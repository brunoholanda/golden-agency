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
  published: boolean
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
  const compressed = await compressImageFile(file)
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
  published?: boolean
}) {
  const { data } = await http.post<AdminLocal>('/admin/local-guide', payload)
  return data
}

export async function adminUpdateLocal(
  id: string,
  payload: Partial<{ title: string; description: string; imageUrl: string; contact: string; location: string; published: boolean }>,
) {
  const { data } = await http.patch<AdminLocal>(`/admin/local-guide/${id}`, payload)
  return data
}

export async function adminDeleteLocal(id: string) {
  await http.delete(`/admin/local-guide/${id}`)
}
