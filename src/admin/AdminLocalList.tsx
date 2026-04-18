import { Button, Popconfirm, Space, Table, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminDeleteLocal, adminListLocal, type AdminLocal } from '../api/adminApi'
import { publicAssetUrl } from '../util/publicAssetUrl'

export function AdminLocalList() {
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
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }} align="start">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Guia local
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/admin/guia-local/novo')}>
          Novo comércio
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={rows}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onDoubleClick: () => navigate(`/admin/guia-local/${record.id}`),
        })}
        columns={[
          {
            title: 'Foto',
            dataIndex: 'imageUrl',
            width: 88,
            render: (url: string) => (
              <img src={publicAssetUrl(url)} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
            ),
          },
          { title: 'Título', dataIndex: 'title' },
          { title: 'Contato', dataIndex: 'contact', ellipsis: true },
          { title: 'Local', dataIndex: 'location', ellipsis: true },
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
                <Button size="small" onClick={() => navigate(`/admin/guia-local/${r.id}`)}>
                  Editar
                </Button>
                <Popconfirm
                  title="Excluir este cadastro?"
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
