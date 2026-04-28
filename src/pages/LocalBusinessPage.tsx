import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  FacebookOutlined,
  GlobalOutlined,
  InstagramFilled,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  TagsOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'
import { Alert, Button, Descriptions, Space, Spin, Typography, message } from 'antd'
import { type CSSProperties, useEffect, useState } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { getAdminToken } from '../api/http'
import { fetchLocalBusiness, type LocalBusinessItem } from '../api/publicContent'
import { PageSection } from '../components/PageSection'
import {
  applySeo,
  clearDynamicJsonLd,
  extractFaqFromMarkdown,
  setBreadcrumbSchema,
  setFaqSchema,
  setLocalBusinessSchema,
} from '../seo/seo'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Title, Paragraph } = Typography
const SITE_URL = 'https://www.goldenagencia.com'

const infoLabelStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontWeight: 600,
}

function asAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function normalizeSocialUrl(value: string, provider: 'instagram' | 'facebook' | 'youtube') {
  if (/^https?:\/\//i.test(value)) return value
  const clean = value.trim().replace(/^@/, '')
  if (!clean) return ''
  if (provider === 'instagram') return `https://instagram.com/${clean}`
  if (provider === 'facebook') return `https://facebook.com/${clean}`
  return `https://youtube.com/${clean}`
}

function googleMapsEmbedUrl(address: string) {
  const q = encodeURIComponent(address.trim())
  return `https://www.google.com/maps?q=${q}&output=embed`
}

const mdComponents: Components = {
  img: ({ src, alt, ...rest }) => (
    <img
      {...rest}
      src={src ? publicAssetUrl(String(src)) : undefined}
      alt={alt || ''}
      style={{ maxWidth: '100%', borderRadius: 8 }}
    />
  ),
}

export function LocalBusinessPage({
  siteName,
  backLabel,
  editInPanelLabel,
}: {
  siteName: string
  backLabel: string
  editInPanelLabel: string
}) {
  const { id = '' } = useParams()
  const [row, setRow] = useState<LocalBusinessItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)
    setRow(null)
    fetchLocalBusiness(id)
      .then((data) => {
        if (!cancelled) {
          setRow(data)
          const canonicalPath = `/guia-local/${data.id}`
          const description = data.description.replace(/[#*_`[\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 158)
          const imageUrl = publicAssetUrl(data.imageUrl)

          applySeo({
            title: `${data.title} | ${siteName}`,
            description,
            path: canonicalPath,
            imageUrl,
          })
          setBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: backLabel, path: '/guia-local' },
            { name: data.title, path: canonicalPath },
          ])
          setLocalBusinessSchema({
            path: canonicalPath,
            name: data.title,
            description,
            imageUrl,
            telephone: data.contact,
            address: data.location,
            email: data.email,
            website: data.site,
            category: data.category,
            socialLinks: [data.instagram, data.facebook, data.youtube]
              .filter(Boolean)
              .map((value) => String(value)),
          })
          setFaqSchema(extractFaqFromMarkdown(data.description))
        }
      })
      .catch(() => {
        if (!cancelled) setErr('Comércio não encontrado ou indisponível.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      clearDynamicJsonLd(['breadcrumb', 'local-business', 'faq'])
      cancelled = true
    }
  }, [id, siteName, backLabel])

  const showEdit = Boolean(row && getAdminToken())
  const shareUrl = row ? `${SITE_URL}/guia-local/${row.id}` : ''
  const shareText = row ? `Confira este negócio no Guia Local: ${row.title}` : ''
  const facebookShareHref = row
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    : '#'
  const whatsappShareHref = row
    ? `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
    : '#'
  const emailShareHref = row
    ? `mailto:?subject=${encodeURIComponent(row.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    : '#'

  const handleInstagramShare = async () => {
    if (!row) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      messageApi.success('Link copiado. Abra o Instagram e cole no post/story.')
    } catch {
      messageApi.info('Não foi possível copiar automaticamente. Copie a URL da página para compartilhar no Instagram.')
    }
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
  }

  return (
    <PageSection>
      {contextHolder}
      <Space wrap align="center" style={{ marginBottom: 12 }}>
        <Link to="/guia-local" style={{ lineHeight: 1 }}>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            aria-label={`Voltar para ${backLabel}`}
            style={{
              borderRadius: 10,
              fontWeight: 600,
              height: 40,
              paddingInline: 16,
              borderColor: 'rgba(16, 42, 67, 0.14)',
              boxShadow: '0 1px 2px rgba(16, 42, 67, 0.06)',
            }}
          >
            {backLabel}
          </Button>
        </Link>
        {showEdit && row ? (
          <Link to={`/admin/guia-local/${row.id}`}>
            <Button type="primary" size="small">
              {editInPanelLabel}
            </Button>
          </Link>
        ) : null}
      </Space>
      {loading && <Spin style={{ display: 'block', marginTop: 24 }} />}
      {err && <Alert type="error" message={err} showIcon style={{ marginTop: 16 }} />}
      {row && !err && (
        <>
          <img
            src={publicAssetUrl(row.imageUrl)}
            alt={`Imagem do negócio ${row.title}`}
            style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 12, marginBottom: 16 }}
          />
          <Title level={1} className="ga-post-title" style={{ marginTop: 0 }}>
            {row.title}
          </Title>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              Compartilhar negócio
            </Typography.Text>
            <Space wrap>
              <Button icon={<FacebookFilled />} href={facebookShareHref} target="_blank" rel="noreferrer">
                Facebook
              </Button>
              <Button icon={<WhatsAppOutlined />} href={whatsappShareHref} target="_blank" rel="noreferrer">
                WhatsApp
              </Button>
              <Button icon={<MailOutlined />} href={emailShareHref}>
                E-mail
              </Button>
              <Button icon={<InstagramFilled />} onClick={handleInstagramShare}>
                Instagram
              </Button>
            </Space>
          </div>
          <div className="ga-markdown ga-post-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {row.description}
            </ReactMarkdown>
          </div>
          <Descriptions column={1} bordered size="small" style={{ marginTop: 18, marginBottom: 16 }}>
            {row.category ? (
              <Descriptions.Item
                label={
                  <span style={infoLabelStyle}>
                    <TagsOutlined />
                    Categoria
                  </span>
                }
              >
                {row.category}
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item
              label={
                <span style={infoLabelStyle}>
                  <PhoneOutlined />
                  Contato
                </span>
              }
            >
              {row.contact}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span style={infoLabelStyle}>
                  <EnvironmentOutlined />
                  Localização
                </span>
              }
            >
              {row.location}
            </Descriptions.Item>
            {row.email ? (
              <Descriptions.Item
                label={
                  <span style={infoLabelStyle}>
                    <MailOutlined />
                    E-mail
                  </span>
                }
              >
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </Descriptions.Item>
            ) : null}
            {row.instagram ? (
              <Descriptions.Item
                label={
                  <span style={infoLabelStyle}>
                    <InstagramOutlined />
                    Instagram
                  </span>
                }
              >
                <a href={normalizeSocialUrl(row.instagram, 'instagram')} target="_blank" rel="noreferrer">
                  {row.instagram}
                </a>
              </Descriptions.Item>
            ) : null}
            {row.facebook ? (
              <Descriptions.Item
                label={
                  <span style={infoLabelStyle}>
                    <FacebookOutlined />
                    Facebook
                  </span>
                }
              >
                <a href={normalizeSocialUrl(row.facebook, 'facebook')} target="_blank" rel="noreferrer">
                  {row.facebook}
                </a>
              </Descriptions.Item>
            ) : null}
            {row.site ? (
              <Descriptions.Item
                label={
                  <span style={infoLabelStyle}>
                    <GlobalOutlined />
                    Site
                  </span>
                }
              >
                <a href={asAbsoluteUrl(row.site)} target="_blank" rel="noreferrer">
                  {row.site}
                </a>
              </Descriptions.Item>
            ) : null}
            {row.youtube ? (
              <Descriptions.Item
                label={
                  <span style={infoLabelStyle}>
                    <YoutubeOutlined />
                    YouTube
                  </span>
                }
              >
                <a href={normalizeSocialUrl(row.youtube, 'youtube')} target="_blank" rel="noreferrer">
                  {row.youtube}
                </a>
              </Descriptions.Item>
            ) : null}
          </Descriptions>
          {row.location ? (
            <div style={{ marginTop: 8, marginBottom: 16 }}>
              <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                Mapa
              </Typography.Text>
              <iframe
                title={`Mapa de ${row.title}`}
                src={googleMapsEmbedUrl(row.location)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{
                  width: '100%',
                  height: 320,
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  borderRadius: 12,
                }}
              />
            </div>
          ) : null}
          <Paragraph type="secondary" style={{ marginTop: 24 }}>
            Cadastrado em {new Date(row.createdAt).toLocaleDateString('pt-BR')}
          </Paragraph>
        </>
      )}
    </PageSection>
  )
}
