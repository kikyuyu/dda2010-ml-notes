// ===== 把已保存的标记重新包裹到 DOM 中 =====
import type { Mark } from './marks';

// 在 root 内查找 text 的首次出现，用 <mark> 包裹（支持跨节点）
export function applyMarkToRoot(root: HTMLElement, mark: Mark): boolean {
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);

  // 拼接全文，建立节点偏移映射
  let full = '';
  const spans: { node: Text; start: number; end: number }[] = [];
  for (const t of nodes) {
    const s = full.length;
    full += t.nodeValue || '';
    spans.push({ node: t, start: s, end: full.length });
  }
  const idx = full.indexOf(mark.text);
  if (idx < 0) return false;
  const endIdx = idx + mark.text.length;

  const startSpan = spans.find((s) => idx < s.end)!;
  const endSpan = spans.find((s) => endIdx <= s.end)!;

  const mk = () => {
    const m = doc.createElement('mark');
    m.className = `hl hl-${mark.color}`;
    m.dataset.markId = mark.id;
    return m;
  };

  if (startSpan === endSpan) {
    const t = startSpan.node;
    const after = t.splitText(idx - startSpan.start);
    after.splitText(mark.text.length);
    after.parentNode!.replaceChild(mk(), after);
    return true;
  }

  // 跨节点：中间节点整体包进 mark
  const first = startSpan.node;
  const head = first.splitText(idx - startSpan.start);
  const middle: Text[] = spans
    .filter((s) => s.start >= startSpan.end && s.end <= endSpan.start)
    .map((s) => s.node);
  const markEl = mk();
  head.parentNode!.insertBefore(markEl, head);
  markEl.appendChild(head);
  for (const m of middle) markEl.appendChild(m);
  if (endSpan !== startSpan) {
    const tail = endSpan.node.splitText(endIdx - endSpan.start);
    markEl.appendChild(endSpan.node);
    // tail 留在原处
    void tail;
  }
  return true;
}

export function applyMarks(root: HTMLElement | null, marks: Mark[]): number {
  if (!root) return 0;
  let ok = 0;
  for (const m of marks) {
    const sec = root.querySelector<HTMLElement>(`#${CSS.escape(m.sectionId)}`);
    if (sec && applyMarkToRoot(sec, m)) ok++;
  }
  return ok;
}

export function flashMark(markId: string) {
  const el = document.querySelector(`mark[data-mark-id="${CSS.escape(markId)}"]`);
  if (el) {
    el.classList.remove('flash');
    void (el as HTMLElement).offsetWidth;
    el.classList.add('flash');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
