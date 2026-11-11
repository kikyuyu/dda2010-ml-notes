import { useMemo, useState } from 'react';
import { modules, lectures } from '../content';
import { Block } from './Block';

interface TrapItem {
  modId: string;
  modTitle: string;
  lecNum: number;
  block: Extract<Parameters<typeof Block>[0]['block'], { kind: 'trap' }>;
}

export default function Traps() {
  const [filter, setFilter] = useState<string>('all');

  const traps = useMemo(() => {
    const out: TrapItem[] = [];
    for (const m of modules) {
      for (const lid of m.lectureIds) {
        const lec = lectures[lid];
        if (!lec) continue;
        for (const sec of lec.sections) {
          for (const b of sec.blocks) {
            if (b.kind === 'trap') {
              out.push({ modId: m.id, modTitle: `${m.num} ${m.titleZh}`, lecNum: lec.num, block: b });
            }
          }
        }
      }
    }
    return out;
  }, []);

  const shown = filter === 'all' ? traps : traps.filter((t) => t.modId === filter);
  const fCount = traps.filter((t) => t.block.verdict === 'F').length;

  return (
    <div className="page-narrow">
      <div style={{ marginBottom: 6 }}>
        <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>MODULE 08</span>
        <h1 style={{ margin: '4px 0 6px', fontSize: 27 }}>⚡ 考前冲刺 · 概念陷阱题库</h1>
        <p style={{ color: 'var(--sub)' }}>
          共 {traps.length} 张陷阱卡片（其中 {fCount} 个典型错误说法），全部来自课件知识点与 Assignment 判断题归纳。
          每张卡片先给出陈述，再标明 TRUE / FALSE 并解释原因。考前一晚按模块扫一遍。
        </p>
      </div>

      <div className="trap-filter">
        <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
          全部 ({traps.length})
        </button>
        {modules.map((m) => {
          const c = traps.filter((t) => t.modId === m.id).length;
          return (
            <button key={m.id} className={filter === m.id ? 'on' : ''} onClick={() => setFilter(m.id)}>
              {m.num} {m.titleZh} ({c})
            </button>
          );
        })}
      </div>

      {modules
        .filter((m) => filter === 'all' || filter === m.id)
        .map((m) => {
          const list = shown.filter((t) => t.modId === m.id);
          if (!list.length) return null;
          return (
            <div className="trap-page-group" key={m.id}>
              <h3>{m.num} · {m.titleZh}</h3>
              {list.map((t, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: 22,
                      color: '#5c6f93',
                      fontSize: 11.5,
                      zIndex: 1,
                    }}
                  >
                    源自 Lecture {t.lecNum}
                  </div>
                  <Block block={t.block} />
                </div>
              ))}
            </div>
          );
        })}

      <div className="footer">判断题答题口诀：见到 always / never / 一定 / 更 就警惕，先想反例再下结论。</div>
    </div>
  );
}
