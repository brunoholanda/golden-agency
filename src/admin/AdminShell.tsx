import { Layout, Menu, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { setAdminToken } from '../api/http'

const { Header, Content } = Layout
const GOLD = '#d4a017'

export function AdminShell() {
  const navigate = useNavigate()
  const location = useLocation()

  const selected = location.pathname.startsWith('/admin/blog')
    ? ['/admin/blog']
    : location.pathname.startsWith('/admin/guia-local')
      ? ['/admin/guia-local']
      : ['/admin/painel']

  return (
    <Layout style={{ minHeight: '100vh', background: '#eef1f6' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          paddingInline: 20,
          height: 56,
          lineHeight: '56px',
          background: 'linear-gradient(180deg, #222 0%, #141414 100%)',
          borderBottom: `3px solid ${GOLD}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}
      >
        <Typography.Text
          strong
          style={{
            color: '#fff',
            marginRight: 'auto',
            fontSize: 15,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Golden Agência
          <Typography.Text style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, marginLeft: 8 }}>
            Painel
          </Typography.Text>
        </Typography.Text>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selected}
          style={{
            flex: 1,
            minWidth: 0,
            justifyContent: 'flex-end',
            background: 'transparent',
            borderBottom: 'none',
          }}
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
      <Content
        style={{
          padding: '28px 20px 48px',
          maxWidth: 1140,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  )
}
