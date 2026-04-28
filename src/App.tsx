import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FormOutlined,
  InstagramOutlined,
  MailOutlined,
  YoutubeOutlined,
  MenuOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Drawer, Layout, Row, Segmented, Space, Tag, Typography } from 'antd'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { AdminRoutes } from './admin/AdminRoutes'
import { fetchBlogHeadlines, type BlogHeadlineItem } from './api/publicContent'
import { privacyPolicyEn, privacyPolicyPtBR } from './content/privacyPolicy'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { LocalBusinessPage } from './pages/LocalBusinessPage'
import { LocalGuidePage } from './pages/LocalGuidePage'
import logo2Webp from './assets/golden-logo.webp'
import teamHianiWebp from './assets/team/hiani.webp'
import teamLeahWebp from './assets/team/leah.webp'
import teamNayWebp from './assets/team/nay.webp'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography
const WHATSAPP_LINK = 'https://wa.me/19132577256'
const MAILTO_LINK = 'mailto:leah@goldenagencia.com'
const CONTACT_EMAIL = 'leah@goldenagencia.com'
const CONTACT_PHONE_TEL = '+19132577256'
const CONTACT_PHONE_DISPLAY = '(913) 257-7256'
const INSTAGRAM_LINK = 'https://www.instagram.com/goldenagenciakc/'
const YOUTUBE_LINK = 'https://www.youtube.com/@GoldenAgenciaKC'
const PARTNER_FORM_LINK = 'https://forms.gle/To6R3YXWjoiEtcYH7'
const SITE_URL = 'https://www.goldenagencia.com'

type Language = 'pt-BR' | 'en'

const translations = {
  'pt-BR': {
    siteName: 'Golden Agência KC',
    siteTagline: 'Descomplicando a vida do imigrante brasileiro',
    contactCta: 'Fale conosco',
    nav: {
      home: 'Home',
      services: 'Serviços',
      pricing: 'Preços',
      blog: 'Blog',
      contact: 'Contato',
      localGuide: 'Guia Local',
      partner: 'Seja nosso parceiro',
    },
    remoteTag: 'Atendimento remoto e presencial',
    heroTitle: 'Como podemos te ajudar hoje?',
    heroDesc:
      'A Golden Agência nasceu para apoiar brasileiros que estão construindo a vida nos Estados Unidos. Cuidamos das tarefas burocráticas para você ganhar tempo, clareza e tranquilidade.',
    whatsappBtn: 'Chamar no WhatsApp',
    emailBtn: 'Enviar e-mail',
    servicesTitle: 'Nossos serviços',
    servicesDesc:
      'Atuamos como ponte entre você e os processos do dia a dia. Da impressão de documentos ao suporte com aplicações, oferecemos atendimento humanizado e prático.',
    services: [
      {
        title: 'Impressão e cópias',
        items: [
          'Impressão de documentos e formulários',
          'Cópias de passaporte, certidões e CPF',
          'Digitalização de documentos e fotos',
        ],
      },
      {
        title: 'Ligações e e-mails',
        items: [
          'Chamadas telefônicas curtas e longas',
          'Envio de e-mails pessoais e profissionais',
          'Contato com bancos, suporte técnico e serviços',
        ],
      },
      {
        title: 'Agendamentos e inscrições',
        items: [
          'Consultas médicas, DMV e matrículas escolares',
          'Reservas de hotel, restaurante e eventos',
          'Criação de contas online e inscrições em programas',
        ],
      },
      {
        title: 'Criação de documentos',
        items: [
          'Carta para condomínio e verificação de emprego',
          'Declaração de renda mensal',
          'Redação de textos em português e inglês',
        ],
      },
      {
        title: 'Auxílio com aplicações',
        items: [
          'Moradia, casamento, divórcio e pensão de menores',
          'Aplicações DCF e Medicaid',
          'Orientação para medidas protetivas',
        ],
      },
      {
        title: 'Assistência virtual',
        items: [
          'Gestão da agenda familiar e controle de contas',
          'Organização digital de documentos',
          'Atendimento para pequenas empresas e emissão de faturas',
        ],
      },
    ],
    additionalServicesTitle: 'Serviços adicionais',
    additionalServicesDesc:
      'Complemente seu atendimento com tradução, apoio presencial e encaminhamento para parceiros contábeis e jurídicos.',
    additionalServices: [
      {
        title: 'Tradução',
        items: ['Tradução de documentos e textos conforme sua necessidade — consulte prazos e valores.'],
      },
      {
        title: 'Auxílio presencial',
        items: ['Acompanhamento presencial em trâmites, visitas e atendimentos que exigem sua presença.'],
      },
      {
        title: 'Contato para serviços contábeis',
        items: ['Orientação e encaminhamento para profissionais contábeis parceiros.'],
      },
      {
        title: 'Contato para serviços jurídicos',
        items: ['Orientação e encaminhamento para assessoria jurídica quando necessário.'],
      },
    ],
    pricingTitle: 'Preços',
    pricingDesc:
      'Cada atendimento é único. Entre em contato para receber uma estimativa personalizada de acordo com o tipo de serviço e urgência.',
    pricingBoards: [
      {
        title: 'Serviços diversos e apoio administrativo',
        description: 'Impressões, agendamentos, documentos e assessoria consular.',
        sections: [
          {
            title: 'Impressão e cópias',
            items: [
              'Impressão de documentos: $0.50 por página',
              'Impressão de adesivos e papel fotográfico: $3 por página',
              'Cópia colorida de passaporte e certidões: $1 por página',
              'Digitalização de fotos e documentos: $2 (envio incluso)',
            ],
          },
          {
            title: 'Ligações, agendamento, inscrições',
            items: [
              'Chamadas telefônicas a partir de $10',
              'Agendamento de consultas médicas: $20',
              'Inscrições em programas escolares: $30',
              'Pagamentos, agendamento e visita ao DMV: $30',
            ],
          },
          {
            title: 'Documentos, cartas formais e serviços consulares',
            items: [
              'Criação e envio de cartas formais: $30',
              'Redigir textos em inglês ou português: $25',
              'Serviços consulares a partir de $50',
            ],
          },
        ],
      },
      {
        title: 'Soluções pessoais e assistência virtual',
        description: 'De aplicações a combos mensais para facilitar sua vida.',
        sections: [
          {
            title: 'Aplicações',
            items: [
              'Moradia: $80',
              'DCF, Medicaid e Medida Protetiva: $100',
              'Divórcio: $180',
              'Pensão alimentícia: $160',
            ],
          },
          {
            title: 'Assistência virtual',
            items: [
              '1 hora: $40',
              '5 horas por mês: $170',
              '15 horas por mês: $450',
              'Secretariado full time: $2.5k (30h semanais)',
            ],
          },
          {
            title: 'Combo "Primeiro mês" - $300',
            items: [
              'Aplicação em condomínios',
              'Aberturas de contas utilitárias',
              'Telefone',
              'Escola',
              'Seguros',
            ],
          },
        ],
      },
      {
        title: 'Marketing e serviços complementares',
        description:
          'Impulsione seu negócio, conte com nosso suporte e pague com praticidade.',
        sections: [
          {
            title: 'Marketing digital',
            items: [
              'Criação e postagens: $20',
              'Gestão de Google Meu Negócio: $50',
              'Criação de site para empresa: $400',
            ],
          },
          {
            title: 'Serviços extras',
            items: [
              'Tradução',
              'Serviços contábeis',
              'Serviços jurídicos',
              'Serviços personalizados',
            ],
          },
          {
            title: 'Pagamentos',
            items: ['Cash', 'Zelle', 'Venmo', 'Direct deposit'],
          },
        ],
      },
    ],
    blogTitle: 'Blog',
    blogDesc:
      'Conteúdo prático para brasileiros nos Estados Unidos: guias, documentos, prazos e dicas para facilitar sua rotina.',
    headerBlogFeedLabel: 'Últimas do blog',
    localGuideTitle: 'Guia Local',
    localGuideDesc:
      'Indicações de serviços e parceiros que podem apoiar você e sua família na região.',
    partnerTitle: 'Seja nosso parceiro',
    partnerHighlight: 'Quer divulgar sua empresa no nosso site?',
    partnerDesc:
      'Você, empreendedor brasileiro, temos o prazer de convidá-lo a integrar o nosso Guia Local, uma iniciativa dedicada a conectar profissionais de excelência à comunidade brasileira residente no Kansas.',
    partnerDesc2:
      'Nosso objetivo é consolidar um ecossistema de serviços confiáveis, facilitando o acesso de nossos concidados a soluções qualificadas em seu próprio idioma.',
    partnerDesc3:
      'Ao listar sua empresa ou sua organização em nossa plataforma, você não apenas amplia a visibilidade de seu negócio, mas também contribui diretamente para o fortalecimento e o desenvolvimento socioeconômico da nossa comunidade na região.',
    partnerDesc4:
      'Preencha o formulário abaixo e em breve nossa equipe entrará em contato com você.',
    partnerFormButton: 'Preencher formulário',
    partnerDesc5: 'Obrigado por fortalecer nossa comunidade.',
    aboutTitle: 'Sobre a Golden',
    aboutDesc:
      'A Golden Agência nasceu de uma percepção real e vivenciada: a jornada do imigrante brasileiro é repleta de sonhos, mas também de obstáculos invisíveis. Percebemos que tarefas cotidianas tornam-se desafios gigantescos quando barreiras como o idioma, o choque cultural e a falta de tempo se impõem.',
    objectiveTitle: 'Nosso Objetivo',
    objectiveDesc:
      'Queremos ser a ponte que elimina essas barreiras, oferecendo o suporte necessário para que você foque no seu crescimento, carreira e no bem-estar da sua família.',
    purposeTitle: 'Nosso Propósito',
    purposeDesc:
      'Mais do que prestar serviços, buscamos fortalecer a comunidade brasileira, simplificando processos e promovendo integração, confiança e apoio mútuo.',
    quickContactTitle: 'Contato rápido',
    quickContactDesc:
      'Se a barreira do inglês ou a complexidade do dia a dia estão limitando seu potencial, estamos aqui por você.',
    quickContactSupportText:
      'Estamos à disposição para tirar suas dúvidas e encontrar caminhos que facilitem sua rotina na região. Escolha o canal de sua preferência e entre em contato agora mesmo. Estamos aqui para ajudar!',
    contactTeamLines: [
      'Hiani Karoliny (Agente em Kansas)',
      'Leah Golden (Assistente Virtual)',
    ],
    phoneLabel: 'Telefone / WhatsApp',
    emailLabel: 'E-mail',
    instagramLabel: 'Instagram',
    youtubeLabel: 'YouTube',
    openMainMenu: 'Abrir menu principal',
    closeMenu: 'Fechar menu',
    mainNavigationAria: 'Navegação principal',
    drawerLanguageHeading: 'Idioma do site',
    teamTitle: 'Sobre nós',
    teamDescription:
      'Pessoas que tornam o atendimento da Golden Agência acolhedor, humano e eficiente.',
    teamMembers: [
      {
        image: teamNayWebp,
        name: 'Nayara Guireli',
        role: 'Idealizadora do projeto',
      },
      {
        image: teamHianiWebp,
        name: 'Hiani Karoliny',
        role: 'Agente Kansas City',
      },
      {
        image: teamLeahWebp,
        name: 'Leah',
        role: 'Assistente Virtual',
      },
    ],
    homePreFooterDesc:
      'Apoiamos brasileiros nos EUA com atendimento em português: documentos, agendamentos, aplicações, assistência virtual e suporte no dia a dia na região.',
    homePreFooterQuickLinks: 'Links rápidos',
    homePreFooterContactHeading: 'Fale conosco',
    homePreFooterLocation: 'Overland Park, Kansas · Estados Unidos',
    privacyFooterLink: 'Política de Privacidade',
    adminFooterLink: 'Painel (gestores)',
    editContentInPanel: 'Editar no painel',
    footer: 'Golden Agência • Atendimento para imigrantes brasileiros nos EUA',
  },
  en: {
    siteName: 'Agency KC',
    siteTagline: 'Making life easier for Brazilian immigrants',
    contactCta: 'Contact us',
    nav: {
      home: 'Home',
      services: 'Services',
      pricing: 'Pricing',
      blog: 'Blog',
      contact: 'Contact',
      localGuide: 'Local Guide',
      partner: 'Become a partner',
    },
    remoteTag: 'Remote and in-person support',
    heroTitle: 'How can we help you today?',
    heroDesc:
      'Golden Agency was created to support Brazilians building their lives in the United States. We handle daily bureaucracy so you can gain time, clarity, and peace of mind.',
    whatsappBtn: 'Chat on WhatsApp',
    emailBtn: 'Send e-mail',
    servicesTitle: 'Our services',
    servicesDesc:
      'We act as a bridge between you and everyday processes. From document printing to application support, we offer practical and human-centered service.',
    services: [
      {
        title: 'Printing and copies',
        items: [
          'Printing forms and documents',
          'Passport, certificate, and ID copies',
          'Document and photo scanning',
        ],
      },
      {
        title: 'Calls and e-mails',
        items: [
          'Short and long phone calls',
          'Personal and professional e-mail support',
          'Contacting banks, support teams, and service providers',
        ],
      },
      {
        title: 'Appointments and enrollments',
        items: [
          'Medical appointments, DMV, and school registrations',
          'Hotel, restaurant, and event reservations',
          'Online account setup and program enrollment',
        ],
      },
      {
        title: 'Document drafting',
        items: [
          'Letters for housing and employment verification',
          'Monthly income declaration',
          'Writing support in Portuguese and English',
        ],
      },
      {
        title: 'Application support',
        items: [
          'Housing, marriage, divorce, and child support applications',
          'DCF and Medicaid applications',
          'Guidance for protective measures',
        ],
      },
      {
        title: 'Virtual assistance',
        items: [
          'Family schedule and bill management',
          'Digital document organization',
          'Small business support and invoice issuance',
        ],
      },
    ],
    additionalServicesTitle: 'Additional services',
    additionalServicesDesc:
      'Add translation, in-person support, and referrals to trusted accounting and legal partners.',
    additionalServices: [
      {
        title: 'Translation',
        items: ['Document and text translation tailored to your needs — ask for timelines and rates.'],
      },
      {
        title: 'In-person assistance',
        items: ['On-site support for errands, visits, and appointments that require you to be there in person.'],
      },
      {
        title: 'Contact for accounting services',
        items: ['Guidance and referrals to partner accounting professionals.'],
      },
      {
        title: 'Contact for legal services',
        items: ['Guidance and referrals to legal counsel when appropriate.'],
      },
    ],
    pricingTitle: 'Pricing',
    pricingDesc:
      'Every case is unique. Contact us to receive a personalized estimate based on service type and urgency.',
    pricingBoards: [
      {
        title: 'Administrative support and document services',
        description: 'Printing, scheduling, documents, and consular support.',
        sections: [
          {
            title: 'Printing and copies',
            items: [
              'Document printing: $0.50 per page',
              'Sticker and photo paper printing: $3 per page',
              'Color copies for passport and certificates: $1 per page',
              'Photo and document scanning: $2 (delivery included)',
            ],
          },
          {
            title: 'Calls, scheduling, enrollments',
            items: [
              'Phone calls starting at $10',
              'Medical appointment scheduling: $20',
              'School program enrollments: $30',
              'Payments, scheduling, and DMV visit: $30',
            ],
          },
          {
            title: 'Documents, formal letters, consular support',
            items: [
              'Formal letter drafting and delivery: $30',
              'Text writing in English or Portuguese: $25',
              'Consular services starting at $50',
            ],
          },
        ],
      },
      {
        title: 'Personal solutions and virtual assistance',
        description: 'From applications to monthly bundles that simplify your routine.',
        sections: [
          {
            title: 'Applications',
            items: [
              'Housing: $80',
              'DCF, Medicaid, and Protective Order: $100',
              'Divorce: $180',
              'Child support: $160',
            ],
          },
          {
            title: 'Virtual assistance',
            items: [
              '1 hour: $40',
              '5 hours per month: $170',
              '15 hours per month: $450',
              'Full-time secretarial support: $2.5k (30h weekly)',
            ],
          },
          {
            title: 'First month bundle - $300',
            items: [
              'Condominium applications',
              'Utility account setup',
              'Phone setup',
              'School support',
              'Insurance support',
            ],
          },
        ],
      },
      {
        title: 'Marketing and complementary services',
        description: 'Boost your business, get reliable support, and pay with flexibility.',
        sections: [
          {
            title: 'Digital marketing',
            items: [
              'Content creation and posting: $20',
              'Google Business Profile management: $50',
              'Business website creation: $400',
            ],
          },
          {
            title: 'Extra services',
            items: ['Translation', 'Accounting services', 'Legal services', 'Custom services'],
          },
          {
            title: 'Payment methods',
            items: ['Cash', 'Zelle', 'Venmo', 'Direct deposit'],
          },
        ],
      },
    ],
    blogTitle: 'Blog',
    blogDesc:
      'Practical content for Brazilians in the U.S.: guides, documents, deadlines, and tips to simplify your routine.',
    headerBlogFeedLabel: 'Latest from the blog',
    localGuideTitle: 'Local Guide',
    localGuideDesc:
      'Recommendations for trusted services and partners that can support you and your family in the region.',
    partnerTitle: 'Become a partner',
    partnerHighlight: 'Would you like to promote your business on our website?',
    partnerDesc:
      'Brazilian entrepreneur, we are pleased to invite you to join our Local Guide, an initiative dedicated to connecting outstanding professionals with the Brazilian community living in Kansas.',
    partnerDesc2:
      'Our goal is to build an ecosystem of trusted services, making it easier for our community members to access qualified solutions in their own language.',
    partnerDesc3:
      'By listing your business or organization on our platform, you not only increase your brand visibility, but also directly contribute to strengthening and supporting the socioeconomic development of our community in the region.',
    partnerDesc4:
      'Fill out the form below and our team will contact you shortly.',
    partnerFormButton: 'Fill out the form',
    partnerDesc5: 'Thank you for strengthening our community.',
    aboutTitle: 'About Golden',
    aboutDesc:
      'Golden Agency was born from real-life experience: the Brazilian immigrant journey is full of dreams, but also invisible obstacles. Everyday tasks become major challenges when language barriers, culture shock, and lack of time come into play.',
    objectiveTitle: 'Our Objective',
    objectiveDesc:
      'We want to be the bridge that removes these barriers, providing support so you can focus on your growth, career, and your family well-being.',
    purposeTitle: 'Our Purpose',
    purposeDesc:
      'More than providing services, our mission is to strengthen the Brazilian community by simplifying processes and promoting integration, trust, and mutual support.',
    quickContactTitle: 'Quick contact',
    quickContactDesc:
      'If the language barrier or daily complexity is limiting your potential, we are here for you.',
    quickContactSupportText:
      'We are available to answer your questions and find practical paths for your routine in the region. Choose your preferred channel and contact us now. We are here to help!',
    contactTeamLines: ['Hiani Karoliny (Kansas Agent)', 'Leah Golden (Virtual Assistant)'],
    phoneLabel: 'Phone / WhatsApp',
    emailLabel: 'E-mail',
    instagramLabel: 'Instagram',
    youtubeLabel: 'YouTube',
    openMainMenu: 'Open main menu',
    closeMenu: 'Close menu',
    mainNavigationAria: 'Main navigation',
    drawerLanguageHeading: 'Site language',
    teamTitle: 'About us',
    teamDescription:
      'The people who make Golden Agency support welcoming, human, and efficient.',
    teamMembers: [
      {
        image: teamNayWebp,
        name: 'Nayara Guireli',
        role: 'Project founder',
      },
      {
        image: teamHianiWebp,
        name: 'Hiani Karoliny',
        role: 'Kansas City Agent',
      },
      {
        image: teamLeahWebp,
        name: 'Leah',
        role: 'Virtual Assistant',
      },
    ],
    homePreFooterDesc:
      'We support Brazilians in the U.S. with Portuguese-language help: documents, scheduling, applications, virtual assistance, and everyday support in the region.',
    homePreFooterQuickLinks: 'Quick links',
    homePreFooterContactHeading: 'Get in touch',
    homePreFooterLocation: 'Kansas City, Kansas · United States',
    privacyFooterLink: 'Privacy Policy',
    adminFooterLink: 'Staff dashboard',
    editContentInPanel: 'Edit in dashboard',
    footer: 'Golden Agency • Support for Brazilian immigrants in the USA',
  },
}

type Translations = (typeof translations)['pt-BR']

const navigationItems = [
  { path: '/', key: 'home' as const },
  { path: '/servicos', key: 'services' as const },
  { path: '/precos', key: 'pricing' as const },
  { path: '/blog', key: 'blog' as const },
  { path: '/contato', key: 'contact' as const },
  { path: '/guia-local', key: 'localGuide' as const },
  { path: '/parceiro', key: 'partner' as const },
]

function HomePreFooter({ t }: { t: Translations }) {
  return (
    <HomePreFooterSection>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <HomePreFooterBrand>{t.siteName}</HomePreFooterBrand>
          <HomePreFooterTagline>{t.siteTagline}</HomePreFooterTagline>
          <HomePreFooterBlurb>{t.homePreFooterDesc}</HomePreFooterBlurb>
          <HomePreFooterSocial>
            <HomePreFooterSocialButton
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label={t.instagramLabel}
            >
              <InstagramOutlined />
            </HomePreFooterSocialButton>
            <HomePreFooterSocialButton
              href={YOUTUBE_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label={t.youtubeLabel}
            >
              <YoutubeOutlined />
            </HomePreFooterSocialButton>
          </HomePreFooterSocial>
        </Col>
        <Col xs={24} lg={8}>
          <HomePreFooterColTitle>{t.homePreFooterQuickLinks}</HomePreFooterColTitle>
          <HomePreFooterLinkList>
            {navigationItems.map((item) => (
              <li key={item.path}>
                <HomePreFooterNavLink to={item.path} end={item.path === '/'}>
                  {t.nav[item.key]}
                </HomePreFooterNavLink>
              </li>
            ))}
            <li key="/politica-de-privacidade">
              <HomePreFooterNavLink to="/politica-de-privacidade">{t.privacyFooterLink}</HomePreFooterNavLink>
            </li>
          </HomePreFooterLinkList>
        </Col>
        <Col xs={24} lg={8}>
          <HomePreFooterColTitle>{t.homePreFooterContactHeading}</HomePreFooterColTitle>
          <HomePreFooterContactList>
            <HomePreFooterContactRow>
              <HomePreFooterContactIcon>
                <MailOutlined />
              </HomePreFooterContactIcon>
              <HomePreFooterContactLink href={MAILTO_LINK}>{CONTACT_EMAIL}</HomePreFooterContactLink>
            </HomePreFooterContactRow>
            <HomePreFooterContactRow>
              <HomePreFooterContactIcon>
                <PhoneOutlined />
              </HomePreFooterContactIcon>
              <HomePreFooterContactLink href={`tel:${CONTACT_PHONE_TEL}`}>
                {CONTACT_PHONE_DISPLAY}
              </HomePreFooterContactLink>
            </HomePreFooterContactRow>
            <HomePreFooterContactRow>
              <HomePreFooterContactIcon>
                <EnvironmentOutlined />
              </HomePreFooterContactIcon>
              <HomePreFooterContactText>{t.homePreFooterLocation}</HomePreFooterContactText>
            </HomePreFooterContactRow>
          </HomePreFooterContactList>
        </Col>
      </Row>
    </HomePreFooterSection>
  )
}

const MOBILE_HEADER_QUERY = '(max-width: 900px)'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)
    setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

function HomePage({ t }: { t: Translations }) {
  return (
    <PageStack>
      <HeroSection>
        <Space orientation="vertical" size="middle">
          <Tag color="blue">{t.remoteTag}</Tag>
          <HeroTitle level={1}>{t.heroTitle}</HeroTitle>
          <HeroDescription>{t.heroDesc}</HeroDescription>
          <Space wrap>
            <Button
              type="primary"
              size="large"
              icon={<WhatsAppOutlined />}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
            >
              {t.whatsappBtn}
            </Button>
            <Button size="large" icon={<MailOutlined />} href={MAILTO_LINK}>
              {t.emailBtn}
            </Button>
          </Space>
        </Space>
      </HeroSection>

      <Section>
        <SectionTitle level={2}>{t.aboutTitle}</SectionTitle>
        <Paragraph style={{ marginBottom: 0 }}>{t.aboutDesc}</Paragraph>
        <AboutSubheading level={2}>{t.objectiveTitle}</AboutSubheading>
        <Paragraph style={{ marginTop: '0.35rem', marginBottom: 0 }}>{t.objectiveDesc}</Paragraph>
        <AboutSubheadingTightTop level={2}>{t.purposeTitle}</AboutSubheadingTightTop>
        <Paragraph style={{ marginTop: '0.35rem', marginBottom: 0 }}>{t.purposeDesc}</Paragraph>
      </Section>

      <Section>
        <SectionTitle level={2}>{t.teamTitle}</SectionTitle>
        <Paragraph>{t.teamDescription}</Paragraph>
        <Row gutter={[16, 16]}>
          {t.teamMembers.map((member) => (
            <Col xs={24} sm={12} lg={8} key={member.name}>
              <TeamCard
                cover={<TeamPhoto src={member.image} alt={`${member.name} - ${member.role}`} />}
              >
                <Title level={4}>{member.name}</Title>
                <Paragraph>{member.role}</Paragraph>
              </TeamCard>
            </Col>
          ))}
        </Row>
      </Section>

      <HomePreFooter t={t} />
    </PageStack>
  )
}

function ServicesPage({ t }: { t: Translations }) {
  return (
    <PageStack>
      <Section>
        <SectionTitle level={2}>{t.servicesTitle}</SectionTitle>
        <Paragraph>{t.servicesDesc}</Paragraph>
        <Row gutter={[16, 16]}>
          {t.services.map((service) => (
            <Col xs={24} sm={12} lg={8} key={service.title}>
              <ServiceCard title={service.title}>
                {service.items.map((item) => (
                  <ServiceItem key={item}>
                    <CheckCircleOutlined />
                    <span>{item}</span>
                  </ServiceItem>
                ))}
              </ServiceCard>
            </Col>
          ))}
        </Row>
      </Section>

      <Section>
        <SectionTitle level={2}>{t.additionalServicesTitle}</SectionTitle>
        <Paragraph>{t.additionalServicesDesc}</Paragraph>
        <Row gutter={[16, 16]}>
          {t.additionalServices.map((service) => (
            <Col xs={24} sm={12} lg={12} key={service.title}>
              <ServiceCard title={service.title}>
                {service.items.map((item) => (
                  <ServiceItem key={item}>
                    <CheckCircleOutlined />
                    <span>{item}</span>
                  </ServiceItem>
                ))}
              </ServiceCard>
            </Col>
          ))}
        </Row>
      </Section>
    </PageStack>
  )
}

function PricingPage({ t }: { t: Translations }) {
  return (
    <Section>
      <SectionTitle level={2}>{t.pricingTitle}</SectionTitle>
      <Paragraph>{t.pricingDesc}</Paragraph>
      <Row gutter={[16, 16]}>
        {t.pricingBoards.map((board) => (
          <Col xs={24} lg={8} key={board.title}>
            <PricingBoard>
              <Title level={4}>{board.title}</Title>
              <Paragraph>{board.description}</Paragraph>
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {board.sections.map((section) => (
                  <PricingSection key={section.title}>
                    <Text strong>{section.title}</Text>
                    <PricingList>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </PricingList>
                  </PricingSection>
                ))}
              </Space>
            </PricingBoard>
          </Col>
        ))}
      </Row>
    </Section>
  )
}

function PartnerPage({ t }: { t: Translations }) {
  return (
    <Section>
      <SectionTitle level={2}>{t.partnerTitle}</SectionTitle>
      <Title level={4}>{t.partnerHighlight}</Title>
      <Paragraph>{t.partnerDesc}</Paragraph>
      <Paragraph>{t.partnerDesc2}</Paragraph>
      <Paragraph>{t.partnerDesc3}</Paragraph>
      <Paragraph>{t.partnerDesc4}</Paragraph>
      <Space style={{ marginTop: 4, marginBottom: 8 }}>
        <Button
          type="primary"
          size="large"
          icon={<FormOutlined />}
          href={PARTNER_FORM_LINK}
          target="_blank"
          rel="noreferrer"
        >
          {t.partnerFormButton}
        </Button>
      </Space>
      <Paragraph>{t.partnerDesc5}</Paragraph>
    </Section>
  )
}

function PrivacyPage({ language }: { language: Language }) {
  const content = language === 'pt-BR' ? privacyPolicyPtBR : privacyPolicyEn

  return (
    <Section>
      <SectionTitle level={2}>{content.title}</SectionTitle>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        {content.lastUpdated}
      </Text>
      <Paragraph>{content.intro}</Paragraph>
      {content.sections.map((section) => (
        <PrivacyBlock key={section.title}>
          <Title level={4}>{section.title}</Title>
          {section.paragraphs.map((paragraph, index) => (
            <Paragraph key={`${section.title}-${index}`}>{paragraph}</Paragraph>
          ))}
        </PrivacyBlock>
      ))}
    </Section>
  )
}

function ContactPage({ t }: { t: Translations }) {
  return (
    <ContactSection>
      <SectionTitle level={2}>{t.quickContactTitle}</SectionTitle>
      <Paragraph>{t.quickContactDesc}</Paragraph>
      <Paragraph>{t.quickContactSupportText}</Paragraph>
      <ContactTeamList>
        {t.contactTeamLines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ContactTeamList>
      <ContactGrid gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <ContactCard>
            <PhoneOutlined />
            <div>
              <Text strong>{t.phoneLabel}</Text>
              <Paragraph>{CONTACT_PHONE_DISPLAY}</Paragraph>
            </div>
          </ContactCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ContactCard>
            <MailOutlined />
            <div>
              <Text strong>{t.emailLabel}</Text>
              <Paragraph>{CONTACT_EMAIL}</Paragraph>
            </div>
          </ContactCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ContactCard>
            <InstagramOutlined />
            <div>
              <Text strong>{t.instagramLabel}</Text>
              <Paragraph>
                <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer">
                  @goldenagenciakc
                </a>
              </Paragraph>
            </div>
          </ContactCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ContactCard>
            <YoutubeOutlined />
            <div>
              <Text strong>{t.youtubeLabel}</Text>
              <Paragraph>
                <a href={YOUTUBE_LINK} target="_blank" rel="noreferrer">
                  @GoldenAgenciaKC
                </a>
              </Paragraph>
            </div>
          </ContactCard>
        </Col>
      </ContactGrid>
    </ContactSection>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.documentElement.scrollLeft = 0
    document.body.scrollTop = 0
    document.body.scrollLeft = 0
  }, [pathname])

  return null
}

function HeaderBlogTicker({ t }: { t: Translations }) {
  const [items, setItems] = useState<BlogHeadlineItem[]>([])

  useEffect(() => {
    let cancelled = false
    fetchBlogHeadlines(3)
      .then((data) => {
        if (!cancelled) {
          setItems(data)
        }
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (items.length === 0) return null
  const loopItems = items.length > 1 ? [...items, ...items] : items

  return (
    <TopNewsBar aria-label={t.headerBlogFeedLabel}>
      <TopNewsInner>
        <TopNewsLabel>{t.headerBlogFeedLabel}</TopNewsLabel>
        <TopNewsViewport>
          <TopNewsTrack $animate={items.length > 1} $durationSeconds={Math.max(24, items.length * 7)}>
            {loopItems.map((post, index) => (
              <TopNewsItem key={`${post.id}-${index}`}>
                <TopNewsLink to={`/blog/${post.slug}`}>{post.title}</TopNewsLink>
                <TopNewsDivider aria-hidden>•</TopNewsDivider>
              </TopNewsItem>
            ))}
          </TopNewsTrack>
        </TopNewsViewport>
      </TopNewsInner>
    </TopNewsBar>
  )
}

function AppLayout({ t, language, setLanguage }: { t: Translations; language: Language; setLanguage: (language: Language) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isCompactHeader = useMediaQuery(MOBILE_HEADER_QUERY)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const metaByPath: Record<string, { title: string; description: string }> = {
      '/': {
        title: `${t.siteName} | Despachante e suporte para imigrantes`,
        description:
          'A Golden Agência oferece suporte para imigrantes brasileiros nos EUA com serviços de documentos, agendamentos, aplicações, assistência virtual e atendimento em português.',
      },
      '/servicos': {
        title: `Serviços | ${t.siteName}`,
        description:
          'Conheça os serviços da Golden Agência: impressão e cópias, ligações, agendamentos, criação de documentos, aplicações e assistência virtual.',
      },
      '/precos': {
        title: `Preços e pacotes | ${t.siteName}`,
        description:
          'Veja estimativas de preços e pacotes da Golden Agência para serviços administrativos, assistência virtual, marketing e serviços complementares.',
      },
      '/blog': {
        title: `Blog | ${t.siteName}`,
        description:
          'Leia conteúdos práticos para brasileiros nos EUA com orientações sobre documentos, prazos, processos e rotina no exterior.',
      },
      '/contato':
        language === 'pt-BR'
          ? {
              title: `Contato | ${t.siteName}`,
              description:
                'Entre em contato com a Golden Agência por WhatsApp, e-mail, Instagram ou YouTube e receba atendimento rápido para suas necessidades.',
            }
          : {
              title: `Contact | ${t.siteName}`,
              description:
                'Reach Golden Agency via WhatsApp, email, Instagram, or YouTube for quick help with your needs.',
            },
      '/guia-local': {
        title: `Guia Local | ${t.siteName}`,
        description:
          'Descubra parceiros e serviços recomendados no Guia Local da Golden Agência para apoiar brasileiros na região do Kansas.',
      },
      '/parceiro': {
        title: `Seja nosso parceiro | ${t.siteName}`,
        description:
          'Divulgue sua empresa no site da Golden Agência e conecte seu negócio com a comunidade brasileira no Kansas.',
      },
      '/politica-de-privacidade':
        language === 'pt-BR'
          ? {
              title: `Política de Privacidade | ${t.siteName}`,
              description:
                'Saiba como a Golden Agência coleta, usa e protege seus dados pessoais ao usar o site e nossos serviços de apoio a imigrantes.',
            }
          : {
              title: `Privacy Policy | ${t.siteName}`,
              description:
                'Learn how Golden Agency collects, uses, and protects your personal data when you use our website and immigrant support services.',
            },
    }

    const fallbackMeta = metaByPath['/']
    let pageMeta = metaByPath[location.pathname]
    if (!pageMeta && location.pathname.startsWith('/blog/') && location.pathname !== '/blog') {
      pageMeta = {
        title: `Artigo | ${t.siteName}`,
        description: t.blogDesc,
      }
    }
    if (!pageMeta && location.pathname.startsWith('/guia-local/') && location.pathname !== '/guia-local') {
      pageMeta = {
        title: `Guia local | ${t.siteName}`,
        description: t.localGuideDesc,
      }
    }
    if (!pageMeta) pageMeta = fallbackMeta
    const canonicalUrl = `${SITE_URL}${location.pathname === '/' ? '' : location.pathname}`

    document.title = pageMeta.title

    const setMeta = (selector: string, content: string) => {
      const element = document.querySelector(selector)
      if (element) {
        element.setAttribute('content', content)
      }
    }

    setMeta('meta[name="description"]', pageMeta.description)
    setMeta('meta[property="og:title"]', pageMeta.title)
    setMeta('meta[property="og:description"]', pageMeta.description)
    setMeta('meta[property="og:url"]', canonicalUrl)
    setMeta('meta[name="twitter:title"]', pageMeta.title)
    setMeta('meta[name="twitter:description"]', pageMeta.description)

    const canonicalElement = document.querySelector('link[rel="canonical"]')
    if (canonicalElement) {
      canonicalElement.setAttribute('href', canonicalUrl)
    }
  }, [location.pathname, t.siteName, language])

  return (
    <PageLayout>
      <HeaderBlogTicker t={t} />
      <TopHeader>
        <HeaderTopRow>
          <HeaderLeading>
            <Brand
              to="/"
              onClick={() => {
                if (isCompactHeader) setMobileMenuOpen(false)
              }}
            >
              <BrandIdentity>
                <BrandLogo src={logo2Webp} alt="Logo Golden Agência" />
              </BrandIdentity>
              <HeaderSubtitle>{t.siteTagline}</HeaderSubtitle>
            </Brand>
          </HeaderLeading>
          <HeaderActionsGroup>
            <TopActions>
              {!isCompactHeader && (
                <LanguageControl>
                  <Segmented
                    size="middle"
                    value={language}
                    options={[
                      { label: 'PT-BR', value: 'pt-BR' },
                      { label: 'EN', value: 'en' },
                    ]}
                    onChange={(value) => setLanguage(value as Language)}
                  />
                </LanguageControl>
              )}
              <HeaderContactButton
                type="primary"
                icon={isCompactHeader ? <WhatsAppOutlined /> : <ArrowRightOutlined />}
                aria-label={t.contactCta}
                title={isCompactHeader ? t.contactCta : undefined}
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
              >
                {!isCompactHeader ? t.contactCta : null}
              </HeaderContactButton>
              <HeaderSocialIconButton
                icon={<InstagramOutlined />}
                aria-label={t.instagramLabel}
                title={t.instagramLabel}
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
              >
                <SocialHeaderLabel>{t.instagramLabel}</SocialHeaderLabel>
              </HeaderSocialIconButton>
              <HeaderSocialIconButton
                icon={<YoutubeOutlined />}
                aria-label={t.youtubeLabel}
                title={t.youtubeLabel}
                href={YOUTUBE_LINK}
                target="_blank"
                rel="noreferrer"
              >
                <SocialHeaderLabel>{t.youtubeLabel}</SocialHeaderLabel>
              </HeaderSocialIconButton>
            </TopActions>
            <MobileMenuButton
              type="text"
              aria-label={t.openMainMenu}
              aria-expanded={mobileMenuOpen}
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
            />
          </HeaderActionsGroup>
        </HeaderTopRow>
        <NavList>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <MenuLink to={item.path} end={item.path === '/'}>
                {t.nav[item.key]}
              </MenuLink>
            </li>
          ))}
        </NavList>
      </TopHeader>

      <MobileDrawer
        title={t.siteName}
        placement="left"
        size={360}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        closable={{ 'aria-label': t.closeMenu }}
        styles={{ body: { paddingTop: 12 } }}
      >
        <MobileDrawerLanguageBlock>
          <MobileDrawerSectionLabel id="mobile-drawer-lang-heading">{t.drawerLanguageHeading}</MobileDrawerSectionLabel>
          <Segmented
            block
            size="large"
            aria-labelledby="mobile-drawer-lang-heading"
            value={language}
            options={[
              { label: 'PT-BR', value: 'pt-BR' },
              { label: 'EN', value: 'en' },
            ]}
            onChange={(value) => setLanguage(value as Language)}
          />
        </MobileDrawerLanguageBlock>
        <nav aria-label={t.mainNavigationAria}>
          <MobileNavList>
            {navigationItems.map((item) => (
              <li key={item.path}>
                <MobileMenuLink to={item.path} end={item.path === '/'} onClick={() => setMobileMenuOpen(false)}>
                  {t.nav[item.key]}
                </MobileMenuLink>
              </li>
            ))}
          </MobileNavList>
        </nav>
      </MobileDrawer>

      <MainContent>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage t={t} />} />
          <Route path="/servicos" element={<ServicesPage t={t} />} />
          <Route path="/precos" element={<PricingPage t={t} />} />
          <Route path="/blog" element={<BlogPage t={t} />} />
          <Route
            path="/blog/:slug"
            element={
              <BlogPostPage
                siteName={t.siteName}
                backLabel={t.nav.blog}
                editInPanelLabel={t.editContentInPanel}
              />
            }
          />
          <Route path="/contato" element={<ContactPage t={t} />} />
          <Route path="/guia-local" element={<LocalGuidePage t={t} />} />
          <Route
            path="/guia-local/:id"
            element={
              <LocalBusinessPage
                siteName={t.siteName}
                backLabel={t.nav.localGuide}
                editInPanelLabel={t.editContentInPanel}
              />
            }
          />
          <Route path="/parceiro" element={<PartnerPage t={t} />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPage language={language} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainContent>

      <PageFooter>
        <FooterBar>
          <FooterText>{t.footer}</FooterText>
          <FooterLinksRow>
            <FooterPrivacyLink to="/politica-de-privacidade">{t.privacyFooterLink}</FooterPrivacyLink>
            <FooterLinkSep aria-hidden>·</FooterLinkSep>
            <FooterAdminLink to="/admin">{t.adminFooterLink}</FooterAdminLink>
          </FooterLinksRow>
        </FooterBar>
      </PageFooter>

      <FloatingWhatsapp
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label={t.whatsappBtn}
        title={t.whatsappBtn}
      >
        <WhatsAppOutlined />
      </FloatingWhatsapp>
    </PageLayout>
  )
}

function App() {
  const [language, setLanguage] = useState<Language>('pt-BR')
  const t = useMemo(() => translations[language], [language])

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<AppLayout t={t} language={language} setLanguage={setLanguage} />} />
    </Routes>
  )
}

const PageLayout = styled(Layout)`
  min-height: 100vh;
  background: #f5f7fb;
`

const FloatingWhatsapp = styled.a`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1050;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25d366;
  color: #ffffff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: #ffffff !important;
    transform: scale(1.06);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
  }

  &:focus-visible {
    outline: 3px solid #ffffff;
    outline-offset: 3px;
  }

  @media (max-width: 900px) {
    right: 16px;
    bottom: 20px;
    width: 54px;
    height: 54px;
    font-size: 26px;
  }
`

const TopHeader = styled(Header)`
  && {
    text-align: left;
  }
  background: #0f2742;
  color: #fff;
  min-height: 122px;
  height: auto;
  padding: 12px clamp(16px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;

  @media (max-width: 900px) {
    position: sticky;
    top: 0;
    z-index: 100;
    min-height: 0;
    gap: 6px;
    padding-top: calc(10px + env(safe-area-inset-top, 0px));
    padding-right: calc(clamp(12px, 3vw, 20px) + env(safe-area-inset-right, 0px));
    padding-bottom: 10px;
    padding-left: calc(clamp(12px, 3vw, 20px) + env(safe-area-inset-left, 0px));
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.22);
  }
`

const HeaderTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 12px;
  row-gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
    row-gap: 0;
  }
`

const HeaderLeading = styled.div`
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  margin-right: auto;
  text-align: left;

  @media (max-width: 900px) {
    flex: 1 1 0;
    margin-right: 0;
    min-width: 0;
  }
`

const HeaderActionsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 1 auto;
  min-width: 0;
  margin-left: auto;

  @media (min-width: 901px) {
    flex-wrap: nowrap;
  }

  @media (max-width: 900px) {
    flex-wrap: nowrap;
    flex: 0 0 auto;
    margin-left: 0;
    align-items: center;
    gap: 6px;
  }
`

const Brand = styled(NavLink)`
  && {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  text-decoration: none;
  min-width: 0;
  max-width: 100%;
  color: inherit;
`

const BrandIdentity = styled.span`
  display: block;
  gap: 0px;
  margin: 0;
  line-height: 1;
`

const BrandLogo = styled.img`
  display: block;
  width: 320px;
  max-width: 100%;
  height: 82px;
  object-fit: contain;
  object-position: left center;
  margin: 0;
  align-self: flex-start;

  @media (max-width: 900px) {
    width: auto;
    max-width: min(220px, 56vw);
    height: clamp(42px, 11vw, 56px);
  }

  @media (max-width: 360px) {
    max-width: min(200px, 50vw);
    height: clamp(38px, 10vw, 48px);
  }
`

const HeaderSubtitle = styled.p`
  margin: 0;
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.25;
  color: #ffffff;
  font-size: clamp(0.78rem, 2.4vw, 0.95rem);
  opacity: 0.8;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-wrap: break-word;
  text-align: left;
  align-self: stretch;

  @media (max-width: 900px) {
    margin-top: 2px;
    font-size: clamp(0.68rem, 2.8vw, 0.82rem);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
`

const TopNewsBar = styled.div`
  background: #081a2e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  width: 100%;
`

const TopNewsInner = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 8px clamp(16px, 4vw, 48px);
  display: flex;
  align-items: center;
  gap: 12px;
`

const TopNewsLabel = styled.span`
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #e8a43d;
  flex-shrink: 0;

  @media (max-width: 900px) {
    font-size: 0.68rem;
  }
`

const TopNewsViewport = styled.div`
  min-width: 0;
  overflow: hidden;
  flex: 1 1 auto;
`

const slideTicker = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`

const TopNewsTrack = styled.div<{ $animate: boolean; $durationSeconds: number }>`
  display: inline-flex;
  align-items: center;
  width: max-content;
  gap: 24px;
  will-change: transform;
  animation: ${({ $animate, $durationSeconds }) =>
    $animate
      ? css`
          ${slideTicker} ${$durationSeconds}s linear infinite
        `
      : 'none'};

  &:hover {
    animation-play-state: paused;
  }
`

const TopNewsItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 24px;
  white-space: nowrap;
`

const TopNewsLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 0.88rem;
  line-height: 1.2;
  opacity: 0.95;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`

const TopNewsDivider = styled.span`
  opacity: 0.45;
`

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 19px;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;

  @media (max-width: 900px) {
    display: none;
  }
`

const MenuLink = styled(NavLink)`
  text-decoration: none;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.98rem;
  opacity: 0.9;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    border-bottom: 2px solid #d4a017;
    padding-bottom: 3px;
  }
`

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
  min-width: 0;
  flex: 1 1 auto;

  @media (max-width: 900px) {
    flex: 0 0 auto;
    flex-wrap: nowrap;
    gap: 6px;
    min-width: 0;
  }
`

const HeaderContactButton = styled(Button)`
  && {
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    && {
      min-width: 48px;
      width: 48px;
      height: 48px;
      padding: 0;
    }
  }
`

const HeaderSocialIconButton = styled(Button)`
  && {
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    && {
      min-width: 48px;
      width: 48px;
      height: 48px;
      padding: 0;
    }
  }
`

const SocialHeaderLabel = styled.span`
  @media (max-width: 900px) {
    display: none;
  }
`

const MobileMenuButton = styled(Button)`
  display: none;
  flex-shrink: 0;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.4) !important;

  @media (max-width: 900px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    width: 48px;
    height: 48px;
    padding: 0;

    .anticon {
      font-size: 26px;
    }
  }
`

const MobileDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    max-width: min(360px, calc(100vw - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px) - 12px));
  }

  .ant-drawer-header-title {
    color: #0f2742;
  }

  .ant-drawer-body {
    padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  }
`

const MobileDrawerLanguageBlock = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e9f2;
`

const MobileDrawerSectionLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #5c6b7f;
  margin-bottom: 10px;
`

const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const MobileMenuLink = styled(NavLink)`
  display: flex;
  align-items: center;
  min-height: 48px;
  text-decoration: none;
  color: #0f2742;
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f3f6fb;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s ease, color 0.15s ease;

  &:active {
    background: #e2e9f5;
  }

  &.active {
    color: #ffffff;
    background: #0f2742;
  }
`

const LanguageControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const MainContent = styled(Content)`
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: clamp(18px, 4vw, 40px);
`

const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const HeroSection = styled.section`
  background: linear-gradient(140deg, #0f2742, #1a4572);
  color: #ffffff;
  border-radius: 20px;
  padding: clamp(20px, 5vw, 48px);
`

const HeroTitle = styled(Title)`
  && {
    color: #ffffff;
    margin: 0;
  }
`

const HeroDescription = styled(Paragraph)`
  && {
    color: #e8f0fa;
    max-width: 760px;
    font-size: 1rem;
  }
`

const Section = styled.section`
  background: #ffffff;
  border-radius: 16px;
  padding: clamp(18px, 4vw, 28px);
  box-shadow: 0 8px 24px rgba(16, 42, 67, 0.08);
`

const SectionTitle = styled(Title)`
  && {
    margin-top: 0;
  }
`

/** Same typography as section headings (e.g. “Sobre a Golden”), with tighter stack inside the about block. */
const AboutSubheading = styled(SectionTitle)`
  && {
    margin-top: 1.1rem;
    margin-bottom: 0;
  }
`

const AboutSubheadingTightTop = styled(SectionTitle)`
  && {
    margin-top: 0.35rem;
    margin-bottom: 0;
  }
`

const ServiceCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
`

const PricingBoard = styled(Card)`
  height: 100%;
  border-radius: 12px;

  .ant-card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`

const PricingSection = styled.div`
  border: 1px solid #d8deea;
  border-radius: 10px;
  padding: 10px 12px;
  background: #f8fbff;
`

const PricingList = styled.ul`
  margin: 8px 0 0;
  padding-left: 18px;
  color: #1f2d3d;

  li + li {
    margin-top: 4px;
  }
`

const ServiceItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 10px;

  span {
    line-height: 1.4;
    color: #1f2d3d;
  }

  .anticon {
    color: #1a8f43;
    margin-top: 3px;
  }
`

const TeamCard = styled(Card)`
  height: 100%;
  border-radius: 12px;

  .ant-card-body {
    padding-top: 14px;
  }
`

const TeamPhoto = styled.img`
  width: 100%;
  height: 450px;
  object-fit: cover;
`

const ContactSection = styled(Section)`
  background: #fff9e8;
`

const ContactGrid = styled(Row)`
  margin-top: 10px;
`

const ContactTeamList = styled.ul`
  margin: 12px 0 0;
  padding-left: 18px;
  color: #1f2d3d;

  li + li {
    margin-top: 6px;
  }
`

const ContactCard = styled(Card)`
  border-radius: 12px;
  .ant-card-body {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .anticon {
    color: #d4a017;
    font-size: 20px;
    margin-top: 2px;
  }
`

const PrivacyBlock = styled.div`
  margin-top: 20px;
`

const HomePreFooterSection = styled.section`
  background: linear-gradient(180deg, #0a1628 0%, #0f2742 100%);
  color: rgba(255, 255, 255, 0.88);
  border-radius: 16px;
  padding: clamp(28px, 4vw, 44px) clamp(20px, 4vw, 40px);
  box-shadow: 0 8px 24px rgba(16, 42, 67, 0.12);
`

const HomePreFooterBrand = styled.span`
  display: block;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 800;
  color: #e8a43d;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
`

const HomePreFooterTagline = styled.p`
  margin: 0 0 14px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.45;
`

const HomePreFooterBlurb = styled.p`
  margin: 0 0 20px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.78);
  max-width: 380px;
`

const HomePreFooterSocial = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const HomePreFooterSocialButton = styled.a`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 18px;
  transition: background 0.2s ease, transform 0.2s ease;
  text-decoration: none !important;

  &:hover {
    background: rgba(232, 164, 61, 0.28);
    color: #ffffff !important;
    transform: translateY(-2px);
  }
`

const HomePreFooterColTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
`

const HomePreFooterLinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const HomePreFooterNavLink = styled(NavLink)`
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  font-size: 0.95rem;
  padding: 5px 0;
  display: inline-block;
  transition: color 0.15s ease;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }

  &.active {
    color: #e8a43d;
  }
`

const HomePreFooterContactList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const HomePreFooterContactRow = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`

const HomePreFooterContactIcon = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e8a43d;
  font-size: 16px;
  margin-top: 2px;
`

const HomePreFooterContactLink = styled.a`
  color: #8ec5ff;
  text-decoration: underline;
  font-size: 0.95rem;
  word-break: break-word;

  &:hover {
    color: #b8d9ff;
  }
`

const HomePreFooterContactText = styled.span`
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.95rem;
  line-height: 1.45;
`

const PageFooter = styled(Footer)`
  text-align: center;
  background: #0f2742;
  color: #ffffff;
  padding: 18px;
`

const FooterBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const FooterText = styled.p`
  margin: 0;
  color: #ffffff;
`

const FooterLinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 12px;
`

const FooterLinkSep = styled.span`
  color: rgba(255, 255, 255, 0.55);
  user-select: none;
`

const footerLinkStyle = `
  color: #ffffff;
  text-decoration: underline;
  font-size: 0.95rem;
  opacity: 0.95;

  &:hover {
    opacity: 1;
    color: #ffffff;
  }
`

const FooterPrivacyLink = styled(NavLink)`
  ${footerLinkStyle}
`

const FooterAdminLink = styled(NavLink)`
  ${footerLinkStyle}
  opacity: 0.85;
  font-size: 0.88rem;
`

export default App
