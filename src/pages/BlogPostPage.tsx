import { ArrowLeftOutlined, FacebookFilled, InstagramFilled, MailOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { Alert, Button, Space, Spin, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { getAdminToken } from '../api/http'
import { fetchBlogPost, type BlogDetail } from '../api/publicContent'
import { PageSection } from '../components/PageSection'
import {
  applySeo,
  clearDynamicJsonLd,
  extractFaqFromMarkdown,
  setBlogPostingSchema,
  setBreadcrumbSchema,
  setFaqSchema,
} from '../seo/seo'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Title, Paragraph } = Typography
const SITE_URL = 'https://www.goldenagencia.com'

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
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)
    setPost(null)
    fetchBlogPost(slug)
      .then((data) => {
        if (!cancelled) {
          setPost(data)
          const canonicalPath = `/blog/${data.slug}`
          const description = data.body.replace(/[#*_`[\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 158)
          const imageUrl = publicAssetUrl(data.imageUrl)

          applySeo({
            title: `${data.title} | ${siteName}`,
            description,
            path: canonicalPath,
            imageUrl,
          })
          setBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: backLabel, path: '/blog' },
            { name: data.title, path: canonicalPath },
          ])
          setBlogPostingSchema({
            path: canonicalPath,
            title: data.title,
            description,
            imageUrl,
            createdAt: data.createdAt,
            tags: data.tags,
          })
          setFaqSchema(extractFaqFromMarkdown(data.body))
        }
      })
      .catch(() => {
        if (!cancelled) setErr('Artigo não encontrado ou indisponível.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      clearDynamicJsonLd(['breadcrumb', 'blog-posting', 'faq'])
      cancelled = true
    }
  }, [slug, siteName, backLabel])

  const showEdit = Boolean(post && getAdminToken())
  const shareUrl = post ? `${SITE_URL}/blog/${post.slug}` : ''
  const shareText = post ? `Confira este artigo: ${post.title}` : ''
  const facebookShareHref = post
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    : '#'
  const whatsappShareHref = post
    ? `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
    : '#'
  const emailShareHref = post
    ? `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    : '#'

  const handleInstagramShare = async () => {
    if (!post) return
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
            alt={`Imagem de capa do artigo ${post.title}`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: 12,
              marginBottom: 16,
            }}
          />
          <Title level={1} className="ga-post-title" style={{ marginTop: 0 }}>
            {post.title}
          </Title>
          <Paragraph type="secondary">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </Paragraph>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              Compartilhar informação
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
