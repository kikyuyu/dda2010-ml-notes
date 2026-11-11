import type { Lecture } from '../types';

const l05: Lecture = {
  id: 'l05',
  num: 5,
  titleEn: 'Multiple Linear Regression, Parameter Influence & Data Standardization',
  titleZh: '多元线性回归、参数影响力与数据标准化',
  sections: [
    {
      id: 'l05-s1',
      title: '从单特征到多特征：动机',
      titleEn: 'Motivation',
      blocks: [
        { kind: 'p', html: 'Boston 数据集有 13 个特征（x₁=CRIM 犯罪率, x₂=NOX 氮氧化物浓度, x₃=RM 房间数, …, x₁₃=LSTAT 低收入人口比例）。只用一个特征预测房价太浪费信息，于是把输入扩展为向量 x = [x₁,…,xₙ]。' },
        { kind: 'term', en: 'Vector & Features', zh: '若 x 是 n 维向量，记 x ∈ ℝⁿ，x = [x₁, x₂, …, xₙ]，n 即 number of features（特征个数）。记号 f⁰ : ℝⁿ → ℝ 表示把 n 维向量映射成一个数。' },
      ],
    },
    {
      id: 'l05-s2',
      title: 'Multiple Linear Regression 模型与 LS 估计',
      titleEn: 'Multiple Linear Regression & LS',
      blocks: [
        { kind: 'formula', tex: 'f(x, \\theta) = b + w_1 x_1 + w_2 x_2 + \\dots + w_n x_n, \\qquad x = [x_1, \\dots, x_n],\\ \\theta = [b, w_1, \\dots, w_n]',
          explain: '多元线性回归：输出是 n 个特征的线性组合。x₁,…,xₙ 是 input 的 n 个 features；b, w₁,…,wₙ 是待估计的 unknown parameters。<b>当 n=1 时退化为 simple linear regression</b>。' },
        { kind: 'formula', tex: '[\\hat{b}, \\hat{w}_1, \\dots, \\hat{w}_n] = \\arg\\min_{b, w_1, \\dots, w_n} \\sum_{i=1}^{N_{train}} \\Big(y_i^{train} - \\big(b + \\sum_{j=1}^{n} w_j x_{ij}^{train}\\big)\\Big)^2',
          explain: 'LS 方法与之前完全一样：最小化 training data 上的残差平方和，解出 b̂, ŵ₁, …, ŵₙ 称为 LS estimates。sklearn 同样是 LinearRegression() + model.fit()。' },
        { kind: 'p', html: '案例（3 特征 RM/NOX/CRIM）：MEDV̂ = −21.8549 + 8.2405·RM − 11.9597·NOX − 0.2048·CRIM。模型对比：simple（1 特征）Test MSE=46.14、R²=0.37 → multiple（3 特征）Test MSE=<b>39.25</b>、R²=<b>0.46</b>。MSE 更低、R² 更高 → 多元模型预测更好、解释了输出中更多的变异。' },
        { kind: 'trap', claim: 'The multiple linear regression model is fundamentally different from the simple linear regression model and requires a different estimation method.', verdict: 'F', explain: '两者同属 linear regression，LS 方法完全通用；n=1 时多元退化为简单。增加特征只是扩展了 x 和 θ 的维度。' },
      ],
    },
    {
      id: 'l05-s3',
      title: '参数估计值的大小能代表特征重要性吗？',
      titleEn: 'Influence of Model Parameters',
      blocks: [
        { kind: 'p', html: '心脏病风险示例：Risk = 3 + 0.5·BP + 0.02·Chol + 10·CRP。<br>• BP 范围 90–140（mm Hg），每 +1 单位 → Risk +0.5；<br>• Chol 范围 150–250（mg/dL），每 +1 单位 → +0.02；<br>• CRP 范围 0.1–3.0（mg/L），每 +1 单位 → +10。<br>三个特征<b>量纲和取值范围完全不同</b>。CRP 的参数最大（10），但取值范围很小——<b>不能</b>直接说 CRP 是最重要的特征。特征的影响力由 <b>参数大小 × 特征取值尺度</b> 共同决定。' },
        { kind: 'trap', claim: 'In a multiple linear regression model, the feature with the largest |ŵᵢ| always has the largest influence on the output.', verdict: 'F', explain: '只在<b>标准化之后</b>该结论才成立（课件 Example 2 的结论明确限定 after standardization）。未标准化时各特征尺度不同，|ŵᵢ| 不可直接比较——CRP 反例。' },
        { kind: 'trap', claim: 'After data standardization, the amplitude |ŵ₁|,…,|ŵₙ| of the parameter estimates represent the influence of the features on the predicted output, so the feature with the largest |ŵᵢ| is the most important.', verdict: 'T', explain: '标准化后所有特征同一尺度（均值 0、标准差 1），单位变化引起的输出变化可直接由 |ŵᵢ| 比较，此时最大 |ŵᵢ| 即最重要特征（Boston 案例中为 RM）。' },
      ],
    },
    {
      id: 'l05-s4',
      title: 'Data Standardization（公式必背）',
      titleEn: 'Data Standardization',
      blocks: [
        { kind: 'term', en: 'Data Standardization', zh: '一种 pre-processing 技术：当各特征取值范围差异大或单位不同（磅/米/英里…）时，把每个特征变换为 <b>mean = 0, standard deviation = 1</b>，消除量纲。' },
        { kind: 'formula', tex: 'z_{ij} = \\frac{x_{ij} - \\mu_j}{\\sigma_j}, \\qquad \\mu_j = \\frac{1}{N}\\sum_{i=1}^{N} x_{ij}, \\quad \\sigma_j = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_{ij} - \\mu_j)^2}',
          explain: '对第 j 个特征：减去该特征的均值 μ_j，除以标准差 σ_j。结果 z：每个特征均值 0、标准差 1。sklearn：StandardScaler().fit(X_train) → transform。注意 scaler 只用 training data fit，再 transform test data（防泄漏）。' },
        { kind: 'p', html: '课件 Example 2 的关键结论（13 特征）：standardization 前后 Test MSE 都是 <b>24.29</b>、R² 都是 <b>0.67</b>——<b>standardization does not improve the accuracy</b>（对 LS 线性回归，标准化只是对特征做了线性重参数化，不改变模型拟合能力），它的作用是<b>让参数估计值可以直接比较影响力</b>。' },
        { kind: 'trap', claim: 'Adding data standardization will not change the Test MSE of the multiple linear regression model for both the least squares method and the LASSO method.', verdict: 'F', explain: 'Assignment 1 原题（组合陷阱！）。对 <b>LS</b>：标准化不改变 Test MSE（24.29 不变），该半句为 T；但对 <b>LASSO</b>：正则化惩罚的是系数绝对值，特征尺度不同会导致惩罚力度不同，<b>标准化会改变 LASSO 的结果</b>。合取命题只要一半错就整体为 F。' },
        { kind: 'p', html: '特征数量与效果：1 特征 MSE 46.14 → 3 特征 39.25 → 13 特征 24.29。特征携带信息越多，预测能力越强（同一数据集上）。' },
        { kind: 'figure', src: 'knn_scaling.png', title: '标准化的意义（为距离/正则类方法铺路）', caption: '左：未标准化时取值范围小的特征被"压扁"，距离计算被大尺度特征主导；右：标准化后两特征公平参与。', guide: '虽然本例对 LS 回归的精度无影响，但对 kNN、SVM、LASSO 等依赖距离或正则的方法，尺度差异会造成实质影响——这就是 Assignment 考"standardization 改变 LASSO 结果"的原因。' },
      ],
    },
    {
      id: 'l05-s5',
      title: '回归模块小结（L3–L5）',
      titleEn: 'Summary',
      blocks: [
        { kind: 'compare', title: '到目前为止的模型家族', heads: ['模型', '结构', '复杂度'], rows: [
          ['Simple Linear Regression', 'f = b + w₁x', '2（n=1 的特例）'],
          ['Polynomial Regression', 'f = b + Σ wₖxᵏ', 'm+1（由阶数 m 决定）'],
          ['Multiple Linear Regression', 'f = b + Σ wⱼxⱼ', 'n+1（由特征数 n 决定）'],
        ]},
        { kind: 'list', items: [
          '所有模型共用同一流程：Data Split → Model Structure Selection → Parameter Estimation (LS) → Prediction → Model Evaluation。',
          '评估指标：Test MSE（越小越好）、Test R²（越大越好，最大 1，可为负）。',
          '结构选择靠 CV（r-fold / LOOCV），test data 只用于最终评估。',
          '误差分解：MSE = (Bias)² + Variance + Irreducible Error。',
        ]},
        {
          kind: 'quiz',
          title: 'Lecture 5 自测',
          questions: [
            { q: 'Data standardization transforms each feature such that it has a mean of 0 and a standard deviation of 1.', type: 'tf', answer: 'T', explain: 'z = (x−μ)/σ 的定义直接可得。' },
            { q: 'For the least squares method, adding data standardization improves the Test MSE of the multiple linear regression model.', type: 'tf', answer: 'F', explain: 'Boston 13 特征案例：标准化前后 MSE 均为 24.29。标准化的作用是统一尺度、使 |ŵ| 可比，而不是提升精度。' },
            { q: 'The StandardScaler should be fitted on the training data only, and then used to transform both training and test data.', type: 'tf', answer: 'T', explain: 'scaler.fit(X_train) 后再 transform(X_train) / transform(X_test)。用全部数据 fit 会让 test 信息泄漏到预处理中。' },
            { q: 'Explain why the feature with the largest |ŵᵢ| is not necessarily the most important feature before standardization.', type: 'sa', answer: 'Because features have different scales/units and ranges; the influence on the output is decided by both the parameter value and the scale of the feature. Only after standardization (all features on the same scale) can |ŵᵢ| be directly compared.', explain: '答题要点：influence = parameter × scale；standardization 之后才可比。' },
          ],
        },
      ],
    },
  ],
};

export default l05;
