import { Alert, Card, Col, Pagination, Row, Spin, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchBlogPosts, type BlogListItem, type PaginatedResponse } from '../api/publicContent'
import { PageSection, PageSectionTitle } from '../components/PageSection'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Paragraph } = Typography
const PAGE_SIZE = 10

type T = { blogTitle: string; blogDesc: string }

export function BlogPage({ t }: { t: T }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, Number(searchParams.get('page') || '1') || 1)
  const [result, setResult] = useState<PaginatedResponse<BlogListItem> | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setErr(null)
    setResult(null)
    fetchBlogPosts(currentPage, PAGE_SIZE)
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch(() => {
        if (!cancelled) setErr('Não foi possível carregar as publicações.')
      })
    return () => {
      cancelled = true
    }
  }, [currentPage])

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams)
    if (page <= 1) next.delete('page')
    else next.set('page', String(page))
    setSearchParams(next, { replace: true })
  }

  const items = result?.items ?? []
  const total = result?.total ?? 0

  return (
    <PageSection>
      <PageSectionTitle level={1} className="ga-post-title">
        {t.blogTitle}
      </PageSectionTitle>
      <Paragraph>{t.blogDesc}</Paragraph>
      {err && <Alert type="error" message={err} style={{ marginTop: 16 }} showIcon />}
      {result === null && <Spin style={{ display: 'block', marginTop: 24 }} />}
      {result && items.length === 0 && (
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          Ainda não há artigos publicados.
        </Paragraph>
      )}
      {result && items.length > 0 && (
        <div style={{ marginTop: 16, display: 'grid', gap: 16 }}>
          {items.map((post) => (
            <Card key={post.id} style={{ width: '100%' }} styles={{ body: { padding: 16 } }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={8} md={6}>
                  <Link to={`/blog/${post.slug}`}>
                    <img
                      src={publicAssetUrl(post.imageUrl)}
                      alt={`Imagem de capa do artigo ${post.title}`}
                      style={{ width: '100%', borderRadius: 12, display: 'block', objectFit: 'cover', maxHeight: 160 }}
                    />
                  </Link>
                </Col>
                <Col xs={24} sm={16} md={18}>
                  <Link to={`/blog/${post.slug}`} style={{ color: 'inherit' }}>
                    <Typography.Title level={4} className="ga-post-title" style={{ marginTop: 0 }}>
                      {post.title}
                    </Typography.Title>
                  </Link>
                  <Paragraph type="secondary" className="ga-post-body" ellipsis={{ rows: 3 }}>
                    {post.excerpt}
                  </Paragraph>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {post.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
          {total > PAGE_SIZE && (
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={setPage}
              showSizeChanger={false}
              align="center"
              style={{ marginTop: 8 }}
            />
          )}
        </div>
      )}
    </PageSection>
  )
}
