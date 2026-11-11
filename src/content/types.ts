// ===== 内容数据类型定义（内容即数据：新增课件只需新增数据文件）=====

export type Block =
  | { kind: 'p'; html: string }
  | { kind: 'term'; en: string; zh: string; note?: string }
  | { kind: 'formula'; tex: string; explain: string }
  | { kind: 'figure'; src: string; title: string; caption: string; guide?: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'steps'; title: string; items: string[] }
  | { kind: 'compare'; title: string; heads: [string, string, string]; rows: [string, string, string][] }
  | { kind: 'table'; title?: string; header: string[]; rows: string[][] }
  | { kind: 'trap'; claim: string; verdict: 'T' | 'F'; explain: string }
  | {
      kind: 'quiz';
      title: string;
      questions: {
        q: string;
        type: 'tf' | 'mcq' | 'sa';
        options?: string[];
        answer: string;
        explain?: string;
      }[];
    };

export interface Section {
  id: string; // 唯一锚点，格式 l{NN}-s{M}
  title: string; // 中文标题
  titleEn?: string; // 英文标题
  blocks: Block[];
}

export interface Lecture {
  id: string; // l01 ... l18
  num: number;
  titleEn: string;
  titleZh: string;
  sections: Section[];
}

export interface CourseModule {
  id: string;
  num: string; // 01 ...
  titleEn: string;
  titleZh: string;
  desc: string;
  lectureIds: string[];
  examFocus: string; // 考试重点提示
}
