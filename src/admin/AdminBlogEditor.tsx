import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { Button, Input, Select, Space, Switch, Typography, Upload, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateBlog,
  adminGetBlog,
  adminUpdateBlog,
  adminUploadImage,
} from '../api/adminApi'
import { publicAssetUrl } from '../util/publicAssetUrl'

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

  if (loading) return <Typography.Paragraph>Carregando…</Typography.Paragraph>

  return (
    <div data-color-mode="light">
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {isCreate ? 'Novo artigo' : 'Editar artigo'}
      </Typography.Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Typography.Text strong>Título</Typography.Text>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} showCount style={{ marginTop: 8 }} />
        </div>
        <div>
          <Typography.Text strong>Imagem de capa (1)</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <Upload
              accept="image/jpeg,image/png,image/webp,image/gif"
              showUploadList={false}
              beforeUpload={async (file) => {
                setUploading(true)
                try {
                  const url = await adminUploadImage(file)
                  setImageUrl(url)
                  message.success('Imagem enviada (otimizada no navegador)')
                } catch {
                  message.error('Falha no upload')
                } finally {
                  setUploading(false)
                }
                return false
              }}
            >
              <Button loading={uploading}>Enviar imagem</Button>
            </Upload>
          </div>
          {imageUrl ? (
            <img
              src={publicAssetUrl(imageUrl)}
              alt=""
              style={{ marginTop: 12, maxWidth: 360, borderRadius: 8, display: 'block' }}
            />
          ) : null}
        </div>
        <div>
          <Typography.Text strong>Tags (até 5)</Typography.Text>
          <Select
            mode="tags"
            style={{ width: '100%', marginTop: 8 }}
            value={tags}
            onChange={(next) => setTags(next.slice(0, 5))}
            placeholder="Digite e pressione Enter"
            tokenSeparators={[',']}
          />
        </div>
        <div>
          <Typography.Text strong>Texto (Markdown)</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <MDEditor value={body} onChange={(v) => setBody(v || '')} height={420} preview="edit" />
          </div>
        </div>
        <div>
          <Space>
            <Typography.Text strong>Publicado</Typography.Text>
            <Switch checked={published} onChange={setPublished} />
          </Space>
        </div>
        <Space>
          <Button type="primary" loading={saving} onClick={() => void save()}>
            Salvar
          </Button>
          <Button onClick={() => navigate('/admin/blog')}>Cancelar</Button>
        </Space>
      </Space>
    </div>
  )
}
