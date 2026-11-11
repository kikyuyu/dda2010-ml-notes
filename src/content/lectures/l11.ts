import type { Lecture } from '../types';

const l11: Lecture = {
  id: 'l11',
  num: 11,
  titleEn: 'Soft Margin SVM & Kernel SVM',
  titleZh: '软间隔 SVM 与核方法',
  sections: [
    {
      id: 'l11-s1',
      title: '软间隔分类器',
      titleEn: 'Soft Margin Classifier',
      blocks: [
        {
          kind: 'p',
          html: '复习：hard margin 要求所有约束 y_i(w·x_i+b) ≥ 1 都满足。对 linearly nonseparable 数据，总有几个点不满足（y_i(w·x_i+b) ≯ 1），约束无解。解决办法：把硬约束放松成<b>软约束</b>。',
        },
        {
          kind: 'formula',
          tex: '\\min_{w,b}\\ \\|w\\| \\quad \\text{and} \\quad \\min_{\\xi_i \\geq 0}\\ \\sum_{i=1}^{N_{train}} \\xi_i, \\quad \\text{subject to } y_i (w \\cdot x_i + b) \\geq 1 - \\xi_i',
          explain: '引入松弛变量 ξ_i（slack variable）：它是第 i 个数据点进入 margin 的深度（the depth of the i-th data point entering into the margin）。ξ_i = 0 表示点在间隔外；ξ_i 越大，点越深入间隔甚至越过边界被错分。',
        },
        {
          kind: 'p',
          html: '软间隔的目标有两个，需要同时兼顾：<b>maximize the margin</b>（间隔尽量大）和 <b>minimize the total depth of the data points entering into the margin</b>（进入间隔的点总深度尽量小）。',
        },
        {
          kind: 'formula',
          tex: '\\hat w, \\hat b, \\hat \\xi = \\arg\\min_{w, b, \\xi}\\ \\|w\\|^2 + C \\sum_{i=1}^{N_{train}} \\xi_i, \\quad \\text{s.t. } y_i (w \\cdot x_i + b) \\geq 1 - \\xi_i,\\ \\xi_i \\geq 0',
          explain: '把两个目标合成一个优化问题：C > 0 是 regularization parameter（正则化参数）。C 越大，越不能容忍点进入间隔（间隔窄、更贴近 hard margin）；C 越小，越宽容（间隔宽、更多点落入间隔）。',
        },
        { kind: 'p', html: 'SVM 就是 soft margin classifier：允许一些点落入 margin 甚至被错分。sklearn：<code>svm.SVC(kernel="linear", C=reg_c)</code>。预测：ŷ = 1 if ŵ·x + b̂ ≥ 0，否则 0。' },
      ],
    },
    {
      id: 'l11-s2',
      title: '正则化参数 C 的影响',
      titleEn: 'Influence of the Regularization Parameter C',
      blocks: [
        {
          kind: 'list',
          items: [
            '<b>smaller C</b> → wider margin，更多点落入 margin，更多 misclassifications（对 linearly separable 数据而言）；',
            '<b>larger C</b> → narrower margin，更少点落入 margin，更少 misclassifications；',
            '<b>C = ∞</b> → 不允许任何误分类，退化为 <b>hard margin classifier</b>。',
          ],
        },
        {
          kind: 'figure',
          src: 'svm_margin_C.png',
          title: '不同 C 值下的间隔宽度',
          caption: 'C 越小，边界两侧的虚线间隔越宽、允许更多点进入间隔；C 越大，间隔越窄、更贴近硬间隔。',
          guide: '考试画图题常给两张 SVM 图让你比较 C 的大小：间隔宽、有"混入"异类点的图 → C 小；间隔窄、边界硬挤在两类中间的图 → C 大。',
        },
        {
          kind: 'p',
          html: '<b>准确率曲线</b>：随 C 增大，training accuracy 先升后降、test accuracy 先升后降，都在某个 C 处达到最大——说明调 C 也存在 <b>bias-variance tradeoff</b>。用 <b>CV 方法</b>（r-fold CV / LOOCV）来调 C。Iris 例子：10-fold CV 选 C_CV = 11.21，LOOCV 选 C_CV = 12.88（两者可以不同）。',
        },
        {
          kind: 'trap',
          claim: '对软间隔 SVM，正则化参数 C 越大，margin 越宽。',
          verdict: 'F',
          explain: '恰好相反：C 越大 margin 越窄（越少点被允许落入间隔）；C → ∞ 退化为 hard margin（不允许任何误分类）。C 越小 margin 越宽。',
        },
        {
          kind: 'trap',
          claim: 'C = ∞ 时 soft margin SVM 仍允许少量数据点落入 margin。',
          verdict: 'F',
          explain: 'C = ∞ 时惩罚无穷大，不允许任何落入间隔或误分类，等价于 hard margin classifier。',
        },
      ],
    },
    {
      id: 'l11-s3',
      title: '核技巧：从线性到非线性',
      titleEn: 'Kernel Trick',
      blocks: [
        {
          kind: 'p',
          html: '到目前介绍的 SVM 都是 <b>linear SVM classifiers</b>：边界是直线（2D）或 hyperplane（高维），对 linearly nonseparable 数据预测能力有限。用 <b>kernel trick</b> 可以把线性 SVM 扩展为 <b>非线性 SVM（kernel SVM）</b>。',
        },
        {
          kind: 'term',
          en: 'Kernel trick', zh: '核技巧',
          note: '把低维特征空间的原始特征向量 x 通过 feature mapping Φ(x) 变换到高维特征空间，使数据在高维空间 linearly separable，从而可以用超平面分开。',
        },
        {
          kind: 'formula',
          tex: '\\Phi(x): (x_1, x_2) \\mapsto (x_1, x_2, x_1^2 + x_2^2)',
          explain: '课件例子：把 2D 的 x 映射到 3D。在高维空间里 w·Φ(x)+b = w₁x₁+w₂x₂+w₃(x₁²+x₂²)+b = 0 关于新特征是"线性"的，但关于原始特征 (x₁,x₂) 是"非线性"的（可以画出圆形边界）。',
        },
        {
          kind: 'formula',
          tex: "k(x, x') = \\Phi(x) \\cdot \\Phi(x')",
          explain: 'kernel function（核函数）k(x,x′) 等于高维空间中两个映射后向量的内积。选择一个好的核函数等价于选择一个好的 feature mapping。x ∈ R^d 是原始特征向量，Φ(x) ∈ R^D 且通常 D ≫ d。',
        },
        {
          kind: 'trap',
          claim: '核技巧的作用是把高维数据映射到低维空间以便分类。',
          verdict: 'F',
          explain: '方向相反：kernel trick 把低维空间中线性不可分的 x 通过 Φ(x) 映射到更高维的空间（D ≫ d），使数据在新空间中 linearly separable，从而能被超平面分开。',
        },
        {
          kind: 'trap',
          claim: '经过 feature mapping 后，在新特征空间中决策边界关于原始输入特征仍然是非线性的。',
          verdict: 'T',
          explain: '如课件例子 w·Φ(x)+b=0 关于 (x₁, x₂, x₁²+x₂²) 是线性的，但关于原始特征 (x₁,x₂) 是非线性的——这正是 kernel SVM 能画出曲线边界的原因。',
        },
      ],
    },
    {
      id: 'l11-s4',
      title: '常用核函数',
      titleEn: 'Commonly Used Kernel Functions',
      blocks: [
        {
          kind: 'table',
          title: '三大常用核函数（公式 + sklearn 调用都要记）',
          header: ['Kernel', '公式 k(x,x′)', 'sklearn'],
          rows: [
            ['linear', 'x·x′（对应 Φ(x)=x，即线性 SVM）', 'SVC(kernel="linear", C=reg_c)'],
            ['polynomial (poly)', '(γx·x′ + r)^d', 'SVC(kernel="poly", C=reg_c, γ, degree=d, coef0=r)'],
            ['radial basis function (rbf)', 'exp(−γ‖x−x′‖²)', 'SVC(kernel="rbf", C=reg_c, γ)'],
          ],
        },
        {
          kind: 'term',
          en: 'Hyper-parameters',
          zh: '核函数里的参数称为超参数（hyper-parameters）',
          note: '如 polynomial kernel 的 γ、d、r；rbf kernel 的 γ。超参数需要用 CV 方法来调。',
        },
        {
          kind: 'figure',
          src: 'svm_kernels.png',
          title: 'linear / poly / rbf 核在 moon 数据集上的决策边界',
          caption: 'moon 数据是线性不可分的：linear SVM 只能画直线，边界效果差；poly 核画出多项式曲线；rbf 核的边界最贴合月牙形状，效果最好。',
          guide: '看图识别核类型：直线边界 → linear；光滑曲线围出整体形状 → rbf；明显的多项式弧线 → poly。课件结论：moon 数据集上 rbf kernel 效果最好。',
        },
        {
          kind: 'p',
          html: '补充记忆：rbf 核中的 γ 控制单个训练样本的影响范围——γ 越大，每个点影响范围越小，边界越弯曲复杂（过拟合倾向）；γ 越小，边界越平滑。',
        },
        {
          kind: 'trap',
          claim: '在 moon 数据集（线性不可分）上，linear SVM 的分类效果最好。',
          verdict: 'F',
          explain: 'moon 数据线性不可分，linear SVM 只能画直线、效果差；kernel SVM 中 rbf 效果最好（poly 次之），能贴合月牙形状。',
        },
      ],
    },
    {
      id: 'l11-s5',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 11 自测题',
          questions: [
            { q: 'T/F：软间隔 SVM 中，ξ_i 表示第 i 个点进入 margin 的深度。', type: 'tf', answer: 'T' },
            { q: 'T/F：C 越大，SVM 的 margin 越宽、允许更多点落入 margin。', type: 'tf', answer: 'F', explain: 'C 越大 margin 越窄；C 越小 margin 越宽。' },
            { q: 'C 取什么值时 soft margin 退化为 hard margin？', type: 'mcq', options: ['C = 0', 'C = 1', 'C → ∞', 'C → 0'], answer: 'C → ∞' },
            { q: '写出 poly kernel 和 rbf kernel 的公式。', type: 'sa', answer: 'poly: k(x,x′)=(γx·x′+r)^d；rbf: k(x,x′)=exp(−γ‖x−x′‖²)。' },
            { q: 'T/F：核技巧把原始特征映射到更低维的空间。', type: 'tf', answer: 'F', explain: '映射到更高维（D ≫ d），使数据在新空间线性可分。' },
            { q: 'T/F：调正则化参数 C 也需要处理 bias-variance tradeoff，可以用 CV 方法。', type: 'tf', answer: 'T' },
            { q: '给定一张 SVM 图：间隔很宽、有几个异类点落入间隔内，判断 C 偏大还是偏小？', type: 'sa', answer: 'C 偏小：小 C 对应宽间隔、允许更多点落入 margin；C 越大间隔越窄。' },
          ],
        },
      ],
    },
  ],
};

export default l11;
