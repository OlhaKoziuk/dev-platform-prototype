import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Result, Row, Space, Spin, Tag, Typography, Select } from 'antd';
import { apiGet, apiPost } from '../utils/api';
import type { SearchResponse, Profile } from '../types';
import SearchResultCard from '../components/SearchResultCard';

const { Title, Text } = Typography;
const { CheckableTag } = Tag;

const CHIP_PRIMARY = '#3B5BFF';
const CHIP_LIGHT = '#E8EDFF';

const baseChip: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 12,
  fontSize: 16,
  lineHeight: '20px',
  transition: 'all .15s ease',
  userSelect: 'none',
  cursor: 'pointer',
};

const uncheckedChip: React.CSSProperties = {
  background: CHIP_LIGHT,
  color: CHIP_PRIMARY,
  border: '1px solid rgba(59,91,255,0.25)',
  boxShadow: '0 2px 6px rgba(59,91,255,0.12)',
  fontWeight: 600,
};

const checkedChip: React.CSSProperties = {
  background: CHIP_PRIMARY,
  color: '#fff',
  border: 'none',
  boxShadow: '0 4px 10px rgba(59,91,255,0.25)',
  fontWeight: 600,
};

const SUGGESTED = ['React', 'Node.js', 'TypeScript', 'GraphQL'];

function sampleThree<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(3, copy.length));
}

function sortByScoreRating<A extends { score: number; rating: number }>(a: A, b: A) {
  if (b.score !== a.score) return b.score - a.score;
  return b.rating - a.rating;
}

export default function Search() {
  const [skills, setSkills] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<SearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);

  useEffect(() => {
    apiGet<Profile[]>('/profiles')
      .then(list => {
        setSuggestions(sampleThree(list));
        const uniq = Array.from(new Set(list.flatMap(p => p.skills))).sort((a, b) => a.localeCompare(b));
        setAllSkills(uniq);
      })
      .catch(() => {
        setSuggestions([]);
        setAllSkills([]);
      });
  }, []);

  const options = useMemo(() => allSkills.map(s => ({ value: s, label: s })), [allSkills]);
  const selectedSet = useMemo(() => new Set(skills.map(s => s.toLowerCase())), [skills]);

  const toggleSkill = (s: string) => {
    const v = s.toLowerCase();
    setSkills(prev =>
      selectedSet.has(v) ? prev.filter(x => x.toLowerCase() !== v) : [...prev, s]
    );
  };

  async function onSearch() {
    setError(null);
    setData(null);
    if (skills.length === 0) return;

    try {
      setLoading(true);
      const res = await apiPost<SearchResponse>('/search', { skills });
      const sorted = [...res.results].sort(sortByScoreRating);
      setData({ ...res, results: sorted });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'Помилка пошуку';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{ borderRadius: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: 24 }}>Search Profiles</Title>

        <Row gutter={[12, 12]} justify="center" align="middle" style={{ marginBottom: 12 }}>
          <Col xs={24} sm="auto" style={{ maxWidth: 560, textAlign: 'left' }}>
            <Select
              mode="multiple"
              size="large"
              placeholder="Skills"
              options={options}
              value={skills}
              onChange={(vals) => setSkills(vals)}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string).toLowerCase().includes(input.toLowerCase())
              }
              open={open}
              onOpenChange={setOpen}
              onFocus={() => setOpen(true)}
              style={{ width: '100%' }}
              maxTagCount="responsive"
              allowClear
            />
          </Col>
          <Col>
            <Button size="large" type="primary" onClick={onSearch}>
              Search
            </Button>
          </Col>
        </Row>

        <Space size={[8, 8]} wrap style={{ justifyContent: 'center', display: 'flex', marginBottom: 16 }}>
          {SUGGESTED.map((s) => {
            const checked = selectedSet.has(s.toLowerCase());
            return (
              <CheckableTag
                key={s}
                checked={checked}
                onChange={() => toggleSkill(s)}
                style={{
                  ...baseChip,
                  ...(checked ? checkedChip : uncheckedChip),
                }}
              >
                {s}
              </CheckableTag>
            );
          })}
        </Space>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && <Spin />}
        {!loading && error && <Alert type="error" message={error} />}

        {!loading && !error && !data && suggestions.length > 0 && (
          <Row gutter={[16, 16]} align="stretch">
            {suggestions.map(p => (
              <Col key={p.id} xs={24} md={12} lg={8} style={{ display: 'flex' }}>
                <SearchResultCard p={p} fullHeight />
              </Col>
            ))}
          </Row>
        )}

        {!loading && !error && data?.results && data.results.length > 0 && (
          <>
            <Space direction="vertical" size={8} style={{ display: 'block', marginBottom: 16 }}>
              <Alert type="info" message={`Found ${data.total} profiles`} />
              <Text type="secondary">Sorted by: <b>Score ↓</b>, then <b>Rating ↓</b></Text>
            </Space>
            <Row gutter={[16, 16]} align="stretch">
              {data.results.map(p => (
                <Col key={p.id} xs={24} md={12} lg={8} style={{ display: 'flex' }}>
                  <SearchResultCard p={p} fullHeight />
                </Col>
              ))}
            </Row>
          </>
        )}

        {!loading && !error && data && data.total === 0 && (
          <Result status="info" title="Not found. Try another skills" />
        )}
      </div>
    </Card>
  );
}




