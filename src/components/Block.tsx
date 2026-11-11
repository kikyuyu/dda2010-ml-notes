import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { Block } from '../content/types';
import { fig } from '../fig';

function Tex({ tex }: { tex: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: true, throwOnError: false, strict: false }),
    [tex],
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function Quiz({ block }: { block: Extract<Block, { kind: 'quiz' }> }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <div className="quiz">
      <div className="q-title">📝 {block.title}</div>
      <div className="q-hint">Assignment 风格自测：先自己判断，再点开答案核对。</div>
      {block.questions.map((q, i) => (
        <div className="quiz-item" key={i}>
          <div className="q-q">
            <span className="q-idx">Q{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: q.q }} />
            <span style={{ color: 'var(--sub)', fontSize: 12 }}>（{q.type === 'tf' ? '判断题' : q.type === 'mcq' ? '单选题' : '解释题'}）</span>
          </div>
          {q.options && (
            <div className="q-opts">
              {q.options.map((o, j) => (
                <div key={j} dangerouslySetInnerHTML={{ __html: o }} />
              ))}
            </div>
          )}
          <button className="q-btn" onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}>
            {open[i] ? '收起答案' : '查看答案'}
          </button>
          {open[i] && (
            <div className="q-reveal">
              <div>
                <span className="q-ans">✔ {q.answer}</span>
              </div>
              {q.explain && <div className="q-exp" dangerouslySetInnerHTML={{ __html: q.explain }} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Block({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return (
        <div className="block">
          <p dangerouslySetInnerHTML={{ __html: block.html }} />
        </div>
      );
    case 'term':
      return (
        <div className="block term">
          <span className="t-en">{block.en}</span>
          <span className="t-zh">{block.zh}</span>
          {block.note && <span className="t-note" dangerouslySetInnerHTML={{ __html: block.note }} />}
        </div>
      );
    case 'formula':
      return (
        <div className="block formula">
          <Tex tex={block.tex} />
          <div className="f-explain" dangerouslySetInnerHTML={{ __html: block.explain }} />
        </div>
      );
    case 'figure':
      return (
        <div className="block figure">
          <div className="fig-title">🖼️ {block.title}</div>
          <img src={fig(block.src)} alt={block.title} loading="lazy" />
          <figcaption dangerouslySetInnerHTML={{ __html: block.caption }} />
          {block.guide && (
            <div className="fig-guide">
              <b>📖 读图指南：</b>
              <span dangerouslySetInnerHTML={{ __html: block.guide }} />
            </div>
          )}
        </div>
      );
    case 'list':
      return (
        <div className="block">
          {block.ordered ? (
            <ol className="blist">
              {block.items.map((it, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
              ))}
            </ol>
          ) : (
            <ul className="blist">
              {block.items.map((it, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
              ))}
            </ul>
          )}
        </div>
      );
    case 'steps':
      return (
        <div className="block steps">
          <div className="st-title">🔁 {block.title}</div>
          <ol>
            {block.items.map((it, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
            ))}
          </ol>
        </div>
      );
    case 'compare':
      return (
        <div className="block cmp">
          <div className="cmp-title">⚖️ {block.title}</div>
          <table className="data">
            <thead>
              <tr>
                <th>{block.heads[0]}</th>
                <th>{block.heads[1]}</th>
                <th>{block.heads[2]}</th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>
                  <td dangerouslySetInnerHTML={{ __html: r[0] }} />
                  <td dangerouslySetInnerHTML={{ __html: r[1] }} />
                  <td dangerouslySetInnerHTML={{ __html: r[2] }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'table':
      return (
        <div className="block cmp">
          {block.title && <div className="tbl-title">{block.title}</div>}
          <table className="data">
            <thead>
              <tr>
                {block.header.map((h, i) => (
                  <th key={i} dangerouslySetInnerHTML={{ __html: h }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} dangerouslySetInnerHTML={{ __html: c }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'trap':
      return (
        <div className="block trap">
          <div className="tr-head">
            <span className={`tr-badge ${block.verdict.toLowerCase()}`}>{block.verdict === 'T' ? 'TRUE' : 'FALSE'}</span>
            <span className="tr-claim" dangerouslySetInnerHTML={{ __html: block.claim }} />
          </div>
          <div className="tr-explain" dangerouslySetInnerHTML={{ __html: block.explain }} />
        </div>
      );
    case 'quiz':
      return <Quiz block={block} />;
    default:
      return null;
  }
}
