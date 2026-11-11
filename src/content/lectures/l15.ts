import type { Lecture } from '../types';

const l15: Lecture = {
  id: 'l15',
  num: 15,
  titleEn: 'A Preamble to Clustering & K-means',
  titleZh: '聚类导论与 K-means 聚类',
  sections: [
    {
      id: 'l15-s1',
      title: '什么是聚类：与分类的本质区别',
      titleEn: 'Difference from Classification',
      blocks: [
        {
          kind: 'p',
          html: '<b>Clustering</b>（Wikipedia）：the task of grouping a set of objects in such a way that objects in the same group (called a cluster) are more similar to each other than to those in other groups。即：<b>组内相似、组间相异</b>。',
        },
        {
          kind: 'compare',
          title: 'Classification vs. Clustering（必考对比）',
          heads: ['', 'Classification', 'Clustering'],
          rows: [
            ['学习类型', 'supervised learning', 'unsupervised learning'],
            ['训练数据', 'requires labeled data', 'does NOT require labeled data'],
            ['目标', 'predict the label of unseen input data', 'find distinct groups / clusters within a dataset without any labeled data'],
          ],
        },
        {
          kind: 'p',
          html: '<b>Motivations</b>：① 把无标签数据分成簇以发现有用结构——customer segmentation（100 万客户分成 20 个簇做定向营销）、disease management（病人按病情分簇）、image segmentation（按像素聚出 tiger/grass/water/sand）；② 实践中标签难以获得——labeling is expensive（医学专家标注）、labeling is time-consuming（ImageNet 100 万张标注图）。',
        },
        {
          kind: 'trap',
          claim: '聚类是监督学习方法，训练时需要 labeled data。',
          verdict: 'F',
          explain: 'Clustering is an unsupervised learning technique：does NOT require labeled data，目标是在无任何标签的数据中找到 distinct groups / clusters。需要标签的是 classification。',
        },
        {
          kind: 'trap',
          claim: '聚类完成后，可以用"预测标签与真实标签之差"来评价聚类结果的好坏。',
          verdict: 'F',
          explain: '聚类用的是 unlabelled data；即使聚类结果相同，聚类给出的标签编号也可能与真实标签不同，因此不能用标签之差作评价指标（要用 Rand Index 这类基于"样本对是否同簇"的指标）。',
        },
        {
          kind: 'figure',
          src: 'cl_vs_classification.png',
          title: '聚类 vs 分类',
          caption: '分类有标签、学的是边界；聚类无标签、学的是数据的自然分组结构。',
          guide: '左图（分类）：点带颜色（标签），目标是画边界。右图（聚类）：点无颜色，目标是按距离远近圈出若干簇。',
        },
      ],
    },
    {
      id: 'l15-s2',
      title: '聚类的两个关键问题',
      titleEn: 'Key Issues & Problem Statement',
      blocks: [
        {
          kind: 'list',
          items: [
            '<b>How to quantify "similarity" or "closeness"</b>？→ 需要一个 <b>distance metric</b>。',
            '<b>How to determine the number of clusters</b>？→ 需要确定簇个数的方法。',
          ],
        },
        {
          kind: 'table',
          title: '常用距离度量（公式要能辨认）',
          header: ['Distance', '公式', '备注'],
          rows: [
            ['Euclidean', '√(Σ(xᵢ−zᵢ)²)', 'K-means 默认使用'],
            ['Manhattan', 'Σ|xᵢ−zᵢ|', '城市街区距离'],
            ['Chebyshev', 'maxᵢ |xᵢ−zᵢ|', '取坐标差的最大值'],
            ['Minkowski', '(Σ|xᵢ−zᵢ|ᵖ)^(1/p)', '前三者的推广（p=2 → Euclidean；p=1 → Manhattan）'],
          ],
        },
        {
          kind: 'steps',
          title: '簇个数的确定方式（按算法不同而不同）',
          items: [
            '需要<b>预先给定</b>：如 <b>K-means clustering</b>（K 必须事先指定）；',
            '<b>不需要预先给定</b>：如 <b>hierarchical clustering</b>——可以从聚类结果中得到任意想要的簇数；',
            '<b>可以从数据中学习</b>：如 Bayesian nonparametric methods。',
          ],
        },
        {
          kind: 'p',
          html: '<b>Problem statement</b>：给定数据点 {x₁,…,x_N} 和距离度量，把它们分成 K 个簇，使同一簇内的数据点彼此比与其他簇的点更相似。注意：同一批数据可以合理地聚成 2、3、4 个簇——<b>聚类结果不唯一</b>，这也是不能用标签差评价的原因之一。',
        },
      ],
    },
    {
      id: 'l15-s3',
      title: '聚类算法分类与评价指标',
      titleEn: 'Categories of Clustering Algorithms & Rand Index',
      blocks: [
        {
          kind: 'list',
          items: [
            '<b>Centroid-based</b>：K-means、K-medoids 及其变体；',
            '<b>Connectivity-based</b>：hierarchical clustering；',
            '<b>Distribution-based</b> / <b>Density-based</b> / <b>Grid-based</b> clustering；',
            '<b>Bayesian nonparametric</b> clustering。',
          ],
        },
        {
          kind: 'formula',
          tex: '\\text{Rand Index} = \\frac{SS + DD}{N(N-1)/2}',
          explain: 'SS：在 T 和 P 两种划分中都处于<b>同一簇</b>的样本对数；DD：在两种划分中都处于<b>不同簇</b>的样本对数；分母是全部无序样本对数 C(N,2)。取值 [0,1]，越大越相似：0 = 完全不认同，1 = 完全一致。sklearn：<code>rand_score(T, P)</code>。',
        },
        {
          kind: 'p',
          html: '<b>手算例子（可能考）</b>：T = {{A,B},{C,D},{E,F}}，P = {{A,B,C},{D,E,F}}。6 个样本共 15 对：SS = 2（{A,B}、{E,F}）；DD = 8（{A,D},{A,E},{A,F},{B,D},{B,E},{B,F},{C,E},{C,F}）。Rand Index = (2+8)/15 ≈ <b>0.667</b>。',
        },
        {
          kind: 'trap',
          claim: 'Rand Index 的取值范围是 [−1, 1]，越大表示两个聚类结果越相似。',
          verdict: 'F',
          explain: 'Rand Index 取值 [0, 1]（不是 [−1,1]）：0 表示对任何样本对的划分都不认同，1 表示完全一致。',
        },
      ],
    },
    {
      id: 'l15-s4',
      title: 'K-means 聚类',
      titleEn: 'K-means Clustering',
      blocks: [
        {
          kind: 'p',
          html: '<b>Centroid</b>：N 个数据点的均值向量 c = (x₁+…+x_N)/N。Centroid-based clustering 中，簇由数据点与<b>簇中心的接近程度</b>形成。K-means 的回答：① similarity 用 <b>Euclidean distance</b>；② 簇数 K <b>必须事先给定</b>。',
        },
        {
          kind: 'formula',
          tex: '\\min_{P}\\ \\sum_{k=1}^{K} \\sum_{i=1}^{n_k} \\| x_{k,i} - c_k \\|^2, \\quad c_k = \\frac{1}{n_k} \\sum_{i=1}^{n_k} x_{k,i}',
          explain: '优化目标：最小化 <b>within-cluster sum of squares (WCSS)</b>——所有点到其簇中心的平方距离之和。c_k 是第 k 簇的 centroid（簇内点的均值）。',
        },
        {
          kind: 'steps',
          title: 'K-means 六步流程（考试按步骤复述）',
          items: [
            '给定簇数 K；',
            '<b>Initialization</b>：随机选 K 个数据点作为初始 centroid；',
            '计算所有点到 K 个 centroid 的距离；',
            '<b>Assignment</b>：把每个点分配给最近的 centroid（更新点的颜色/标签）；',
            '<b>Update</b>：重新计算每个簇的 centroid（均值）；',
            '重复 3–5，直到 <b>centroids 和划分不再变化</b>为止。',
          ],
        },
        {
          kind: 'figure',
          src: 'cl_kmeans_steps.png',
          title: 'K-means 迭代过程',
          caption: '方形是 centroid、圆点是样本：初始化 → 分配（点按最近 centroid 变色）→ 更新（centroid 移到簇均值处）→ 再分配 → 再更新，直到收敛。',
          guide: '考试画图题常要求画出一次 assignment 和一次 update 后的样子：①分配步只改点的颜色；②更新步 centroid 移到同色点的几何中心；③收敛判断：分配不再变化。',
        },
        {
          kind: 'p',
          html: 'sklearn：<code>KMeans(n_clusters=K, random_state=0)</code>（random_state 控制初始 centroid 的随机选择），<code>model.predict(data)</code> 输出簇标签。Iris 上 K=3 时 Rand index ≈ <b>0.82</b>。',
        },
        {
          kind: 'trap',
          claim: 'K-means 聚类时，簇数 K 可以从数据中学习得到，不需要事先指定。',
          verdict: 'F',
          explain: 'K-means 要求 K <b>事先给定</b>（predetermined）。不需要预先给定簇数的是 hierarchical clustering 等方法。',
        },
        {
          kind: 'trap',
          claim: 'K-means 使用 Manhattan distance 作为相似度度量。',
          verdict: 'F',
          explain: 'K-means 使用 <b>Euclidean distance</b> 度量 similarity/closeness，目标是最小化 WCSS（平方距离和）。',
        },
      ],
    },
    {
      id: 'l15-s5',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 15 自测题',
          questions: [
            { q: 'T/F：聚类是无监督学习，不需要 labeled data。', type: 'tf', answer: 'T' },
            { q: 'K-means 聚类中，相似度用（ ）度量，簇数 K 需要（ ）。', type: 'mcq', options: ['Euclidean distance；事先给定', 'Manhattan distance；从数据学习', 'Euclidean distance；从数据学习', 'Chebyshev distance；事先给定'], answer: 'Euclidean distance；事先给定' },
            { q: '写出 K-means 的优化目标（WCSS）并解释 centroid 的定义。', type: 'sa', answer: 'min ΣₖΣᵢ‖x_{k,i}−c_k‖²（within-cluster sum of squares）；c_k 是第 k 簇内所有点的均值向量。' },
            { q: 'T/F：Rand Index 越小，两个聚类结果越相似。', type: 'tf', answer: 'F', explain: 'Rand Index ∈ [0,1]，越大越相似，1 表示完全一致。' },
            { q: 'T = {{A,B},{C,D},{E,F}}，P = {{A,B,C},{D,E,F}}，计算 Rand Index。', type: 'sa', answer: '总对数 C(6,2)=15；SS=2（{A,B},{E,F}），DD=8；Rand Index = 10/15 ≈ 0.667。' },
            { q: '层次聚类（hierarchical clustering）与 K-means 在"确定簇数"上的区别是？', type: 'sa', answer: 'K-means 必须事先给定 K；hierarchical clustering 不需要——任意想要的簇数都可以从聚类结果中得到。' },
            { q: 'T/F：给定同一批数据，只存在唯一一种"正确"的聚类结果。', type: 'tf', answer: 'F', explain: '同一数据可以合理地聚成 2、3、4 个簇，聚类结果不唯一，这也是不能用标签差评价聚类的原因。' },
          ],
        },
      ],
    },
  ],
};

export default l15;
