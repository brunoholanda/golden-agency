import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminLogin } from '../api/adminApi'
import { getAdminToken, setAdminToken } from '../api/http'

export function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/admin/painel'

  useEffect(() => {
    if (getAdminToken()) navigate(from, { replace: true })
  }, [from, navigate])

  return (
    <div style={{ maxWidth: 400, margin: '64px auto' }}>
      <Card title="Entrar no painel">
        <Typography.Paragraph type="secondary">
          Use o e-mail e a senha do administrador configurados no backend (variáveis ADMIN_EMAIL e ADMIN_PASSWORD no primeiro acesso).
        </Typography.Paragraph>
        <Form
          layout="vertical"
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
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Entrar
          </Button>
        </Form>
      </Card>
    </div>
  )
}
