import { compressImageFile } from '../util/compressImage'
import { http } from './http'

export type AdminBlog = {
  id: string
  title: string
  slug: string
  body: string
  imageUrl: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

export type AdminLocal = {
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
  published: boolean
  createdAt: string
  updatedAt: string
}

export type AdminLocalCategory = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export async function adminLogin(email: string, password: string) {
  const { data } = await http.post<{ access_token: string; user: { id: string; email: string; name: string } }>(
    '/auth/login',
    { email, password },
  )
  return data
}

export async function adminUploadImage(file: File) {
  const compressed = await compressImageFile(file, { maxBytes: 50 * 1024, maxWidthOrHeight: 800 })
  const fd = new FormData()
  fd.append('file', compressed)
  const { data } = await http.post<{ url: string }>('/admin/upload', fd)
  return data.url as string
}

export async function adminListBlog() {
  const { data } = await http.get<AdminBlog[]>('/admin/blog')
  return data
}

export async function adminGetBlog(id: string) {
  const { data } = await http.get<AdminBlog>(`/admin/blog/${encodeURIComponent(id)}`)
  return data
}

export async function adminCreateBlog(payload: {
  title: string
  body: string
  imageUrl: string
  tags: string[]
  published?: boolean
}) {
  const { data } = await http.post<AdminBlog>('/admin/blog', payload)
  return data
}

export async function adminUpdateBlog(
  id: string,
  payload: Partial<{ title: string; body: string; imageUrl: string; tags: string[]; published: boolean }>,
) {
  const { data } = await http.patch<AdminBlog>(`/admin/blog/${id}`, payload)
  return data
}

export async function adminDeleteBlog(id: string) {
  await http.delete(`/admin/blog/${id}`)
}

export async function adminListLocal() {
  const { data } = await http.get<AdminLocal[]>('/admin/local-guide')
  return data
}

export async function adminGetLocal(id: string) {
  const { data } = await http.get<AdminLocal>(`/admin/local-guide/${encodeURIComponent(id)}`)
  return data
}

export async function adminCreateLocal(payload: {
  title: string
  description: string
  imageUrl: string
  contact: string
  location: string
  category?: string
  email?: string
  instagram?: string
  facebook?: string
  site?: string
  youtube?: string
  published?: boolean
}) {
  const { data } = await http.post<AdminLocal>('/admin/local-guide', payload)
  return data
}

export async function adminUpdateLocal(
  id: string,
  payload: Partial<{
    title: string
    description: string
    imageUrl: string
    contact: string
    location: string
    category: string
    email: string
    instagram: string
    facebook: string
    site: string
    youtube: string
    published: boolean
  }>,
) {
  const { data } = await http.patch<AdminLocal>(`/admin/local-guide/${id}`, payload)
  return data
}

export async function adminDeleteLocal(id: string) {
  await http.delete(`/admin/local-guide/${id}`)
}

export async function adminListLocalCategories() {
  const { data } = await http.get<AdminLocalCategory[]>('/admin/local-guide/categories')
  return data
}

export async function adminCreateLocalCategory(payload: { name: string }) {
  const { data } = await http.post<AdminLocalCategory>('/admin/local-guide/categories', payload)
  return data
}

export async function adminUpdateLocalCategory(id: string, payload: { name: string }) {
  const { data } = await http.patch<AdminLocalCategory>(`/admin/local-guide/categories/${encodeURIComponent(id)}`, payload)
  return data
}
