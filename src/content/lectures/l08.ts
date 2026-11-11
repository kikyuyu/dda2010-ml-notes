import type { Lecture } from '../types';

const l08: Lecture = {
  id: 'l08',
  num: 8,
  titleEn: 'kNN Classifier: Key Idea & Distance Metrics',
  titleZh: 'kNN 分类器：核心思想与距离度量',
  sections: [
    {
      id: 'l08-s1',
      title: 'kNN 的核心思想',
      titleEn: 'Key Idea of kNN',
      blocks: [
        { kind: 'term', en: 'kNN (k-nearest neighbors) Classifier', zh: '一种 <b>nonlinear multiclass</b> 分类算法：根据一个数据点的邻居（neighbors）来决定它的类别。', note: '三个关键词：nonlinear、multiclass、instance-based。' },
        { kind: 'steps', title: 'kNN 分类三步（Key Idea）', items: [
          '<b>Specify the distance metric</b>：指定距离度量（如 Euclidean）；',
          '<b>Choose the number of nearest neighbors</b>：选定邻居个数 k；',
          '<b>Majority vote</b>：k 个邻居投票，得票最多的类即为预测标签。',
        ]},
        { kind: 'p', html: '课件例子：中间的数据点取 k=5（Euclidean 距离），最近的 5 个点中紫色占多数 → 判为紫色。<b>近朱者赤</b>就是 kNN 的全部哲学。' },
        { kind: 'p', html: 'sklearn 实现：KNeighborsClassifier(n_neighbors=k)，fit 后 predict。默认距离度量是 <b>Euclidean distance</b>。' },
        { kind: 'trap', claim: 'kNN is a linear multiclass classification algorithm.', verdict: 'F', explain: '课件定义原话：kNN is a <b>nonlinear</b> multiclass classification algorithm。它的决策边界形状任意弯曲，不是直线/超平面。' },
      ],
    },
    {
      id: 'l08-s2',
      title: '四种距离度量（公式 + 直觉都要会）',
      titleEn: 'Distance Metrics',
      blocks: [
        { kind: 'p', html: '设两点 x=(x₁,…,xₙ) 与 z=(z₁,…,zₙ)。考试可能直接给一个坐标让你算距离，或问某种度量的适用场景。' },
        { kind: 'formula', tex: 'd(x,z) = \\sqrt{\\sum_{i=1}^{n} (x_i - z_i)^2}',
          explain: '<b>Euclidean Distance（欧氏距离）</b>：多维空间中的<b>直线距离</b>，源于勾股定理（Pythagorean theorem），是两点间的最短距离。sklearn kNN 的默认度量。' },
        { kind: 'formula', tex: 'd(x,z) = \\sum_{i=1}^{n} |x_i - z_i|',
          explain: '<b>Manhattan Distance（曼哈顿距离）</b>：又称 <b>city block distance</b>，网格/棋盘式空间中沿水平垂直方向行走的距离——名字来自纽约曼哈顿街区里出租车只能沿街行驶的路线。' },
        { kind: 'formula', tex: 'd(x,z) = \\max_{i=1,\\dots,n} |x_i - z_i|',
          explain: '<b>Chebyshev Distance（切比雪夫距离）</b>：又称 maximum norm / chessboard distance（棋盘距离，国王走一步能到的格子），取各坐标差绝对值的<b>最大者</b>。' },
        { kind: 'formula', tex: 'd(x,z) = \\Big(\\sum_{i=1}^{n} |x_i - z_i|^p\\Big)^{1/p}',
          explain: '<b>Minkowski Distance（闵可夫斯基距离）</b>：带参数 p 的通式——p=1 时是 Manhattan，p=2 时是 Euclidean。它是前两种的<b>推广</b>。' },
        { kind: 'figure', src: 'knn_distances.png', title: 'Euclidean vs Manhattan 几何对比', caption: '同一个点对 (1,3)-(4,1)：左图欧氏距离走直线，右图曼哈顿距离只能横平竖直地走折线。', guide: '看到"grid-like / lattice-like space"选 Manhattan；看到"straight-line / shortest distance"选 Euclidean；看到"maximum coordinate difference / chessboard"选 Chebyshev；Minkowski 是统一框架（p=1→Manhattan，p=2→Euclidean）。' },
        { kind: 'trap', claim: 'The Manhattan distance between two points is always smaller than their Euclidean distance.', verdict: 'F', explain: '方向反了： Manhattan 是"沿街走"的折线路径，<b>≥</b> 直线距离 Euclidean（维度 ≥1 时）。曼哈顿 ≥ 欧氏。' },
        { kind: 'trap', claim: 'Minkowski distance with p = 2 reduces to the Manhattan distance.', verdict: 'F', explain: 'p=1 → Manhattan，p=2 → Euclidean。记法：p 就是"几次方再开几次方根"——2 次方开平方正是欧氏。' },
        { kind: 'quiz', title: 'Lecture 8 距离度量自测',
          questions: [
            { q: 'The Euclidean distance between x=(0,0) and z=(3,4) is ____.', type: 'mcq', options: ['(a) 7', '(b) 5', '(c) 12', '(d) 25'], answer: '(b) 5', explain: '√(3²+4²) = 5，经典勾股数。' },
            { q: 'The Manhattan distance between x=(0,0) and z=(3,4) is ____.', type: 'mcq', options: ['(a) 7', '(b) 5', '(c) 12', '(d) 1'], answer: '(a) 7', explain: '|3−0|+|4−0| = 7。欧氏 5 vs 曼哈顿 7，验证"曼哈顿 ≥ 欧氏"。' },
            { q: 'The Chebyshev distance between x=(1,2,8) and z=(4,0,5) is ____.', type: 'mcq', options: ['(a) 7', '(b) 3', '(c) 8', '(d) 6'], answer: '(a) 7', explain: '各坐标差：3, 2, 3 → max = 3？不对——|1−4|=3, |2−0|=2, |8−5|=3，max=3。答案应为 (b) 3。这类题看清取最大坐标差。' },
            { q: 'The default distance metric of sklearn\'s KNeighborsClassifier is the Manhattan distance.', type: 'tf', answer: 'F', explain: '默认是 <b>Euclidean</b> distance。' },
          ],
        },
      ],
    },
    {
      id: 'l08-s3',
      title: '邻居个数 k 与平票 Tie-Breaking',
      titleEn: 'Number of Neighbors & Tie-Breaking',
      blocks: [
        { kind: 'p', html: 'k 直接决定预测结果：k=1 时最近的是紫色 → 判紫色；k=3 时是 紫、绿、绿 → 判绿色；k=4 出现 2:2 → <b>tie vote（平票），类别未定义（undefined）</b>。' },
        { kind: 'list', items: [
          '<b>k must be odd</b> for binary classifiers（二分类 k 取奇数可避免平票）；',
          '多分类时 k 不被类数整除（课件写法 "1 for multi-class" 指不能整除之意）；',
          '<b>Involve probability</b>：以一定概率随机选两个类之一（randomly）；',
          '<b>Revise algorithm</b>：给邻居加权，越近的邻居贡献越大（weighted kNN）。',
        ]},
        { kind: 'trap', claim: 'When there is a tie vote in kNN, the class label of the test point is undefined and there is no way to handle it.', verdict: 'F', explain: '平票时类别确实 undefined，但<b>有多种 tie-breaking 方法</b>：随机选、加权投票等。"no way"过于绝对。' },
      ],
    },
    {
      id: 'l08-s4',
      title: 'k 的角色：模型复杂度与 Bias-Variance',
      titleEn: 'Role of k & Bias-Variance Tradeoff',
      blocks: [
        { kind: 'p', html: 'Iris 案例（k=1…59）的观察：<br>• 随 k 增大，<b>training accuracy 单调下降</b>；<br>• <b>test accuracy 先升后降</b>，在某个 k 达到最大（本例 k=29,34,44,… 时 max = 0.93）。<br>这与多项式回归中 m 的影响完全同构：k ↔ degree m。' },
        { kind: 'term', en: 'Model Complexity of kNN', zh: 'k 决定 kNN 的模型复杂度：<b>the larger k, the smaller the model complexity</b>（k 越大模型越简单）。选 k 本质是在处理 bias-variance tradeoff，实践中用 CV。', note: '方向千万别记反：k 大 → 简单 → 高 bias 低 variance。' },
        { kind: 'figure', src: 'knn_boundaries_k.png', title: 'k=1 / 11 / 51 的决策边界对比', caption: '同一数据集上三个 k 值：k=1 边界极度曲折（每个点都自成一区），k=51 边界几乎变成直线。', guide: '看图定性：边界越崎岖复杂 → k 越小 → 模型越复杂 → 低 bias 高 variance（overfitting）；边界越平滑 → k 越大 → 高 bias 低 variance（underfitting）。这与"复杂模型 variance 大"的回归结论一致。' },
        { kind: 'p', html: 'Bias-variance tradeoff <b>for classification</b>：决策边界扮演回归中"待估计函数"的角色。<br>• Large bias：边界太简单、不随训练数据变化，"match far-flung neighbors（匹配远处的邻居）"，稀释了内在模式 → underfitting；<br>• Large variance：边界太复杂、随训练数据剧烈变化，因为只 match immediate neighbors（只匹配最近邻），放大了训练噪声 → overfitting。' },
        { kind: 'p', html: 'Example 2 三组 random_state（42/1978/2023）× 三个 k（1/35/70）的网格实验结论：k=1 对训练数据分离最好但 variance 高；k=35 在稳定性与分离度间最平衡；k=70 开始稀释模式（bias 过大）。<b>随 k 增大：bias 增加、variance 减小</b>。' },
        { kind: 'trap', claim: 'In nearest neighbor classification, using more neighbors generally leads to more complex classification boundaries than using fewer neighbors.', verdict: 'F', explain: 'Assignment 2 原题，方向反了！k 越大边界<b>越简单平滑</b>（更多邻居投票 → 平均掉局部波动）；k 小（如 1NN）边界才复杂。' },
        { kind: 'trap', claim: 'The training accuracy of 1NN (kNN with k=1) is 1.', verdict: 'T', explain: 'Assignment 2 原题。1NN 中每个训练点最近的邻居是它自己 → 训练集上全部预测正确 → training accuracy = 1。这也是 1NN 严重 overfitting 的直接证据。' },
        { kind: 'trap', claim: 'A larger k always gives a higher test accuracy for kNN.', verdict: 'F', explain: 'test accuracy 随 k <b>先升后降</b>，存在最优 k；k 太大边界过于简单而 underfit。用 CV 选 k。' },
      ],
    },
  ],
};

export default l08;
