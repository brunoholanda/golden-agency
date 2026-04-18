import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Badge, Button, Popconfirm, Space, Table, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminDeleteBlog, adminListBlog, type AdminBlog } from '../api/adminApi'
import { publicAssetUrl } from '../util/publicAssetUrl'
import { AdminPageHeader, AdminPanelCard } from './AdminPageChrome'

export function AdminBlogList() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<AdminBlog[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminListBlog()
      .then(setRows)
      .catch(() => message.error('Não foi possível carregar os posts'))
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
          { label: 'Blog' },
        ]}
        title="Artigos do blog"
        description="Gerencie artigos com capa, tags e texto em Markdown. Clique duas vezes numa linha para editar."
        extra={
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/admin/blog/novo')}>
            Novo artigo
          </Button>
        }
      />

      <AdminPanelCard bodyPadding={0}>
        <Table<AdminBlog>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          size="middle"
          pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
          scroll={{ x: 720 }}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 16px' }}>
                <Typography.Text type="secondary">Nenhum artigo ainda.</Typography.Text>
                <div style={{ marginTop: 12 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/blog/novo')}>
                    Criar primeiro artigo
                  </Button>
                </div>
              </div>
            ),
          }}
          onRow={(record) => ({
            onDoubleClick: () => navigate(`/admin/blog/${record.id}`),
          })}
          columns={[
            {
              title: 'Capa',
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
              title: 'Slug',
              dataIndex: 'slug',
              width: 200,
              ellipsis: true,
              responsive: ['lg'],
              render: (slug: string) => (
                <Typography.Text type="secondary" code style={{ fontSize: 12 }}>
                  {slug}
                </Typography.Text>
              ),
            },
            {
              title: 'Tags',
              dataIndex: 'tags',
              width: 220,
              ellipsis: true,
              responsive: ['md'],
              render: (tags: string[]) =>
                tags?.length ? (
                  <Space size={[4, 4]} wrap>
                    {tags.map((t) => (
                      <Tag key={t} style={{ margin: 0 }}>
                        {t}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  '—'
                ),
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
                  <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/blog/${r.id}`)}>
                    Editar
                  </Button>
                  <Popconfirm
                    title="Excluir este artigo?"
                    description="Esta ação não pode ser desfeita."
                    okText="Excluir"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true }}
                    onConfirm={async () => {
                      try {
                        await adminDeleteBlog(r.id)
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
