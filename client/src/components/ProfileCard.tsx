import React from 'react';
import { Card, Tag, Rate, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Profile } from '../types';

const { Text } = Typography;

export default function ProfileCard({ p }: { p: Profile }) {
  const nav = useNavigate();
  return (
    <Card
      hoverable
      onClick={() => nav(`/profile/${p.id}`)}
      style={{ borderRadius: 16 }}
      styles={{
        body: { display: 'flex', flexDirection: 'column', gap: 8 },
      }}
    >
      <Space direction="vertical" size={4}>
        <Text strong style={{ fontSize: 16 }}>{p.name}</Text>
        <Text type="secondary">{p.city}</Text>
      </Space>
      <div style={{ minHeight: 48 }}>
        {p.skills.slice(0, 6).map(s => <Tag key={s}>{s}</Tag>)}
      </div>
      <Rate allowHalf value={p.rating} disabled />
    </Card>
  );
}
