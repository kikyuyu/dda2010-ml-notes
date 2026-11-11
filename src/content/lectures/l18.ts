import type { Lecture } from '../types';

const l18: Lecture = {
  id: 'l18',
  num: 18,
  titleEn: 'Principal Component Analysis (PCA)',
  titleZh: '主成分分析（PCA）',
  sections: [
    {
      id: 'l18-s1',
      title: 'PCA 问题定义',
      titleEn: 'Problem Statement of PCA',
      blocks: [
        {
          kind: 'p',
          html: '<b>Wine dataset 动机</b>：178 个样本、13 个特征（alcohol、malic acid、…、proline），问题：特征太多且部分冗余。任务：构造<b>更少的新特征</b>来很好地描述这些酒。',
        },
        {
          kind: 'p',
          html: '回顾引例：只保留一个原始特征时选方差大的 x₁。但若数据<b>旋转 45°</b>，x₁、x₂ 都不是最好的选择——最好的是<b>椭圆的长轴方向</b>（新特征 z₁ = √2/2·x₁ − √2/2·x₂）。这引出 PCA。',
        },
        {
          kind: 'steps',
          title: 'Problem Statement of PCA',
          items: [
            '找到 m 条新的<b>相互正交</b>的轴（principal axes / principal components），对应 m 个新特征；',
            '第 j 条主轴用单位向量 [α_j1,…,α_jn] 表示，满足 α²_j1+…+α²_jn = <b>1</b>；',
            '第 j 个新特征是线性组合 z_j = α_j1x₁+…+α_jnx_n；',
            'm ≪ n，且新数据集的 variance <b>尽可能保留原始数据集的 variance</b>。',
          ],
        },
      ],
    },
    {
      id: 'l18-s2',
      title: '两特征简化例子（8 个酒样本）',
      titleEn: 'A Simple Example with Two Features',
      blocks: [
        {
          kind: 'p',
          html: '<b>先做 Data Standardization</b>：alcohol 与 malic acid 单位、尺度不同，必须标准化：z_ij = (x_ij − μ_j)/σ_j，使每个分量均值为 <b>0</b>、标准差为 <b>1</b>。标准化后数据整体平移到原点附近，但<b>相对位置不变</b>。',
        },
        {
          kind: 'formula',
          tex: 'z_{ij} = \\frac{x_{ij} - \\mu_j}{\\sigma_j}',
          explain: 'μ_j 是第 j 个特征的均值，σ_j 是其标准差。标准化是多数机器学习方法的常见预处理步骤（去单位、统一尺度）。',
        },
        {
          kind: 'p',
          html: '<b>找第一根新轴</b>：候选轴是过原点的一条直线。把每个点向候选轴作垂线（红线），蓝点投影成红点（新数据点）。设 d_i 为第 i 个点到候选轴的距离，PCA 求解：',
        },
        {
          kind: 'formula',
          tex: '\\min\\ \\sum_{i=1}^{8} d_i^2 \\quad \\Longleftrightarrow \\quad \\max\\ \\sum_{i=1}^{8} c_i^2',
          explain: 'c_i 是第 i 个红点到原点的距离。因为 ℓ_i² = d_i² + c_i² 且 ℓ_i（点到原点距离）与候选轴无关，所以"最小化投影误差平方和"等价于"最大化投影点到原点距离平方和"。',
        },
        {
          kind: 'p',
          html: '<b>含义</b>：Σc_i² 就是红点沿新轴的 <b>variance</b>（标准化后均值在原点）。所以 PCA = 找一条轴使投影方差最大——<b>最小化重建误差 等价于 最大化投影方差</b>。本例最佳轴斜率为 −1，PCA 用该轴与单位圆的交点 [√2/2, −√2/2] 表示方向：',
        },
        {
          kind: 'formula',
          tex: 'z_1 = \\frac{\\sqrt{2}}{2} x_1 - \\frac{\\sqrt{2}}{2} x_2 = [x_1, x_2] \\cdot \\left[\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right]',
          explain: '第一新特征（first principal component）。第二根轴必须与第一根垂直：[√2/2, √2/2]，z₂ = √2/2·x₁ + √2/2·x₂。两条主轴构成新坐标系。',
        },
        {
          kind: 'trap',
          claim: 'PCA 第一主成分是最小化投影方差的方向。',
          verdict: 'F',
          explain: '相反：PCA 第一主轴 <b>最大化</b>投影方差（等价于最小化投影误差/重建误差 Σd_i²）。"min 误差 ⇔ max 方差"是考试核心等价关系。',
        },
        {
          kind: 'trap',
          claim: '对特征做 standardization 会改变数据点的相对位置，从而改变 PCA 的结果结构。',
          verdict: 'F',
          explain: '标准化把数据平移到原点附近（均值 0、标准差 1），但<b>相对位置不变</b>；标准化是必要的预处理（去单位、统一尺度），尺度不同会主导 PCA 方向。',
        },
      ],
    },
    {
      id: 'l18-s3',
      title: '一般情形与 Python 实现',
      titleEn: 'More General Cases & Python',
      blocks: [
        {
          kind: 'steps',
          title: 'n 维数据找 m 个主成分（按顺序贪心求解）',
          items: [
            '<b>Step 0</b>：Data Standardization；',
            '<b>第 1 根主轴</b>：最大化数据投影方差 → 得第 1 新特征 z₁；',
            '<b>第 2 根主轴</b>：在<b>与第 1 根主轴垂直</b>的所有直线中最大化投影方差（几何上是在垂直超平面内找）→ 得 z₂；',
            '……第 m 根主轴：在与前 m−1 根主轴都垂直的直线中最大化投影方差 → 得 z_m。',
          ],
        },
        {
          kind: 'formula',
          tex: 'z_{ij} = [x_{i1}, x_{i2}, \\cdots, x_{in}] \\cdot [\\alpha_{j1}, \\alpha_{j2}, \\cdots, \\alpha_{jn}]',
          explain: '任意样本在新坐标系下的坐标：与第 j 条主轴的单位方向向量做点积。全部样本得到新数据集 z_i = [z_i1,…,z_im]，m ≪ n。',
        },
        {
          kind: 'figure',
          src: 'pca_projection.png',
          title: 'PCA 投影与方差最大化',
          caption: '第一主成分沿数据散布最长的方向；第二主成分与其垂直且方差次之。投影点越分散，保留的信息越多。',
          guide: '考试画图：①先标出数据椭圆的长轴 = PC1；②PC2 与 PC1 垂直；③各点向轴作垂线得到投影（红点）；④方差比较看投影点的分散程度。',
        },
        {
          kind: 'p',
          html: 'sklearn：<code>PCA(n_components=m)</code> → <code>fit(Standardized_data)</code>；<code>model.components_</code> 给出各主轴 [α_j1,…,α_jn]；<code>model.transform(Standardized_data)</code> 得到新数据集。',
        },
        {
          kind: 'p',
          html: '<b>Wine 任务</b>：Task 1——对 13 维标准化数据做 PCA，取前两个主成分，在 2D 平面可视化（各类酒自然分开）；Task 2——在 PCA 后的新数据集上训练 <b>3 类 logistic regression（OvO/OvR）</b>。这是"降维作为其他分析 intermediate step"的典型用法。',
        },
        {
          kind: 'trap',
          claim: 'PCA 的第二主成分是与第一主成分相关性最大的方向。',
          verdict: 'F',
          explain: '第二主轴必须在<b>与第一主轴垂直（orthogonal）</b>的所有方向中找投影方差最大者——"垂直"约束是定义的一部分，不是"相关性最大"。',
        },
      ],
    },
    {
      id: 'l18-s4',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 18 自测题',
          questions: [
            { q: 'T/F：PCA 在找第一主成分时，最小化投影点到候选轴的垂直距离平方和。', type: 'tf', answer: 'T', explain: 'min Σd_i² ⇔ max 投影方差 Σc_i²，两种表述等价。' },
            { q: 'T/F：第二主成分是与第一主成分垂直的方向中投影方差最大的方向。', type: 'tf', answer: 'T' },
            { q: '写出数据标准化公式，并说明 PCA 之前为什么要标准化。', type: 'sa', answer: 'z=(x−μ)/σ，使各特征均值 0、标准差 1；不同特征单位与尺度不同，不标准化会被大尺度特征主导。' },
            { q: 'T/F：第 j 个新特征 z_j 是原始特征的线性组合，系数向量满足单位长度（平方和为 1）。', type: 'tf', answer: 'T' },
            { q: '为什么 PCA 之前要 standardization？标准化会改变数据点的相对位置吗？', type: 'sa', answer: '去单位、统一各特征尺度；标准化只把数据平移缩放到均值 0、标准差 1，相对位置不变。' },
            { q: 'sklearn 中如何获得主轴方向和新数据集？', type: 'sa', answer: 'model.components_ 给主轴 [α_j1,…,α_jn]；model.transform(标准化数据) 得到新数据集。' },
          ],
        },
      ],
    },
  ],
};

export default l18;
