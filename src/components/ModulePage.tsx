import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { moduleById, getModuleLectures } from '../content';
import { Block } from './Block';
import SideNav from './SideNav';
import { getMarks, subscribe } from '../lib/marks';
import { applyMarks, flashMark } from '../lib/highlight';

export default function ModulePage() {
  const { moduleId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const mod = moduleById(moduleId);
  const articleRef = useRef<HTMLDivElement>(null);
  const marksVersion = useRef(0);

  const lectures = mod ? getModuleLectures(mod) : [];

  // 渲染后应用本模块的标记
  useEffect(() => {
    if (!mod) return;
    const apply = () => {
      const marks = getMarks().filter((m) => m.moduleId === mod.id);
      applyMarks(articleRef.current, marks);
    };
    apply();
    const unsub = subscribe(() => {
      marksVersion.current++;
      apply();
    });
    return unsub;
  }, [mod, moduleId]);

  // 处理 ?sec=xxx&mark=xxx 跳转
  useEffect(() => {
    const sec = searchParams.get('sec');
    const markId = searchParams.get('mark');
    if (sec) {
      const t = setTimeout(() => {
        const el = document.getElementById(sec);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (markId) setTimeout(() => flashMark(markId), 350);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [searchParams, moduleId]);

  if (!mod) return <Navigate to="/" replace />;

  return (
    <div className="page with-sidenav">
      <SideNav mod={mod} lectures={lectures} />
      <div className="article" ref={articleRef}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>
            MODULE {mod.num}
          </span>
          <h1 style={{ margin: '4px 0 6px', fontSize: 27 }}>{mod.titleZh}</h1>
          <div style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 14 }}>{mod.titleEn}</div>
          <p style={{ color: 'var(--sub)' }}>{mod.desc}</p>
          <p style={{ color: 'var(--amber)', fontSize: 13.5 }}>🎯 考试重点：{mod.examFocus}</p>
        </div>

        {lectures.map((lec) => (
          <article className="lecture" id={lec.id} key={lec.id}>
            <div className="lecture-head">
              <span className="lnum">Lecture {lec.num}</span>
              <h2>{lec.titleZh}</h2>
              <span className="en">{lec.titleEn}</span>
            </div>
            {lec.sections.map((sec) => (
              <section className="section" id={sec.id} key={sec.id}>
                <h3>
                  {sec.title}
                  {sec.titleEn && <span className="en">{sec.titleEn}</span>}
                  <a className="s-anchor" href={`#${sec.id}`} title="复制锚点链接">
                    #
                  </a>
                </h3>
                {sec.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}
          </article>
        ))}
        <div className="footer">模块 {mod.num} {mod.titleZh} · 学习完记得做每讲末尾的自测题 ✍️</div>
      </div>
    </div>
  );
}
