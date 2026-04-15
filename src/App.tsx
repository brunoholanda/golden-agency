import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  InstagramOutlined,
  MailOutlined,
  MenuOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Drawer, Layout, Row, Segmented, Space, Tag, Typography } from 'antd'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { privacyPolicyEn, privacyPolicyPtBR } from './content/privacyPolicy'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography
const WHATSAPP_LINK = 'https://wa.me/19132577256'
const MAILTO_LINK = 'mailto:leah@goldenagencia.com'
const INSTAGRAM_LINK = 'https://www.instagram.com/goldenagenciakc/'
const SITE_URL = 'https://www.goldenagencia.com'

type Language = 'pt-BR' | 'en'

const translations = {
  'pt-BR': {
    siteName: 'Agência KC',
    siteTagline: 'Descomplicando a vida do imigrante brasileiro',
    contactCta: 'Fale conosco',
    nav: {
      home: 'Home',
      services: 'Servicos',
      pricing: 'Precos',
      blog: 'Blog',
      contact: 'Contato',
      localGuide: 'Guia Local',
      partner: 'Seja nosso parceiro',
    },
    remoteTag: 'Atendimento remoto e presencial',
    heroTitle: 'Como podemos te ajudar hoje?',
    heroDesc:
      'A Golden Agencia nasceu para apoiar brasileiros que estao construindo a vida nos Estados Unidos. Cuidamos das tarefas burocraticas para voce ganhar tempo, clareza e tranquilidade.',
    whatsappBtn: 'Chamar no WhatsApp',
    emailBtn: 'Enviar e-mail',
    servicesTitle: 'Nossos servicos',
    servicesDesc:
      'Atuamos como ponte entre voce e os processos do dia a dia. Da impressao de documentos ao suporte com aplicacoes, oferecemos atendimento humanizado e pratico.',
    services: [
      {
        title: 'Impressao e copias',
        items: [
          'Impressao de documentos e formularios',
          'Copias de passaporte, certidoes e CPF',
          'Digitalizacao de documentos e fotos',
        ],
      },
      {
        title: 'Ligacoes e e-mails',
        items: [
          'Chamadas telefonicas curtas e longas',
          'Envio de e-mails pessoais e profissionais',
          'Contato com bancos, suporte tecnico e servicos',
        ],
      },
      {
        title: 'Agendamentos e inscricoes',
        items: [
          'Consultas medicas, DMV e matriculas escolares',
          'Reservas de hotel, restaurante e eventos',
          'Criacao de contas online e inscricoes em programas',
        ],
      },
      {
        title: 'Criacao de documentos',
        items: [
          'Carta para condominio e verificacao de emprego',
          'Declaracao de renda mensal',
          'Redacao de textos em portugues e ingles',
        ],
      },
      {
        title: 'Auxilio com aplicacoes',
        items: [
          'Moradia, casamento, divorcio e pensao de menores',
          'Aplicacoes DCF e Medicaid',
          'Orientacao para medidas protetivas',
        ],
      },
      {
        title: 'Assistencia virtual',
        items: [
          'Gestao da agenda familiar e controle de contas',
          'Organizacao digital de documentos',
          'Atendimento para pequenas empresas e emissao de faturas',
        ],
      },
    ],
    pricingTitle: 'Precos',
    pricingDesc:
      'Cada atendimento e unico. Entre em contato para receber uma estimativa personalizada de acordo com o tipo de servico e urgencia.',
    pricingBoards: [
      {
        title: 'Servicos diversos e apoio administrativo',
        description: 'Impressoes, agendamentos, documentos e assessoria consular.',
        sections: [
          {
            title: 'Impressao e copias',
            items: [
              'Impressao de documentos: $0.50 por pagina',
              'Impressao de adesivos e papel fotografico: $3 por pagina',
              'Copia colorida de passaporte e certidoes: $1 por pagina',
              'Digitalizacao de fotos e documentos: $2 (envio incluso)',
            ],
          },
          {
            title: 'Ligacoes, agendamento, inscricoes',
            items: [
              'Chamadas telefonicas a partir de $10',
              'Agendamento de consultas medicas: $20',
              'Inscricoes em programas escolares: $30',
              'Pagamentos, agendamento e visita ao DMV: $30',
            ],
          },
          {
            title: 'Documentos, cartas formais e servicos consulares',
            items: [
              'Criacao e envio de cartas formais: $30',
              'Redigir textos em ingles ou portugues: $25',
              'Servicos consulares a partir de $50',
            ],
          },
        ],
      },
      {
        title: 'Solucoes pessoais e assistencia virtual',
        description: 'De aplicacoes a combos mensais para facilitar sua vida.',
        sections: [
          {
            title: 'Aplicacoes',
            items: [
              'Moradia: $80',
              'DCF, Medicaid e Medida Protetiva: $100',
              'Divorcio: $180',
              'Pensao alimenticia: $160',
            ],
          },
          {
            title: 'Assistencia virtual',
            items: [
              '1 hora: $40',
              '5 horas por mes: $170',
              '15 horas por mes: $450',
              'Secretariado full time: $2.5k (30h semanais)',
            ],
          },
          {
            title: 'Combo "Primeiro mes" - $300',
            items: [
              'Aplicacao em condominios',
              'Aberturas de contas utilitarias',
              'Telefone',
              'Escola',
              'Seguros',
            ],
          },
        ],
      },
      {
        title: 'Marketing e servicos complementares',
        description:
          'Impulsione seu negocio, conte com nosso suporte e pague com praticidade.',
        sections: [
          {
            title: 'Marketing digital',
            items: [
              'Criacao e postagens: $20',
              'Gestao de Google Meu Negocio: $50',
              'Criacao de site para empresa: $400',
            ],
          },
          {
            title: 'Servicos extras',
            items: [
              'Traducao',
              'Servicos contabeis',
              'Servicos juridicos',
              'Servicos personalizados',
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
      'Conteudo pratico para brasileiros nos Estados Unidos: guias, documentos, prazos e dicas para facilitar sua rotina.',
    localGuideTitle: 'Guia Local',
    localGuideDesc:
      'Indicacoes de servicos e parceiros que podem apoiar voce e sua familia na regiao.',
    partnerTitle: 'Seja nosso parceiro',
    partnerHighlight: 'Quer divulgar sua empresa no nosso site?',
    partnerDesc:
      'Voce empreendedor brasileiro, temos o prazer de convida-lo a integrar o nosso Guia Local, uma iniciativa dedicada a conectar profissionais de excelencia a comunidade brasileira residente no Kansas.',
    partnerDesc2:
      'Nosso objetivo e consolidar um ecossistema de servicos confiaveis, facilitando o acesso de nossos concidadaos a solucoes qualificadas em seu proprio idioma.',
    partnerDesc3:
      'Ao listar sua empresa ou sua organizacao em nossa plataforma, voce nao apenas amplia a visibilidade de seu negocio, mas tambem contribui diretamente para o fortalecimento e o desenvolvimento socioeconomico da nossa comunidade na regiao.',
    partnerDesc4:
      'Preencha o formulario abaixo e em breve nossa equipe entrara em contato com voce.',
    partnerDesc5: 'Obrigado por fortalecer nossa comunidade.',
    aboutTitle: 'Sobre a Golden',
    aboutDesc:
      'A Golden Agencia nasceu de uma percepcao real e vivenciada: a jornada do imigrante brasileiro e repleta de sonhos, mas tambem de obstaculos invisiveis. Percebemos que tarefas cotidianas tornam-se desafios gigantescos quando barreiras como o idioma, o choque cultural e a falta de tempo se impoem.',
    objectiveTitle: 'Nosso Objetivo',
    objectiveDesc:
      'Queremos ser a ponte que elimina essas barreiras, oferecendo o suporte necessario para que voce foque no seu crescimento, carreira e no bem-estar da sua familia.',
    purposeTitle: 'Nosso Proposito',
    purposeDesc:
      'Mais do que prestar servicos, buscamos fortalecer a comunidade brasileira, simplificando processos e promovendo integracao, confianca e apoio mutuo.',
    quickContactTitle: 'Contato rapido',
    quickContactDesc:
      'Se a barreira do ingles ou a complexidade do dia a dia estao limitando seu potencial, estamos aqui por voce.',
    quickContactSupportText:
      'Estamos a disposicao para tirar suas duvidas e encontrar caminhos que facilitem sua rotina na regiao. Escolha o canal de sua preferencia e entre em contato agora mesmo. Estamos aqui para ajudar!',
    contactTeamLines: [
      'Hiani Karoliny (Agente em Kansas)',
      'Leah Golden (Virtual Assistente)',
    ],
    phoneLabel: 'Telefone / WhatsApp',
    emailLabel: 'E-mail',
    instagramLabel: 'Instagram',
    teamTitle: 'Minha equipe',
    teamDescription:
      'Pessoas que tornam o atendimento da Golden Agencia acolhedor, humano e eficiente.',
    teamMembers: [
      {
        image: '/src/assets/team/nay.webp',
        name: 'Nayara Guireli',
        role: 'Idealizadora do projeto',
      },
      {
        image: '/src/assets/team/hiani.webp',
        name: 'Hiani Karoliny',
        role: 'Agente Kansas City',
      },
      {
        image: '/src/assets/team/leah.webp',
        name: 'Leah',
        role: 'Assistente Virtual',
      },
    ],
    privacyFooterLink: 'Politica de Privacidade',
    footer: 'Golden Agencia • Atendimento para imigrantes brasileiros nos EUA',
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
    teamTitle: 'Our team',
    teamDescription:
      'The people who make Golden Agency support welcoming, human, and efficient.',
    teamMembers: [
      {
        image: '/src/assets/team/nay.webp',
        name: 'Nayara Guireli',
        role: 'Project founder',
      },
      {
        image: '/src/assets/team/hiani.webp',
        name: 'Hiani Karoliny',
        role: 'Kansas City Agent',
      },
      {
        image: '/src/assets/team/leah.webp',
        name: 'Leah',
        role: 'Virtual Assistant',
      },
    ],
    privacyFooterLink: 'Privacy Policy',
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

function HomePage({ t }: { t: Translations }) {
  return (
    <PageStack>
      <HeroSection>
        <Space direction="vertical" size="middle">
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
        <Paragraph>{t.aboutDesc}</Paragraph>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <InfoCard>
              <Title level={4}>{t.objectiveTitle}</Title>
              <Paragraph>{t.objectiveDesc}</Paragraph>
            </InfoCard>
          </Col>
          <Col xs={24} md={12}>
            <InfoCard>
              <Title level={4}>{t.purposeTitle}</Title>
              <Paragraph>{t.purposeDesc}</Paragraph>
            </InfoCard>
          </Col>
        </Row>
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
    </PageStack>
  )
}

function ServicesPage({ t }: { t: Translations }) {
  return (
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
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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

function BlogPage({ t }: { t: Translations }) {
  return (
    <Section>
      <SectionTitle level={2}>{t.blogTitle}</SectionTitle>
      <Paragraph>{t.blogDesc}</Paragraph>
    </Section>
  )
}

function LocalGuidePage({ t }: { t: Translations }) {
  return (
    <Section>
      <SectionTitle level={2}>{t.localGuideTitle}</SectionTitle>
      <Paragraph>{t.localGuideDesc}</Paragraph>
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
        <Col xs={24} md={8}>
          <ContactCard>
            <PhoneOutlined />
            <div>
              <Text strong>{t.phoneLabel}</Text>
              <Paragraph>(913) 257-7256</Paragraph>
            </div>
          </ContactCard>
        </Col>
        <Col xs={24} md={8}>
          <ContactCard>
            <MailOutlined />
            <div>
              <Text strong>{t.emailLabel}</Text>
              <Paragraph>leah@goldenagencia.com</Paragraph>
            </div>
          </ContactCard>
        </Col>
        <Col xs={24} md={8}>
          <ContactCard>
            <InstagramOutlined />
            <div>
              <Text strong>{t.instagramLabel}</Text>
              <Paragraph>
                <a href="https://www.instagram.com/goldenagenciakc/" target="_blank" rel="noreferrer">
                  @goldenagenciakc
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

function AppLayout({ t, language, setLanguage }: { t: Translations; language: Language; setLanguage: (language: Language) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const metaByPath: Record<string, { title: string; description: string }> = {
      '/': {
        title: `${t.siteName} | Despachante e suporte para imigrantes`,
        description:
          'A Golden Agencia oferece suporte para imigrantes brasileiros nos EUA com servicos de documentos, agendamentos, aplicacoes, assistencia virtual e atendimento em portugues.',
      },
      '/servicos': {
        title: `Servicos | ${t.siteName}`,
        description:
          'Conheca os servicos da Golden Agencia: impressao e copias, ligacoes, agendamentos, criacao de documentos, aplicacoes e assistencia virtual.',
      },
      '/precos': {
        title: `Precos e pacotes | ${t.siteName}`,
        description:
          'Veja estimativas de precos e pacotes da Golden Agencia para servicos administrativos, assistencia virtual, marketing e servicos complementares.',
      },
      '/blog': {
        title: `Blog | ${t.siteName}`,
        description:
          'Leia conteudos praticos para brasileiros nos EUA com orientacoes sobre documentos, prazos, processos e rotina no exterior.',
      },
      '/contato': {
        title: `Contato | ${t.siteName}`,
        description:
          'Entre em contato com a Golden Agencia por WhatsApp, e-mail ou Instagram e receba atendimento rapido para suas necessidades.',
      },
      '/guia-local': {
        title: `Guia Local | ${t.siteName}`,
        description:
          'Descubra parceiros e servicos recomendados no Guia Local da Golden Agencia para apoiar brasileiros na regiao do Kansas.',
      },
      '/parceiro': {
        title: `Seja nosso parceiro | ${t.siteName}`,
        description:
          'Divulgue sua empresa no site da Golden Agencia e conecte seu negocio com a comunidade brasileira no Kansas.',
      },
      '/politica-de-privacidade':
        language === 'pt-BR'
          ? {
              title: `Politica de Privacidade | ${t.siteName}`,
              description:
                'Saiba como a Golden Agencia coleta, usa e protege seus dados pessoais ao usar o site e nossos servicos de apoio a imigrantes.',
            }
          : {
              title: `Privacy Policy | ${t.siteName}`,
              description:
                'Learn how Golden Agency collects, uses, and protects your personal data when you use our website and immigrant support services.',
            },
    }

    const fallbackMeta = metaByPath['/']
    const pageMeta = metaByPath[location.pathname] ?? fallbackMeta
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
      <TopHeader>
        <HeaderTopRow>
          <MobileMenuButton
            type="text"
            aria-label="Abrir menu"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
          />
          <Brand to="/">
            <BrandColumn>
              <BrandIdentity>
                <BrandLogo src="/src/assets/logo-2.png" alt="Logo Golden Agencia" />
                <BrandTitle>{t.siteName}</BrandTitle>
              </BrandIdentity>
              <HeaderSubtitle>{t.siteTagline}</HeaderSubtitle>
            </BrandColumn>
          </Brand>
          <TopActions>
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
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              aria-label={t.contactCta}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
            >
              {t.contactCta}
            </Button>
            <Button
              icon={<InstagramOutlined />}
              aria-label="Instagram Golden Agencia"
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </Button>
          </TopActions>
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
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <MobileNavList>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <MobileMenuLink to={item.path} end={item.path === '/'} onClick={() => setMobileMenuOpen(false)}>
                {t.nav[item.key]}
              </MobileMenuLink>
            </li>
          ))}
        </MobileNavList>
      </MobileDrawer>

      <MainContent>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage t={t} />} />
          <Route path="/servicos" element={<ServicesPage t={t} />} />
          <Route path="/precos" element={<PricingPage t={t} />} />
          <Route path="/blog" element={<BlogPage t={t} />} />
          <Route path="/contato" element={<ContactPage t={t} />} />
          <Route path="/guia-local" element={<LocalGuidePage t={t} />} />
          <Route path="/parceiro" element={<PartnerPage t={t} />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPage language={language} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainContent>

      <PageFooter>
        <FooterBar>
          <FooterText>{t.footer}</FooterText>
          <FooterPrivacyLink to="/politica-de-privacidade">{t.privacyFooterLink}</FooterPrivacyLink>
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

  return <AppLayout t={t} language={language} setLanguage={setLanguage} />
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
  background: #0f2742;
  color: #fff;
  min-height: 122px;
  height: auto;
  padding: 12px clamp(16px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
`

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

const Brand = styled(NavLink)`
  text-decoration: none;
  flex: 1;
  min-width: 0;
`

const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  min-width: 0;
`

const BrandIdentity = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  line-height: 1;
`

const BrandLogo = styled.img`
  display: block;
  width: 82px;
  height: 82px;
  object-fit: contain;
`

const BrandTitle = styled.h1`
  margin: 0;
  font-size: clamp(1rem, 3.0vw, 1.2rem);
  line-height: 1;
  margin-top: 30px;
  color: #ffffff;
`

const HeaderSubtitle = styled.p`
  margin: 0;
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.2;
  color: #ffffff;
  font-size: 0.95rem;
  opacity: 0.80;
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
  gap: 12px;
  flex-wrap: wrap;
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
  .ant-drawer-header-title {
    color: #0f2742;
  }
`

const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const MobileMenuLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  color: #0f2742;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f3f6fb;

  &.active {
    color: #ffffff;
    background: #0f2742;
  }
`

const LanguageControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const InfoCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
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

const FooterPrivacyLink = styled(NavLink)`
  color: #ffffff;
  text-decoration: underline;
  font-size: 0.95rem;
  opacity: 0.95;

  &:hover {
    opacity: 1;
    color: #ffffff;
  }
`

export default App
