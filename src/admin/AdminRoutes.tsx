import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminBlogEditor } from './AdminBlogEditor'
import { AdminBlogList } from './AdminBlogList'
import { AdminDashboard } from './AdminDashboard'
import { AdminLocalEditor } from './AdminLocalEditor'
import { AdminLocalList } from './AdminLocalList'
import { AdminLogin } from './AdminLogin'
import { AdminShell } from './AdminShell'
import { RequireAuth } from './RequireAuth'

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminShell />}>
          <Route path="painel" element={<AdminDashboard />} />
          <Route path="blog/novo" element={<AdminBlogEditor />} />
          <Route path="blog/:id" element={<AdminBlogEditor />} />
          <Route path="blog" element={<AdminBlogList />} />
          <Route path="guia-local/novo" element={<AdminLocalEditor />} />
          <Route path="guia-local/:id" element={<AdminLocalEditor />} />
          <Route path="guia-local" element={<AdminLocalList />} />
        </Route>
      </Route>
      <Route path="" element={<Navigate to="painel" replace />} />
      <Route path="*" element={<Navigate to="/admin/painel" replace />} />
    </Routes>
  )
}
