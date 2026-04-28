import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const SITE_URL = 'https://www.goldenagencia.com'
const API_BASE =
  process.env.SITEMAP_API_BASE ||
  process.env.VITE_API_BASE ||
  'http://127.0.0.1:3000/api/v1'

const STATIC_PATHS = [
  '/',
  '/servicos',
  '/precos',
  '/blog',
  '/contato',
  '/guia-local',
  '/parceiro',
  '/politica-de-privacidade',
]

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toAbsoluteUrl(path) {
  if (!path || path === '/') return SITE_URL
  return `${SITE_URL}${path}`
}

async function requestJson(pathWithQuery) {
  const base = API_BASE.replace(/\/+$/, '')
  const path = pathWithQuery.replace(/^\/+/, '')
  const response = await fetch(`${base}/${path}`)
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao consultar ${pathWithQuery}`)
  }
  return response.json()
}

async function fetchAllBlogSlugs() {
  let page = 1
  const limit = 100
  const rows = []
  while (true) {
    const data = await requestJson(`blog?page=${page}&limit=${limit}`)
    const items = Array.isArray(data) ? data : data.items || []
    rows.push(...items)
    const totalPages = Array.isArray(data) ? 1 : Number(data.totalPages || 1)
    if (page >= totalPages) break
    page += 1
  }
  return rows
    .map((item) => ({
      path: `/blog/${item.slug}`,
      lastmod: item.createdAt,
    }))
    .filter((item) => item.path !== '/blog/undefined')
}

async function fetchAllGuideEntries() {
  let page = 1
  const limit = 100
  const rows = []
  while (true) {
    const data = await requestJson(`local-guide?page=${page}&limit=${limit}`)
    const items = Array.isArray(data) ? data : data.items || []
    rows.push(...items)
    const totalPages = Array.isArray(data) ? 1 : Number(data.totalPages || 1)
    if (page >= totalPages) break
    page += 1
  }
  return rows
    .map((item) => ({
      path: `/guia-local/${item.id}`,
      lastmod: item.createdAt,
    }))
    .filter((item) => item.path !== '/guia-local/undefined')
}

function renderSitemap(entries) {
  const body = entries
    .map((entry) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(toAbsoluteUrl(entry.path))}</loc>`]
      if (entry.lastmod) lines.push(`    <lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>`)
      lines.push('  </url>')
      return lines.join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

async function main() {
  const dynamicEntries = []

  try {
    const [blogEntries, guideEntries] = await Promise.all([fetchAllBlogSlugs(), fetchAllGuideEntries()])
    dynamicEntries.push(...blogEntries, ...guideEntries)
  } catch (error) {
    console.warn(`[sitemap] Não foi possível carregar conteúdo dinâmico da API (${String(error)}).`)
  }

  const entries = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...dynamicEntries,
  ]

  const deduped = Array.from(new Map(entries.map((entry) => [entry.path, entry])).values())
  const xml = renderSitemap(deduped)
  const targetPath = resolve(process.cwd(), 'public', 'sitemap.xml')
  await mkdir(dirname(targetPath), { recursive: true })
  await writeFile(targetPath, xml, 'utf8')
  console.log(`[sitemap] Gerado com ${deduped.length} URLs.`)
}

main().catch((error) => {
  console.error('[sitemap] Falha ao gerar sitemap:', error)
  process.exit(1)
})
