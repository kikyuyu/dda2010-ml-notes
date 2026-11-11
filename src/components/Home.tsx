import { Link } from 'react-router-dom';
import { modules } from '../content';

export default function Home() {
  return (
    <div className="page-narrow">
      <div className="hero">
        <h1>DDA2010 Applied Machine Learning</h1>
        <div className="en">从零开始的机器学习 · 概念全覆盖 · 考试导向</div>
        <p className="lead">
          本站把 18 讲课件的全部知识点重新梳理为 7 大主题：专业术语与关键解释保留英文，详细讲解用中文；
          每个算法配对比图示与读图指南；从 Assignment 反推出 70+ 个判断题陷阱。目标是：<b>不考 coding、不考繁琐计算，专攻概念理解</b>。
        </p>
        <img src="figures/ml_four_tasks.png" alt="四大机器学习任务" />
      </div>

      <div className="home-sec">
        <h2>课程主题导航</h2>
        <p style={{ color: 'var(--sub)' }}>
          按知识主题组织（不按讲次），点击卡片进入学习。每页左侧有小节导航，可精确定位每个知识点。
        </p>
        <div className="mod-grid">
          {modules.map((m) => (
            <Link to={`/m/${m.id}`} className="mod-card" key={m.id}>
              <div className="num">MODULE {m.num}</div>
              <h3>{m.titleZh}</h3>
              <div className="en">{m.titleEn}</div>
              <p>{m.desc}</p>
              <div className="meta">
                {m.lectureIds.map((id) => (
                  <span key={id}>L{parseInt(id.slice(1), 10)}</span>
                ))}
              </div>
              <div className="focus">🎯 考试重点：{m.examFocus}</div>
            </Link>
          ))}
          <Link to="/traps" className="mod-card">
            <div className="num">MODULE 08</div>
            <h3>考前冲刺 · 概念陷阱题库</h3>
            <div className="en">Exam Traps Collection</div>
            <p>汇总散落在各讲中的全部判断题陷阱卡片，按主题筛选，考前快速扫一遍。</p>
            <div className="meta">
              <span>判断题</span>
              <span>选择题</span>
              <span>陷阱辨析</span>
            </div>
            <div className="focus">🎯 考试前最后一晚必看</div>
          </Link>
        </div>
      </div>

      <div className="home-sec">
        <h2>如何使用本站考高分</h2>
        <div className="home-cols">
          <div className="info-card">
            <h4>🧭 学习路径</h4>
            <ul>
              <li>第 1 遍：按模块顺序读讲解，重点看 <b style={{ color: 'var(--amber)' }}>⚠️ 陷阱卡片</b> 和图示读图指南。</li>
              <li>第 2 遍：做每讲末尾的 📝 自测题（Assignment 风格）。</li>
              <li>考前：过一遍「⚡ 考前冲刺」页的陷阱总表。</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>✍️ 我的标记</h4>
            <ul>
              <li>选中任意文字 → 弹出工具条 → 选颜色高亮，可附备注。</li>
              <li>右下角「我的标记」按钮查看全部标记，按讲次分组，点击跳转定位。</li>
              <li>标记保存在本机浏览器（localStorage），支持导出 / 导入备份。</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>📝 考试情报（来自 Assignment 分析）</h4>
            <ul>
              <li>判断题 ×10 + 单选题 + 解释题，<b>不考 coding</b>。</li>
              <li>判断题最爱考：绝对化表述、因果颠倒、概念张冠李戴。</li>
              <li>解释题常要求：用一句话讲清算法思想 / 参数作用。</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer">
        DDA2010 Applied Machine Learning · 学习站 | 内容基于课程 Lecture 1–18 课件与 Assignment 1–3 整理
      </div>
    </div>
  );
}
