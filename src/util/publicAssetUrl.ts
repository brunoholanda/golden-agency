/** URL absoluta para arquivos servidos pelo backend (ex.: /uploads/...). */
export function publicAssetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const origin = (import.meta.env.VITE_API_ORIGIN as string | undefined) || ''
  return `${origin}${path}`
}
