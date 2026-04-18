import { Alert, Button, Descriptions, Space, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { getAdminToken } from '../api/http'
import { fetchLocalBusiness, type LocalBusinessItem } from '../api/publicContent'
import { PageSection } from '../components/PageSection'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Title, Paragraph } = Typography

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
            style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }}
          />
          <Title level={2} style={{ marginTop: 0 }}>
            {row.title}
          </Title>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Contato">{row.contact}</Descriptions.Item>
            <Descriptions.Item label="Localização">{row.location}</Descriptions.Item>
          </Descriptions>
          <div className="ga-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {row.description}
            </ReactMarkdown>
          </div>
          <Paragraph type="secondary" style={{ marginTop: 24 }}>
            Cadastrado em {new Date(row.createdAt).toLocaleDateString('pt-BR')}
          </Paragraph>
        </>
      )}
    </PageSection>
  )
}
