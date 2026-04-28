import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import { AutoComplete, Button, Divider, Flex, Input, Modal, Select, Space, Spin, Switch, Table, Typography, Upload, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateLocalCategory,
  adminListLocalCategories,
  adminCreateLocal,
  adminGetLocal,
  adminUpdateLocalCategory,
  adminUpdateLocal,
  adminUploadImage,
  type AdminLocalCategory,
} from '../api/adminApi'
import { AdminImageCropModal } from './AdminImageCropModal'
import { publicAssetUrl } from '../util/publicAssetUrl'
import { AdminFieldLabel, AdminPageHeader, AdminPanelCard } from './AdminPageChrome'

function formatUsPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  const local = digits.startsWith('1') && digits.length > 10 ? digits.slice(1, 11) : digits.slice(0, 10)
  const area = local.slice(0, 3)
  const prefix = local.slice(3, 6)
  const line = local.slice(6, 10)

  if (!area) return ''
  if (!prefix) return `(${area}`
  if (!line) return `(${area}) ${prefix}`
  return `(${area}) ${prefix}-${line}`
}

export function AdminLocalEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isCreate = !id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [contact, setContact] = useState('')
  const [location, setLocation] = useState('')
  const [locationOptions, setLocationOptions] = useState<Array<{ value: string; label: string }>>([])
  const [locationLookupLoading, setLocationLookupLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [email, setEmail] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [site, setSite] = useState('')
  const [youtube, setYoutube] = useState('')
  const [categoryOptions, setCategoryOptions] = useState<AdminLocalCategory[]>([])
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false)
  const [categoryNameInput, setCategoryNameInput] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [savingCategory, setSavingCategory] = useState(false)
  const [published, setPublished] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [cropOpen, setCropOpen] = useState(false)
  const [pendingImage, setPendingImage] = useState<File | null>(null)
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
        setCategory(row.category || '')
        setEmail(row.email || '')
        setInstagram(row.instagram || '')
        setFacebook(row.facebook || '')
        setSite(row.site || '')
        setYoutube(row.youtube || '')
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

  const loadCategories = async () => {
    const data = await adminListLocalCategories()
    setCategoryOptions(data)
  }

  useEffect(() => {
    let active = true
    adminListLocalCategories()
      .then((data) => {
        if (active) setCategoryOptions(data)
      })
      .catch(() => {
        if (active) setCategoryOptions([])
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const q = location.trim()
    if (q.length < 3) {
      setLocationOptions([])
      return
    }

    const ctrl = new AbortController()
    setLocationLookupLoading(true)

    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q,
          format: 'jsonv2',
          addressdetails: '1',
          limit: '6',
        })
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          signal: ctrl.signal,
        })
        if (!res.ok) throw new Error('Falha na busca')
        const data = (await res.json()) as Array<{ display_name?: string }>
        setLocationOptions(
          data
            .map((item) => item.display_name?.trim())
            .filter(Boolean)
            .map((text) => ({ value: text as string, label: text as string })),
        )
      } catch {
        setLocationOptions([])
      } finally {
        setLocationLookupLoading(false)
      }
    }, 350)

    return () => {
      window.clearTimeout(timer)
      ctrl.abort()
      setLocationLookupLoading(false)
    }
  }, [location])

  const openCreateCategory = () => {
    setEditingCategoryId(null)
    setCategoryNameInput('')
  }

  const openEditCategory = (row: AdminLocalCategory) => {
    setEditingCategoryId(row.id)
    setCategoryNameInput(row.name)
  }

  const saveCategory = async () => {
    const name = categoryNameInput.trim()
    if (!name) return message.warning('Informe o nome da categoria')
    setSavingCategory(true)
    try {
      if (editingCategoryId) {
        await adminUpdateLocalCategory(editingCategoryId, { name })
        message.success('Categoria atualizada')
      } else {
        await adminCreateLocalCategory({ name })
        message.success('Categoria criada')
      }
      await loadCategories()
      openCreateCategory()
    } catch {
      message.error('Não foi possível salvar a categoria')
    } finally {
      setSavingCategory(false)
    }
  }

  const save = async () => {
    if (!title.trim()) return message.warning('Informe o título')
    if (!imageUrl.trim()) return message.warning('Envie a foto')
    if (!description.trim()) return message.warning('Escreva a descrição')
    if (!contact.trim()) return message.warning('Informe o contato')
    if (!location.trim()) return message.warning('Informe a localização')
    const optionalTrim = (value: string) => {
      const trimmed = value.trim()
      return trimmed || undefined
    }
    setSaving(true)
    try {
      if (isCreate) {
        await adminCreateLocal({
          title,
          description,
          imageUrl,
          contact,
          location,
          category: optionalTrim(category),
          email: optionalTrim(email),
          instagram: optionalTrim(instagram),
          facebook: optionalTrim(facebook),
          site: optionalTrim(site),
          youtube: optionalTrim(youtube),
          published,
        })
        message.success('Criado')
      } else if (id) {
        await adminUpdateLocal(id, {
          title,
          description,
          imageUrl,
          contact,
          location,
          category: optionalTrim(category),
          email: optionalTrim(email),
          instagram: optionalTrim(instagram),
          facebook: optionalTrim(facebook),
          site: optionalTrim(site),
          youtube: optionalTrim(youtube),
          published,
        })
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
        description="Foto com recorte otimizado (800x445) e compressão agressiva para até 50 KB, com texto em Markdown e dados de contato."
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
              Uma foto por cadastro. Formatos: JPEG, PNG, WebP ou GIF. Após selecionar, o sistema abre recorte em 800x445.
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
              <AdminFieldLabel>Categoria</AdminFieldLabel>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Select
                value={category || undefined}
                options={categoryOptions.map((value) => ({ value: value.name, label: value.name }))}
                onChange={(value) => setCategory(value || '')}
                size="large"
                placeholder="Selecione uma categoria"
                style={{ width: '100%' }}
                allowClear
              />
                <Button
                  type="link"
                  style={{ paddingInline: 0 }}
                  onClick={() => {
                    setCategoriesModalOpen(true)
                    openCreateCategory()
                  }}
                >
                  Criar ou editar categorias
                </Button>
              </Space>
            </div>
          </Flex>

          <Flex gap={16} wrap="wrap">
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>Contato</AdminFieldLabel>
              <Input
                value={contact}
                onChange={(e) => setContact(formatUsPhone(e.target.value))}
                size="large"
                placeholder="(555) 123-4567"
                maxLength={14}
              />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Formato EUA: (DDD) 000-0000. Código +1 é tratado automaticamente.
              </Typography.Text>
            </div>
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>Localização</AdminFieldLabel>
              <AutoComplete
                value={location}
                options={locationOptions}
                onChange={(value) => setLocation(value)}
                onSelect={(value) => setLocation(value)}
                notFoundContent={locationLookupLoading ? 'Buscando endereços...' : 'Nenhum endereço encontrado'}
                style={{ width: '100%' }}
              >
                <Input size="large" placeholder="Digite endereço ou cidade" />
              </AutoComplete>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Sugestões via OpenStreetMap. Se preferir, você pode digitar livremente.
              </Typography.Text>
            </div>
          </Flex>

          <Flex gap={16} wrap="wrap">
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>E-mail (opcional)</AdminFieldLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="large"
                placeholder="contato@comercio.com.br"
              />
            </div>
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>Instagram (opcional)</AdminFieldLabel>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                size="large"
                placeholder="@perfil ou URL"
              />
            </div>
          </Flex>

          <Flex gap={16} wrap="wrap">
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>Facebook (opcional)</AdminFieldLabel>
              <Input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                size="large"
                placeholder="URL da página"
              />
            </div>
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>Site (opcional)</AdminFieldLabel>
              <Input
                value={site}
                onChange={(e) => setSite(e.target.value)}
                size="large"
                placeholder="https://..."
              />
            </div>
          </Flex>

          <Flex gap={16} wrap="wrap">
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <AdminFieldLabel>YouTube (opcional)</AdminFieldLabel>
              <Input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                size="large"
                placeholder="Canal ou vídeo"
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
      <AdminImageCropModal
        open={cropOpen}
        file={pendingImage}
        title="Recortar imagem do comércio"
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
      <Modal
        open={categoriesModalOpen}
        title="Categorias do guia local"
        onCancel={() => setCategoriesModalOpen(false)}
        footer={null}
        width={760}
        destroyOnClose
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Flex gap={10} wrap="wrap">
            <Input
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="Nome da categoria"
              maxLength={120}
              style={{ flex: '1 1 260px' }}
            />
            <Button type="primary" loading={savingCategory} onClick={() => void saveCategory()}>
              {editingCategoryId ? 'Salvar edição' : 'Criar categoria'}
            </Button>
            {editingCategoryId ? (
              <Button onClick={openCreateCategory}>Cancelar edição</Button>
            ) : null}
          </Flex>
          <Table<AdminLocalCategory>
            rowKey="id"
            dataSource={categoryOptions}
            size="small"
            pagination={{ pageSize: 6, hideOnSinglePage: true }}
            locale={{ emptyText: 'Nenhuma categoria cadastrada.' }}
            columns={[
              { title: 'Nome', dataIndex: 'name' },
              {
                title: 'Ação',
                width: 120,
                render: (_, row) => (
                  <Button type="link" size="small" onClick={() => openEditCategory(row)}>
                    Editar
                  </Button>
                ),
              },
            ]}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Exclusão de categorias está desativada.
          </Typography.Text>
        </Space>
      </Modal>
    </div>
  )
}
