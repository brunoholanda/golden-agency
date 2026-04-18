import { Card, Col, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

export function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <div>
      <Title level={3} style={{ marginTop: 0 }}>
        Bem-vindo
      </Title>
      <Paragraph>Gerencie publicações do blog e comércios do guia local.</Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Blog" hoverable onClick={() => navigate('/admin/blog')}>
            Listar, criar e editar artigos com imagem de capa, título, até 5 tags e texto em Markdown.
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Guia local" hoverable onClick={() => navigate('/admin/guia-local')}>
            Cadastrar comércios com foto, descrição, contato e localização.
          </Card>
        </Col>
      </Row>
    </div>
  )
}
