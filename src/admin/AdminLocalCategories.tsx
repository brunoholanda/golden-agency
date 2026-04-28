import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { App, Button, Flex, Form, Input, Modal, Space, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import {
  adminCreateLocalCategory,
  adminListLocalCategories,
  adminUpdateLocalCategory,
  type AdminLocalCategory,
} from '../api/adminApi'
import { AdminPageHeader, AdminPanelCard } from './AdminPageChrome'

export function AdminLocalCategories() {
  const { message } = App.useApp()
  const [rows, setRows] = useState<AdminLocalCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminLocalCategory | null>(null)
  const [form] = Form.useForm<{ name: string }>()

  const load = () => {
    setLoading(true)
    adminListLocalCategories()
      .then(setRows)
      .catch(() => message.error('Não foi possível carregar as categorias'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    form.setFieldsValue({ name: '' })
    setModalOpen(true)
  }

  const openEdit = (row: AdminLocalCategory) => {
    setEditing(row)
    form.setFieldsValue({ name: row.name })
    setModalOpen(true)
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      if (editing) {
        await adminUpdateLocalCategory(editing.id, { name: values.name })
        message.success('Categoria atualizada')
      } else {
        await adminCreateLocalCategory({ name: values.name })
        message.success('Categoria criada')
      }
      setModalOpen(false)
      load()
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errorFields' in error) return
      message.error('Não foi possível salvar a categoria')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminPageHeader
        items={[
          { label: 'Painel', path: '/admin/painel' },
          { label: 'Guia local', path: '/admin/guia-local' },
          { label: 'Categorias' },
        ]}
        title="Categorias do guia local"
        description="Crie e edite categorias para usar no cadastro dos comércios. Exclusão desativada para preservar histórico."
        extra={
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreate}>
            Nova categoria
          </Button>
        }
      />

      <AdminPanelCard bodyPadding={0}>
        <Table<AdminLocalCategory>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          pagination={{ pageSize: 12, hideOnSinglePage: true }}
          columns={[
            {
              title: 'Nome',
              dataIndex: 'name',
              render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
            },
            {
              title: 'Atualizada em',
              dataIndex: 'updatedAt',
              width: 180,
              render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
            },
            {
              title: 'Ações',
              width: 120,
              render: (_, row) => (
                <Space size="small">
                  <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(row)}>
                    Editar
                  </Button>
                </Space>
              ),
            },
          ]}
          locale={{
            emptyText: (
              <Flex vertical align="center" style={{ padding: '32px 16px' }} gap={10}>
                <Typography.Text type="secondary">Nenhuma categoria cadastrada.</Typography.Text>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                  Criar primeira categoria
                </Button>
              </Flex>
            ),
          }}
        />
      </AdminPanelCard>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar categoria' : 'Nova categoria'}
        okText={editing ? 'Salvar' : 'Criar'}
        cancelText="Cancelar"
        confirmLoading={saving}
        onOk={() => void save()}
        onCancel={() => setModalOpen(false)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nome da categoria"
            name="name"
            rules={[
              { required: true, message: 'Informe o nome da categoria' },
              { min: 1, max: 120, message: 'Use entre 1 e 120 caracteres' },
            ]}
          >
            <Input placeholder="Ex.: Alimentação" maxLength={120} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
