import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mark,
  getMarks,
  addMark,
  updateMark,
  deleteMark,
  subscribe,
  exportMarks,
  importMarks,
  jumpToMarkHash,
} from '../lib/marks';
import { modules } from '../content';

const COLORS = ['c1', 'c2', 'c3', 'c4'];

interface SelState {
  text: string;
  x: number;
  y: number;
  sectionId: string;
  sectionTitle: string;
  lectureNum: number;
  lectureTitle: string;
}

interface PopState {
  mark: Mark;
  x: number;
  y: number;
}

export default function MarksUI() {
  const navigate = useNavigate();
  const location = useLocation();
  const moduleId = location.pathname.startsWith('/m/') ? location.pathname.split('/')[2] : '';

  const [marks, setMarks] = useState<Mark[]>(getMarks);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<SelState | null>(null);
  const [color, setColor] = useState('c1');
  const [noteMode, setNoteMode] = useState(false);
  const [note, setNote] = useState('');
  const [pop, setPop] = useState<PopState | null>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  useEffect(() => subscribe(() => setMarks(getMarks())), []);

  // 文本选择 → 工具条（兼容鼠标 / 触摸 / 键盘选择）
  const selTimer = useRef<number | undefined>(undefined);
  const [hint, setHint] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 2600);
    return () => clearTimeout(t);
  }, [hint]);

  useEffect(() => {
    const evalSel = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed) {
        setSel(null);
        return;
      }
      const text = s.toString().trim();
      if (text.length < 2) {
        setSel(null);
        return;
      }
      const node = s.anchorNode;
      const el = node instanceof Element ? node : node?.parentElement;
      const r = s.getRangeAt(0).getBoundingClientRect();
      const x = Math.min(Math.max(r.left + r.width / 2, 160), window.innerWidth - 160);
      // 选区太靠顶部时工具条放到选区下方，避免被顶导航挡住
      const y = r.top < 110 ? r.bottom + 12 : r.top - 52;
      const secEl = el?.closest('section.section') as HTMLElement | null;
      const lecEl = el?.closest('article.lecture') as HTMLElement | null;
      if (!secEl || !lecEl || !el?.closest('.article')) {
        // 不在讲义正文区（首页/陷阱页/模块头）：给出提示而不是毫无反应
        setSel(null);
        setHint({ x, y });
        return;
      }
      setNote('');
      setNoteMode(false);
      setColor('c1');
      setSel({
        text: text.slice(0, 500),
        x,
        y,
        sectionId: secEl.id,
        sectionTitle: secEl.querySelector('h3')?.childNodes[0]?.textContent?.trim() || secEl.id,
        lectureNum: parseInt(lecEl.id.slice(1), 10),
        lectureTitle: lecEl.querySelector('h2')?.textContent?.trim() || lecEl.id,
      });
    };
    const onSelChange = () => {
      window.clearTimeout(selTimer.current);
      selTimer.current = window.setTimeout(evalSel, 220);
    };
    const onUp = () => window.setTimeout(evalSel, 10);
    document.addEventListener('selectionchange', onSelChange);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('keyup', onUp);
    return () => {
      window.clearTimeout(selTimer.current);
      document.removeEventListener('selectionchange', onSelChange);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('keyup', onUp);
    };
  }, []);

  const saveSel = useCallback(() => {
    if (!sel || !moduleId) return;
    // 同一段落相同文本已存在 → 更新颜色/备注
    const exist = getMarks().find((m) => m.sectionId === sel.sectionId && m.text === sel.text);
    if (exist) {
      updateMark(exist.id, { color, note: note.trim() });
    } else {
      addMark({
        moduleId,
        lectureNum: sel.lectureNum,
        lectureTitle: sel.lectureTitle,
        sectionId: sel.sectionId,
        sectionTitle: sel.sectionTitle,
        text: sel.text,
        color,
        note: note.trim(),
      });
    }
    window.getSelection()?.removeAllRanges();
    setSel(null);
  }, [sel, moduleId, color, note]);

  // 点击已有高亮 → 弹出备注/删除
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest?.('mark[data-mark-id]') as HTMLElement | null;
      if (t) {
        const mark = getMarks().find((m) => m.id === t.dataset.markId);
        if (mark) {
          setPop({ mark, x: Math.min(e.clientX, window.innerWidth - 320), y: e.clientY + 10 });
          return;
        }
      }
      if (!(e.target as HTMLElement).closest?.('.mark-note-pop')) setPop(null);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const [popNote, setPopNote] = useState('');
  useEffect(() => {
    if (pop) setPopNote(pop.mark.note);
  }, [pop]);

  const grouped = useCallback(() => {
    const g = new Map<string, Mark[]>();
    for (const m of marks) {
      const arr = g.get(m.moduleId) || [];
      arr.push(m);
      g.set(m.moduleId, arr);
    }
    for (const arr of g.values()) arr.sort((a, b) => a.lectureNum - b.lectureNum || a.ts - b.ts);
    return [...g.entries()].sort((a, b) => {
      const ma = modules.find((m) => m.id === a[0]);
      const mb = modules.find((m) => m.id === b[0]);
      return (ma?.num || '99').localeCompare(mb?.num || '99');
    });
  }, [marks]);

  const modName = (id: string) => {
    const m = modules.find((x) => x.id === id);
    return m ? `${m.num} ${m.titleZh}` : id;
  };

  return (
    <>
      {/* 右下角悬浮按钮 */}
      <button className="marks-fab" onClick={() => setOpen(true)} title="查看我的标记">
        ✎ 我的标记 <span className="cnt">{marks.length}</span>
      </button>

      {/* 抽屉 */}
      <div className={`marks-drawer ${open ? 'open' : ''}`}>
        <div className="md-head">
          <h3>✎ 我的标记</h3>
          <button onClick={() => setOpen(false)} title="关闭">✕</button>
        </div>
        <div className="md-body">
          {marks.length === 0 && (
            <div className="md-empty">
              还没有标记。
              <br />
              在正文中选中文字，即可高亮并添加备注。
              <br />
              标记会保存在本机浏览器中。
            </div>
          )}
          {grouped().map(([mid, list]) => (
            <div className="md-group" key={mid}>
              <div className="g-title">📂 {modName(mid)}（{list.length}）</div>
              {list.map((m) => (
                <div
                  className="md-item"
                  key={m.id}
                  onClick={() => {
                    setOpen(false);
                    navigate(jumpToMarkHash(m));
                  }}
                >
                  <button
                    className="mi-del"
                    title="删除标记"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMark(m.id);
                    }}
                  >
                    ✕
                  </button>
                  <div className="mi-text">
                    <mark className={`hl hl-${m.color}`}>{m.text.length > 90 ? m.text.slice(0, 90) + '…' : m.text}</mark>
                  </div>
                  {m.note && <div className="mi-note">🗒 {m.note}</div>}
                  <div className="mi-loc">Lecture {m.lectureNum} {m.lectureTitle} › {m.sectionTitle}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="md-tools">
          <button
            onClick={() => {
              const blob = new Blob([exportMarks()], { type: 'application/json' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'dda2010-marks.json';
              a.click();
            }}
          >
            ⬇ 导出
          </button>
          <button
            onClick={() => {
              const inp = document.createElement('input');
              inp.type = 'file';
              inp.accept = '.json';
              inp.onchange = async () => {
                const f = inp.files?.[0];
                if (!f) return;
                const n = importMarks(await f.text());
                alert(`已导入 ${n} 条标记`);
              };
              inp.click();
            }}
          >
            ⬆ 导入
          </button>
          <button
            onClick={() => {
              if (marks.length && confirm(`删除全部 ${marks.length} 条标记？`)) {
                marks.forEach((m) => deleteMark(m.id));
              }
            }}
          >
            🗑 清空
          </button>
        </div>
      </div>

      {/* 选中工具条 */}
      {sel && (
        <div className="sel-toolbar" style={{ left: sel.x - 150, top: sel.y }}>
          {COLORS.map((c) => (
            <div
              key={c}
              className={`swatch hl-${c} ${color === c ? 'sel' : ''}`}
              style={{ background: { c1: '#f2d85f', c2: '#5fd6a0', c3: '#4f8ef7', c4: '#e4647c' }[c] }}
              onClick={() => setColor(c)}
              title={`高亮色 ${c}`}
            />
          ))}
          <button onClick={() => { setNoteMode(!noteMode); setTimeout(() => noteRef.current?.focus(), 50); }}>
            🗒 备注
          </button>
          <button onClick={saveSel} style={{ color: 'var(--green)', fontWeight: 700 }}>
            ✔ 保存
          </button>
          <button onClick={() => { setSel(null); window.getSelection()?.removeAllRanges(); }}>✕</button>
          {noteMode && (
            <input
              ref={noteRef}
              className="note-input"
              placeholder="写点备注（可选）…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveSel(); }}
            />
          )}
        </div>
      )}

      {/* 不在讲义区选中时的提示 */}
      {hint && (
        <div className="sel-hint" style={{ left: hint.x, top: hint.y }}>
          ✎ 标记功能在主题讲义页使用：进入任意模块后，选中正文文字即可高亮、写备注
        </div>
      )}

      {/* 高亮点击弹层 */}
      {pop && (
        <div className="mark-note-pop" style={{ left: pop.x, top: pop.y, position: 'fixed' }}>
          <div className="mn-text">“{pop.mark.text.length > 120 ? pop.mark.text.slice(0, 120) + '…' : pop.mark.text}”</div>
          <input
            className="note-input"
            style={{ width: '100%', marginTop: 8 }}
            placeholder="备注（可选）…"
            value={popNote}
            onChange={(e) => setPopNote(e.target.value)}
          />
          <div className="mn-actions">
            <button
              onClick={() => {
                updateMark(pop.mark.id, { note: popNote.trim() });
                setPop(null);
              }}
            >
              保存备注
            </button>
            <button
              className="danger"
              onClick={() => {
                deleteMark(pop.mark.id);
                setPop(null);
              }}
            >
              删除标记
            </button>
          </div>
        </div>
      )}
    </>
  );
}
