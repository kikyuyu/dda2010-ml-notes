import type { Lecture } from '../types';

const l13: Lecture = {
  id: 'l13',
  num: 13,
  titleEn: 'Multiclass with Binary Classifiers & Decision Tree Intro',
  titleZh: '用二分类器解决多分类 & 决策树入门',
  sections: [
    {
      id: 'l13-s1',
      title: '多分类问题与两种组合策略',
      titleEn: 'Multiclass Classification with Binary Classifiers',
      blocks: [
        {
          kind: 'p',
          html: '<b>Multiclass classification</b>：类别数 K &gt; 2 的分类任务。学过的二分类器（perceptron、SVM、logistic regression）都能处理多分类，关键思想是<b>把多分类问题拆成多个二分类问题</b>：One-vs-One (OvO) 和 One-vs-Rest (OvR) 两种方法。',
        },
        {
          kind: 'figure',
          src: 'lc_multiclass_ovo_ovr.png',
          title: 'OvO 与 OvR 的拆解方式',
          caption: 'OvO：每两类之间训练一个分类器，共 K(K−1)/2 个；OvR：每一类对其余所有类，共 K 个分类器。',
          guide: '考试计算题：K 个类时，OvO 需要训练 ½K(K−1) 个二分类器（K=4 → 6 个），OvR 需要 K 个（K=4 → 4 个）。OvO 分类器更多但每个分类器只用两类数据训练。',
        },
      ],
    },
    {
      id: 'l13-s2',
      title: 'One-vs-One (OvO) 方法',
      titleEn: 'One-vs-One',
      blocks: [
        {
          kind: 'steps',
          title: 'OvO 四步流程',
          items: [
            '把 K 类数据拆成 <b>½K(K−1)</b> 个二分类数据集（each class versus every other class），对应 ½K(K−1) 个二分类问题。',
            '为每个二分类问题训练一个二分类器。',
            '对每条测试数据：perceptron/SVM 预测类别标签；logistic regression 预测"属于该类 vs 其补类"的一对概率。',
            '汇总决策：perceptron/SVM 用 <b>投票（most votes）</b>；logistic regression 用 <b>各类概率之和最大（largest sum of probabilities）</b>。',
          ],
        },
        {
          kind: 'p',
          html: '<b>K=4 投票例子</b>：6 个分类器输出 red、red、red、blue、yellow、green → red 得 3 票最多 → 判 red。<b>概率和例子</b>：red 得 0.6+0.7+0.3 = 1.6，blue 得 0.4+0.8+0.6 = 1.8，green 得 0.3+0.2+0.9 = 1.4，yellow 得 0.7+0.4+0.1 = 1.2 → blue 最大 → 判 blue。<b>注意：投票最多的类别与概率和最大的类别可以不同！</b>',
        },
        { kind: 'p', html: 'sklearn：<code>OneVsOneClassifier(binary_model)</code>。' },
      ],
    },
    {
      id: 'l13-s3',
      title: 'One-vs-Rest (OvR) 方法',
      titleEn: 'One-vs-Rest',
      blocks: [
        {
          kind: 'steps',
          title: 'OvR 四步流程',
          items: [
            '把 K 类数据拆成 <b>K</b> 个二分类数据集（each class versus all the other classes），对应 K 个二分类问题。',
            '为每个二分类问题训练一个二分类器。',
            '对每条测试数据：perceptron/SVM 输出类别标签和一个 <b>probability-like score</b>（如到决策边界的距离）；logistic regression 输出类别及其概率。',
            '汇总决策：perceptron/SVM 用 <b>最大的 probability-like score</b>；logistic regression 用 <b>最大的概率</b>。',
          ],
        },
        {
          kind: 'p',
          html: '<b>K=4 例子</b>：score 分别为 red 1.9、blue 2.8、green 0.9、yellow 3.6 → yellow 最大 → 判 yellow；概率分别为 red 0.9、blue 0.8、green 0.6、yellow 0.7 → red 最大 → 判 red。sklearn：<code>OneVsRestClassifier(binary_model)</code>。',
        },
        {
          kind: 'trap',
          claim: '对 K 类多分类问题，OvO 需要训练 K 个二分类器，OvR 需要训练 ½K(K−1) 个。',
          verdict: 'F',
          explain: '恰好相反：OvO 训练 ½K(K−1) 个（每两类一个）；OvR 训练 K 个（每一类对其余类）。K=4 时分别是 6 个和 4 个。',
        },
        {
          kind: 'trap',
          claim: 'OvO 中 logistic regression 的预测规则是"得票数最多的类别获胜"。',
          verdict: 'F',
          explain: '投票（most votes）是 perceptron / SVM 的汇总规则；logistic regression 有概率输出，规则是 <b>各类概率之和最大</b>的类别获胜。',
        },
      ],
    },
    {
      id: 'l13-s4',
      title: '决策树：结构与术语',
      titleEn: 'Decision Tree',
      blocks: [
        {
          kind: 'p',
          html: '日常分类常基于规则（rule-based），把决策过程画出来就是树。A <b>decision tree for classification</b> is a hierarchical tree-like structure that uses a series of <b>binary decisions</b> to classify data into different classes：一串决策规则把 feature space 划分（partition）成若干区域，每个区域关联一个类别标签。树状图通常倒着画：根在上、叶子在下。',
        },
        {
          kind: 'table',
          title: '决策树术语（考试名词解释常客）',
          header: ['术语', '含义'],
          rows: [
            ['Root Node（根节点）', '最顶部的节点，代表整个数据集'],
            ['Decision Node（决策节点）', '会分裂出子节点的节点，代表一个数据子集'],
            ['Leaf / Terminal Node（叶节点）', '不再分裂的节点（terminal node）'],
            ['Maximum Depth（最大深度）', '从根到最远叶节点的最长路径上的节点数'],
            ['Sub-Tree / Branch（子树/分支）', '整棵树的一个子部分'],
            ['Splitting（分裂）', '把一个节点分成子节点的过程'],
            ['Pruning（剪枝）', '移除决策节点的过程，与 splitting 相反'],
          ],
        },
        {
          kind: 'p',
          html: '<b>Complexity of decision trees</b> 由三个因素控制：① maximum depth；② leaf node 所需的最小数据点数（分裂时只有左右分支都至少留下这个数量才会被考虑）；③ number of leaf nodes。',
        },
      ],
    },
    {
      id: 'l13-s5',
      title: '构建决策树：分裂准则',
      titleEn: 'Building a Decision Tree',
      blocks: [
        {
          kind: 'p',
          html: '目标：递归地把 feature space 划分成区域，使同一叶节点内的数据点尽量 <b>PURE</b>（同类）。每次分裂考察候选参数 θ = (j, t_m)（特征 x_j 和阈值 t_m），把节点 m 的数据 Q_m 分成 Q_left = {x | x_j ≤ t_m} 与 Q_right = {x | x_j &gt; t_m}。',
        },
        {
          kind: 'formula',
          tex: 'G(Q_m, \\theta) = \\frac{n_m^{left}}{n_m} H(Q_m^{left}(\\theta)) + \\frac{n_m^{right}}{n_m} H(Q_m^{right}(\\theta))',
          explain: '候选分裂的质量函数：左右子集加权（按数据点数加权）的不纯度之和 H(·)。选择使 G 最小的 θ̂ 分裂，然后对左右子集递归，直到达到最大深度、或 n_m = 1、或少于叶节点最小数据点数。',
        },
        {
          kind: 'formula',
          tex: 'H(Q_m) = -\\sum_{k=1}^{K} p_{mk} \\log(p_{mk}) \\quad \\text{(Information Entropy)}',
          explain: 'p_mk 是节点 m 中属于类 k 的数据点比例。熵是 disorder / uncertainty / impurity 的度量：所有类等概率时熵最大（最混乱、信息最少）；只有一种类时熵为 0（最纯、无歧义）。',
        },
        {
          kind: 'formula',
          tex: 'H(Q_m) = 1 - \\sum_{k=1}^{K} p_{mk}^2 \\quad \\text{(Gini Index)}',
          explain: 'Gini index 与熵类似，也是 impurity 的度量，越大越不纯。sklearn 中 <code>DecisionTreeClassifier(criterion=\'gini\')</code> 是默认值，也可用 <code>criterion=\'entropy\'</code>。',
        },
        {
          kind: 'trap',
          claim: 'Information entropy 和 Gini index 越大，说明节点越纯、所含信息越多。',
          verdict: 'F',
          explain: '恰好相反：两者都是 disorder / uncertainty / impurity 的度量，越大越混乱越不纯、所含信息越少；唯一纯节点（单一类别）时最小（熵为 0）。',
        },
        {
          kind: 'trap',
          claim: 'sklearn 的 DecisionTreeClassifier 默认使用 entropy 作为分裂准则。',
          verdict: 'F',
          explain: '默认是 gini index；entropy 需要显式指定 criterion=\'entropy\'。',
        },
      ],
    },
    {
      id: 'l13-s6',
      title: 'Iris 例子与过拟合',
      titleEn: 'Iris Classification & Overfitting',
      blocks: [
        {
          kind: 'figure',
          src: 'tree_split_criteria.png',
          title: '决策树的轴平行（axis-parallel）决策边界',
          caption: '决策树每次只按一个特征阈值切分，所以边界是横平竖直的矩形网格；树越深、矩形越多、边界越复杂。',
          guide: '识别决策树边界：边界必为水平线/竖直线组成的矩形区域（axis-parallel），这与 SVM/ logistic 的斜线边界、kernel SVM 的曲线边界都不同。',
        },
        {
          kind: 'p',
          html: '特征对比实验：<b>petal length + petal width</b> → 树简单，test accuracy = <b>1.0</b>；<b>sepal length + sepal width</b> → 树<b>更复杂</b>，test accuracy 只有 <b>0.63</b>。原因：sepal 特征难以分开数据，树不得不构建 overly complex structure → <b>overfitting（过拟合）</b>。结论：更复杂的树 ≠ 更高的精度。',
        },
        {
          kind: 'trap',
          claim: '决策树越复杂（深度越大），在测试数据上的准确率一定越高。',
          verdict: 'F',
          explain: 'Iris 反例：用更难分的 sepal 特征时树更复杂，但 test accuracy 反而只有 0.63（vs petal 特征的 1.0）——过度复杂的树结构导致 overfitting。',
        },
      ],
    },
    {
      id: 'l13-s7',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 13 自测题',
          questions: [
            { q: 'K = 5 类时，OvO 与 OvR 分别训练多少个二分类器？', type: 'sa', answer: 'OvO：½×5×4 = 10 个；OvR：5 个。' },
            { q: 'T/F：OvO 方法中，perceptron / SVM 用各类概率之和最大来决定最终类别。', type: 'tf', answer: 'F', explain: 'perceptron/SVM 没有概率输出，用 most votes（投票）；概率和最大是 logistic regression 的汇总规则。' },
            { q: 'OvR 中，对 perceptron / SVM 来说，最终类别由（ ）决定。', type: 'mcq', options: ['得票数最多', 'probability-like score 最大', '第一个分类器输出', '概率最大'], answer: 'probability-like score 最大', explain: 'perceptron/SVM 输出的是 probability-like score（如到边界距离），取最大者；"概率最大"是 logistic regression 的规则。' },
            { q: '写出 Gini index 公式，并说明它度量什么。', type: 'sa', answer: 'H(Q_m) = 1 − Σₖ p_mk²；它是节点 impurity（不纯度/不确定性）的度量，越大越不纯，单类节点时为 0。' },
            { q: 'T/F：决策树的决策边界通常是轴平行的（axis-parallel）矩形区域。', type: 'tf', answer: 'T' },
            { q: 'Pruning（剪枝）是什么？它与 splitting 的关系是？', type: 'sa', answer: '移除决策节点（子树）的过程，是 splitting 的相反过程，用于降低树的复杂度、对抗过拟合。' },
            { q: 'T/F：熵越大，节点越纯、信息量越大。', type: 'tf', answer: 'F' },
          ],
        },
      ],
    },
  ],
};

export default l13;
