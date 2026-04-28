const SITE_URL = 'https://www.goldenagencia.com'

type BreadcrumbItem = {
  name: string
  path: string
}

type SeoPayload = {
  title: string
  description: string
  path: string
  imageUrl?: string
}

function getCanonicalUrl(path: string) {
  if (!path || path === '/') return SITE_URL
  return `${SITE_URL}${path}`
}

function upsertMeta(selector: string, content: string) {
  const element = document.querySelector(selector)
  if (element) {
    element.setAttribute('content', content)
  }
}

function ensureJsonLdScript(id: string) {
  let script = document.querySelector<HTMLScriptElement>(`script[data-seo-jsonld="${id}"]`)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-jsonld', id)
    document.head.appendChild(script)
  }
  return script
}

export function clearDynamicJsonLd(ids: string[]) {
  ids.forEach((id) => {
    const script = document.querySelector(`script[data-seo-jsonld="${id}"]`)
    if (script) script.remove()
  })
}

export function applySeo(payload: SeoPayload) {
  const canonical = getCanonicalUrl(payload.path)
  const image = payload.imageUrl || `${SITE_URL}/favicon.png`

  document.title = payload.title
  upsertMeta('meta[name="description"]', payload.description)
  upsertMeta('meta[property="og:title"]', payload.title)
  upsertMeta('meta[property="og:description"]', payload.description)
  upsertMeta('meta[property="og:url"]', canonical)
  upsertMeta('meta[property="og:image"]', image)
  upsertMeta('meta[property="og:image:alt"]', payload.title)
  upsertMeta('meta[name="twitter:title"]', payload.title)
  upsertMeta('meta[name="twitter:description"]', payload.description)
  upsertMeta('meta[name="twitter:image"]', image)

  const canonicalElement = document.querySelector('link[rel="canonical"]')
  if (canonicalElement) canonicalElement.setAttribute('href', canonical)
}

export function setBreadcrumbSchema(items: BreadcrumbItem[]) {
  const script = ensureJsonLdScript('breadcrumb')
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  })
}

export function setBlogPostingSchema(input: {
  path: string
  title: string
  description: string
  imageUrl?: string
  createdAt: string
  tags: string[]
}) {
  const script = ensureJsonLdScript('blog-posting')
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    image: input.imageUrl || `${SITE_URL}/favicon.png`,
    datePublished: input.createdAt,
    dateModified: input.createdAt,
    keywords: input.tags,
    mainEntityOfPage: getCanonicalUrl(input.path),
    author: {
      '@type': 'Organization',
      name: 'Golden Agência',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Golden Agência',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.png`,
      },
    },
  })
}

export function setLocalBusinessSchema(input: {
  path: string
  name: string
  description: string
  imageUrl?: string
  telephone: string
  address: string
  email?: string | null
  website?: string | null
  socialLinks?: string[]
  category?: string | null
}) {
  const script = ensureJsonLdScript('local-business')
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    description: input.description,
    image: input.imageUrl || `${SITE_URL}/favicon.png`,
    telephone: input.telephone,
    email: input.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: input.address,
      addressLocality: 'Kansas City',
      addressRegion: 'KS',
      addressCountry: 'US',
    },
    url: getCanonicalUrl(input.path),
    sameAs: input.socialLinks ?? [],
    additionalType: input.category || undefined,
  })
}

export function setFaqSchema(faqItems: Array<{ question: string; answer: string }>) {
  if (faqItems.length === 0) {
    clearDynamicJsonLd(['faq'])
    return
  }
  const script = ensureJsonLdScript('faq')
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  })
}

export function extractFaqFromMarkdown(markdown: string) {
  const lines = markdown.split('\n').map((line) => line.trim())
  const faqHeadingIndex = lines.findIndex((line) =>
    /^##\s+(faq|perguntas frequentes|frequently asked questions)$/i.test(line),
  )
  if (faqHeadingIndex < 0) return []

  const faqItems: Array<{ question: string; answer: string }> = []
  let currentQuestion = ''
  let currentAnswer: string[] = []

  for (let i = faqHeadingIndex + 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (/^##\s+/.test(line)) break

    if (/^###\s+/.test(line)) {
      if (currentQuestion && currentAnswer.length > 0) {
        faqItems.push({
          question: currentQuestion,
          answer: currentAnswer.join(' ').replace(/\s+/g, ' ').trim(),
        })
      }
      currentQuestion = line.replace(/^###\s+/, '').trim()
      currentAnswer = []
      continue
    }

    if (currentQuestion && line) {
      currentAnswer.push(line.replace(/^[*-]\s+/, '').trim())
    }
  }

  if (currentQuestion && currentAnswer.length > 0) {
    faqItems.push({
      question: currentQuestion,
      answer: currentAnswer.join(' ').replace(/\s+/g, ' ').trim(),
    })
  }

  return faqItems
}
