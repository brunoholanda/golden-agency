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

export async function fetchBlogPosts(): Promise<BlogListItem[]> {
  const { data } = await http.get<BlogListItem[]>('/blog')
  return data
}

export async function fetchBlogPost(slug: string): Promise<BlogDetail> {
  const { data } = await http.get<BlogDetail>(`/blog/${encodeURIComponent(slug)}`)
  return data
}

export async function fetchBlogHeadlines(limit = 2): Promise<BlogHeadlineItem[]> {
  const { data } = await http.get<BlogHeadlineItem[]>('/blog/headlines', { params: { limit } })
  return data
}

export async function fetchLocalBusinesses(category?: string): Promise<LocalBusinessItem[]> {
  const params = category ? { category } : undefined
  const { data } = await http.get<LocalBusinessItem[]>('/local-guide', { params })
  return data
}

export async function fetchLocalBusinessCategories(): Promise<string[]> {
  const { data } = await http.get<string[]>('/local-guide/categories')
  return data
}

export async function fetchLocalBusiness(id: string): Promise<LocalBusinessItem> {
  const { data } = await http.get<LocalBusinessItem>(`/local-guide/${encodeURIComponent(id)}`)
  return data
}
