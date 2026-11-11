import type { Lecture } from '../types';

const l02: Lecture = {
  id: 'l02',
  num: 2,
  titleEn: 'Python Basics, AI-Assisted Programming & Key Components of Regression',
  titleZh: 'Python 与 AI 辅助编程 · 回归的七大要素',
  sections: [
    {
      id: 'l02-s1',
      title: 'Python 与工具箱（了解即可）',
      titleEn: 'Why Python & ML Libraries',
      blocks: [
        { kind: 'p', html: 'Python 是本课程的编程语言：popular、open source、powerful libraries、语法优雅简洁。考试几乎不涉及安装细节，记住各库的<b>分工</b>即可。' },
        { kind: 'term', en: 'Anaconda', zh: 'Python 与 R 的科学计算发行版，自带约 600 个包，简化 package management 与虚拟环境。' },
        { kind: 'term', en: 'Jupyter Notebook', zh: '基于网页的交互式计算笔记本环境（.ipynb = Interactive Python Notebook），Anaconda 预装，本课程用它写和运行脚本。' },
        { kind: 'term', en: 'NumPy', zh: '科学计算基础包（import numpy as np），提供 sin / cos / exp / log / gcd 等数学函数。' },
        { kind: 'term', en: 'Matplotlib', zh: 'Python 可视化库，用于绘制各种 static / animated / interactive 图。' },
        {
          kind: 'table',
          title: '三大机器学习库的分工（选择题可能考"哪个库做什么"）',
          header: ['库', '用途', '备注'],
          rows: [
            ['sklearn (Scikit-learn)', 'basic learning algorithms：回归、分类、聚类、降维、model selection、data preprocessing', '构建在 NumPy / SciPy / matplotlib 之上，本课程主力'],
            ['TensorFlow', '数学运算与<b>深度神经网络</b>的训练和推理', 'Google Brain 团队开发'],
            ['Keras', '处理 TensorFlow 中人工神经网络的 Python 接口', '本课程用它几行代码搭建 MLP'],
          ],
        },
        { kind: 'term', en: 'MLP (Multi-layer Perceptron)', zh: '多层感知机：一种 feedforward neural network，由多层互相连接的人工神经元组成。用 Keras 的 Sequential + model.add(Dense(...)) 几行即可搭建。' },
        { kind: 'p', html: 'REPL（Read Evaluate Print Loop）：交互式一行行执行代码；写多行代码则用 script 文件。' },
      ],
    },
    {
      id: 'l02-s2',
      title: 'AI 辅助编程流程',
      titleEn: 'AI-Assisted Programming',
      blocks: [
        { kind: 'term', en: 'Generative AI', zh: '能够根据 prompts 生成文本、图像、视频等数据的 AI 类；transformer-based 深度神经网络（尤其 LLMs）的进步推动了 2020s 初的生成式 AI 热潮。' },
        { kind: 'steps', title: 'AI-Assisted Programming Flow in DDA2010', items: [
          '用英文描述任务，输入 prompt（必要时调整描述）；',
          'AI assistant 生成代码；',
          '<b>Examine the code to see if it is reasonable</b>（检查代码是否合理）；',
          'Test the code：在 Jupyter Notebook 中运行；',
          '结果正确 → 完成；出错 → 把 error message 贴回 AI assistant，重复以上流程。',
        ]},
        { kind: 'p', html: '可用工具：DeepSeek、Kimi、Qianwen、ChatGPT、Copilot、Gemini、Cody 等。课程要求只需<b>读懂示例代码并做小修改</b>，考试不考手写代码。' },
      ],
    },
    {
      id: 'l02-s3',
      title: '数据集 Data Set：术语精确定义',
      titleEn: 'Data Set',
      blocks: [
        {
          kind: 'formula',
          tex: '\\{y_i, x_i,\\ i = 1, \\dots, N\\}, \\qquad y_i = f^0(x_i) + e_i',
          explain: '<b>N</b>：sample size / number of data points（样本量）；<b>x_i</b>：input data / the feature（输入/特征）；<b>y_i</b>：output data（输出）；<b>e_i</b>：measurement noise（测量噪声）。数据集 = N 对输入输出的集合。',
        },
        { kind: 'p', html: '判断题常在这里抠字眼："input data 也叫 feature"（T）；"y_i 是 f⁰(x_i) 的精确值"（F，因为有噪声）。' },
      ],
    },
    {
      id: 'l02-s4',
      title: '为什么需要 Test Data（核心思想）',
      titleEn: 'Need of Test Data in Practice',
      blocks: [
        { kind: 'p', html: '课件的思想实验分三步，务必理解：<br>① 若知道 true function f⁰：两个估计谁更好一目了然——谁更接近 f⁰ 谁好，closeness 用 Σ(f(x_i) − f̂(x_i))² 衡量；<br>② <b>若不知道 true function</b>： NOTHING can be said —— 必须先把"better"定义出来；<br>③ 实践中 <span class="en-t">the true function is never known</span>，所以把数据切成 training data 与 test data，用 test data 上的预测误差来定义"更好"。' },
        {
          kind: 'trap',
          claim: 'Without knowing the true function, we can still tell which of two estimates is better by looking at the training data alone.',
          verdict: 'F',
          explain: '不知道 true function 时<b>无法</b>仅凭训练数据说哪个估计更好（nothing can be said）。正因为 true function never known in practice，才需要 data split，用 <b>test data</b> 上的预测精度来评估。',
        },
        { kind: 'figure', src: 'reg_train_test_mse.png', title: 'Training MSE vs Test MSE', caption: '左：training MSE 随模型复杂度单调下降，但 test MSE 先降后升；右：训练时 test data 必须保持"未见"。', guide: '左图两条曲线的分叉是 overfitting 的标志性图形：training MSE 越来越小（模型把训练数据连同噪声都记住了），test MSE 反而变大（对新数据预测变差）。最优模型阶数在 test MSE 的最低点。' },
      ],
    },
    {
      id: 'l02-s5',
      title: '数据划分 Data Split 的定义',
      titleEn: 'Data Split',
      blocks: [
        { kind: 'term', en: 'Training Data', zh: '用于训练估计 f̂ 的数据，样本量记 N_train（data for training f̂）。' },
        { kind: 'term', en: 'Test Data', zh: '用于评估（assessing）估计 f̂ 的数据，样本量记 N_test（data reserved exclusively to assess the model）。', note: 'test data 绝不可参与训练！' },
        {
          kind: 'formula',
          tex: 'N_{train} + N_{test} = N',
          explain: '数据集被切成两部分，样本量守恒。NOTE: there are many ways to split a data set（划分方式不唯一）。',
        },
        {
          kind: 'formula',
          tex: '\\sum_{i=1}^{N_{test}} \\big(y_i^{test} - \\hat{f}(x_i^{test})\\big)^2 \\ \\rightarrow\\ \\text{as small as possible}',
          explain: '实践版 function estimation：基于 training data 估计 f̂，使 test data 上的预测 ŷ_test = f̂(x_test) 与真实输出 y_test 的<b>平方误差之和</b>尽可能小。评估指标由此诞生。',
        },
        {
          kind: 'steps',
          title: '回归 / 函数估计的七大要素（本课程骨架，之后每一讲都在填它们）',
          items: [
            '<b>Data set</b>（数据集）→ ② <b>Data split</b>（数据划分）',
            '<b>Model structure</b>（模型结构 f(x,θ)）→ ④ <b>Parameter estimation</b>（参数估计）',
            '<b>Prediction</b>（预测）→ ⑥ <b>Model evaluation</b>（模型评估）',
            '<b>Model structure selection</b>（模型结构选择）',
          ],
        },
        {
          kind: 'trap',
          claim: 'The test data should also be used in training to make the model better.',
          verdict: 'F',
          explain: 'Test data 的唯一用途是 <b>assessing（评估）</b>模型。用 test data 训练会让评估失真（相当于考试泄题），这是贯穿全课程的铁律。',
        },
        {
          kind: 'quiz',
          title: 'Lecture 2 自测',
          questions: [
            { q: 'The sample size of the training data plus the sample size of the test data equals the sample size of the whole data set.', type: 'tf', answer: 'T', explain: 'N_train + N_test = N，划分只是切分数据，不增不减。' },
            { q: 'Which library provides basic learning algorithms for regression, classification, clustering, dimensionality reduction, model selection and data preprocessing?', type: 'mcq', options: ['(a) TensorFlow', '(b) Keras', '(c) Scikit-learn (sklearn)', '(d) Matplotlib'], answer: '(c)', explain: 'sklearn 是基本学习算法库；TensorFlow/Keras 面向深度神经网络；Matplotlib 负责画图。' },
            { q: 'In practice, how do we decide which of two model estimates is better when the true function is unknown?', type: 'sa', answer: 'Split the data set into training data and test data; train both models on the training data and compare their prediction errors (e.g., the sum of squared errors) on the test data. The one with smaller test error is better.', explain: '答题要点：data split + 用 test data 上的误差定义"更好"。' },
          ],
        },
      ],
    },
  ],
};

export default l02;
