import { CodeOutlined, LockOutlined } from '@ant-design/icons'
import { App, Button, Card, Form, Input, Space, Typography } from 'antd'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminLogin } from '../api/adminApi'
import { getAdminToken, setAdminToken } from '../api/http'

const GOLD = '#d4a017'
const PAGE_BG = 'linear-gradient(165deg, #faf8f3 0%, #f4f0e8 42%, #ebe4d6 100%)'

export function AdminLogin() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/admin/painel'

  useEffect(() => {
    if (getAdminToken()) navigate(from, { replace: true })
  }, [from, navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px 40px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Space orientation="vertical" size={28} style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Typography.Title level={2} style={{ marginBottom: 4, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Golden Agência
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 15 }}>
              Painel administrativo
            </Typography.Text>
          </div>

          <Card
            style={{
              borderRadius: 14,
              borderTop: `3px solid ${GOLD}`,
              boxShadow: '0 12px 40px rgba(26, 22, 12, 0.08), 0 2px 8px rgba(26, 22, 12, 0.04)',
            }}
            styles={{ body: { padding: '28px 24px 24px' } }}
          >
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `linear-gradient(145deg, ${GOLD}22, ${GOLD}0d)`,
                    color: GOLD,
                  }}
                  aria-hidden
                >
                  <LockOutlined style={{ fontSize: 18 }} />
                </span>
                <div>
                  <Typography.Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                    Entrar
                  </Typography.Title>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    Acesso restrito a gestores
                  </Typography.Text>
                </div>
              </div>

              <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 13 }}>
                Use o e-mail e a senha do administrador configurados no backend.
              </Typography.Paragraph>

              <Form
                layout="vertical"
                requiredMark={false}
                style={{ marginTop: 4 }}
                onFinish={async (v: { email: string; password: string }) => {
                  try {
                    const res = await adminLogin(v.email, v.password)
                    setAdminToken(res.access_token)
                    message.success('Login ok')
                    navigate(from, { replace: true })
                  } catch {
                    message.error('E-mail ou senha inválidos')
                  }
                }}
              >
                <Form.Item name="email" label="E-mail" rules={[{ required: true, type: 'email' }]}>
                  <Input size="large" autoComplete="username" placeholder="nome@exemplo.com" />
                </Form.Item>
                <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
                  <Input.Password size="large" autoComplete="current-password" placeholder="••••••••" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: 4, height: 44 }}>
                  Entrar no painel
                </Button>
              </Form>
            </Space>
          </Card>

          <div
            role="note"
            style={{
              textAlign: 'center',
              padding: '18px 16px 20px',
              borderRadius: 12,
              background: 'rgba(212, 160, 23, 0.1)',
              border: `1px solid rgba(212, 160, 23, 0.35)`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `linear-gradient(160deg, ${GOLD}, #b8890f)`,
                color: '#fff',
                marginBottom: 10,
                boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)',
              }}
              aria-hidden
            >
              <CodeOutlined style={{ fontSize: 17 }} />
            </div>
            <Typography.Text type="secondary" style={{ fontSize: 11, marginLeft: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Plataforma
            </Typography.Text>
            <Typography.Paragraph style={{ margin: '6px 0 0', fontSize: 15, lineHeight: 1.45, fontWeight: 600, color: '#1f1f1f' }}>
             Desenvolvido por
              <br />
              <span style={{ color: '#141414' }}>Holanda Desenvolvimento de Software ME</span>
            </Typography.Paragraph>
          </div>
        </Space>
      </div>
    </div>
  )
}
