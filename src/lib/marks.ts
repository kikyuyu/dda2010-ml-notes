// ===== 我的标记：localStorage 存储 + 订阅通知 =====

export interface Mark {
  id: string;
  moduleId: string;
  lectureNum: number;
  lectureTitle: string;
  sectionId: string;
  sectionTitle: string;
  text: string;
  color: string; // c1..c4
  note: string;
  ts: number;
}

const KEY = 'dda2010-marks-v1';
const listeners = new Set<() => void>();

export function getMarks(): Mark[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Mark[]) : [];
  } catch {
    return [];
  }
}

function save(marks: Mark[]) {
  localStorage.setItem(KEY, JSON.stringify(marks));
  listeners.forEach((f) => f());
}

export function addMark(m: Omit<Mark, 'id' | 'ts'>): Mark {
  const marks = getMarks();
  const mark: Mark = { ...m, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ts: Date.now() };
  marks.push(mark);
  save(marks);
  return mark;
}

export function updateMark(id: string, patch: Partial<Mark>) {
  save(getMarks().map((m) => (m.id === id ? { ...m, ...patch } : m)));
}

export function deleteMark(id: string) {
  save(getMarks().filter((m) => m.id !== id));
}

export function exportMarks(): string {
  return JSON.stringify(getMarks(), null, 2);
}

export function importMarks(json: string): number {
  const arr = JSON.parse(json) as Mark[];
  if (!Array.isArray(arr)) return 0;
  const cur = getMarks();
  const ids = new Set(cur.map((m) => m.id));
  const fresh = arr.filter((m) => m && m.id && !ids.has(m.id));
  save([...cur, ...fresh]);
  return fresh.length;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function jumpToMarkHash(mark: Mark): string {
  return `/m/${mark.moduleId}?sec=${mark.sectionId}&mark=${mark.id}`;
}
