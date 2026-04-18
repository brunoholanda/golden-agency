import { Alert, Card, List, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLocalBusinesses, type LocalBusinessItem } from '../api/publicContent'
import { PageSection, PageSectionTitle } from '../components/PageSection'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Paragraph } = Typography

type T = { localGuideTitle: string; localGuideDesc: string }

export function LocalGuidePage({ t }: { t: T }) {
  const [items, setItems] = useState<LocalBusinessItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchLocalBusinesses()
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch(() => {
        if (!cancelled) setErr('Não foi possível carregar o guia local.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageSection>
      <PageSectionTitle level={2}>{t.localGuideTitle}</PageSectionTitle>
      <Paragraph>{t.localGuideDesc}</Paragraph>
      {err && <Alert type="error" message={err} style={{ marginTop: 16 }} showIcon />}
      {items === null && <Spin style={{ display: 'block', marginTop: 24 }} />}
      {items && items.length === 0 && (
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          Nenhum comércio cadastrado no momento.
        </Paragraph>
      )}
      {items && items.length > 0 && (
        <List
          style={{ marginTop: 16 }}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
          dataSource={items}
          renderItem={(biz) => (
            <List.Item key={biz.id}>
              <Card
                hoverable
                cover={
                  <Link to={`/guia-local/${biz.id}`}>
                    <img
                      alt=""
                      src={publicAssetUrl(biz.imageUrl)}
                      style={{ height: 180, objectFit: 'cover', width: '100%' }}
                    />
                  </Link>
                }
              >
                <Link to={`/guia-local/${biz.id}`} style={{ color: 'inherit' }}>
                  <Typography.Title level={5} style={{ marginTop: 0 }}>
                    {biz.title}
                  </Typography.Title>
                </Link>
                <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                  {biz.description.replace(/[#*_`[\]]/g, ' ').replace(/\s+/g, ' ').trim()}
                </Paragraph>
              </Card>
            </List.Item>
          )}
        />
      )}
    </PageSection>
  )
}
