import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Button, Space, Spin, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { getAdminToken } from '../api/http'
import { fetchBlogPost, type BlogDetail } from '../api/publicContent'
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

export function BlogPostPage({
  siteName,
  backLabel,
  editInPanelLabel,
}: {
  siteName: string
  backLabel: string
  editInPanelLabel: string
}) {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<BlogDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)
    setPost(null)
    fetchBlogPost(slug)
      .then((data) => {
        if (!cancelled) {
          setPost(data)
          document.title = `${data.title} | ${siteName}`
        }
      })
      .catch(() => {
        if (!cancelled) setErr('Artigo não encontrado ou indisponível.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug, siteName])

  const showEdit = Boolean(post && getAdminToken())

  return (
    <PageSection>
      <Space wrap align="center" style={{ marginBottom: 12 }}>
        <Link to="/blog" style={{ lineHeight: 1 }}>
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
        {showEdit && post ? (
          <Link to={`/admin/blog/${post.id}`}>
            <Button type="primary" size="small">
              {editInPanelLabel}
            </Button>
          </Link>
        ) : null}
      </Space>
      {loading && <Spin style={{ display: 'block', marginTop: 24 }} />}
      {err && <Alert type="error" message={err} showIcon style={{ marginTop: 16 }} />}
      {post && !err && (
        <>
          <img
            src={publicAssetUrl(post.imageUrl)}
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: 12,
              marginBottom: 16,
            }}
          />
          <Title level={2} style={{ marginTop: 0 }}>
            {post.title}
          </Title>
          <Paragraph type="secondary">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </Paragraph>
          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <article className="ga-markdown" aria-label="Conteúdo do artigo">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {post.body}
            </ReactMarkdown>
          </article>
        </>
      )}
    </PageSection>
  )
}
