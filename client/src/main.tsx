import '@ant-design/v5-patch-for-react-19';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import ukUA from 'antd/locale/uk_UA'
import 'antd/dist/reset.css'
import dayjs from 'dayjs'
import 'dayjs/locale/uk'
import App from './App'

dayjs.locale('uk')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={ukUA}
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
          token: {
          colorPrimary: '#1677ff',
          colorInfo: '#1677ff',
          colorLink: '#1677ff',
          colorPrimaryBg: '#e6f4ff',
          borderRadius: 12,
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
)

