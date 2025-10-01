import React from 'react';
import { Avatar, Card, Space, Tag, Typography, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Profile, ScoredProfile } from '../types';

const { Text, Paragraph } = Typography;

type Props = {
  p: Profile | ScoredProfile;
  fullHeight?: boolean;
};

export default function SearchResultCard({ p, fullHeight }: Props) {
  const nav = useNavigate();

  const initials = p.name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const matched = 'matchedSkills' in p ? p.matchedSkills.map(x => x.toLowerCase()) : [];
  const isMatched = (s: string) => matched.includes(s.toLowerCase());

  const goToProfile = () => nav(`/profile/${p.id}`);

  const clampedRating = Math.max(0, Math.min(5, p.rating ?? 0));

  return (
    <Card
      hoverable
      onClick={goToProfile}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToProfile(); } }}
      aria-label={`Open profile ${p.name}`}
      style={{
        borderRadius: 16,
        cursor: 'pointer',
        height: fullHeight ? '100%' : undefined,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Space align="start" size={16} style={{ width: '100%' }}>
        <Avatar size={48} style={{ background: '#e9eef7', color: '#6b7280', fontWeight: 700 }}>
          {initials}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: 16, display: 'block' }}>{p.name}</Text>
          <Text type="secondary" style={{ display: 'block' }}>
            {'age' in p && p.age ? `${p.age}, ` : ''}{p.city}
          </Text>

          <div style={{ marginTop: 12 }}>
            <Space size={[8, 8]} wrap>
              {p.skills.map(s => {
                const hit = isMatched(s);
                return (
                  <Tag
                    key={s}
                    bordered={false}
                    style={{
                      borderRadius: 12,
                      padding: '4px 10px',
                      background: hit ? '#e6f4ff' : '#f2f3f5',
                      color: hit ? '#1677ff' : 'inherit',
                      fontWeight: hit ? 600 : 400
                    }}
                  >
                    {s}
                  </Tag>
                );
              })}
            </Space>
          </div>

          <Paragraph style={{ marginTop: 12, marginBottom: 12 }}>{p.about}</Paragraph>

          <Space size={8} align="center" aria-label={`Rating ${clampedRating.toFixed(1)} out of 5`}>
            <Rate
              disabled
              allowHalf
              value={clampedRating}
              style={{ color: '#faad14', fontSize: 16, lineHeight: 1 }}
            />
            <Text style={{ color: '#faad14', fontWeight: 600 }}>{clampedRating.toFixed(1)}</Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
}
