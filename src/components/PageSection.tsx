import { Typography } from 'antd'
import styled from 'styled-components'

const { Title } = Typography

export const PageSection = styled.section`
  background: #ffffff;
  border-radius: 16px;
  padding: clamp(18px, 4vw, 28px);
  box-shadow: 0 8px 24px rgba(16, 42, 67, 0.08);
`

export const PageSectionTitle = styled(Title)`
  && {
    margin-top: 0;
  }
`
