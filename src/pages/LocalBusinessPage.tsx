import { EnvironmentOutlined, FacebookOutlined, GlobalOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, TagsOutlined, YoutubeOutlined } from '@ant-design/icons'
import { Alert, Button, Descriptions, Space, Spin, Typography } from 'antd'
import { type CSSProperties, useEffect, useState } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { getAdminToken } from '../api/http'
import { fetchLocalBusiness, type LocalBusinessItem } from '../api/publicContent'
import { PageSection } from '../components/PageSection'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Title, Paragraph } = Typography

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

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)
    setRow(null)
    fetchLocalBusiness(id)
      .then((data) => {
        if (!cancelled) {
          setRow(data)
          document.title = `${data.title} | ${siteName}`
        }
      })
      .catch(() => {
        if (!cancelled) setErr('Comércio não encontrado ou indisponível.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, siteName])

  const showEdit = Boolean(row && getAdminToken())

  return (
    <PageSection>
      <Space wrap align="center" style={{ marginBottom: 8 }}>
        <Link to="/guia-local">
          <Button type="link" style={{ paddingLeft: 0 }}>
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
            alt=""
            style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 12, marginBottom: 16 }}
          />
          <Title level={2} style={{ marginTop: 0 }}>
            {row.title}
          </Title>
          <div className="ga-markdown">
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
