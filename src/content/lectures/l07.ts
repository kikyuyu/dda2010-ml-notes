import type { Lecture } from '../types';

const l07: Lecture = {
  id: 'l07',
  num: 7,
  titleEn: 'Concluding Regression & Preamble of Classification',
  titleZh: '回归小结与分类入门：决策边界、分类器类型',
  sections: [
    {
      id: 'l07-s1',
      title: '回归的 Pros and Cons（名词解释素材）',
      titleEn: 'Pros & Cons of Linear Regression',
      blocks: [
        { kind: 'list', ordered: true, items: [
          '<b>Pros — Simplicity</b>：模型结构简单直接（simple and straightforward）；',
          '<b>Pros — Interpretability</b>：每个系数的符号和大小清楚地表明对应输入变量的重要性；',
          '<b>Cons — Limited complexity</b>：假设输入输出之间是线性关系，能表达的复杂程度有限。',
        ]},
        { kind: 'p', html: '解释题模板：问"为什么需要非线性模型/更复杂的分类器？"——答 limited complexity：linear regression assumes linear relation between input and output，无法刻画非线性关系。' },
      ],
    },
    {
      id: 'l07-s2',
      title: '分类问题及其关键要素',
      titleEn: 'Key Components of Classification',
      blocks: [
        { kind: 'p', html: '分类的九大要素：Data set、Data split、Model structure、Parameter estimation、<b>Decision boundary</b>、Prediction、Model evaluation、Model structure selection。与回归相比<b>多了 Decision Boundary</b>，评估指标也从 MSE/R² 换成 Accuracy。' },
        { kind: 'formula', tex: '\\{ (x_i, y_i)\\}_{i=1}^{N}, \\qquad x_i = [x_{i1}, \\dots, x_{in}], \\quad y_i \\in \\{0, 1, \\dots, K-1\\}',
          explain: '分类数据集：x_i 是含 n 个特征的 feature vector，y_i 是 class label（类别标签）。与回归数据集的形式差异只在 y 的含义。' },
        { kind: 'term', en: 'Binary Classification', zh: '二分类：把数据分到两个互斥（mutually exclusive）的类别中。' },
        { kind: 'term', en: 'Multiclass Classification', zh: '多分类：把数据分到两个以上的类别中。' },
        { kind: 'compare', title: '两种标签编码方案 Encoding Scheme（K 个类，K ≥ 2）', heads: ['方案', '形式', '例（K=4，第 2 类）'], rows: [
          ['<b>Integer encoding</b>', 'y ∈ {0,1,…,K−1}，y=j 表示属于第 (j+1) 类', 'y = 1'],
          ['<b>One-hot encoding</b>', 'y 是长度 K 的向量，所属类位置为 1，其余为 0', 'y = [0, 1, 0, 0]ᵀ'],
        ]},
      ],
    },
    {
      id: 'l07-s3',
      title: '模型结构 y=f(x,θ) 与决策边界',
      titleEn: 'Model Structure & Decision Boundary',
      blocks: [
        { kind: 'term', en: 'Classifier', zh: '分类器：y = f(x, θ)，y 是 class label，x 是输入，θ 是待估计的未知参数。训练分类器 = 估计 θ（同样用 θ̂ = argmin L(θ)，最简单的是 MSE loss）。' },
        { kind: 'term', en: 'Decision Boundary', zh: '决策边界：分隔不同类别的分界曲线或超曲面，决定数据点如何按特征被分配到各类。', note: '不同分类器 → 不同决策边界 → 不同预测结果；模型结构选择的本质就是选边界形状。' },
        { kind: 'term', en: 'Linear Decision Boundary / Linear Classifier', zh: '线性决策边界：2D 中是直线、3D 及以上是超平面（hyperplane）。线性分类器：y = f(w·x + b)，θ = [b, w]，b 是 bias term，w 是 weight vector。' },
        { kind: 'term', en: 'Nonlinear Decision Boundary / Nonlinear Classifier', zh: '非线性决策边界：曲线/超曲面，可有弯曲、不规则轮廓等复杂形状。非线性分类器：y = f(x, θ)，决策边界不是直线/超平面。' },
        { kind: 'figure', src: 'svm_kernels.png', title: '线性 vs 非线性决策边界', caption: '上排数据：线性核只能画直线（左），RBF/多项式核可以画弯曲的边界（中、右）。下排环形数据：线性核完全失败。', guide: '读图题判断技巧：边界是一条直线 → linear classifier；边界是曲线/环绕形状 → nonlinear classifier。同一种算法换 kernel 可以在两类之间切换（如 SVM）。' },
        { kind: 'trap', claim: 'A linear classifier can produce a curved decision boundary if it is trained well enough.', verdict: 'F', explain: '线性分类器的定义就限定边界是直线/超平面（w·x+b）；曲线边界只能来自非线性分类器（换 kernel、换算法）。训练再充分也变不出曲线。' },
      ],
    },
    {
      id: 'l07-s4',
      title: '分类器的两大阵营（sklearn 清单）',
      titleEn: 'Types of Classifiers',
      blocks: [
        { kind: 'compare', title: 'Linear vs Nonlinear Classifiers in scikit-learn（按课件清单背诵）', heads: ['Linear Classifiers', 'Nonlinear Classifiers', ''], rows: [
          ['Logistic Regression', 'Decision Trees', ''],
          ['SVM with linear kernels', 'Random Forests', ''],
          ['Linear Discriminant Analysis (LDA)', 'k-Nearest Neighbours (kNN)', ''],
          ['Perceptron', 'SVM with non-linear kernels', ''],
          ['…', 'Naive Bayes / Neural Network / …', ''],
        ]},
        { kind: 'p', html: '高频辨析：<b>SVM 本身两属</b>——linear kernel 时是线性分类器，non-linear kernel 时是非线性分类器；<b>kNN 是 nonlinear</b>（边界随邻居分布任意弯曲）；<b>Logistic Regression 名字带"回归"但是 linear classifier</b>，这是经典陷阱。' },
        { kind: 'trap', claim: 'Logistic regression is a regression algorithm because its name contains "regression".', verdict: 'F', explain: 'Logistic regression 是（线性）<b>分类器</b>：它预测类别标签。名字中的 regression 来自其模型结构与回归的渊源，任务类型是 classification。' },
        { kind: 'trap', claim: 'kNN is a linear classifier when k is small.', verdict: 'F', explain: 'kNN 无论在什么 k 下都是 nonlinear classifier（决策边界由邻居分布决定、形状任意）；k 的大小只影响边界的光滑程度，不改变其非线性本质。' },
      ],
    },
    {
      id: 'l07-s5',
      title: 'Accuracy 与解决分类问题的关键步骤',
      titleEn: 'Accuracy & Key Steps',
      blocks: [
        { kind: 'formula', tex: '\\text{Accuracy} = \\frac{\\text{Number of Correct Predictions}}{N_{test}}, \\qquad \\hat{y}_i^{test} = y_i^{test} \\ \\Leftrightarrow\\ \\text{correct prediction}',
          explain: 'Accuracy = 测试集上预测正确的样本数 / 总测试样本数。sklearn：accuracy_score(y_test, y_pred)。分类<b>最常用</b>的评估指标。注意与回归指标（MSE/R²）区分：分类的"误差"是错分类的个数。' },
        { kind: 'steps', title: 'Key Steps to Solve a Classification Problem', items: [
          '<b>Data Split and Preprocessing</b>：切分数据 + 按问题需要做 preprocessing（如 standardization）；',
          '<b>Model Structure Selection</b>：选模型结构 f(x,θ)（选哪种分类器）；选合适的 model complexity（θ 中未知参数个数），用 CV（r-fold / LOOCV）调；',
          '<b>Parameter Estimation</b>：θ̂ = argmin L(θ)，loss 的选择取决于问题；',
          '<b>Prediction</b>：ŷ_test = f(x_test, θ̂)；',
          '<b>Model Evaluation</b>：用评估指标在 test data 上量化预测能力（分类用 Accuracy），指标选择取决于问题。',
        ]},
        { kind: 'p', html: '模板意义：与回归五步几乎一一对应，背一套即可通吃。差异只在 ②可选结构是"分类器家族"、⑤指标是 Accuracy。' },
      ],
    },
    {
      id: 'l07-s6',
      title: '案例：Iris 数据集',
      titleEn: 'Iris Flower Classification',
      blocks: [
        { kind: 'term', en: 'Iris Dataset', zh: '机器学习经典分类数据集：3 种鸢尾花（Setosa / Versicolor / Virginica），150 个样本（每类 50 个），4 个特征：sepal length、sepal width、petal length、petal width（cm）。' },
        { kind: 'p', html: '标签编码：y ∈ {0,1,2}（0=setosa, 1=versicolor, 2=virginica）。特征选择示例：x = [x₁, x₂]（sepal length & width）或 [x₃, x₄]（petal）或全部 4 个。' },
        { kind: 'list', items: [
          '数据划分：80% training / 20% test（test 样本散点带黑边）；',
          '任务：对 unseen 数据 (x, y) 预测 species ŷ，理想情况 ŷ = y。',
        ]},
        { kind: 'p', html: 'Group project 提示：2 人一组，可选 regression / classification / clustering 组合问题；数据源 Kaggle、UCI ML Repository、sklearn datasets；proposal 一页纸写问题 + 数据集描述。考试不考，了解即可。' },
        {
          kind: 'quiz',
          title: 'Lecture 7 自测',
          questions: [
            { q: 'For a 3-class problem, the one-hot encoding of the second class is [0, 1, 0].', type: 'tf', answer: 'T', explain: 'one-hot：所属类位置为 1，其余为 0。' },
            { q: 'The decision boundary of a linear classifier can be a hyperplane in 3D and higher dimensions.', type: 'tf', answer: 'T', explain: 'linear decision boundary：2D 直线、3D+ 超平面。' },
            { q: 'Which of the following is a linear classifier?', type: 'mcq', options: ['(a) kNN', '(b) SVM with RBF kernel', '(c) Perceptron', '(d) Decision Tree'], answer: '(c)', explain: 'Perceptron、Logistic Regression、linear-kernel SVM、LDA 是线性；kNN、非线性核 SVM、树/森林、朴素贝叶斯、神经网络是非线性。' },
            { q: 'What is a decision boundary? Answer in one sentence.', type: 'sa', answer: 'It is the dividing curve or hypersurface that separates different classes, and determines how data points are assigned to classes based on their features.', explain: '背课件原句最稳。' },
          ],
        },
      ],
    },
  ],
};

export default l07;
