import { Breadcrumb, Card, Flex, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type AdminBreadcrumbItem = { label: string; path?: string }

type AdminPageHeaderProps = {
  items: AdminBreadcrumbItem[]
  title: string
  description?: string
  extra?: ReactNode
}

export function AdminPageHeader({ items, title, description, extra }: AdminPageHeaderProps) {
  const breadcrumbItems = items.map((it, i) => ({
    key: `${i}-${it.label}`,
    title: it.path ? <Link to={it.path}>{it.label}</Link> : it.label,
  }))

  return (
    <header style={{ marginBottom: 24 }}>
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 14 }} />
      <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
        <div style={{ minWidth: 0 }}>
          <Typography.Title level={3} style={{ margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: 640, fontSize: 15 }}>
              {description}
            </Typography.Paragraph>
          ) : null}
        </div>
        {extra ? <div style={{ flexShrink: 0 }}>{extra}</div> : null}
      </Flex>
    </header>
  )
}

type AdminPanelCardProps = {
  children: ReactNode
  /** Padding do corpo; use 0 para tabela “full bleed”. */
  bodyPadding?: number | string
  title?: ReactNode
}

export function AdminPanelCard({ children, bodyPadding = 20, title }: AdminPanelCardProps) {
  return (
    <Card
      title={title}
      variant="borderless"
      style={{
        borderRadius: 14,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.04)',
        border: '1px solid rgba(15, 23, 42, 0.06)',
      }}
      styles={{
        header: title ? { borderBottom: '1px solid rgba(15, 23, 42, 0.06)', minHeight: 48 } : undefined,
        body: { padding: bodyPadding },
      }}
    >
      {children}
    </Card>
  )
}

export function AdminFieldLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <Typography.Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13, ...style }}>
      {children}
    </Typography.Text>
  )
}
