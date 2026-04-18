import { BookOutlined, ShopOutlined } from '@ant-design/icons'
import { Card, Col, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AdminPageHeader, AdminPanelCard } from './AdminPageChrome'

const { Paragraph } = Typography

export function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <div>
      <AdminPageHeader
        items={[{ label: 'Painel' }]}
        title="Bem-vindo"
        description="Gerencie publicações do blog e comércios exibidos no guia local do site."
      />

      <AdminPanelCard>
        <Row gutter={[20, 20]}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              variant="borderless"
              onClick={() => navigate('/admin/blog')}
              style={{
                height: '100%',
                borderRadius: 12,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background: 'rgba(212, 160, 23, 0.04)',
              }}
              styles={{ body: { padding: 22 } }}
            >
              <Typography.Title level={4} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOutlined style={{ color: '#d4a017' }} />
                Blog
              </Typography.Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Listar, criar e editar artigos com imagem de capa, título, até 5 tags e texto em Markdown.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              hoverable
              variant="borderless"
              onClick={() => navigate('/admin/guia-local')}
              style={{
                height: '100%',
                borderRadius: 12,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background: 'rgba(212, 160, 23, 0.04)',
              }}
              styles={{ body: { padding: 22 } }}
            >
              <Typography.Title level={4} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShopOutlined style={{ color: '#d4a017' }} />
                Guia local
              </Typography.Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Cadastrar comércios com foto, descrição em Markdown, contato e localização.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </AdminPanelCard>
    </div>
  )
}
