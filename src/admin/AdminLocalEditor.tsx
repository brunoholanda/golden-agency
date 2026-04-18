import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { Button, Input, Space, Switch, Typography, Upload, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateLocal,
  adminGetLocal,
  adminUpdateLocal,
  adminUploadImage,
} from '../api/adminApi'
import { publicAssetUrl } from '../util/publicAssetUrl'

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

  if (loading) return <Typography.Paragraph>Carregando…</Typography.Paragraph>

  return (
    <div data-color-mode="light">
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {isCreate ? 'Novo comércio' : 'Editar comércio'}
      </Typography.Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Typography.Text strong>Título</Typography.Text>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} showCount style={{ marginTop: 8 }} />
        </div>
        <div>
          <Typography.Text strong>Foto</Typography.Text>
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
              <Button loading={uploading}>Enviar foto</Button>
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
          <Typography.Text strong>Texto principal (Markdown)</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <MDEditor value={description} onChange={(v) => setDescription(v || '')} height={360} preview="edit" />
          </div>
        </div>
        <div>
          <Typography.Text strong>Contato</Typography.Text>
          <Input value={contact} onChange={(e) => setContact(e.target.value)} style={{ marginTop: 8 }} placeholder="Telefone, WhatsApp, site…" />
        </div>
        <div>
          <Typography.Text strong>Localização</Typography.Text>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} style={{ marginTop: 8 }} placeholder="Endereço ou cidade" />
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
          <Button onClick={() => navigate('/admin/guia-local')}>Cancelar</Button>
        </Space>
      </Space>
    </div>
  )
}
