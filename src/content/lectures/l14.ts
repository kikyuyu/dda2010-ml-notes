import type { Lecture } from '../types';

const l14: Lecture = {
  id: 'l14',
  num: 14,
  titleEn: 'Pruning, Multiclass Feature Selection & Imbalanced Data',
  titleZh: '决策树剪枝、多分类特征选择与不平衡数据集',
  sections: [
    {
      id: 'l14-s1',
      title: '剪枝（Pruning）',
      titleEn: 'Pruning Decision Trees',
      blocks: [
        {
          kind: 'p',
          html: '上讲反例：sepal 特征难分 → 树被迫构建 overly complex structure → <b>overfitting</b>。<b>Pruning（剪枝）</b>：移除树中 non-critical 和 redundant 的分支，通过降低树的复杂度来避免过拟合、提升预测精度。它正是 splitting 的逆过程。',
        },
        {
          kind: 'p',
          html: '控制树复杂度的三个参数（注意它们<b>不相互独立</b>）：① <b>maximum depth</b>；② <b>leaf node 最小数据点数</b>（分裂时每个分支至少留下这么多点才会被考虑）；③ <b>number of leaf nodes</b>。对应三种剪枝方式：减小 max depth、增大 min samples leaf（即减小叶节点最小数据点数的要求表述）、减少叶节点数。',
        },
        {
          kind: 'term',
          en: 'ccp_alpha (cost complexity pruning parameter)',
          zh: '叶节点数的正则化参数',
          note: '作用类似 LASSO 中的 α：the larger ccp_alpha, the smaller number of leaf nodes（树越简单）。剪枝路径由 model.cost_complexity_pruning_path(X_train, y_train) 得到。',
        },
        {
          kind: 'p',
          html: 'sklearn：<code>DecisionTreeClassifier(max_depth=10, min_samples_leaf=1, ccp_alpha=α)</code>。',
        },
        {
          kind: 'figure',
          src: 'tree_pruning_boundary.png',
          title: '剪枝前后的决策边界',
          caption: '未剪枝的树边界细碎、贴着训练点走（过拟合）；剪枝后边界变简洁、泛化更好。',
          guide: '考试读图：边界矩形又多又碎 = 树复杂（未剪枝）；大而少的矩形 = 剪枝后。配合"test accuracy 先升后降"的曲线判断最优剪枝强度。',
        },
        {
          kind: 'list',
          items: [
            '随 ccp_alpha 增大：<b>节点数减少、最大深度下降</b> → 树越来越简单。',
            '随 ccp_alpha 增大：<b>training accuracy 单调下降；test accuracy 先升、达到最大、再降</b> → 调 ccp_alpha 本质上是 bias-variance tradeoff，用 CV 来调。',
            'parsimony：多个 ccp_alpha 给出相同 CV accuracy 时，选<b>较大的 ccp_alpha</b>（更简单的树）。',
          ],
        },
        {
          kind: 'trap',
          claim: 'ccp_alpha 越大，决策树的叶节点数越多、结构越复杂。',
          verdict: 'F',
          explain: '相反：the larger ccp_alpha, the smaller number of leaf nodes。它与 LASSO 的正则化参数 α 角色类似。',
        },
        {
          kind: 'trap',
          claim: '剪枝会降低 training accuracy，所以剪枝总是有害的。',
          verdict: 'F',
          explain: 'training accuracy 确实随剪枝下降，但 test accuracy 会先升后降——适当剪枝通过降低复杂度对抗 overfitting，提升泛化（预测）能力。',
        },
      ],
    },
    {
      id: 'l14-s2',
      title: '多分类的特征选择',
      titleEn: 'Feature Selection for Multiclass Classification',
      blocks: [
        {
          kind: 'p',
          html: '学过的多分类器：kNN、multinomial logistic regression、OvO、OvR、decision tree。它们性质不同，但 model complexity 都取决于特征的数量与组合，都需要仔细调。常规做法是用 CV 选特征；对 multinomial logistic regression，还可以像二分类一样用 <b>ℓ₁-norm regularization（LASSO）</b>：<code>LogisticRegression(multi_class=\'multinomial\', penalty=\'l1\', C=1/alpha, solver=\'saga\')</code>。规则不变：α 越大 ŵ 越 sparse。',
        },
      ],
    },
    {
      id: 'l14-s3',
      title: '不平衡数据集',
      titleEn: 'Imbalanced Dataset',
      blocks: [
        {
          kind: 'term',
          en: 'Imbalanced Dataset', zh: '各类样本数量不均匀的数据集',
          note: 'majority classes（占比高的类）vs minority classes（占比低的类）。Iris 原始每类 50 个是 balanced；10:50 或 50:10 的构造集是 imbalanced。',
        },
        {
          kind: 'p',
          html: '<b>Motivation example</b>：Versicolor vs Virginica 三个数据集（10:50、50:50、50:10）。不平衡时线性 SVM 的 accuracy 看着还行（0.83 / 0.75），但<b>占比低的类几乎全部被错分</b>！这引出两个问题：① 不平衡数据上 <b>accuracy 不是好的评价指标</b>；② 分类器本身需要<b>修改</b>。',
        },
        {
          kind: 'table',
          title: 'Accuracy vs Balanced Accuracy（必背例子：90 正 + 10 负，正类对 81/90、负类只对 1/10）',
          header: ['指标', '公式', '该例取值'],
          rows: [
            ['Accuracy', '(TP+TN)/(TP+TN+FP+FN)', '(81+1)/100 = 82%（虚高！）'],
            ['Balanced Accuracy', '½( TP/(TP+FN) + TN/(TN+FP) )', '½(81/90 + 1/10) = 50%（真实水平）'],
          ],
        },
        {
          kind: 'list',
          items: [
            '<b>TP / TN / FP / FN</b>：真阳/真阴/假阳/假阴——先分清这四个再算指标。',
            '<b>Accuracy 的优点</b>：easy to use and understand；balanced data 上有效。',
            '<b>Accuracy 的缺点</b>：imbalanced dataset 上 not recommended；不反映对 minority class 的糟糕预测。',
            '<b>Balanced accuracy</b> 把 TP、TN 分别按正、负样本数归一化再取平均，避免不平衡数据上性能虚高（inflated prediction performance）。',
          ],
        },
        {
          kind: 'trap',
          claim: '在严重不平衡的数据集上，accuracy 是评价分类器的最佳指标。',
          verdict: 'F',
          explain: 'Accuracy 的缺点恰在于 imbalanced dataset：它会被 majority class 主导而虚高（如 82% vs 真实 balanced accuracy 50%），应改用 balanced accuracy 等指标。',
        },
      ],
    },
    {
      id: 'l14-s4',
      title: '修改分类器：Class Weight 调整',
      titleEn: 'Class Weight Adjustment',
      blocks: [
        {
          kind: 'p',
          html: '给每个样本乘一个 <b>class weight C_i</b>，并使权重与类频率<b>成反比</b>（inversely proportional to class frequencies）。sklearn 的 <code>class_weight=\'balanced\'</code> 自动完成：类频率 (6/10, 3/10, 1/10) → 权重 (10/6, 10/3, 10/1)。例：Dataset 1（10 versicolor + 50 virginica）中 C_i = 60/10（versicolor）、60/50（virginica）。',
        },
        {
          kind: 'list',
          items: [
            'Perceptron：min Σ C_i|yᵢ − ŷᵢ|　→　<code>Perceptron(class_weight=\'balanced\')</code>',
            'SVM：min ‖w‖² + Σ C_i·C·ξᵢ　→　<code>SVC(class_weight=\'balanced\')</code>',
            'Logistic Regression：损失乘 C_i　→　<code>LogisticRegression(class_weight=\'balanced\')</code>',
            'Decision Tree：<code>DecisionTreeClassifier(class_weight=\'balanced\')</code>',
          ],
        },
        { kind: 'p', html: '加上 balanced weight 后，SVM 在不平衡数据上表现明显改善（边界不再一边倒向 majority class）。' },
        {
          kind: 'trap',
          claim: 'class_weight=\'balanced\' 让权重与类频率成正比，多数类获得更大权重。',
          verdict: 'F',
          explain: '恰好相反：权重与类频率<b>成反比</b>——minority class 获得更大权重，从而在训练中受到更多重视。',
        },
      ],
    },
    {
      id: 'l14-s5',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 14 自测题',
          questions: [
            { q: 'T/F：剪枝（pruning）是 splitting 的相反过程，目的是降低树复杂度、避免过拟合。', type: 'tf', answer: 'T' },
            { q: 'ccp_alpha 与决策树叶节点数的关系是（ ）。', type: 'mcq', options: ['ccp_alpha 越大叶节点越多', 'ccp_alpha 越大叶节点越少', '两者无关', 'ccp_alpha 只影响训练速度'], answer: 'ccp_alpha 越大叶节点越少' },
            { q: 'T/F：随 ccp_alpha 增大，test accuracy 先升后降，说明调剪枝强度本质上是 bias-variance tradeoff。', type: 'tf', answer: 'T' },
            { q: '某测试集 90 正 10 负，TP=81、FP=9、TN=1、FN=9。计算 accuracy 和 balanced accuracy，并说明为何两者差这么多。', type: 'sa', answer: 'Accuracy = (81+1)/100 = 82%；Balanced Accuracy = ½(81/90 + 1/10) = 50%。Accuracy 被多数类主导而虚高，掩盖了少数类只有 10% 正确率的糟糕表现。' },
            { q: 'T/F：class_weight=\'balanced\' 使少数类样本获得更大的权重。', type: 'tf', answer: 'T', explain: '权重与类频率成反比，少数类权重更大。' },
            { q: 'Pruning 的三种方式分别对应哪三个控制参数？', type: 'sa', answer: '减小 maximum depth（max_depth）；增大叶节点最小样本数约束（min_samples_leaf）；减少叶节点数（ccp_alpha）。三者用 CV 方法调节。' },
          ],
        },
      ],
    },
  ],
};

export default l14;
