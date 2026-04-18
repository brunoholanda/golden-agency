import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { Button, Divider, Flex, Input, Space, Spin, Switch, Typography, Upload, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateLocal,
  adminGetLocal,
  adminUpdateLocal,
  adminUploadImage,
} from '../api/adminApi'
import { publicAssetUrl } from '../util/publicAssetUrl'
import { AdminFieldLabel, AdminPageHeader, AdminPanelCard } from './AdminPageChrome'

export function AdminLocalEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isCreate = !id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [contact, setContact] = useState('')
  const [location, setLocation] = useState('')
  const [published, setPublished] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isCreate)

  useEffect(() => {
    if (isCreate || !id) return
    let cancelled = false
    adminGetLocal(id)
      .then((row) => {
        if (cancelled) return
        setTitle(row.title)
        setDescription(row.description)
        setImageUrl(row.imageUrl)
        setContact(row.contact)
        setLocation(row.location)
        setPublished(row.published)
      })
      .catch(() => {
        if (!cancelled) {
          message.error('Erro ao carregar')
          navigate('/admin/guia-local')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isCreate, navigate])

  const save = async () => {
    if (!title.trim()) return message.warning('Informe o título')
    if (!imageUrl.trim()) return message.warning('Envie a foto')
    if (!description.trim()) return message.warning('Escreva a descrição')
    if (!contact.trim()) return message.warning('Informe o contato')
    if (!location.trim()) return message.warning('Informe a localização')
    setSaving(true)
    try {
      if (isCreate) {
        await adminCreateLocal({ title, description, imageUrl, contact, location, published })
        message.success('Criado')
      } else if (id) {
        await adminUpdateLocal(id, { title, description, imageUrl, contact, location, published })
        message.success('Salvo')
      }
      navigate('/admin/guia-local')
    } catch {
      message.error('Não foi possível salvar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 320 }}>
        <Spin size="large" tip="Carregando cadastro…" />
      </Flex>
    )
  }

  return (
    <div data-color-mode="light">
      <AdminPageHeader
        items={[
          { label: 'Painel', path: '/admin/painel' },
          { label: 'Guia local', path: '/admin/guia-local' },
          { label: isCreate ? 'Novo comércio' : 'Editar' },
        ]}
        title={isCreate ? 'Novo comércio' : 'Editar comércio'}
        description="Foto otimizada no envio (até ~300 KB), texto em Markdown e dados de contato exibidos no guia."
        extra={
          <Button icon={<ArrowLeftOutlined />} size="large" onClick={() => navigate('/admin/guia-local')}>
            Voltar à lista
          </Button>
        }
      />

      <AdminPanelCard>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <AdminFieldLabel>Nome do comércio</AdminFieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              showCount
              size="large"
              placeholder="Ex.: Padaria Brasil"
            />
          </div>

          <div>
            <AdminFieldLabel>Foto</AdminFieldLabel>
            <Typography.Paragraph type="secondary" style={{ marginTop: 0, marginBottom: 10, fontSize: 13 }}>
              Uma foto por cadastro. Formatos: JPEG, PNG, WebP ou GIF.
            </Typography.Paragraph>
            <div
              style={{
                border: '1px dashed rgba(15, 23, 42, 0.15)',
                borderRadius: 12,
                padding: 16,
                background: 'rgba(15, 23, 42, 0.02)',
              }}
            >
              <Upload
                accept="image/jpeg,image/png,image/webp,image/gif"
                showUploadList={false}
                beforeUpload={async (file) => {
                  setUploading(true)
                  try {
                    const url = await adminUploadImage(file)
                    setImageUrl(url)
                    message.success('Imagem enviada')
                  } catch {
                    message.error('Falha no upload')
                  } finally {
                    setUploading(false)
                  }
                  return false
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Enviar foto
                </Button>
              </Upload>
              {imageUrl ? (
                <img
                  src={publicAssetUrl(imageUrl)}
                  alt=""
                  style={{
                    marginTop: 16,
                    maxWidth: '100%',
                    width: 400,
                    borderRadius: 10,
                    display: 'block',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
                  }}
                />
              ) : null}
            </div>
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div>
            <AdminFieldLabel>Descrição (Markdown)</AdminFieldLabel>
            <div
              style={{
                marginTop: 8,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid rgba(15, 23, 42, 0.1)',
              }}
            >
              <MDEditor value={description} onChange={(v) => setDescription(v || '')} height={380} preview="edit" />
            </div>
          </div>

          <Flex gap={16} wrap="wrap">
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>Contato</AdminFieldLabel>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                size="large"
                placeholder="Telefone, WhatsApp, site…"
              />
            </div>
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>Localização</AdminFieldLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                size="large"
                placeholder="Endereço ou cidade"
              />
            </div>
          </Flex>

          <Flex align="center" gap={12} wrap="wrap">
            <AdminFieldLabel style={{ marginBottom: 0 }}>Publicado no site</AdminFieldLabel>
            <Switch checked={published} onChange={setPublished} />
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {published ? 'Visível no guia local' : 'Oculto (rascunho)'}
            </Typography.Text>
          </Flex>

          <Divider style={{ margin: '8px 0 0' }} />

          <Flex gap="middle" wrap="wrap">
            <Button type="primary" icon={<SaveOutlined />} size="large" loading={saving} onClick={() => void save()}>
              Salvar
            </Button>
            <Button size="large" onClick={() => navigate('/admin/guia-local')}>
              Cancelar
            </Button>
          </Flex>
        </Space>
      </AdminPanelCard>
    </div>
  )
}
