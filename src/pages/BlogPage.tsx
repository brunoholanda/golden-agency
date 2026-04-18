import { Alert, Card, Col, List, Row, Spin, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBlogPosts, type BlogListItem } from '../api/publicContent'
import { PageSection, PageSectionTitle } from '../components/PageSection'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Paragraph } = Typography

type T = { blogTitle: string; blogDesc: string }

export function BlogPage({ t }: { t: T }) {
  const [items, setItems] = useState<BlogListItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchBlogPosts()
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch(() => {
        if (!cancelled) setErr('Não foi possível carregar as publicações.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageSection>
      <PageSectionTitle level={2}>{t.blogTitle}</PageSectionTitle>
      <Paragraph>{t.blogDesc}</Paragraph>
      {err && <Alert type="error" message={err} style={{ marginTop: 16 }} showIcon />}
      {items === null && <Spin style={{ display: 'block', marginTop: 24 }} />}
      {items && items.length === 0 && (
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          Ainda não há artigos publicados.
        </Paragraph>
      )}
      {items && items.length > 0 && (
        <List
          style={{ marginTop: 16 }}
          dataSource={items}
          renderItem={(post) => (
            <List.Item key={post.id}>
              <Card style={{ width: '100%' }} styles={{ body: { padding: 16 } }}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={8} md={6}>
                    <Link to={`/blog/${post.slug}`}>
                      <img
                        src={publicAssetUrl(post.imageUrl)}
                        alt=""
                        style={{ width: '100%', borderRadius: 12, display: 'block', objectFit: 'cover', maxHeight: 160 }}
                      />
                    </Link>
                  </Col>
                  <Col xs={24} sm={16} md={18}>
                    <Link to={`/blog/${post.slug}`} style={{ color: 'inherit' }}>
                      <Typography.Title level={4} style={{ marginTop: 0 }}>
                        {post.title}
                      </Typography.Title>
                    </Link>
                    <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                      {post.excerpt}
                    </Paragraph>
                    <div>
                      {post.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      )}
    </PageSection>
  )
}
