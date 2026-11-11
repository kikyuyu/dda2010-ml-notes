import type { Lecture } from '../types';

const l01: Lecture = {
  id: 'l01',
  num: 1,
  titleEn: 'Introduction: AI, ML, DL and Typical ML Problems',
  titleZh: '课程导论：AI / ML / DL 与机器学习典型任务',
  sections: [
    {
      id: 'l01-s1',
      title: 'AI、ML、DL 的定义与关系',
      titleEn: 'What are AI, ML and DL?',
      blocks: [
        { kind: 'p', html: '本讲先厘清三个层层包含的概念。<b>专业术语全部保留英文</b>，考试判断题经常直接考定义本身。' },
        { kind: 'term', en: 'Artificial Intelligence (AI)', zh: '人工智能：机器执行通常与人类智能相关的任务（如学习、问题求解）的能力。', note: 'Wikipedia 定义，范围最大。' },
        { kind: 'term', en: 'Machine Learning (ML)', zh: '机器学习：AI 与计算机科学的分支，使用<b>数据和算法</b>来模仿人类学习的方式，逐步提高预测精度。', note: 'IBM 定义关键词：data and algorithms、gradually improving its accuracy。' },
        { kind: 'term', en: 'Deep Learning (DL)', zh: '深度学习：基于 artificial neural networks with representation learning 的机器学习方法家族；"deep" 指网络使用<b>多个层（multiple layers）</b>。', note: 'DL 是 ML 的子集，不是并列关系。' },
        { kind: 'p', html: '<span class="en-t">Relation:</span> AI ⊃ ML ⊃ DL。DL 与 ML 是<b>包含</b>关系，不是并列关系；ML 是 AI 的一个分支。' },
        { kind: 'p', html: '历史考点：<span class="en-t">The term "machine learning" was coined in 1959 by Arthur Lee Samuel</span>，他是 IBM 员工，以跳棋（checkers）研究闻名。' },
        {
          kind: 'trap',
          claim: 'Deep learning and machine learning are two parallel / independent branches of AI.',
          verdict: 'F',
          explain: '<b>DL is part of ML</b>（基于人工神经网络与 representation learning），ML 又是 AI 的分支。三者是层层包含关系 AI ⊃ ML ⊃ DL，不是并列关系。',
        },
        {
          kind: 'trap',
          claim: 'The term machine learning was coined by Arthur Lee Samuel in 1959.',
          verdict: 'T',
          explain: 'Samuel 是 IBM 员工，1959 年发表 "Some Studies In Machine Learning Using The Game Of Checkers"。细节题，记住 <b>1959 + Samuel + IBM</b>。',
        },
        {
          kind: 'quiz',
          title: 'Lecture 1 自测',
          questions: [
            { q: 'The adjective "deep" in deep learning refers to the use of multiple layers in the network.', type: 'tf', answer: 'T', explain: 'DL = 基于多层人工神经网络的机器学习方法，"deep" 即多层。' },
            { q: 'Which of the following is an example of a classification problem?', type: 'mcq', options: ['(a) Predicting the price of a house based on its features', '(b) Grouping customers by their shopping behavior without labels', '(c) Predicting whether an email is spam or not', '(d) Compressing images to save storage'], answer: '(c)', explain: '(a) 是回归（连续值）；(b) 是聚类（无标签）；(d) 是降维。(c) 预测离散标签 → classification。' },
            { q: 'Machine learning algorithms improve their performance as the number of available samples increases.', type: 'tf', answer: 'T', explain: 'MathWorks 定义原话：adaptively improve performance as the number of samples increases。' },
          ],
        },
      ],
    },
    {
      id: 'l01-s2',
      title: '监督学习与无监督学习',
      titleEn: 'Supervised vs Unsupervised Learning',
      blocks: [
        { kind: 'term', en: 'Supervised Learning', zh: '监督学习：使用 <b>labeled datasets（带标签数据）</b> 训练算法，以准确预测结果或分类数据。', note: '两大任务：regression、classification。' },
        { kind: 'term', en: 'Unsupervised Learning', zh: '无监督学习：对 <b>unlabeled datasets（无标签数据）</b> 进行分组或发现隐藏模式。', note: '两大任务：clustering、dimensionality reduction。' },
        {
          kind: 'table',
          title: '本课程的任务地图（必背）',
          header: ['类别', '任务', '数据', '输出'],
          rows: [
            ['Supervised', 'Regression', 'labeled', '连续值 y ∈ ℝ'],
            ['Supervised', 'Classification', 'labeled', '离散标签 y ∈ {1,…,K}'],
            ['Unsupervised', 'Clustering', 'unlabeled', '样本的分组（cluster）'],
            ['Unsupervised', 'Dimensionality Reduction', 'unlabeled', '低维表示（新特征）'],
            ['（本课程后半）', 'Artificial Neural Networks / Deep Learning', '—', '可解决上述多种问题'],
          ],
        },
        { kind: 'p', html: '注意：课件明确说 <span class="en-t">deep learning can be used to solve all these three kinds of problems</span>（regression / classification / clustering 类问题 DL 都能做），所以神经网络不是与四大任务并列的"第五类问题"，而是一种<b>方法</b>。' },
        {
          kind: 'trap',
          claim: 'Clustering is a typical supervised learning task because it also produces groups of data.',
          verdict: 'F',
          explain: '聚类是 <b>unsupervised learning</b>，处理的是 unlabeled data。有没有"标签"才是区分标准，不是看输出是不是分组。',
        },
      ],
    },
    {
      id: 'l01-s3',
      title: '回归：Function Estimation',
      titleEn: 'Regression as Function Estimation',
      blocks: [
        { kind: 'term', en: 'Regression Analysis', zh: '回归分析：考察并量化 <b>dependent/output variable（因变量，记 y）</b> 与一个或多个 <b>independent/input variables（自变量，记 x）</b> 之间关系的统计方法。' },
        { kind: 'term', en: 'Function Estimation', zh: '函数估计：从 N 个带噪声的观测 y_i = f⁰(x_i) + e_i 中估计真实函数 f⁰，使估计 f̂ 对 unseen input 尽可能接近 f⁰(x)。' },
        {
          kind: 'formula',
          tex: 'y_i = f^0(x_i) + e_i, \\quad i = 1, \\dots, N',
          explain: '<b>f⁰</b>：true function（真实函数）；<b>x_i</b>：input data / feature；<b>y_i</b>：measured output（观测值）；<b>e_i</b>：measurement noise（测量噪声）。回归的本质：噪声中恢复信号。',
        },
        { kind: 'p', html: '课件示例：蓝色曲线是 true function f⁰(x)=sin(x)，红点是 noisy data（50 个带噪声采样），绿色曲线是 Gaussian process regression 估计及 95% 置信区间。考试可能让你看图说明"哪些曲线/点分别是什么"。' },
        { kind: 'figure', src: 'reg_poly_degrees.png', title: '回归 = 在噪声数据中拟合函数', caption: '同一批训练数据（橙色点）下，不同复杂度的模型（多项式阶数 1 / 4 / 14）拟合出的曲线差别巨大。', guide: '横轴是输入 x，纵轴是输出 y。阶数 1 太简单（学不到 sin 的形状，underfitting），阶数 14 把噪声也学进去了（overfitting），阶数 4 最接近真实规律。模型复杂度是回归的核心矛盾。' },
        {
          kind: 'trap',
          claim: 'In function estimation, the measured value y_i equals the true function value f⁰(x_i) exactly.',
          verdict: 'F',
          explain: '观测值带有 <b>measurement noise</b>：y_i = f⁰(x_i) + e_i。只要看到"观测 = 真值"这类说法就是错的。',
        },
      ],
    },
    {
      id: 'l01-s4',
      title: '分类 Classification',
      titleEn: 'Classification',
      blocks: [
        { kind: 'term', en: 'Classification', zh: '分类：一种监督学习，算法从 <b>labeled examples</b> 中学习，对给定的新数据预测其 label（标签）。', note: '输出是离散类别，不是连续数值。' },
        { kind: 'list', items: [
          '<b>Biology & Medicine</b>：根据症状与检查结果辅助诊断，如从 CT 切片判断是否确诊新冠。',
          '<b>Social Science</b>：sentiment analysis（正/负/中性情绪分类）、personality types 预测。',
          '<b>Management & Economics</b>：market segmentation、financial risk assessment（低/中/高风险分级）。',
        ]},
        { kind: 'p', html: '识别题型：题干出现 "predicting the label / category / whether ... or not" 就是 classification；出现 "predicting the price / amount" 是 regression。' },
      ],
    },
    {
      id: 'l01-s5',
      title: '聚类 Clustering 与分类的本质区别',
      titleEn: 'Clustering: Labeled vs Unlabeled',
      blocks: [
        { kind: 'term', en: 'Clustering', zh: '聚类：把一组对象分组，使同组（cluster）内对象之间的相似性高于与其他组对象的相似性。', note: 'Wikipedia 定义，无监督任务。' },
        { kind: 'p', html: '<span class="en-t">Difference from Classification: Labeled vs Unlabeled Data.</span> 分类的训练数据带标签；聚类面对的是 unlabeled data——<b>Labelling is expensive and time-consuming</b>（打标签又贵又慢），这正是需要聚类的现实原因。' },
        { kind: 'figure', src: 'cl_vs_classification.png', title: 'Classification vs Clustering', caption: '左：聚类算法自己"发现"分组结构；右：分类依赖给定标签学习决策边界。', guide: '左图的颜色是 K-means 自己算出来的，没有任何标签输入；右图的颜色（标签）是训练数据里本来就给的。判断题看到 "clustering predicts the label of unseen data" 必错——那是 classification 的目标。' },
        { kind: 'list', items: [
          '<b>Management & Economics</b>：customer segmentation / target market。',
          '<b>Medicine</b>：disease management，按病情把病人分组。',
          '<b>Image Processing</b>：image segmentation，分离图像中的物体。',
        ]},
        {
          kind: 'trap',
          claim: 'The goal of clustering is to predict the label of unseen input data.',
          verdict: 'F',
          explain: '这是 Assignment 3 原题！预测 unseen data 的 label 是 <b>classification</b> 的目标；clustering 是在无标签数据上发现分组结构，不存在"预测标签"。',
        },
      ],
    },
    {
      id: 'l01-s6',
      title: '降维 Dimensionality Reduction',
      titleEn: 'Dimensionality Reduction',
      blocks: [
        { kind: 'term', en: 'Dimensionality Reduction', zh: '降维：把数据从高维空间变换到低维空间，使低维表示保留原数据的某些有意义性质，理想情况下接近其 intrinsic dimension（内在维度）。' },
        { kind: 'p', html: '课件例子：三维空间中的数据可能接近一条直线 (A)、一个圆周 (B) 或一条抛物线 (C)——三种情况的 intrinsic dimensionality 都等于 <b>one</b>。这是"内在维度"概念的经典考法。' },
        { kind: 'list', items: [
          '<b>Removal of Overlapped / Redundant Features</b>：如描述葡萄酒的多个特征可能相互关联（酒龄影响颜色和烈度），冗余特征可以去掉。',
          '<b>Data Visualization</b>：把高维数据投影到 2 或 3 维，损失少量信息即可可视化。',
          '<b>Data Compression</b>：降低存储成本与计算复杂度，如 image compression。',
        ]},
        { kind: 'term', en: 'Feature Extraction', zh: '特征提取：通过变换构造出少量新特征来表示数据（PCA 就是典型方法），区别于从原特征中挑子集的 feature selection。', note: 'Assignment 3 原题考点：PCA is a feature extraction method。' },
      ],
    },
    {
      id: 'l01-s7',
      title: '人工神经网络与本课程定位',
      titleEn: 'ANN & What is "Applied ML"',
      blocks: [
        { kind: 'term', en: 'Artificial Neural Network (ANN)', zh: '人工神经网络：由人工神经元（artificial neurons / nodes）组成的网络，广泛用于求解 AI 问题。应用：intelligent chatbot、self-driving car 等。' },
        { kind: 'p', html: '本课程定位（Applied ML）：<b>不深入</b>数学、优化算法与理论性质，而是 (1) 介绍 regression、classification、clustering、dimensionality reduction 与 neural networks 的基本方法；(2) 训练用 <b>AI-assisted programming</b> 和 Python 机器学习工具箱解决应用问题。Python 在这里被比喻为 <span class="en-t">"an Advanced Calculator for Machine Learning"</span>——只需能读懂示例代码并做小修改。' },
        { kind: 'table', title: 'Assessment Scheme（了解即可）', header: ['Component', 'Weight'], rows: [
          ['Assignments', '32%'], ['Group Projects', '38%'], ['Final Exam', '30%'],
        ]},
        { kind: 'p', html: '课程为 <b>non-STEM students</b> 设计，默认学员没学过 Calculus / Linear Algebra / Optimization / Probability / Programming——所以考试重概念理解、轻推导计算，与本站策略一致。' },
        {
          kind: 'quiz',
          title: 'Lecture 1 综合自测',
          questions: [
            { q: 'The intrinsic dimensionality of data lying close to a circle in 3D space is ____.', type: 'mcq', options: ['(a) 3', '(b) 2', '(c) 1', '(d) 0'], answer: '(c) 1', explain: '圆周是一维流形，内在维度为 1（直线、圆周、抛物线三个例子的 intrinsic dimension 都是 one）。' },
            { q: 'Why is clustering useful in practice even though classification also groups data?', type: 'sa', answer: 'Because labelling data is expensive and time-consuming; clustering works directly on unlabeled data to discover group structures.', explain: '答出两点即满分：① 打标签昂贵耗时；② 聚类处理 unlabeled data、发现隐藏分组。' },
            { q: 'Supervised learning can only be used for classification problems.', type: 'tf', answer: 'F', explain: 'Supervised learning 包括 regression 和 classification 两类任务。' },
          ],
        },
      ],
    },
  ],
};

export default l01;
