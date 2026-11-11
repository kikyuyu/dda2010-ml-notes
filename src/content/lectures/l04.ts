import type { Lecture } from '../types';

const l04: Lecture = {
  id: 'l04',
  num: 4,
  titleEn: 'Cross Validation, Under/Overfitting & Bias-Variance Tradeoff',
  titleZh: '交叉验证、过拟合/欠拟合与偏差-方差分解',
  sections: [
    {
      id: 'l04-s1',
      title: '实验观察：m=1…20 的 Boston 案例',
      titleEn: 'Training vs Test Error over Model Order',
      blocks: [
        { kind: 'p', html: '对 m=1,…,20 各拟合一个多项式回归（LS 方法），得到两条形状完全不同的曲线：<br>① <b>Training MSE / R²</b>：m 越大，training MSE <b>单调下降</b>，Training R² 相反地上升。下降过度是 <b>fitting to the noise</b>（把训练数据的随机噪声也拟合了）的结果，会损害对 unseen data 的预测能力。<br>② <b>Test MSE / R²</b>：m 增大时 test MSE <b>先降后升</b>（本例 m=5 之后上升），Test R² 相反。test MSE 的上升同样源于 fitting to the noise。' },
        { kind: 'figure', src: 'reg_train_test_mse.png', title: 'Training MSE vs Test MSE：U 形曲线是考点', caption: '左：training MSE 单调下降、test MSE 呈 U 形（m=5 最优）；右：test data（红三角）在训练中必须保持未见。', guide: '考试给你这张图要能解释：training error 下降不代表模型变好；test error 的最低点才是"最佳模型复杂度"。m 太大 → 过拟合（曲线剧烈震荡、穿过所有噪声点）。' },
        { kind: 'p', html: '困境：test MSE 显示 m=5 最好，但 test data 必须 reserved exclusively for assessing the model——<b>训练/模型选择过程绝不能用 test data</b>。于是产生核心问题：<span class="en-t">Model Structure Selection: how to choose the right model structure by only making use of the training data such that the test MSE is minimized.</span>' },
        { kind: 'trap', claim: 'Given two models, the one that has a smaller training MSE will always have a smaller test MSE.', verdict: 'F', explain: 'Assignment 1 原题。training MSE 随复杂度<b>单调下降</b>，但 test MSE 先降后升。m 很大时 training MSE 小的模型 test MSE 反而大（overfitting）。' },
        { kind: 'trap', claim: 'The best degree m=5 that minimizes the test MSE can be used in practice to select the model structure.', verdict: 'F', explain: '不能用 test data 做模型选择（test data 只能用于最终评估）。实践中只能用 training data + CV 选结构——这正是交叉验证存在的理由。' },
      ],
    },
    {
      id: 'l04-s2',
      title: '三路划分与 Cross Validation 定义',
      titleEn: 'Three-Way Split & CV',
      blocks: [
        { kind: 'table', title: 'Training / Validation / Test 三种数据的职责（务必区分）', header: ['数据', '用途'], rows: [
          ['<b>Training data</b>', '估计各种不同复杂度/结构模型的未知参数'],
          ['<b>Validation data</b>', 'validate 这些不同复杂度/结构的模型，找出最佳的 model complexity / structure'],
          ['<b>Test data</b>', 'reserved exclusively to assess the model（只做最终评估）'],
        ]},
        { kind: 'term', en: 'Cross Validation (CV)', zh: '一种 resampling method：用数据的不同部分轮流估计模型参数并验证模型估计。training data 与 validation data 的不同切分方式产生不同形式的 CV，如 r-fold CV、LOOCV。', note: 'CV 只发生在 training data 内部，test data 全程不参与。' },
      ],
    },
    {
      id: 'l04-s3',
      title: 'r-fold Cross Validation 的步骤',
      titleEn: 'r-fold CV',
      blocks: [
        { kind: 'steps', title: 'r-fold CV 标准流程（会默写）', items: [
          '把 <b>training data</b> 均分成 r 份（folds），每份数据量相同：fold 1, …, fold r；',
          '对每个候选模型复杂度 m：',
          '— for each k = 1,…,r：以第 k 份为 <b>validation fold</b>，其余 r−1 份为 training folds，估计参数并计算该折上的 Validation MSE（即 MSE<sup>Val-k</sup>）；',
          '— r-fold CV error = 各折 Validation MSE 的<b>平均</b>：(1/r)Σₖ MSE<sup>Val-k</sup>(m)；',
          '选择使 r-fold CV error <b>最小</b> 的复杂度 m_CV。',
        ]},
        { kind: 'figure', src: 'reg_cross_validation.png', title: '5-fold CV 示意与 CV 误差曲线', caption: '左：5 折轮流做验证集；右：用 CV error（而非 test error）选择模型阶数。', guide: '左图看清"轮流"结构：每一折都当且只当一次 validation。右图 CV 误差曲线与 test MSE 曲线形状相似（都是 U 形），这是"CV 能代替 test 选结构"的直观原因——注意选结构时看 CV 曲线，评估时看 test。' },
        { kind: 'p', html: 'sklearn 实现：GridSearchCV(model, param_grid, cv=r, scoring=\'neg_mean_squared_error\')；cv=LeaveOneOut() 即 LOOCV。' },
        { kind: 'term', en: 'Leave-One-Out CV (LOOCV)', zh: '每次只留 1 个数据点做验证、其余 N−1 个做训练，重复 N 次再平均——即 r = N_train 的 r-fold CV 特例。', note: 'Assignment 1 原题考点！' },
        { kind: 'trap', claim: 'Leave-one-out cross validation (LOOCV) is a special case of the r-fold CV, with r chosen to be the number of data points.', verdict: 'T', explain: 'LOOCV = r-fold CV 取 r = N（数据点数）的情形：每折只含 1 个点。' },
        { kind: 'trap', claim: 'The primary purpose of cross validation is to lower the training MSE.', verdict: 'F', explain: 'Assignment 1 原题。CV 的用途是 <b>model structure / complexity selection</b>（选结构），它优化的是 validation/CV error，不是 training MSE。' },
        { kind: 'trap', claim: 'A group first splits data into training and test data, then uses training data + CV to choose the model order, builds the model with the chosen order on the training data, and finally assesses on the test data.', verdict: 'T', explain: 'Assignment 1 原题——这正是<b>标准流程</b>：test data 只在最后评估时出现一次。' },
      ],
    },
    {
      id: 'l04-s4',
      title: '案例：10-fold vs 5-fold CV 与 Parsimony 原则',
      titleEn: '10-fold vs 5-fold & Principle of Parsimony',
      blocks: [
        { kind: 'p', html: '同一 Boston 数据：10-fold CV 选出 <b>m=5</b>（Test MSE=32.5148，R²=0.5566）；5-fold CV 选出 <b>m=11</b>（Test MSE=100.4790，R²=−0.3702，明显过拟合）。原因：m=5 的 5-fold CV error 只比 m=11 的略差一点（38.6092 vs 38.2684），m=11 的"优势"是假象。' },
        { kind: 'term', en: 'Principle of Parsimony', zh: '简约原则：如果两个模型结构的 CV error 几乎相同，应选<b>更简单的那个</b>（the simpler the better）。', note: 'philosophy 中也称 law of parsimony：用尽可能少的元素构建解释。' },
        { kind: 'trap', claim: 'For a polynomial regression problem, if two model orders give similar CV errors, we should choose the larger model order.', verdict: 'F', explain: 'Assignment 1 原题，方向说反了！CV error 相近时应选<b>更小的阶数</b>（更简单的模型）——Principle of Parsimony。' },
        { kind: 'p', html: '如何选 r？<b>No general answer! Very often one can try r=5 or r=10.</b>——判断题若说"r 越大越好"或"有通用最优 r"即为错。' },
      ],
    },
    {
      id: 'l04-s5',
      title: 'Underfitting 与 Overfitting',
      titleEn: 'Underfitting and Overfitting',
      blocks: [
        { kind: 'term', en: 'Underfitting', zh: '模型太简单或训练不充分，无法捕捉输入输出之间的潜在关系，结果在 training 和 validation/test 数据上<b>表现都差</b>。', note: ' overly simple → large bias, small variance。' },
        { kind: 'term', en: 'Overfitting', zh: '模型太复杂，把训练数据（包括其中的随机噪声）学得太好，结果 training 上表现极好、validation/test 上<b>表现差</b>。', note: 'overly complex → small bias, large variance。' },
        { kind: 'compare', title: 'Underfitting vs Overfitting 对照表（课件原表，常考）', heads: ['Aspect', 'Underfitting', 'Overfitting'], rows: [
          ['Training performance', 'Poor（差）', 'Very good / near-perfect（近乎完美）'],
          ['Test/validation performance', 'Poor（差）', 'Poor（差）'],
          ['Key symptom', 'Training 与 test 误差都高', 'Training 误差低但 test 误差高'],
          ['Typical causes', 'Model too simple / insufficiently trained', 'Model too complex / overly trained'],
          ['Common fixes', '用更复杂的模型、train longer', '简化模型、dropout / early stopping'],
          ['Bias/Variance', 'Large bias, small variance', 'Small bias, large variance'],
        ]},
        { kind: 'figure', src: 'reg_poly_degrees.png', title: '欠拟合 / 合适 / 过拟合的三联图', caption: 'degree 1（underfitting）、4（good fit）、14（overfitting）在同一数据集上的拟合曲线。', guide: '一眼识别法：曲线太平滑→欠拟合；曲线穿过几乎所有训练点、剧烈震荡→过拟合；介于两者之间→合适。课件 Example 3 的总结词：overly simple / suitable complexity / overly complex；large bias / good balance / large variance。' },
      ],
    },
    {
      id: 'l04-s6',
      title: 'MSE 的分解：Bias² + Variance + Irreducible Error（必考公式）',
      titleEn: 'Decomposition of MSE',
      blocks: [
        { kind: 'formula', tex: '\\text{MSE}(\\hat{f}, f^0) = (\\text{Bias})^2 + \\text{Variance} + \\text{Irreducible Error}',
          explain: '对 model estimator f̂ 的均方误差（对 training 与 test 数据取期望 E）可分解为三项，三者都 ≥ 0。这是本课程<b>最重要的公式</b>之一。' },
        { kind: 'table', header: ['项', '含义', '过大时的情形'], rows: [
          ['<b>(Bias)²</b>', '因<b>模型结构太简单</b>导致的估计误差部分；模型估计不随训练数据变化太多，错过输入输出的相关关系', 'overly simple → <b>underfitting</b>（large bias）'],
          ['<b>Variance</b>', '因<b>训练数据的变动</b>导致的估计误差部分；模型估计随训练数据显著变化，因为建模了训练数据中的随机噪声', 'overly complex → <b>overfitting</b>（large variance）'],
          ['<b>Irreducible Error</b>', '由 <b>measurement noise</b> 导致，任何模型结构都<b>无法降低</b>', '与模型无关，存在误差下界'],
        ]},
        { kind: 'figure', src: 'reg_bias_variance.png', title: 'Bias-Variance Tradeoff', caption: '模型复杂度增加 → bias² 下降、variance 上升，总误差呈 U 形；最优复杂度在 U 形底部。', guide: '读图三句话：① 左端 underfitting（高 bias）；② 右端 overfitting（高 variance）；③ 最低点即最佳模型复杂度。考试可能要求你<b>画出并标注</b>这张图。' },
        { kind: 'p', html: '<span class="en-t">Bias-Variance Tradeoff</span>：复杂度↑ → bias↓ 但 variance↑；复杂度↓ → bias↑ 但 variance↓。理想目标是找到使 MSE 最小的 right model complexity。' },
        { kind: 'trap', claim: 'In machine learning, variance is always a bigger source of error than bias.', verdict: 'F', explain: 'Assignment 1 原题。带 always 即错：bias 与 variance 谁大取决于模型复杂度——简单模型 bias 大，复杂模型 variance 大。' },
        { kind: 'trap', claim: 'The irreducible error can be reduced by choosing a more complex model structure.', verdict: 'F', explain: 'Irreducible error 由测量噪声决定，<b>任何模型结构都无法降低</b>（can\'t be reduced by any model structure）。能降低的只有 bias 和 variance。' },
        { kind: 'trap', claim: 'As the model complexity increases, both the bias and the variance tend to increase.', verdict: 'F', explain: '复杂度↑时 <b>bias 下降、variance 上升</b>（一升一降才是 tradeoff）；两者同升或同降都不对。' },
      ],
    },
    {
      id: 'l04-s7',
      title: 'CV 为什么有效 & 多项式回归的复杂度选择总结',
      titleEn: 'Why CV Works & Summary',
      blocks: [
        { kind: 'p', html: '<span class="en-t">Why can CV methods work?</span> 当 N_train → ∞ 时，在温和假设下可以证明：<b>CV error 在某种意义下收敛于 estimator 的 MSE</b>；因此使 CV error 最小的模型复杂度也会使 MSE 最小——即 CV 可以保证找到最佳模型结构（under mild assumptions）。' },
        { kind: 'p', html: '多项式回归复杂度选择总结：degree 太低 → 太简单 → 可能 underfitting；degree 太高 → 能捕捉更复杂关系但有过拟合风险；最佳 degree 应使 MSE 最小；实践中 <b>不能用 test data</b>，用 training data + CV 选复杂度。' },
        {
          kind: 'quiz',
          title: 'Lecture 4 自测',
          questions: [
            { q: 'In r-fold CV, the r-fold CV error is computed as the sum of the Validation MSEs over the r folds.', type: 'tf', answer: 'F', explain: '是<b>平均</b>（除以 r），不是求和：r-fold CV error = (1/r)Σₖ MSE^Val-k。' },
            { q: 'A model with large variance means its estimate changes significantly when the training data varies.', type: 'tf', answer: 'T', explain: 'variance 项的定义：训练数据变化导致模型估计的波动，源于建模了训练数据中的随机噪声。' },
            { q: 'Very often one can try r = ____ or ____ for r-fold CV, as there is no general answer for choosing r.', type: 'mcq', options: ['(a) 2, 3', '(b) 5, 10', '(c) 10, 20', '(d) N−1, N'], answer: '(b)', explain: '课件原话：No general answer! Very often one can try r=5 or r=10。' },
            { q: 'Explain why the test data cannot be used for model structure selection.', type: 'sa', answer: 'The test data is reserved exclusively for assessing the final model. If it is used during model selection, the resulting test error no longer reflects the true prediction capability on unseen data (the model selection process would have "seen" the test data).', explain: '答题要点：reserved exclusively for assessment + 用了就失去"unseen"意义。' },
          ],
        },
      ],
    },
  ],
};

export default l04;
