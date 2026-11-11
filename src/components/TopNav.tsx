import { NavLink, Link } from 'react-router-dom';
import { modules } from '../content';

export default function TopNav() {
  return (
    <header className="topnav">
      <Link to="/" className="logo">
        <span className="dot" />
        DDA2010 · ML 学习站
      </Link>
      <nav>
        <NavLink to="/" end>
          首页
        </NavLink>
        {modules.map((m) => (
          <NavLink key={m.id} to={`/m/${m.id}`}>
            {m.num} {m.titleZh}
          </NavLink>
        ))}
        <NavLink to="/traps">⚡ 考前冲刺</NavLink>
      </nav>
      <div className="spacer" />
    </header>
  );
}
