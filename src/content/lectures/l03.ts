import type { Lecture } from '../types';

const l03: Lecture = {
  id: 'l03',
  num: 3,
  titleEn: 'Model Structure, Parameter Estimation, Evaluation & Simple/ Polynomial Linear Regression',
  titleZh: '回归五要素与（多项式）线性回归 + 最小二乘',
  sections: [
    {
      id: 'l03-s1',
      title: '模型结构与模型复杂度',
      titleEn: 'Model Structure & Model Complexity',
      blocks: [
        { kind: 'p', html: '虽然 f⁰(x) 未知，但可以对它的<b>形式</b>做假设，这就是 <span class="en-t">model structure</span>，其中包含若干 unknown parameters（未知参数）。' },
        { kind: 'term', en: 'Model Structure f(x, θ)', zh: '对未知函数形式的假设，含未知参数 θ。常见选择：simple linear regression f(x,θ)=b+w₁x（θ=[b,w₁]）；m 阶多项式回归 f(x,θ)=b+w₁x+…+w_mx^m（θ=[b,w₁,…,w_m]）。', note: 'b 常称 intercept（截距），w 为 weights（权重/系数）。' },
        { kind: 'term', en: 'Model Complexity', zh: '模型复杂度 = 未知参数向量 θ 中元素的个数。', note: '多项式阶数 m 越大 → 参数越多 → 模型越复杂。' },
      ],
    },
    {
      id: 'l03-s2',
      title: '参数估计：argmin 与 Loss Function',
      titleEn: 'Parameter Estimation',
      blocks: [
        { kind: 'term', en: 'Parameter Estimation', zh: '对给定模型结构 f(x,θ)，基于 training data 估计未知参数 θ。最常用的方式：最小化一个 estimation criterion / loss function L(θ)。' },
        { kind: 'formula', tex: '\\hat{\\theta} = \\arg\\min_{\\theta}\\ L(\\theta), \\qquad L(\\theta) = \\frac{1}{N_{train}} \\sum_{i=1}^{N_{train}} \\big(y_i^{train} - f(x_i^{train}, \\theta)\\big)^2',
          explain: '<b>argmin</b>：使函数取得最小值的自变量取值（注意 argmin 返回的是 θ 不是 L 的最小值）。最简单的 loss 就是 <b>MSE（mean square error）</b>；L(θ̂) 即 training MSE（训练均方误差）。' },
        { kind: 'p', html: 'Prediction（预测）：对每个 test input x_test，代入估计好的参数计算 ŷ_test = f(x_test, θ̂)。' },
        { kind: 'trap', claim: 'argmin_θ L(θ) refers to the smallest value of the loss function L(θ).', verdict: 'F', explain: 'argmin 返回的是<b>使 L 最小的那个自变量 θ̂</b>（the value of the argument），不是 L 的最小值本身。最小值是 L(θ̂)。概念辨析题经典考法。' },
      ],
    },
    {
      id: 'l03-s3',
      title: '模型评估：Test MSE 与 Test R²（必考）',
      titleEn: 'Model Evaluation',
      blocks: [
        { kind: 'formula', tex: '\\text{Test MSE} := \\frac{1}{N_{test}} \\sum_{i=1}^{N_{test}} \\big(y_i^{test} - \\hat{y}_i^{test}\\big)^2',
          explain: 'Test MSE 衡量模型估计在 test data 上的预测能力。<b>Test MSE 越小，模型估计越好</b>（the smaller the Test MSE, the better the model estimate）。' },
        { kind: 'formula', tex: '\\text{Test } R^2 = 1 - \\frac{\\sum_{i=1}^{N_{test}} (y_i^{test} - \\hat{y}_i^{test})^2}{\\sum_{i=1}^{N_{test}} (y_i^{test} - \\bar{y}^{test})^2}, \\qquad \\bar{y}^{test} = \\frac{1}{N_{test}} \\sum_{i=1}^{N_{test}} y_i^{test}',
          explain: 'Test R² 又称 <b>coefficient of determination（决定系数）</b>。性质：① <b>The larger the Test R², the better</b>；② 最大值是 <b>1</b>，表示输出变量的变异完全可以由输入变量预测；③ <b>R² 可以为负</b>，表示模型还不如直接用均值预测。分母是"用均值预测的误差"。' },
        { kind: 'trap', claim: 'In model evaluation, a larger test R² indicates a worse regression model estimate.', verdict: 'F', explain: 'Assignment 1 原题。R² <b>越大越好</b>（最大为 1）；越小越差，甚至可以为负。' },
        { kind: 'trap', claim: 'In model evaluation, a smaller test MSE indicates a better regression model estimate.', verdict: 'T', explain: 'Assignment 1 原题。MSE 是误差，越小越好；与 R² 方向相反，务必记牢这对"一升一降"。' },
        { kind: 'trap', claim: 'The test R² of a regression model estimate can never be negative.', verdict: 'F', explain: 'R² <b>可以为负</b>：当模型在测试集上的预测比"直接猜均值"还差时，分子大于分母，R² < 0。' },
      ],
    },
    {
      id: 'l03-s4',
      title: '模型结构选择与回归五大步骤',
      titleEn: 'Model Structure Selection & Major Steps',
      blocks: [
        { kind: 'term', en: 'Model Structure Selection', zh: '可以尝试多种模型结构，选哪个结构及其对应估计的问题。标准：选 prediction capability 最好的——test MSE 最小或 test R² 最大的那个。', note: '不看训练误差选结构，看测试误差。' },
        { kind: 'steps', title: 'Major Steps for Regression / Function Estimation', items: [
          '<b>Data Split</b>：切成 training data 与 test data；',
          '<b>Model Structure Selection</b>：选模型结构 f(x,θ)，并选择合适的 model complexity（θ 中元素个数）；',
          '<b>Parameter Estimation</b>：基于 training data，用 θ̂ = argmin L(θ) 估计参数；',
          '<b>Prediction</b>：对 test input 计算 ŷ_test = f(x_test, θ̂)；',
          '<b>Model Evaluation</b>：用 test MSE / test R² 在 test data 上量化预测能力。',
        ]},
        { kind: 'p', html: 'Steps 1、4、5 是 standard（标准化流程），主要困难在 <b>steps 2 和 3</b>。对应的三个关键问题（Key Issues）：① 有哪些 model structures？② 如何调节 model complexity？③ 如何选择 loss function 估计参数 θ？' },
      ],
    },
    {
      id: 'l03-s5',
      title: '简单线性回归与最小二乘法',
      titleEn: 'Simple Linear Regression & LS Method',
      blocks: [
        { kind: 'term', en: 'Linear Regression', zh: '建模 <b>scalar output y</b> 与一个或多个 input x 之间 linear relationship（线性关系）的方法。线性关系：一个变量的变化与另一个变量的变化成比例，画出来是一条直线。' },
        { kind: 'formula', tex: 'f(x, \\theta) = b + w_1 x, \\qquad \\theta = [b, w_1]',
          explain: 'Simple linear regression model（简单线性回归）：一个输入特征 + 一条直线。b 是 intercept，w₁ 是斜率。sklearn：model = LinearRegression()。' },
        { kind: 'formula', tex: '[\\hat{b}, \\hat{w}_1] = \\arg\\min_{b, w_1} \\sum_{i=1}^{N_{train}} \\big(y_i^{train} - b - w_1 x_i^{train}\\big)^2',
          explain: '<b>Least Squares (LS) method（最小二乘法）</b>：使<b>残差平方和</b>最小的 b̂、ŵ₁ 称为 LS estimates。ls 参数估计用 model.fit(X_train, y_train)；b̂ = model.intercept_，ŵ₁ = model.coef_。' },
        { kind: 'p', html: '名字理解：<b>least squares = 让"平方误差"最小</b>。平方的作用：① 误差可正可负，平方后同向累加；② 放大大的误差，惩罚更狠。' },
        { kind: 'figure', src: 'reg_poly_degrees.png', title: '简单线性回归 = 阶数 m=1 的多项式回归', caption: '左图（degree 1）就是简单线性回归拟合 sin 型数据的样子：一条直线，明显 underfitting。', guide: '考试看图题：如果拟合线是一条直线而数据明显弯曲，说明模型复杂度不足（high bias / underfitting），应提高模型阶数。' },
        { kind: 'trap', claim: 'The least squares method estimates the parameters by minimizing the absolute values of the prediction errors.', verdict: 'F', explain: 'LS 最小化的是<b>误差平方和（squares）</b>，不是绝对值之和。名字里的 squares 就是考点。' },
      ],
    },
    {
      id: 'l03-s6',
      title: '案例：Boston 房价预测（读题模板）',
      titleEn: 'Case Study: Boston House Price',
      blocks: [
        { kind: 'p', html: '<b>Boston Housing dataset</b>：506 个数据点，14 个变量。案例取 x = RM（平均房间数，第 5 列），y = MEDV（自住房屋中位数价值，千美元，第 13 列）。' },
        { kind: 'steps', title: '案例的完整五步（所有回归题的答题骨架）', items: [
          '<b>Data Split</b>：train_test_split(X, y, test_size=0.2, random_state=42) → N=506，N_train=404，N_test=102（随机 80/20 划分）；',
          '<b>Model Structure</b>：MEDV = b + w₁·RM；',
          '<b>Parameter Estimation</b>：LS 得 b̂=−36.2463，ŵ₁=9.3483；',
          '<b>Prediction</b>：MEDV̂ = −36.2463 + 9.3483·RM；',
          '<b>Model Evaluation</b>：Test MSE = 46.1448，Test R² = 0.3708。',
        ]},
        { kind: 'term', en: 'Scatter Plot', zh: '散点图：用笛卡尔坐标展示两组变量取值的图，横轴一个变量、纵轴另一个变量。', note: '案例中黑点 = training data，红点 = test data。' },
        { kind: 'p', html: 'prediction error（预测误差）ε_i = y_i − ŷ_i。案例图中 test data 上的绿色虚线长度就是每个测试点的预测误差——看图识别"残差/residual"也是考点。' },
        { kind: 'trap', claim: 'In the Boston example, a 80/20 split means N_train = 400 and N_test = 100.', verdict: 'F', explain: 'test_size=0.2 是<b>比例</b>：N_train=404、N_test=102（80% × 506 ≈ 405，向下取整机制）。看到具体数字题要会算 N_train + N_test = N。' },
      ],
    },
    {
      id: 'l03-s7',
      title: '多项式回归模型',
      titleEn: 'Polynomial Regression Model',
      blocks: [
        { kind: 'formula', tex: 'f(x, \\theta) = b + w_1 x + w_2 x^2 + \\dots + w_m x^m, \\qquad \\theta = [b, w_1, \\dots, w_m]',
          explain: 'm = degree of the polynomial = <b>model order</b>，也是模型复杂度的度量：<b>the larger the order m, the more complex the model</b>。sklearn：make_pipeline(PolynomialFeatures(m), LinearRegression())。' },
        { kind: 'p', html: '关键退化关系：<b>when m = 1, the polynomial regression model reduces to the simple linear regression model</b>。简单线性回归是多项式回归的特例。' },
        { kind: 'p', html: '案例结果对比（同一数据集、同一划分）：simple linear regression 的 Test MSE = 46.1448、R² = 0.3708；polynomial (m=2) 的 Test MSE = <b>35.3698</b>、R² = <b>0.5177</b>。m=2 的预测能力更好（MSE 降、R² 升）。' },
        { kind: 'p', html: '自然的问题：<b>if we increase the model order m, can we get better prediction capability?</b>——不一定！m 太大将 overfit（见 Lecture 5 的 bias-variance 分析）。这引出了 model complexity selection 的主题。' },
        { kind: 'trap', claim: 'The larger the model order m, the better the prediction capability of the polynomial regression model.', verdict: 'F', explain: 'm 越大模型越复杂：training error 一定越来越小，但 <b>test error 会先降后升</b>（overfitting）。预测能力由 test error 决定，不是越大越好。' },
        { kind: 'trap', claim: 'Polynomial regression is a nonlinear regression method because the fitted curve is not a straight line.', verdict: 'F', explain: '注意课件语境：polynomial regression <b>仍属 linear regression</b>——它对<b>参数 θ 是线性的</b>（关于 w 的线性组合），用的还是 LS 方法；非线性指的是对输入 x 的变换。这是经典概念题。' },
        {
          kind: 'quiz',
          title: 'Lecture 3 自测',
          questions: [
            { q: 'Which of the following quantities is used to measure the model complexity of a model structure f(x,θ)?', type: 'mcq', options: ['(a) The number of training data points N_train', '(b) The number of elements contained in θ', '(c) The value of the loss function L(θ)', '(d) The test MSE'], answer: '(b)', explain: 'Model complexity = θ 中未知参数的个数（元素个数）。' },
            { q: 'When m = 1, the polynomial regression model reduces to the simple linear regression model.', type: 'tf', answer: 'T', explain: 'm=1 时 f(x,θ)=b+w₁x，正是 simple linear regression。' },
            { q: 'The maximum possible value of Test R² is 1.', type: 'tf', answer: 'T', explain: 'R² ≤ 1，等于 1 表示输出变量的变异完全被模型预测。' },
            { q: 'Explain in one sentence what the least squares method does.', type: 'sa', answer: 'It estimates the unknown parameters by minimizing the sum of squared prediction errors (the MSE) over the training data.', explain: '答题抓三个点：minimizing、squared errors、training data。' },
          ],
        },
      ],
    },
  ],
};

export default l03;
