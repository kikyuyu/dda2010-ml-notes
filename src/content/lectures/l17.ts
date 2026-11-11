import type { Lecture } from '../types';

const l17: Lecture = {
  id: 'l17',
  num: 17,
  titleEn: 'Agglomerative Clustering Summary & Dimensionality Reduction',
  titleZh: '层次聚类小结与降维导论',
  sections: [
    {
      id: 'l17-s1',
      title: 'Agglomerative 聚类：定簇数与实现',
      titleEn: 'Determine the Number of Clusters & Python',
      blocks: [
        {
          kind: 'p',
          html: '层次聚类<b>不需要事先给定簇数</b>：在 dendrogram 上<b>用水平线切在想要的高度</b>，得到的每个连通部分就是一个簇——<b>the number of clusters is obtained by cutting the dendrogram at the desired level</b>。',
        },
        {
          kind: 'steps',
          title: 'Python 两步走',
          items: [
            '用 scipy 画 dendrogram：<code>linkage(data, method=\'single\'/\'complete\'/\'average\'/\'centroid\', metric=\'euclidean\')</code> → <code>dendrogram(linkage_data)</code>；',
            '根据 dendrogram 选定 k 后用 sklearn 聚类：<code>AgglomerativeClustering(n_clusters=k, metric=\'euclidean\', linkage=\'single\')</code>。',
          ],
        },
        {
          kind: 'p',
          html: '<b>Iris 结果</b>：average linkage + 3 簇，Rand index = <b>0.76</b>；complete linkage + 4 簇，Rand index = <b>0.70</b>。<b>不同 linkage 与不同切法会给出不同结果</b>。',
        },
      ],
    },
    {
      id: 'l17-s2',
      title: 'Agglomerative 的 Pros and Cons',
      titleEn: 'Pros and Cons of Agglomerative Clustering',
      blocks: [
        {
          kind: 'table',
          title: 'Agglomerative clustering 优缺点',
          header: ['Pros', 'Cons'],
          rows: [
            ['easy to understand and visualize（dendrogram 直观）', 'no mathematical objective function is directly minimized（没有直接最小化的数学目标函数）'],
            ['the prior information on the number of clusters is not required（无需预先知道簇数）', '—'],
            ['any desired number of clusters can be obtained by cutting the dendrogram at a proper level', '—'],
          ],
        },
        {
          kind: 'trap',
          claim: 'Agglomerative clustering 通过最小化 WCSS 这个数学目标函数来完成聚类。',
          verdict: 'F',
          explain: '这正是它的 cons 之一：no mathematical objective function is directly minimized。它靠"最近就合并"的贪心规则 + dendrogram 切层定簇数。',
        },
      ],
    },
    {
      id: 'l17-s3',
      title: '降维：动机',
      titleEn: 'Dimensionality Reduction: A Preamble',
      blocks: [
        {
          kind: 'term',
          en: 'Dimensionality reduction', zh: '降维',
          note: '把数据从高维空间变换到低维空间，使低维表示保留原始数据的某些 meaningful properties， ideally close to its intrinsic dimension（内在维度）。',
        },
        {
          kind: 'p',
          html: '例子：3D 空间中的数据可能贴近一条直线 (A)、"∞"形环线 (B) 或套索形环线 (C)——三种情况 <b>intrinsic dimensionality 都等于 1</b>。',
        },
        {
          kind: 'steps',
          title: '四大 Motivations（简答题模板）',
          items: [
            '<b>Curse of dimensionality</b>：维度升高时空间体积急剧膨胀，数据变得稀疏；为获得可靠结果，所需数据量随维度<b>指数增长</b>。',
            '<b>Removal of redundant features</b>：有些特征相互重叠、冗余（如酒的年龄影响颜色和酒精度）。',
            '<b>Data visualization</b>：人类只擅长看 2D/部分 3D；降维可用少量信息损失把高维数据投影到 2/3 维来可视化。',
            '<b>Data compression</b>：保留最显著特征的同时降低存储与计算开销（如图像压缩）。',
            '另外还可作为 regression / classification / clustering 的 <b>intermediate step</b>，便利后续分析。',
          ],
        },
        {
          kind: 'steps',
          title: '降维方法分类（考试常考归类题）',
          items: [
            '按变换是否线性：<b>linear</b>（如 PCA）vs <b>nonlinear</b>（如 kernel PCA）；',
            '按是否构造新特征：<b>feature selection</b>（选原始特征的子集，如 LASSO）vs <b>feature extraction</b>（从原始数据提取新特征，如 <b>PCA</b>、kernel PCA、LDA、GDA）。',
            '本课学两种：<b>PCA</b> 和 <b>kernel PCA</b>。',
          ],
        },
        {
          kind: 'trap',
          claim: 'PCA 是一种 feature selection 方法，它从原始特征中选出一个子集。',
          verdict: 'F',
          explain: 'PCA 是 <b>feature extraction</b>：它构造原始特征的 linear combination 作为<b>新特征</b>（principal components），而不是选原始特征的子集。feature selection 的例子是 LASSO。',
        },
      ],
    },
    {
      id: 'l17-s4',
      title: 'PCA 铺垫：方差与新坐标系',
      titleEn: 'A Preamble to PCA',
      blocks: [
        {
          kind: 'p',
          html: '<b>PCA (Principal Component Analysis)</b>：通过寻找一组<b>少于原始特征数的新特征</b>，在保持数据集 variation 的前提下降低维度。即 z_i = [z_i1,…,z_im]，m ≪ n，且新数据集 <b>preserves the variation of the original dataset as much as possible</b>。',
        },
        {
          kind: 'p',
          html: '几何视角：原坐标系 (x₁, x₂) 中旋转出两条新轴 PC1、PC2，对应两个新特征 √2/2·x₁ − √2/2·x₂ 与 √2/2·x₁ + √2/2·x₂——这就是 <b>linear combination of features</b>（α₁x₁+…+α_nx_n，数学家叫它 cocktail recipe）。',
        },
        {
          kind: 'p',
          html: '<b>引例</b>：19 个两特征数据点，若只保留一个特征，选 x₁ 还是 x₂？选 <b>x₁</b>——因为它保留了数据集的更多 variation。用 <b>variance（方差）</b> 来量化：variance is a measure of the dispersion or spread out of the data points with respect to their mean。x₁ 的方差远大于 x₂，所以选 x₁。',
        },
        {
          kind: 'term', en: 'Variance', zh: '方差',
          note: '数据点相对其均值的分散程度（dispersion / spread out）的度量。PCA 选方差大的方向保留更多信息。',
        },
        {
          kind: 'figure',
          src: 'pca_projection.png',
          title: 'PCA 的本质：找方差最大的方向投影',
          caption: '左：2D 数据在两个候选方向上的投影；右：沿 PC1 投影后方差最大、信息保留最多，垂直方向（PC2 方向）的信息被丢弃。',
          guide: '考试看图：①数据呈椭圆分布时，PCA 第一主成分是长轴方向；②往方差大的方向投影，点分得越开、保留信息越多；③重建误差 = 点到投影直线的垂直距离平方和。',
        },
      ],
    },
    {
      id: 'l17-s5',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 17 自测题',
          questions: [
            { q: '层次聚类如何确定簇数？', type: 'sa', answer: '无需预先给定：在 dendrogram 上用水平线切在所需高度，每个连通部分就是一个簇。' },
            { q: 'T/F：Agglomerative clustering 有一个直接被最小化的数学目标函数。', type: 'tf', answer: 'F', explain: '这是它的 cons：no mathematical objective function is directly minimized。' },
            { q: '写出 curse of dimensionality 的含义。', type: 'sa', answer: '维度增加时空间体积急剧膨胀、数据变稀疏；为获得可靠结果所需数据量随维度指数增长。' },
            { q: 'PCA 属于（ ）。', type: 'mcq', options: ['feature selection，线性方法', 'feature extraction，线性方法', 'feature extraction，非线性方法', 'feature selection，非线性方法'], answer: 'feature extraction，线性方法' },
            { q: 'T/F：PCA 保留的是数据集 variance 最大的方向。', type: 'tf', answer: 'T' },
            { q: '降维的四大 motivation 是？', type: 'sa', answer: 'curse of dimensionality；removal of redundant features；data visualization；data compression（还可作为其他分析的 intermediate step）。' },
          ],
        },
      ],
    },
  ],
};

export default l17;
