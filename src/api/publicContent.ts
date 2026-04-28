import { http } from './http'

export type BlogListItem = {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl: string
  tags: string[]
  createdAt: string
}

export type BlogDetail = {
  id: string
  title: string
  slug: string
  body: string
  imageUrl: string
  tags: string[]
  createdAt: string
}

export type BlogHeadlineItem = {
  id: string
  title: string
  slug: string
  createdAt: string
}

export type LocalBusinessItem = {
  id: string
  title: string
  description: string
  imageUrl: string
  contact: string
  location: string
  category: string | null
  email: string | null
  instagram: string | null
  facebook: string | null
  site: string | null
  youtube: string | null
  createdAt: string
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function normalizePaginatedResponse<T>(data: PaginatedResponse<T> | T[], page: number, limit: number): PaginatedResponse<T> {
  if (Array.isArray(data)) {
    const total = data.length
    return {
      items: data,
      total,
      page,
      limit,
      totalPages: total > 0 ? Math.ceil(total / limit) : 1,
    }
  }

  return {
    items: data.items ?? [],
    total: typeof data.total === 'number' ? data.total : (data.items?.length ?? 0),
    page: typeof data.page === 'number' ? data.page : page,
    limit: typeof data.limit === 'number' ? data.limit : limit,
    totalPages:
      typeof data.totalPages === 'number'
        ? data.totalPages
        : Math.max(1, Math.ceil((typeof data.total === 'number' ? data.total : data.items?.length ?? 0) / limit)),
  }
}

export async function fetchBlogPosts(page = 1, limit = 10): Promise<PaginatedResponse<BlogListItem>> {
  const { data } = await http.get<PaginatedResponse<BlogListItem> | BlogListItem[]>('/blog', { params: { page, limit } })
  return normalizePaginatedResponse(data, page, limit)
}

export async function fetchBlogPost(slug: string): Promise<BlogDetail> {
  const { data } = await http.get<BlogDetail>(`/blog/${encodeURIComponent(slug)}`)
  return data
}

export async function fetchBlogHeadlines(limit = 2): Promise<BlogHeadlineItem[]> {
  const { data } = await http.get<BlogHeadlineItem[]>('/blog/headlines', { params: { limit } })
  return data
}

export async function fetchLocalBusinesses(
  category?: string,
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<LocalBusinessItem>> {
  const params = { page, limit, ...(category ? { category } : {}) }
  const { data } = await http.get<PaginatedResponse<LocalBusinessItem> | LocalBusinessItem[]>('/local-guide', { params })
  return normalizePaginatedResponse(data, page, limit)
}

export async function fetchLocalBusinessCategories(): Promise<string[]> {
  const { data } = await http.get<string[]>('/local-guide/categories')
  return data
}

export async function fetchLocalBusiness(id: string): Promise<LocalBusinessItem> {
  const { data } = await http.get<LocalBusinessItem>(`/local-guide/${encodeURIComponent(id)}`)
  return data
}
