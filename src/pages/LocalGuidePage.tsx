import { Alert, Button, Card, Col, Grid, Pagination, Row, Select, Space, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  fetchLocalBusinessCategories,
  fetchLocalBusinesses,
  type LocalBusinessItem,
  type PaginatedResponse,
} from '../api/publicContent'
import { PageSection, PageSectionTitle } from '../components/PageSection'
import { publicAssetUrl } from '../util/publicAssetUrl'

const { Paragraph } = Typography
const { useBreakpoint } = Grid
const PAGE_SIZE = 10

type T = { localGuideTitle: string; localGuideDesc: string }

export function LocalGuidePage({ t }: { t: T }) {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('categoria') || undefined
  const currentPage = Math.max(1, Number(searchParams.get('page') || '1') || 1)
  const [result, setResult] = useState<PaginatedResponse<LocalBusinessItem> | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setErr(null)
    setResult(null)
    fetchLocalBusinesses(selectedCategory, currentPage, PAGE_SIZE)
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch(() => {
        if (!cancelled) setErr('Não foi possível carregar o guia local.')
      })
    return () => {
      cancelled = true
    }
  }, [selectedCategory, currentPage])

  useEffect(() => {
    let cancelled = false
    fetchLocalBusinessCategories()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categoryOptions = categories.map((value) => ({ label: value, value }))
  const setCategoryFilter = (value?: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('categoria', value)
    else next.delete('categoria')
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

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
        {t.localGuideTitle}
      </PageSectionTitle>
      <Paragraph>{t.localGuideDesc}</Paragraph>
      {isMobile ? (
        <Space orientation="vertical" size={4} style={{ marginTop: 8 }}>
          <Typography.Text strong>Filtrar por categoria</Typography.Text>
          <Select
            allowClear
            placeholder="Todas as categorias"
            value={selectedCategory}
            options={categoryOptions}
            style={{ minWidth: 260 }}
            onChange={(value) => setCategoryFilter(value)}
          />
        </Space>
      ) : (
        <Space orientation="vertical" size={8} style={{ marginTop: 8, width: '100%' }}>
          <Typography.Text strong>Categorias</Typography.Text>
          <Space wrap size={[8, 8]}>
            <Button type={selectedCategory ? 'default' : 'primary'} onClick={() => setCategoryFilter(undefined)}>
              Todas
            </Button>
            {categories.map((cat) => (
              <Button key={cat} type={selectedCategory === cat ? 'primary' : 'default'} onClick={() => setCategoryFilter(cat)}>
                {cat}
              </Button>
            ))}
          </Space>
        </Space>
      )}
      {err && <Alert type="error" message={err} style={{ marginTop: 16 }} showIcon />}
      {result === null && <Spin style={{ display: 'block', marginTop: 24 }} />}
      {result && items.length === 0 && (
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          Nenhum comércio cadastrado no momento.
        </Paragraph>
      )}
      {result && items.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            {items.map((biz) => (
              <Col xs={24} md={12} key={biz.id}>
                <Card
                  hoverable
                  cover={
                    <Link to={`/guia-local/${biz.id}`}>
                      <img
                        alt={`Imagem do negócio ${biz.title}`}
                        src={publicAssetUrl(biz.imageUrl)}
                        style={{ height: 260, objectFit: 'cover', width: '100%' }}
                      />
                    </Link>
                  }
                >
                  <Link to={`/guia-local/${biz.id}`} style={{ color: 'inherit' }}>
                    <Typography.Title level={5} className="ga-post-title" style={{ marginTop: 0 }}>
                      {biz.title}
                    </Typography.Title>
                  </Link>
                  <Paragraph type="secondary" className="ga-post-body" ellipsis={{ rows: 3 }}>
                    {biz.description.replace(/[#*_`[\]]/g, ' ').replace(/\s+/g, ' ').trim()}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
          {total > PAGE_SIZE && (
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={setPage}
              showSizeChanger={false}
              align="center"
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      )}
    </PageSection>
  )
}
