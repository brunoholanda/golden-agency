import imageCompression from 'browser-image-compression'

/** Reduz tamanho e dimensao antes do upload (executado no navegador). */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  return imageCompression(file, {
    maxSizeMB: 0.9,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  })
}
