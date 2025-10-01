import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, SearchOutlined, IdcardOutlined } from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';

export default function HeaderNav() {
  const { pathname } = useLocation();
  const active = pathname.startsWith('/search')
    ? '/search'
    : pathname.startsWith('/profile')
    ? '/profile'
    : '/';

  const items = [
    { key: '/',      icon: <HomeOutlined />,   label: <NavLink to="/">Home</NavLink> },
    { key: '/search',icon: <SearchOutlined />, label: <NavLink to="/search">Search</NavLink> },
    { key: '/profile', icon: <IdcardOutlined />, label: <NavLink to="/profile/1">Profile</NavLink> },
  ];

  return (
    <Menu mode="horizontal" selectedKeys={[active]} items={items} style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }} />
  );
}
