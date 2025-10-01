import React, { useEffect, useRef } from 'react';
import { Tag } from 'antd';

type Bubble = { x: number; y: number; vx: number; vy: number; label: string };

const PALETTE = [
  '#E6F0FF',
  '#F0E9FF',
  '#DCEBFF',
  '#EFE6FF',
  '#EAF3FF',
  '#F3EDFF',
  '#DEE8FF',
  '#ECE5FF',
];

function hashToIndex(str: string, mod: number) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

export default function TagCloudChaotic({ skills }: { skills: string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLSpanElement[]>([]);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const box = boxRef.current!;
    const rect = () => box.getBoundingClientRect();

    const bubbles: Bubble[] = skills.map((label, i) => ({
      x: 10 + (i * 30) % Math.max(40, rect().width - 100),
      y: 10 + ((i * 22) % Math.max(40, rect().height - 40)),
      vx: (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? 1 : -1),
      vy: (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? 1 : -1),
      label,
    }));

    function frame() {
      const r = rect();
      bubbles.forEach((b, i) => {
        b.x += b.vx;
        b.y += b.vy;

        const w = itemsRef.current[i]?.offsetWidth ?? 60;
        const h = itemsRef.current[i]?.offsetHeight ?? 28;

        if (b.x < 0) { b.x = 0; b.vx *= -1; }
        if (b.y < 0) { b.y = 0; b.vy *= -1; }
        if (b.x + w > r.width)  { b.x = r.width - w;  b.vx *= -1; }
        if (b.y + h > r.height) { b.y = r.height - h; b.vy *= -1; }

        const el = itemsRef.current[i];
        if (el) el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      });
      animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [skills]);

  return (
    <div
      ref={boxRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 320,
        overflow: 'hidden',
        borderRadius: 16,
      }}
    >
      {skills.map((s, i) => {
        const bg = PALETTE[hashToIndex(s, PALETTE.length)];
        return (
          <span
            key={s}
            ref={(el) => { if (el) itemsRef.current[i] = el; }}
            style={{ position: 'absolute', willChange: 'transform' }}
          >
            <Tag
              bordered={false}
              style={{
                fontSize: 14,
                padding: '6px 12px',
                borderRadius: 20,
                backgroundColor: bg,
                color: '#1f2937',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
              }}
            >
              {s}
            </Tag>
          </span>
        );
      })}
    </div>
  );
}
