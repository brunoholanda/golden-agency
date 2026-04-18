import imageCompression from 'browser-image-compression'

/** Limite máximo (~300 KiB). Não ultrapassa este tamanho após a compressão. */
const MAX_BYTES = 300 * 1024

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

/**
 * Reduz dimensão e peso antes do upload (no navegador).
 * Saída em WebP (se suportado) ou JPEG, sempre ≤ 300 KiB quando possível.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file
  }

  const outputMime = canvasSupportsWebp() ? 'image/webp' : 'image/jpeg'
  const maxSizeMB = MAX_BYTES / (1024 * 1024)

  let input: File = file
  let maxSide = 1920
  let initialQuality = 0.9

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
    if (out.size <= MAX_BYTES) {
      return out
    }

    input = out
    maxSide = Math.max(560, Math.floor(maxSide * 0.78))
    initialQuality = Math.max(0.58, initialQuality - 0.07)
  }

  let last = await imageCompression(input, {
    maxSizeMB,
    maxWidthOrHeight: 520,
    useWebWorker: true,
    maxIteration: 45,
    initialQuality: 0.52,
    fileType: outputMime,
  })
  last = asUploadFile(last, file.name, outputMime)

  for (let w = 420; last.size > MAX_BYTES && w >= 160; w -= 40) {
    const again = await imageCompression(last, {
      maxSizeMB,
      maxWidthOrHeight: w,
      useWebWorker: true,
      maxIteration: 50,
      initialQuality: 0.45,
      fileType: outputMime,
    })
    last = asUploadFile(again, file.name, outputMime)
  }

  return last
}
