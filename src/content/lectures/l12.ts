import type { Lecture } from '../types';

const l12: Lecture = {
  id: 'l12',
  num: 12,
  titleEn: 'Logistic Regression & Multinomial Logistic Regression',
  titleZh: '逻辑回归与多项逻辑回归',
  sections: [
    {
      id: 'l12-s1',
      title: '动机：从类别到概率',
      titleEn: 'Motivation',
      blocks: [
        {
          kind: 'p',
          html: '<b>Motivation</b>：有些应用不只需要预测的类别标签，还需要它对应的<b>概率</b>（probability）。Perceptron 的 threshold function 只输出 0/1，没有概率信息，因此需要对 perceptron 做两处修改：modification of model structure 和 modification of parameter estimation。',
        },
        {
          kind: 'formula',
          tex: 'y = g(z) = \\frac{1}{1 + e^{-z}}, \\quad z = w \\cdot x + b',
          explain: 'sigmoid function：把任意实数 z 压到 (0,1) 区间。z ≥ 0 时 y ≥ 0.5；z < 0 时 y < 0.5。决策边界仍然是 w·x + b = 0（与 perceptron 相同！），只是输出从硬判决变成概率。',
        },
        {
          kind: 'p',
          html: '<b>概率解释</b>：ŷ 解释为 x 属于 Class 1 的概率；1 − ŷ 解释为 x 属于 Class 0 的概率。分类规则：ŷ ≥ 0.5 → Class 1；ŷ < 0.5 → Class 0。',
        },
        {
          kind: 'figure',
          src: 'lc_logistic_sigmoid.png',
          title: 'sigmoid 函数与线性决策边界',
          caption: '左：sigmoid 曲线把 w·x+b 的得分压成 0–1 之间的概率；右： logistic regression 的决策边界仍然是一条直线（w·x+b=0 处概率恰为 0.5）。',
          guide: '看图要点：①sigmoid 过 (0, 0.5)，单调递增；②边界上概率恰好 0.5，离边界越远概率越接近 0 或 1；③logistic regression 是线性分类器，不是画逻辑曲线的非线性方法。',
        },
        {
          kind: 'trap',
          claim: 'Logistic regression 是线性分类器，其决策边界形式为 ŵ·x + b̂ = 0。',
          verdict: 'T',
          explain: '虽然用了非线性的 sigmoid，但分类规则 ŷ≥0.5 ⇔ w·x+b≥0，所以决策边界仍是线性超平面。perceptron、linear SVM、logistic regression 三者边界形式相同，区别只在参数估计准则。',
        },
      ],
    },
    {
      id: 'l12-s2',
      title: '参数估计：从 MLE 到交叉熵',
      titleEn: 'Modification of Parameter Estimation',
      blocks: [
        {
          kind: 'p',
          html: '模型结构换成了 sigmoid 后，原来的准则 Σ|yᵢ − ŷᵢ| <b>不再是误分类数</b>（因为 ŷ 现在是连续概率），必须换参数估计准则。',
        },
        {
          kind: 'formula',
          tex: '\\hat w, \\hat b = \\arg\\max_{w, b}\\ (\\hat y_i)^{y_i} (1 - \\hat y_i)^{1 - y_i}',
          explain: '单个训练数据：最大化"真实标签对应的概率"。yᵢ = 1 时最大化 ŷᵢ；yᵢ = 0 时最大化 1 − ŷᵢ。',
        },
        {
          kind: 'formula',
          tex: '\\hat w, \\hat b = \\arg\\max_{w, b}\\ \\prod_{i=1}^{N_{train}} (\\hat y_i)^{y_i} (1 - \\hat y_i)^{1 - y_i}',
          explain: '全部训练数据：假设各数据点相互独立（independent），最大化整体概率（likelihood，连乘形式）。',
        },
        {
          kind: 'formula',
          tex: '\\hat w, \\hat b = \\arg\\min_{w, b}\\ \\sum_{i=1}^{N_{train}} \\big[ -y_i \\log(\\hat y_i) - (1 - y_i) \\log(1 - \\hat y_i) \\big]',
          explain: '对连乘取负对数（log 化、取负号），最大化 likelihood 等价于最小化该式——这就是 <b>binary cross-entropy loss function</b>（二元交叉熵）。sklearn：<code>LogisticRegression(penalty=None)</code>。',
        },
        {
          kind: 'trap',
          claim: 'logistic regression 仍然通过最小化误分类数 Σ|yᵢ − ŷᵢ| 来估计参数。',
          verdict: 'F',
          explain: 'sigmoid 输出连续概率后，Σ|yᵢ−ŷᵢ| is NOT the misclassification anymore；参数通过最大化 likelihood（等价于最小化 binary cross-entropy）来估计。',
        },
        {
          kind: 'trap',
          claim: 'logistic regression 的 ŷ 输出只能解释为类别标签 0 或 1。',
          verdict: 'F',
          explain: 'ŷ 是 x 属于 Class 1 的概率（0–1 之间的连续值），1−ŷ 是属于 Class 0 的概率；类别标签只是再按 0.5 阈值划分的结果。<code>model.predict_proba(X_test)</code> 拿的就是概率。',
        },
      ],
    },
    {
      id: 'l12-s3',
      title: '特征选择：ℓ₁ 正则化',
      titleEn: 'Feature Selection via ℓ₁ Regularization',
      blocks: [
        {
          kind: 'p',
          html: '对 linear 分类器（perceptron / linear SVM / logistic regression），用 CV 逐个挑特征效率低；sklearn 提供了另一条路：通过 <b>ℓ₁-norm regularization（结合 LASSO）</b>做自动特征选择。',
        },
        {
          kind: 'formula',
          tex: '\\hat w, \\hat b = \\arg\\min_{w, b}\\ \\text{loss function} + \\alpha \\sum_{i=1}^{n} |w_i|',
          explain: '在损失函数上加 α Σ|wᵢ|（ℓ₁ 惩罚）。α ≥ 0 是 regularization parameter：α 越大 ŵ 越 sparse（越多权重被压成 0，相当于越多特征被剔除）；α 越小 ŵ 越 dense；α = 0 退化为原分类器。',
        },
        {
          kind: 'list',
          items: [
            '<code>Perceptron(penalty=\'l1\', alpha=alpha)</code>',
            '<code>LinearSVC(penalty=\'l1\', C=1/alpha)</code>',
            '<code>LogisticRegression(penalty=\'l1\', C=1/alpha, solver=\'saga\')</code>　注意 sklearn 里 C = 1/α（alpha 越大对应 C 越小）。',
          ],
        },
        {
          kind: 'p',
          html: '<b>20 Newsgroups 例子</b>：21,067 个 TF-IDF 特征。不加正则：accuracy ≈ 0.9760，非零权重 21,067（全选）；加 ℓ₁ 正则（C=1）：accuracy ≈ <b>0.9774</b>（反而更高！），非零权重只剩 <b>8,448</b>——即自动选出了 8,448 个特征。<b>特征选择可以简化模型同时不降低（甚至提升）精度。</b>',
        },
        {
          kind: 'trap',
          claim: 'ℓ₁ 正则化中 α 越大，权重向量 ŵ 越 dense（保留越多特征）。',
          verdict: 'F',
          explain: '相反：the larger α, the more sparse ŵ（越多 wᵢ 被压为 0、越多特征被剔除）；α = 0 时退化为原分类器。',
        },
      ],
    },
    {
      id: 'l12-s4',
      title: '多分类：Multinomial Logistic Regression',
      titleEn: 'Multiclass Classification & Softmax',
      blocks: [
        {
          kind: 'p',
          html: '<b>分类问题类型</b>：Binary（kNN、perceptron、SVM、logistic regression）；Multiclass（kNN、multinomial logistic regression、用二分类器组合多分类、decision tree）。把 logistic regression 推广到 K 类：把真实标签的 0-1 编码换成 <b>one-hot encoding</b>。',
        },
        {
          kind: 'formula',
          tex: '\\hat y_i^{(j)} = \\frac{e^{w^{(j)} \\cdot x_i + b^{(j)}}}{\\sum_{k=1}^{K} e^{w^{(k)} \\cdot x_i + b^{(k)}}}, \\quad j = 1, \\dots, K',
          explain: '<b>softmax activation function</b>：把 K 个得分 zⱼ = w⁽ʲ⁾·x + b⁽ʲ⁾ 转成 K 个概率。满足 0 ≤ ŷ⁽ʲ⁾ ≤ 1 且 Σⱼ ŷ⁽ʲ⁾ = 1，可解释为属于各类的概率。',
        },
        {
          kind: 'formula',
          tex: '\\hat w, \\hat b = \\arg\\min_{w, b}\\ \\sum_{i=1}^{N_{train}} \\sum_{j=1}^{K} \\big[ -y_i^{(j)} \\log(\\hat y_i^{(j)}) \\big]',
          explain: '<b>categorical cross-entropy loss</b>（交叉熵损失）：one-hot 标签只有真实类别那一项为 1，所以等价于最大化真实类别的预测概率 −log(ŷ⁽ᵏ⁾)。最小化它等价于最大化对应概率。',
        },
        {
          kind: 'list',
          items: [
            '每类有自己的参数 w⁽ʲ⁾、b⁽ʲ⁾，决策边界由 ŵ⁽ʲ⁾·x + b̂⁽ʲ⁾ = 0（j = 1…K）决定。',
            '<b>预测规则</b>：K 个概率中<b>最大概率对应的下标</b>就是预测的类别。',
            'sklearn：<code>LogisticRegression(multi_class=\'multinomial\')</code>；<code>predict</code> 给类别，<code>predict_proba</code> 给概率。',
          ],
        },
        {
          kind: 'trap',
          claim: 'softmax 输出的 K 个数值相加等于 K。',
          verdict: 'F',
          explain: 'softmax 输出是概率分布：0 ≤ ŷ⁽ʲ⁾ ≤ 1 且 Σⱼ ŷ⁽ʲ⁾ = 1（相加等于 1，不是 K）。',
        },
      ],
    },
    {
      id: 'l12-s5',
      title: '三种线性分类器对比（必考总结）',
      titleEn: 'Comparison of Linear Binary Classifiers',
      blocks: [
        {
          kind: 'compare',
          title: '决策边界形式相同，差别只在参数估计',
          heads: ['分类器', '参数估计准则', '特点'],
          rows: [
            ['Perceptron', 'min Σ|yᵢ − ŷᵢ|（最小化误分类数）', '线性可分时保证收敛但不唯一；无概率输出'],
            ['SVM (soft margin)', 'min ‖w‖² + C Σξᵢ，s.t. yᵢ(w·xᵢ+b) ≥ 1−ξᵢ', '最大化 margin；C 控制间隔软硬；可用 kernel 变非线性'],
            ['Logistic Regression', 'min Σ[−yᵢ log ŷᵢ − (1−yᵢ) log(1−ŷᵢ)]（binary cross-entropy）', '输出类别概率；ℓ₁ 正则可做特征选择'],
          ],
        },
        { kind: 'p', html: '三者的 decision boundary 都是 ŵ·x + b̂ = 0（linear kernel SVM 时）。它们的 model complexity 还取决于特征的数量与选择，实践中要仔细调。' },
        {
          kind: 'trap',
          claim: 'Perceptron、linear SVM 和 logistic regression 的决策边界形式不同，所以适合不同的数据形状。',
          verdict: 'F',
          explain: '三者都是 linear classifiers，decision boundary 都是 ŵ·x+b̂=0；它们 ONLY differ in the estimation of the parameters (w,b)。',
        },
      ],
    },
    {
      id: 'l12-s6',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 12 自测题',
          questions: [
            { q: 'T/F：sigmoid 函数把 z = w·x + b 映射到 (0, 1) 区间，且 z = 0 时输出恰为 0.5。', type: 'tf', answer: 'T' },
            { q: 'logistic regression 的参数是通过（ ）估计的。', type: 'mcq', options: ['最小化误分类数', '最小化 binary cross-entropy（最大化 likelihood）', '最大化 margin', '最小化 ‖w‖'], answer: '最小化 binary cross-entropy（最大化 likelihood）' },
            { q: 'T/F：logistic regression 的决策边界是非线性的，因为它用了 sigmoid。', type: 'tf', answer: 'F', explain: '分类规则是 w·x+b ≥ 0 ⇔ 概率 ≥ 0.5，边界仍是线性超平面。' },
            { q: '写出 ℓ₁ 正则化的目标函数，并说明 α 的作用。', type: 'sa', answer: 'min loss + αΣ|wᵢ|；α 越大 ŵ 越 sparse（越多特征被剔除）、α 越小越 dense、α=0 退化为原分类器；sklearn 中 C = 1/α。' },
            { q: 'T/F：multinomial logistic regression 中，预测类别是 softmax 输出中概率最大的下标。', type: 'tf', answer: 'T' },
            { q: 'T/F：categorical cross-entropy 中，one-hot 标签使得每个样本只有真实类别那一项对损失有贡献。', type: 'tf', answer: 'T', explain: 'one-hot 向量只有真实类别位置为 1，所以 Σⱼ −y⁽ʲ⁾log(ŷ⁽ʲ⁾) 退化为 −log(ŷ⁽ᵏ⁾)。' },
          ],
        },
      ],
    },
  ],
};

export default l12;
