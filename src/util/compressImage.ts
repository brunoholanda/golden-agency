import imageCompression from 'browser-image-compression'

/** Limite padrão agressivo para capas otimizadas. */
const DEFAULT_MAX_BYTES = 50 * 1024

function canvasSupportsWebp(): boolean {
  try {
    const c = document.createElement('canvas')
    return c.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

function outputName(originalName: string, mime: string): string {
  const base = originalName.replace(/\.[^/.]+$/, '') || 'image'
  const ext = mime === 'image/webp' ? '.webp' : '.jpg'
  return `${base}${ext}`
}

function asUploadFile(blob: File, originalName: string, mime: string): File {
  return new File([blob], outputName(originalName, mime), {
    type: mime,
    lastModified: Date.now(),
  })
}

export type CompressImageOptions = {
  maxBytes?: number
  maxWidthOrHeight?: number
}

/**
 * Reduz dimensão e peso antes do upload (no navegador).
 * Saída em WebP (se suportado) ou JPEG, tentando o menor KB possível dentro do limite.
 */
export async function compressImageFile(file: File, options: CompressImageOptions = {}): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file
  }

  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES
  const outputMime = canvasSupportsWebp() ? 'image/webp' : 'image/jpeg'
  const maxSizeMB = maxBytes / (1024 * 1024)

  let input: File = file
  let maxSide = options.maxWidthOrHeight ?? 800
  let initialQuality = 0.82

  for (let round = 0; round < 10; round++) {
    const compressed = await imageCompression(input, {
      maxSizeMB,
      maxWidthOrHeight: maxSide,
      useWebWorker: true,
      maxIteration: 35,
      initialQuality,
      fileType: outputMime,
    })

    const out = asUploadFile(compressed, file.name, outputMime)
    if (out.size <= maxBytes) {
      return out
    }

    input = out
    maxSide = Math.max(320, Math.floor(maxSide * 0.86))
    initialQuality = Math.max(0.4, initialQuality - 0.06)
  }

  let last = await imageCompression(input, {
    maxSizeMB,
    maxWidthOrHeight: 320,
    useWebWorker: true,
    maxIteration: 45,
    initialQuality: 0.38,
    fileType: outputMime,
  })
  last = asUploadFile(last, file.name, outputMime)

  for (let w = 300; last.size > maxBytes && w >= 120; w -= 20) {
    const again = await imageCompression(last, {
      maxSizeMB,
      maxWidthOrHeight: w,
      useWebWorker: true,
      maxIteration: 50,
      initialQuality: 0.32,
      fileType: outputMime,
    })
    last = asUploadFile(again, file.name, outputMime)
  }

  return last
}
