import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { Button, Divider, Flex, Input, Select, Space, Spin, Switch, Typography, Upload, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateBlog,
  adminGetBlog,
  adminUpdateBlog,
  adminUploadImage,
} from '../api/adminApi'
import { AdminImageCropModal } from './AdminImageCropModal'
import { publicAssetUrl } from '../util/publicAssetUrl'
import { AdminFieldLabel, AdminPageHeader, AdminPanelCard } from './AdminPageChrome'

export function AdminBlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isCreate = !id

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [published, setPublished] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [cropOpen, setCropOpen] = useState(false)
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isCreate)

  useEffect(() => {
    if (isCreate || !id) return
    let cancelled = false
    adminGetBlog(id)
      .then((row) => {
        if (cancelled) return
        setTitle(row.title)
        setBody(row.body)
        setImageUrl(row.imageUrl)
        setTags(row.tags || [])
        setPublished(row.published)
      })
      .catch(() => {
        if (!cancelled) {
          message.error('Erro ao carregar')
          navigate('/admin/blog')
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
    if (!imageUrl.trim()) return message.warning('Envie a imagem de capa')
    if (!body.trim()) return message.warning('Escreva o texto do artigo')
    setSaving(true)
    try {
      if (isCreate) {
        await adminCreateBlog({ title, body, imageUrl, tags, published })
        message.success('Criado')
      } else if (id) {
        await adminUpdateBlog(id, { title, body, imageUrl, tags, published })
        message.success('Salvo')
      }
      navigate('/admin/blog')
    } catch {
      message.error('Não foi possível salvar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 320 }}>
        <Spin size="large" tip="Carregando artigo…" />
      </Flex>
    )
  }

  return (
    <div data-color-mode="light">
      <AdminPageHeader
        items={[
          { label: 'Painel', path: '/admin/painel' },
          { label: 'Blog', path: '/admin/blog' },
          { label: isCreate ? 'Novo artigo' : 'Editar' },
        ]}
        title={isCreate ? 'Novo artigo' : 'Editar artigo'}
        description="Imagem de capa com recorte otimizado (800x445) e compressão agressiva para até 50 KB. Até 5 tags e corpo em Markdown."
        extra={
          <Button icon={<ArrowLeftOutlined />} size="large" onClick={() => navigate('/admin/blog')}>
            Voltar à lista
          </Button>
        }
      />

      <AdminPanelCard>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <AdminFieldLabel>Título</AdminFieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              showCount
              size="large"
              placeholder="Título do artigo"
            />
          </div>

          <div>
            <AdminFieldLabel>Imagem de capa</AdminFieldLabel>
            <Typography.Paragraph type="secondary" style={{ marginTop: 0, marginBottom: 10, fontSize: 13 }}>
              Uma imagem por artigo. Formatos: JPEG, PNG, WebP ou GIF. Após selecionar, o sistema abre recorte em 800x445.
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
                beforeUpload={(file) => {
                  setPendingImage(file)
                  setCropOpen(true)
                  return false
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Enviar imagem
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

          <div>
            <AdminFieldLabel>Tags (até 5)</AdminFieldLabel>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              size="large"
              value={tags}
              onChange={(next) => setTags(next.slice(0, 5))}
              placeholder="Digite e pressione Enter"
              tokenSeparators={[',']}
            />
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div>
            <AdminFieldLabel>Texto (Markdown)</AdminFieldLabel>
            <div
              style={{
                marginTop: 8,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid rgba(15, 23, 42, 0.1)',
              }}
            >
              <MDEditor value={body} onChange={(v) => setBody(v || '')} height={440} preview="edit" />
            </div>
          </div>

          <Flex align="center" gap={12} wrap="wrap">
            <AdminFieldLabel style={{ marginBottom: 0 }}>Publicado no site</AdminFieldLabel>
            <Switch checked={published} onChange={setPublished} />
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {published ? 'Visível para visitantes' : 'Oculto (rascunho)'}
            </Typography.Text>
          </Flex>

          <Divider style={{ margin: '8px 0 0' }} />

          <Flex gap="middle" wrap="wrap">
            <Button type="primary" icon={<SaveOutlined />} size="large" loading={saving} onClick={() => void save()}>
              Salvar
            </Button>
            <Button size="large" onClick={() => navigate('/admin/blog')}>
              Cancelar
            </Button>
          </Flex>
        </Space>
      </AdminPanelCard>
      <AdminImageCropModal
        open={cropOpen}
        file={pendingImage}
        title="Recortar capa do artigo"
        onCancel={() => {
          setCropOpen(false)
          setPendingImage(null)
        }}
        onConfirm={async (croppedFile) => {
          setUploading(true)
          try {
            const url = await adminUploadImage(croppedFile)
            setImageUrl(url)
            message.success('Imagem enviada e otimizada')
            setCropOpen(false)
            setPendingImage(null)
          } catch {
            message.error('Falha no upload')
          } finally {
            setUploading(false)
          }
        }}
      />
    </div>
  )
}
