import type { Lecture } from '../types';

const l09: Lecture = {
  id: 'l09',
  num: 9,
  titleEn: 'Tuning kNN: CV, Parsimony and Feature Selection',
  titleZh: 'kNN 调参：交叉验证、简约原则与特征选择',
  sections: [
    {
      id: 'l09-s1',
      title: 'kNN 回顾：k 的角色',
      titleEn: 'Role of the Number of Nearest Neighbors',
      blocks: [
        {
          kind: 'p',
          html: '上一讲介绍了 kNN（k-nearest neighbors）分类器。本讲首先讨论如何为它选择超参数 <b>k</b>（number of nearest neighbors）。',
        },
        { kind: 'term', en: 'Number of nearest neighbors k', zh: '最近邻个数 k', note: 'kNN 的超参数，作用类似于多项式回归中的阶数 m：它决定 model complexity。' },
        {
          kind: 'list',
          items: [
            '<b>The larger k, the smaller the model complexity</b>：k 越大，参与投票的邻居越多，决策边界越平滑、越简单（高 bias、低 variance）；k 越小，边界越弯曲复杂（低 bias、高 variance）。',
            '因此调 k 本质上是处理 <b>bias-variance tradeoff</b> 的问题，目标是找到使 MSE 最小（预测精度最优）的 k。',
            'Large bias（underfitting）：模型过于简单，边界随训练数据变化不大，会"迁就"远处的邻居，稀释了真实模式。',
            'Large variance（overfitting）：模型过于复杂，边界对训练数据非常敏感，只匹配紧邻的点，放大了训练数据里随机噪声的影响。',
          ],
        },
        {
          kind: 'formula',
          tex: '\\mathrm{MSE}(\\hat f, f_0) = (\\mathrm{Bias})^2 + \\mathrm{Variance} + \\mathrm{Irreducible\\ Error}',
          explain: 'classification 中 decision boundary 扮演的角色与 regression 中 underlying function 相同；Irreducible Error 来自 measurement noise，任何模型结构都无法降低它。',
        },
        {
          kind: 'figure',
          src: 'knn_boundaries_k.png',
          title: 'k 取不同值时的决策边界',
          caption: 'k = 1 时边界极度曲折（过拟合）；k 增大后边界越来越平滑（模型越来越简单）。',
          guide: '考试常给一张边界图让你判断 k 的大小：边界越"破碎"、每个小区域都围着单个点，k 越小；边界越平滑，k 越大。',
        },
      ],
    },
    {
      id: 'l09-s2',
      title: '用交叉验证选择 k',
      titleEn: 'Tuning k by Cross-Validation',
      blocks: [
        {
          kind: 'steps',
          title: 'r-fold CV 调 k 的流程',
          items: [
            '把 training data 分成 r 份（folds），每份数据量相同，记为 fold 1 … fold r。',
            '对每个候选 k = 1 … k_max：依次把第 m 份当作 validation fold，其余 r−1 份训练 kNN，在验证折上计算 accuracy_val_m(k)。',
            'r-fold CV accuracy = 所有验证折准确率的平均：(1/r) Σ accuracy_val_m(k)。',
            '选择使 r-fold CV accuracy 最大的 k，记为 k_CV。',
          ],
        },
        {
          kind: 'term',
          en: 'LOOCV (Leave-One-Out Cross Validation)',
          zh: '留一交叉验证',
          note: 'r-fold CV 的特例：r = N_train，每次只留 1 个样本做验证，其余全部用于训练。计算量大，但几乎不浪费训练数据。',
        },
        { kind: 'p', html: '<b>sklearn 实现</b>：<code>cross_val_score(knn, X, y, cv=r)</code> 做 r-fold CV；<code>cross_val_score(knn, X, y, cv=LeaveOneOut())</code> 做 LOOCV。' },
        {
          kind: 'term',
          en: 'Principle of Parsimony',
          zh: '简约原则（奥卡姆剃刀）',
          note: 'If two model structures give almost the same CV accuracy, then the simpler one should be chosen!',
        },
        {
          kind: 'p',
          html: '对 kNN：如果有多个 k 给出相同（或几乎相同）的最大 CV accuracy，按 parsimony 应选 <b>较大的 k</b>（model structure 更简单）。但若有其他考虑（如 computational efficiency），也可以选较小的 k——k 越大，预测时计算量越大。',
        },
        {
          kind: 'p',
          html: '<b>Iris 例子（考试数字）</b>：10-fold CV 下 k = 21, 35, 33, 43, 47 都给出相同最大 CV accuracy，按 parsimony 选 <b>k_CV = 47</b>；LOOCV 下 k = 21, 23, 37, 41 并列最大，选 <b>k_CV = 41</b>。注意 r-fold CV 与 LOOCV 选出的 k 不一定相同。',
        },
        {
          kind: 'trap',
          claim: '多个 k 的 CV accuracy 相同时，应该选其中最小的 k，因为小 k 更精确。',
          verdict: 'F',
          explain: '按 principle of parsimony，CV accuracy 相同或相近时应选较大的 k（更简单的模型结构）。只有存在其他考虑（如计算效率）时才会选较小的 k。Assignment 1 判断题原题考点。',
        },
      ],
    },
    {
      id: 'l09-s3',
      title: '特征选择',
      titleEn: 'Feature Selection',
      blocks: [
        {
          kind: 'p',
          html: 'kNN 的 model complexity 由两个因素决定：<b>number of nearest neighbors k</b> 和 <b>number of features n</b>，两者都可以用 CV 方法来调。',
        },
        {
          kind: 'list',
          items: [
            '<b>Pros of more features</b>：Enhanced Information（可能包含有价值的信息）；Increased Discriminative Power（更强的判别能力、能捕捉更复杂的模式）。',
            '<b>Cons of more features</b>：Increased Complexity（模型更难解释）；Computational and Storage Requirements（更多计算与存储开销）。',
            '所以 <b>using more features does NOT always imply better classification</b>——特征多 ≠ 效果好，无关或噪声特征反而有害。',
          ],
        },
        {
          kind: 'term',
          en: 'Scatterplot Matrix (PairPlot)',
          zh: '散点图矩阵',
          note: '对角线是各特征的 histogram；非对角线是两两特征的 scatter plot。用来直观挑选"分得最开"的特征对。',
        },
        {
          kind: 'p',
          html: 'Iris 实验结论：只用 2 个特征时，<b>petal length + petal width</b> 是最好的特征对（scatterplot matrix 中分得最开）；之前用的 sepal length + sepal width 并不是最佳选择。用全部 4 个特征的 test accuracy 也不一定比选对 2 个特征更高——PL+PW 两个特征反而可能取得最好的 test accuracy。',
        },
        {
          kind: 'figure',
          src: 'model_compare_datasets.png',
          title: '不同特征/复杂度下的分类效果差异',
          caption: '特征与模型复杂度选择不当（左列简单、右列复杂）都会带来误判；中间的合理选择边界最贴合真实类别结构。',
          guide: '读图要点：边界过于平直说明 bias 大（特征不够或 k 太大）；边界围着噪声点打圈说明 variance 大（特征噪声多或 k 太小）。',
        },
        {
          kind: 'trap',
          claim: '使用越多的输入特征，分类效果一定越好。',
          verdict: 'F',
          explain: '更多特征有 pros（信息更丰富、判别力更强）也有 cons（复杂度上升、计算存储开销变大）。Iris 例子中仅 2 个特征（PL+PW）就可能超过 4 个特征的 test accuracy。',
        },
      ],
    },
    {
      id: 'l09-s4',
      title: '图像在计算机中的表示与 MNIST',
      titleEn: 'Representation of Images & MNIST with kNN',
      blocks: [
        {
          kind: 'list',
          items: [
            '<b>Gray-scale image</b>：一个 0–255 的整数矩阵，每个元素表示白色的强度（intensity of white）。',
            '<b>Color image</b>：RGB 模型，三个 0–255 的整数矩阵，分别对应 red / green / blue 三个 color channels；每个像素的颜色是一个整数三元组，如 (255, 0, 0) 是纯红。',
          ],
        },
        {
          kind: 'p',
          html: '<b>MNIST</b>：手写数字库，training set 60,000 张、test set 10,000 张，每张是 28×28 的灰度图。用 kNN 分类前需把每张图的矩阵 <b>reshape 成一个 784 维的向量</b>。k=1 时 test accuracy ≈ <b>0.9691</b>。',
        },
        {
          kind: 'trap',
          claim: '彩色图像由 1 个整数矩阵表示，矩阵元素的取值范围是 0–255。',
          verdict: 'F',
          explain: '灰度图才是 1 个矩阵；彩色图有 3 个矩阵（R/G/B 三个 color channels），每个像素的完整颜色是一个三元组。',
        },
      ],
    },
    {
      id: 'l09-s5',
      title: '文本向量化入门',
      titleEn: 'A Brief Introduction to Text Vectorization',
      blocks: [
        { kind: 'p', html: '<b>NLP (Natural Language Processing)</b>：计算机科学与语言学的交叉子领域，让计算机支持并操纵人类语言。应用包括 text classification、speech recognition、natural-language understanding、natural-language generation。因为计算机只理解数值数据，所以必须先把文本转换成数值向量——这个过程叫 <b>text vectorization</b>。' },
        {
          kind: 'term', en: 'Document', zh: '单个文本数据点，例如用户对某产品的一条评论。',
        },
        { kind: 'term', en: 'Corpus', zh: '所有我们关心的 documents 组成的集合。' },
        { kind: 'term', en: 'Text Feature', zh: '每个 unique word 视为一个 text feature；全部 unique words 构成 vocabulary。' },
        {
          kind: 'p',
          html: '例子：corpus = ["love this movie and that movie", "This movie is very very terrible"]，vocabulary = [\'and\', \'is\', \'love\', \'movie\', \'terrible\', \'that\', \'this\', \'very\']（8 个 unique words）。文本特征组成的向量叫 text feature vector，对应的数值向量叫 feature vector / embedding vector。',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<b>Integer Encoding</b>：给每个 token 分配唯一整数 ID（预处理步骤，本身没有向量空间）。',
            '<b>One-hot Encoding</b>：每个 token 映射到一个 sparse vector，除一个位置为 1 外其余全为 0。',
            '两者都简单，常用作更高级方法的预处理/中间步骤；缺点：不反映词频，也不反映词与词之间的关系。',
          ],
        },
        {
          kind: 'trap',
          claim: 'One-hot encoding 可以反映单词出现的频率以及词与词之间的关系。',
          verdict: 'F',
          explain: 'One-hot 向量只有"是哪个词"的信息，没有词频、无语义关系；反映频率需要 Count / TF-IDF 这类 Bag of Words 方法。',
        },
      ],
    },
    {
      id: 'l09-s6',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 9 自测题',
          questions: [
            { q: 'T/F：对 kNN 分类器，k 越大，model complexity 越大。', type: 'tf', answer: 'F', explain: 'k 越大模型越简单（边界越平滑），k 的作用类似回归中的多项式阶数 m。' },
            { q: 'T/F：Principle of parsimony 告诉我们，两个模型 CV accuracy 几乎相同时应选更简单的那个。', type: 'tf', answer: 'T' },
            { q: '多个 k 给出相同的最大 CV accuracy 时，按 parsimony 应选（ ）。', type: 'mcq', options: ['最小的 k', '最大的 k', '任意一个 k', 'k = 1'], answer: '最大的 k', explain: 'k 越大模型结构越简单；若有计算效率等其他顾虑才选较小的 k。' },
            { q: 'T/F：使用更多的输入特征一定能提高分类准确率。', type: 'tf', answer: 'F' },
            { q: 'LOOCV 是什么的特例？简述它与 r-fold CV 的区别。', type: 'sa', answer: 'LOOCV 是 r-fold CV 取 r = N_train 的特例：每次留 1 个样本验证、其余全部训练。它几乎不浪费数据但计算量大；与 r-fold CV 选出的最优 k 可能不同。' },
            { q: '彩色图像在计算机中如何表示？', type: 'sa', answer: 'RGB 模型：3 个取值为 0–255 的整数矩阵（red / green / blue 三个 color channels），每个像素颜色是一个整数三元组。' },
          ],
        },
      ],
    },
  ],
};

export default l09;
