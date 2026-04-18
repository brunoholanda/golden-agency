import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import { BrowserRouter } from 'react-router-dom'
import { GtagRouteListener } from './analytics/GtagRouteListener'
import App from './App'
import './style.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: '#d4a017',
          colorInfo: '#d4a017',
          borderRadius: 12,
          fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <GtagRouteListener />
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
