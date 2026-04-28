type AreaPixels = { x: number; y: number; width: number; height: number }

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })
}

function outputName(originalName: string): string {
  const base = originalName.replace(/\.[^/.]+$/, '') || 'image'
  return `${base}.webp`
}

export async function cropImageToFile(
  file: File,
  area: AreaPixels,
  output: { width: number; height: number; quality?: number } = { width: 800, height: 445, quality: 0.9 },
): Promise<File> {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = output.width
  canvas.height = output.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não foi possível preparar o recorte da imagem')

  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, output.width, output.height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', output.quality ?? 0.9)
  })
  if (!blob) throw new Error('Falha ao gerar imagem recortada')

  return new File([blob], outputName(file.name), {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}
