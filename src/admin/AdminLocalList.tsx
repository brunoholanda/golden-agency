import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { App, Badge, Button, Popconfirm, Space, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminDeleteLocal, adminListLocal, type AdminLocal } from '../api/adminApi'
import { publicAssetUrl } from '../util/publicAssetUrl'
import { AdminPageHeader, AdminPanelCard } from './AdminPageChrome'

export function AdminLocalList() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [rows, setRows] = useState<AdminLocal[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminListLocal()
      .then(setRows)
      .catch(() => message.error('Não foi possível carregar'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <AdminPageHeader
        items={[
          { label: 'Painel', path: '/admin/painel' },
          { label: 'Guia local' },
        ]}
        title="Comércios do guia local"
        description="Cadastros exibidos no site com foto, categoria, descrição, contato e localização. Duplo clique numa linha para editar."
        extra={
          <Space>
            <Button size="large" onClick={() => navigate('/admin/guia-local/categorias')}>
              Categorias
            </Button>
            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/admin/guia-local/novo')}>
              Novo comércio
            </Button>
          </Space>
        }
      />

      <AdminPanelCard bodyPadding={0}>
        <Table<AdminLocal>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          size="middle"
          pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 16px' }}>
                <Typography.Text type="secondary">Nenhum comércio cadastrado.</Typography.Text>
                <div style={{ marginTop: 12 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/guia-local/novo')}>
                    Adicionar primeiro comércio
                  </Button>
                </div>
              </div>
            ),
          }}
          onRow={(record) => ({
            onDoubleClick: () => navigate(`/admin/guia-local/${record.id}`),
          })}
          columns={[
            {
              title: 'Foto',
              dataIndex: 'imageUrl',
              width: 96,
              fixed: 'left',
              render: (url: string) => (
                <img
                  src={publicAssetUrl(url)}
                  alt=""
                  style={{
                    width: 72,
                    height: 52,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'block',
                  }}
                />
              ),
            },
            {
              title: 'Título',
              dataIndex: 'title',
              ellipsis: true,
              render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
            },
            {
              title: 'Contato',
              dataIndex: 'contact',
              ellipsis: true,
              width: 200,
              responsive: ['md'],
            },
            {
              title: 'Categoria',
              dataIndex: 'category',
              width: 180,
              ellipsis: true,
              responsive: ['md'],
              render: (value: string | null) => value || <Typography.Text type="secondary">Sem categoria</Typography.Text>,
            },
            {
              title: 'Local',
              dataIndex: 'location',
              ellipsis: true,
              width: 200,
              responsive: ['lg'],
            },
            {
              title: 'Status',
              dataIndex: 'published',
              width: 130,
              render: (p: boolean) => (
                <Badge status={p ? 'success' : 'warning'} text={p ? 'Publicado' : 'Rascunho'} />
              ),
            },
            {
              title: 'Ações',
              key: 'actions',
              width: 168,
              fixed: 'right',
              render: (_, r) => (
                <Space size="small">
                  <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/guia-local/${r.id}`)}>
                    Editar
                  </Button>
                  <Popconfirm
                    title="Excluir este cadastro?"
                    description="Esta ação não pode ser desfeita."
                    okText="Excluir"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true }}
                    onConfirm={async () => {
                      try {
                        await adminDeleteLocal(r.id)
                        message.success('Removido')
                        load()
                      } catch {
                        message.error('Falha ao excluir')
                      }
                    }}
                  >
                    <Button size="small" danger type="link">
                      Excluir
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </AdminPanelCard>
      <Typography.Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0, fontSize: 13 }}>
        Dica: duplo clique numa linha abre o editor.
      </Typography.Paragraph>
    </div>
  )
}
