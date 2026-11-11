import type { Lecture } from '../types';

const l06: Lecture = {
  id: 'l06',
  num: 6,
  titleEn: 'LASSO, Feature Selection & Multiple Polynomial Regression',
  titleZh: 'LASSO 正则化、特征选择与多元多项式回归',
  sections: [
    {
      id: 'l06-s1',
      title: '特征选择 Feature Selection',
      titleEn: 'Feature Selection',
      blocks: [
        { kind: 'term', en: 'Feature Selection', zh: '（又称 variable selection / attribute selection）：从全部特征中选择一个有意义的子集用于模型构建的过程。', note: '目的：simplification of models（简化模型）。' },
        { kind: 'p', html: '动机问题（Boston 13 特征）：13 特征的模型能否被简化、同时预测性能尽量不下降？如何得到只有 5 个特征的模型？答案就是 LASSO。' },
        { kind: 'term', en: 'LASSO', zh: 'Least Absolute Shrinkage and Selection Operator：一种同时做 feature selection 和 regularization 的回归方法。', note: '记住全称，名词解释题可能考。' },
      ],
    },
    {
      id: 'l06-s2',
      title: 'LASSO 参数估计（公式必考）',
      titleEn: 'Parameter Estimation with LASSO',
      blocks: [
        { kind: 'formula', tex: '[\\hat{b}, \\hat{w}_1, \\dots, \\hat{w}_n] = \\arg\\min_{b, w_1, \\dots, w_n} \\Big( \\sum_{i=1}^{N_{train}} \\big(y_i^{train} - b - \\sum_{j=1}^{n} w_j x_{ij}^{train}\\big)^2 + \\alpha \\sum_{j=1}^{n} |w_j| \\Big)',
          explain: '与 LS 的差别：损失函数后面多了 <b>正则化项 α Σ|wⱼ|</b>（L1 惩罚，系数绝对值之和）。α ≥ 0 是 <b>regularization parameter</b>：控制正则化强度，是 LASSO 的 tuning parameter。sklearn：Lasso(alpha=α) + fit。' },
        { kind: 'p', html: '正则化的直觉：拟合误差想让小，惩罚项也想让小 → 只能把不重要特征的系数压成 0，从而自动完成特征选择。' },
        { kind: 'trap', claim: 'When α = 0, the LASSO method reduces to the least squares (LS) method.', verdict: 'T', explain: 'α=0 时正则化项 αΣ|wⱼ| 消失，LASSO 目标函数 = LS 目标函数。' },
        { kind: 'trap', claim: 'Lasso regression reduces to the multiple linear regression with the LS method when the regularization parameter α goes to infinity.', verdict: 'F', explain: 'Assignment 1 原题，方向反了！α→<b>0</b> 时退化为 LS（惩罚消失）；α→∞ 时<b>所有系数都变成 0</b>（模型不含任何特征）。' },
        { kind: 'trap', claim: 'As α → ∞, all of ŵ₁, …, ŵₙ will be zero.', verdict: 'T', explain: 'α 无限大时惩罚项主导，唯一让目标有限的办法是所有 w = 0 → 得到一个没有输入特征的模型。' },
      ],
    },
    {
      id: 'l06-s3',
      title: '稀疏性：Sparsity Inducing Property',
      titleEn: 'Sparsity Inducing Property',
      blocks: [
        { kind: 'term', en: 'Sparsity Inducing Property', zh: 'LASSO 偏好 sparse solutions：估计出的 ŵ₁,…,ŵₙ 中<b>很多恰好等于 0</b>。', note: '例如 n=13 时 [ŵ₁,…,ŵ₁₃] = [0,0,0,ŵ₄,0,ŵ₆,0,0,ŵ₉,0,0,0,0]。' },
        { kind: 'p', html: '效果：预测时 ŷ = b̂ + ŵ₄x₄ + ŵ₆x₆ + ŵ₉x₉，相当于只用 3 个特征——这就是 LASSO 能做 <b>feature selection</b>、得到更简单模型的原理。' },
        { kind: 'p', html: 'α 对稀疏性的控制：<b>as α increases</b> → 系数越来越稀疏（模型越来越简单）；<b>as α decreases</b> → 系数越来越稠密（模型越来越复杂），α→0 时退化为 LS、所有特征都进入模型。关键结论：<b>the model complexity is now controlled by α but not by n!</b>（特征数 n 不再决定复杂度，α 才是旋钮。）' },
        { kind: 'figure', src: 'reg_lasso_vs_ridge.png', title: 'LASSO Path：系数随 α 变化的轨迹', caption: '左 Ridge (L2)、右 LASSO (L1)：横轴是 α（对数刻度），纵轴是各特征系数估计值。', guide: '看右图 LASSO：α 小时系数接近 LS 解；α 增大时系数曲线被压向 0，且<b>很多系数直接变成精确的 0</b>（掉到横轴上），这就是稀疏性。对比 Ridge：系数都缩小但<b>不会精确到 0</b>。考试若问"LASSO 与 Ridge 的区别"，答案就是这一条。' },
      ],
    },
    {
      id: 'l06-s4',
      title: '用 CV 调 α',
      titleEn: 'Tuning of α',
      blocks: [
        { kind: 'p', html: '调 α 与调多项式阶数 m 完全同构：对每个候选 α 计算 r-fold CV error（各折 Validation MSE 的平均），选 CV error 最小的 α_CV。sklearn：<code>LassoCV(cv=5)</code> 自动完成；LOOCV 则 <code>cv=len(y_train)</code>。' },
        { kind: 'steps', title: 'Steps for LASSO（与 LS 流程对比记忆）', items: [
          'Data Split and Pre-processing（切分 + 标准化，得到 z）；',
          'Model Structure Selection：选 multiple linear regression 结构；<b>用 CV 调 regularization parameter α</b> 得 α_CV；',
          'Parameter Estimation：用 LASSO 方法（基于 training data + α_CV）估计 θ̂；',
          'Prediction；5. Model Evaluation（Test MSE / R²）。',
        ]},
        { kind: 'table', title: 'Boston 案例全模型对比表（数字体现的故事）', header: ['Model', 'Test MSE', 'Test R²'], rows: [
          ['LS, 1 feature', '46.14', '0.37'],
          ['LS, 3 features', '39.25', '0.46'],
          ['LS, 13 features', '24.29', '0.67'],
          ['LS, standardized 13 features', '24.29', '0.67'],
          ['LASSO, α=0.5（固定）', '27.31', '0.63'],
          ['LASSO, α=α_CV≈0.069', '<b>24.32</b>', '<b>0.67</b>'],
        ]},
        { kind: 'p', html: '解读：① 固定 α=0.5 惩罚过强 → 精度略降（27.31）；② CV 选的 α≈0.069 让 LASSO 达到与 LS 几乎相同的精度（24.32 vs 24.29），但<b>模型更简单（非零系数更少）</b>——这正是特征选择的价值。' },
      ],
    },
    {
      id: 'l06-s5',
      title: 'Multiple Polynomial Regression 模型',
      titleEn: 'Multiple Polynomial Regression Model',
      blocks: [
        { kind: 'formula', tex: 'f(x, \\theta) = b + \\sum_{j_1=1}^{n} w_{j_1} x_{j_1} + \\sum_{j_1=1}^{n} \\sum_{j_2=j_1}^{n} w_{j_1 j_2} x_{j_1} x_{j_2} + \\dots',
          explain: 'm 阶多元多项式回归：在多元线性回归的基础上加入<b>交叉项</b>（xⱼ₁xⱼ₂、xⱼ₁xⱼ₂xⱼ₃…），每一项次数 ≤ m。退化关系：m=1 → multiple linear regression；n=1 → m 阶多项式回归。' },
        { kind: 'p', html: '复杂度调节的两个旋钮：复杂度取决于 <b>特征数 n</b> 和 <b>多项式阶数 m</b>。调法：<br>• <b>LS 方法</b>：用 degree m 调复杂度（CV 选 m_CV）；<br>• <b>LASSO 方法</b>：先选一个足够大的 m，然后用 <b>α 调复杂度</b>（CV 选 α_CV）。' },
        { kind: 'table', title: 'Example 3 & 4 的结果（重点案例）', header: ['Method', 'Test R²', 'Test MSE', '非零参数个数'], rows: [
          ['Multiple poly, m=2, LS', '0.81', '14.24', '104'],
          ['Multiple poly, m=3, LASSO(α_CV)', '0.80', '14.44', '<b>89</b>'],
          ['Multiple poly, m=3, LS', '−105.20', '7788.00', '559'],
        ]},
        { kind: 'p', html: '这个故事是 LASSO 的最佳广告：m=3 时 LS 严重过拟合（R²=−105！）；LASSO 用同样 m=3 达到与 m=2 LS 几乎相同的精度，且只用 <b>89 个非零参数</b>（vs LS 的 559 个）——<b>similar performance, fewer nonzero parameters</b>。' },
        { kind: 'trap', claim: 'For the LASSO method, the model complexity is controlled by the number of features n.', verdict: 'F', explain: '对 LASSO，复杂度由 <b>α</b> 控制（先固定足够大的 m，α 决定稀疏程度），不是由 n 控制。由 n/m 控制复杂度的是 LS 路线。' },
        { kind: 'trap', claim: 'LASSO always improves the Test MSE compared with the LS method.', verdict: 'F', explain: '固定大 α 时 LASSO 精度可能下降（27.31 vs 24.29）；只有 α 调得合适时才能"精度不降、模型更简单"。always 必错。' },
        {
          kind: 'quiz',
          title: 'Lecture 6 自测',
          questions: [
            { q: 'The regularization term in LASSO is αΣ|wⱼ|, i.e., the sum of the squared coefficients.', type: 'tf', answer: 'F', explain: 'LASSO 惩罚的是<b>绝对值</b>之和（L1）；平方和（L2）是 Ridge。一字之差。' },
            { q: 'As α increases, the LASSO parameter estimates become more and more sparse.', type: 'tf', answer: 'T', explain: 'α↑ → 惩罚加重 → 更多系数被压成 0 → 模型更简单。' },
            { q: 'For LASSO, a larger α always leads to a better prediction capability.', type: 'tf', answer: 'F', explain: 'α 太大所有系数都为 0，模型退化；要 CV 选合适的 α。' },
            { q: 'Explain how LASSO performs feature selection.', type: 'sa', answer: 'LASSO adds an L1 penalty αΣ|wⱼ| to the LS loss; minimizing it drives the coefficients of irrelevant features exactly to zero, so those features are excluded from the model, which is equivalent to selecting a subset of features.', explain: '答题要点：L1 penalty → coefficients exactly zero → 特征被剔除。' },
          ],
        },
      ],
    },
  ],
};

export default l06;
