import React from 'react'
import { Layout, theme } from 'antd'
import { Routes, Route } from 'react-router-dom'
import HeaderNav from './components/HeaderNav'
import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'

const { Header, Content } = Layout

export default function App() {
  const { token } = theme.useToken()
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ background: '#fff', borderBottom: `1px solid ${token.colorSplit}` }}>
        <HeaderNav />
      </Header>
      <Content style={{ maxWidth: 1200, margin: '24px auto', width: '100%', padding: '0 12px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </Content>
    </Layout>
  )
}



