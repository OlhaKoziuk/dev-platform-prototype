import React from 'react';
import { Button, Card, Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import TagCloudChaotic from '../components/TagCloudChaotic';

const { Title, Paragraph } = Typography;

const SKILLS = ['React','Node.js','TypeScript','Express','PostgreSQL','GraphQL','CSS','JavaScript'];

export default function Home() {
  const nav = useNavigate();

  return (
    <Card style={{ borderRadius: 16 }}>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={14}>
          <Title level={1} style={{ marginBottom: 12 }}>Welcome to the Platform</Title>
          <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 24 }}>
            Search developers by skills. Fast, clean, keyboard-friendly.
          </Paragraph>
          <Button type="primary" size="large" onClick={() => nav('/search')}>
            Go to Search
          </Button>
        </Col>
        <Col xs={24} md={10}>
          <TagCloudChaotic skills={SKILLS} />
        </Col>
      </Row>
    </Card>
  );
}
