import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Profile } from '../types';
import { Card, Typography, Space, Tag, Rate, Skeleton, Result, Avatar } from 'antd';
import { getProfiles } from '../api';

const { Title, Text, Paragraph } = Typography;

export default function ProfilePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [p, setP] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const list: Profile[] = await getProfiles();
        if (!mounted) return;

        const found = list.find(x => x.id === id) ?? null;
        setP(found);
        setError(found ? null : 'not-found');
      } catch {
        if (mounted) setError('fetch-error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  const initials = useMemo(() => {
    if (!p?.name) return '';
    return p.name
      .split(/\s+/)
      .map(w => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [p]);

  if (loading) {
    return (
      <Card style={{ borderRadius: 16, maxWidth: 760, margin: '0 auto' }}>
        <Skeleton active avatar={{ shape: 'square', size: 120 }} paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (error === 'not-found' || !p) {
    return (
      <Result
        status="404"
        title="Profile not found"
        subTitle="Спробуйте повернутися до пошуку та обрати інший профіль."
      />
    );
  }

  return (
    <Card 
      style={{ borderRadius: 16, maxWidth: 760, margin: '0 auto' }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }} align="center">
        <Avatar
          shape="square"
          size={128}
          src={p.photo || undefined}
          alt={p.name}
          style={{
            background: '#efeae4',
            color: '#1f2937',
            fontWeight: 700,
            fontSize: 40,
            borderRadius: 16
          }}
        >
          {initials}
        </Avatar>

        <Title level={1} style={{ margin: 0, textAlign: 'center' }}>
          {p.name}
        </Title>

        <Text type="secondary" style={{ fontSize: 18 }}>
          {p.age ? `${p.age}, ` : ''}{p.city}
        </Text>

        <Space size={[8, 8]} wrap style={{ justifyContent: 'center' }}>
          {p.skills.map(s => (
            <Tag
              key={s}
              style={{
                border: 'none',
                background: '#f2f3f5',
                borderRadius: 12,
                padding: '6px 10px',
                fontSize: 14
              }}
            >
              {s}
            </Tag>
          ))}
        </Space>

        <div style={{ width: '100%', marginTop: 8 }}>
          <Title level={3} style={{ marginBottom: 8 }}>About</Title>
          <Paragraph style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>
            {p.about}
          </Paragraph>
        </div>

        <Rate allowHalf disabled value={p.rating} style={{ fontSize: 28, color: '#faad14' }} />
      </Space>
    </Card>
  );
}
