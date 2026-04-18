import { Layout, Menu, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { setAdminToken } from '../api/http'

const { Header, Content } = Layout

export function AdminShell() {
  const navigate = useNavigate()
  const location = useLocation()

  const selected = location.pathname.startsWith('/admin/blog')
    ? ['/admin/blog']
    : location.pathname.startsWith('/admin/guia-local')
      ? ['/admin/guia-local']
      : ['/admin/painel']

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 24, paddingInline: 16 }}>
        <Typography.Text strong style={{ color: '#fff', marginRight: 'auto' }}>
          Golden Agência — Painel
        </Typography.Text>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selected}
          style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
          items={[
            { key: '/admin/painel', label: 'Início', onClick: () => navigate('/admin/painel') },
            { key: '/admin/blog', label: 'Blog', onClick: () => navigate('/admin/blog') },
            { key: '/admin/guia-local', label: 'Guia local', onClick: () => navigate('/admin/guia-local') },
            {
              key: 'out',
              label: 'Sair',
              onClick: () => {
                setAdminToken(null)
                navigate('/admin/login', { replace: true })
              },
            },
          ]}
        />
      </Header>
      <Content style={{ padding: 24, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}
