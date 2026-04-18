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

export type LocalBusinessItem = {
  id: string
  title: string
  description: string
  imageUrl: string
  contact: string
  location: string
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

export async function fetchLocalBusinesses(): Promise<LocalBusinessItem[]> {
  const { data } = await http.get<LocalBusinessItem[]>('/local-guide')
  return data
}

export async function fetchLocalBusiness(id: string): Promise<LocalBusinessItem> {
  const { data } = await http.get<LocalBusinessItem>(`/local-guide/${encodeURIComponent(id)}`)
  return data
}
