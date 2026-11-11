import type { CourseModule, Lecture } from '../content/types';

interface Props {
  mod: CourseModule;
  lectures: Lecture[];
}

export default function SideNav({ mod, lectures }: Props) {
  return (
    <aside className="sidenav">
      <div className="sn-mod">
        {mod.num} · {mod.titleZh}
      </div>
      {lectures.map((lec) => (
        <div className="sn-lec" key={lec.id}>
          <a href={`#${lec.id}`}>Lecture {lec.num} · {lec.titleZh}</a>
          <div className="sn-secs">
            {lec.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} title={s.title}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
