import { Button, Popconfirm, Space, Table, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminDeleteBlog, adminListBlog, type AdminBlog } from '../api/adminApi'
import { publicAssetUrl } from '../util/publicAssetUrl'

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
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }} align="start">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Blog
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/admin/blog/novo')}>
          Novo artigo
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={rows}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onDoubleClick: () => navigate(`/admin/blog/${record.id}`),
        })}
        columns={[
          {
            title: 'Capa',
            dataIndex: 'imageUrl',
            width: 88,
            render: (url: string) => (
              <img src={publicAssetUrl(url)} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
            ),
          },
          { title: 'Título', dataIndex: 'title' },
          { title: 'Slug', dataIndex: 'slug', width: 200, ellipsis: true },
          {
            title: 'Tags',
            dataIndex: 'tags',
            render: (tags: string[]) =>
              tags?.map((t) => (
                <Tag key={t}>{t}</Tag>
              )),
          },
          {
            title: 'Publicado',
            dataIndex: 'published',
            width: 100,
            render: (p: boolean) => (p ? 'Sim' : 'Não'),
          },
          {
            title: '',
            key: 'actions',
            width: 160,
            render: (_, r) => (
              <Space>
                <Button size="small" onClick={() => navigate(`/admin/blog/${r.id}`)}>
                  Editar
                </Button>
                <Popconfirm
                  title="Excluir este artigo?"
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
                  <Button size="small" danger>
                    Excluir
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </div>
  )
}
