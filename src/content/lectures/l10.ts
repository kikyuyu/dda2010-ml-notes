import type { Lecture } from '../types';

const l10: Lecture = {
  id: 'l10',
  num: 10,
  titleEn: 'Text Vectorization, Perceptron & Hard Margin SVM',
  titleZh: '文本向量化、感知机与硬间隔支持向量机',
  sections: [
    {
      id: 'l10-s1',
      title: '文本向量化方法总览',
      titleEn: 'Text Vectorization',
      blocks: [
        { kind: 'p', html: '<b>Text Vectorization</b>：把文本/词语转换成数值向量的过程，因为计算机只能处理 numerical data。方法分三大类（考试常考分类题）：' },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<b>Integer Encoding and One-hot Encoding</b>：预处理级别的简单编码。',
            '<b>Bag of Words Methods</b>：忽略词序和语法（ignoring word order and grammar），只关注每个词是否出现及出现频率。包括 <b>Count Vectorization</b> 与 <b>TF-IDF Vectorization</b>。',
            '<b>Methods to Capture Semantic and Contextual Information</b>：① Statistical/Matrix Factorization：LSA、LDA（捕捉 latent topics）；② Static Word Embeddings：Word2Vec（CBOW、Skip-gram）、GloVe、FastText（dense vectors with semantic distance, but context-independent）；③ Contextual Embeddings（Deep Learning）：ELMo、BERT、GPT（dynamic, context-aware dense vectors）。',
          ],
        },
        {
          kind: 'term', en: 'Bag of Words (BoW)', zh: '把文本看成装满词的"袋子"，忽略词序与语法，只统计词频。', note: 'BoW 能捕捉词相对于语料的相关性，但不包含 semantic information。',
        },
        {
          kind: 'steps',
          title: 'Bag of Words 的四步流程',
          items: [
            '<b>Tokenization</b>：把文本切分成一个个词（tokens），给每个 unique word 分配整数 id。',
            '<b>Building Vocabulary</b>：收集 corpus 中所有 unique words 构成 vocabulary。',
            '<b>Counting Frequencies</b>：对每条文本，统计 vocabulary 中每个词出现的频率。',
            '<b>Generating Vector</b>：按 vocabulary 顺序把频率填入向量。',
          ],
        },
      ],
    },
    {
      id: 'l10-s2',
      title: 'Count Vectorization 及其缺点',
      titleEn: 'Count Vectorization',
      blocks: [
        {
          kind: 'p',
          html: '<b>Count Vectorization</b>：向量每个位置是该词在 document 中的 <b>raw count</b>（原始计数）。sklearn 用法：<code>CountVectorizer()</code> → <code>fit_transform(corpus)</code>；<code>.vocabulary_</code> 查看词表；对新文档用 <code>.transform(new_doc)</code>（注意是 transform 不是 fit_transform，保持原词表不变）。',
        },
        {
          kind: 'p',
          html: '<b>例子</b>（考试可能给数字让你辨认）：corpus = ["love this movie and that movie", "This movie is very very terrible"]，词表按字母序为 [\'and\',\'is\',\'love\',\'movie\',\'terrible\',\'that\',\'this\',\'very\']，两条文档的 count 向量分别是 [1,0,1,2,0,1,1,0] 和 [0,1,0,1,1,0,1,2]；新文档 "That movie is so amazing, is it?" 为 [0,2,0,1,0,1,0,0]（词表外的 "so"/"amazing"/"it" 被忽略，"is" 出现 2 次）。',
        },
        {
          kind: 'steps',
          title: 'Count Vectorization 的缺点（四条，常考简答）',
          items: [
            '<b>Bias towards Frequent Words</b>：高频词（the、is、a）主导特征空间，可能掩盖稀有但有意义的词。',
            '<b>Lack of Normalization</b>：不考虑文档长度，长文档计数天然偏高。',
            '<b>Ignores Semantic Information</b>：每个 token 是独立实体，不捕捉词间语义关系。',
            '<b>Limited Information</b>：不考虑词序，而词序在 sentiment analysis 等任务中可能很关键。',
          ],
        },
      ],
    },
    {
      id: 'l10-s3',
      title: 'TF-IDF Vectorization',
      titleEn: 'TF-IDF Vectorization',
      blocks: [
        {
          kind: 'p',
          html: '<b>TF-IDF</b>：向量每个元素是 <b>term frequency (TF)</b> 与 <b>inverse document frequency (IDF)</b> 的乘积，用来压制高频常见词、突出稀有信息词。sklearn 用法与 CountVectorizer 相同，换成 <code>TfidfVectorizer()</code>。',
        },
        {
          kind: 'formula',
          tex: '\\mathrm{tf}(d, v) = \\frac{\\text{raw count of the word } v \\text{ in document } d}{\\text{total number of words in document } d}',
          explain: '词频的归一化：0 ≤ tf(d,v) ≤ 1，越大表示该词在本文档中出现得越频繁。',
        },
        {
          kind: 'formula',
          tex: '\\mathrm{idf}(v) = \\log\\left(\\frac{1 + N}{1 + \\mathrm{df}(v)}\\right) + 1',
          explain: 'N 为 corpus 中文档总数，df(v) 为包含词 v 的文档数。idf(v) ≥ 1；词越稀有 idf 越大，说明它提供的信息越多。',
        },
        {
          kind: 'formula',
          tex: '\\mathrm{tf\\text{-}idf}(d, v) = \\mathrm{tf}(d, v) \\times \\mathrm{idf}(v)',
          explain: '最终每个文档的 TF-IDF 向量还要做 L2 归一化：除以它的 2-范数（sklearn 默认行为）。',
        },
        {
          kind: 'p',
          html: '<b>TF-IDF 的缺点</b>：Ignores Semantic Information（无语义关系）、Limited Information（忽略词序）。要捕捉语义与词序需要用 deep learning 方法（如 BERT、GPT 等 contextual embeddings）。',
        },
        {
          kind: 'trap',
          claim: '在 TF-IDF 中，一个词在越多文档中出现，它的 IDF 越大。',
          verdict: 'F',
          explain: '恰好相反：idf(v) 随文档频率增大而减小——越常见的词 IDF 越接近 1，越稀有的词 IDF 越大、信息量越大。',
        },
        {
          kind: 'trap',
          claim: 'TF-IDF vectorization 能够捕捉词与词之间的语义关系。',
          verdict: 'F',
          explain: 'TF-IDF 与 Count Vectorization 都只统计词频，treats each token as a separate entity，不捕捉语义关系与词序；捕捉语义要靠 word embeddings / deep learning 方法。',
        },
      ],
    },
    {
      id: 'l10-s4',
      title: '文本分类与二分类引入',
      titleEn: 'Text Classification with kNN & Binary Classification',
      blocks: [
        { kind: 'p', html: '完整 pipeline：20 Newsgroups（18,000 篇帖子、20 个类别，本例取其中 4 类）→ <code>TfidfVectorizer(stop_words=\'english\')</code> 向量化 → <code>KNeighborsClassifier(n_neighbors=1)</code> 训练 → test accuracy ≈ <b>0.827</b>。注意 <b>训练集 fit_transform、测试集只用 transform</b>，防止信息泄露。' },
        {
          kind: 'p',
          html: '<b>Binary Classification</b>：把数据分到两个互斥类别中的任务。接下来三讲介绍三种 <b>linear binary classifiers</b>：<b>Perceptron → SVM → Logistic Regression</b>。它们的分界面都是 linear decision boundary。',
        },
        {
          kind: 'figure',
          src: 'figures/lc_perceptron.png',
          title: '线性分类器的直线决策边界',
          caption: '线性二分类器用一条直线（高维中是超平面）w·x + b = 0 把两类分开；直线的斜率由 −w₁/w₂ 决定、截距由 −b/w₂ 决定。',
          guide: '看图说话模板：①边界是直线→线性分类器；②边界位置由 b（截距）和 w（斜率）共同决定；③边界到两侧最近点的距离就是后面要讲的 margin。',
        },
      ],
    },
    {
      id: 'l10-s5',
      title: 'Perceptron',
      titleEn: 'Perceptron',
      blocks: [
        {
          kind: 'formula',
          tex: 'y = f(x, \\theta) = \\begin{cases} 1 & \\text{if } w \\cdot x + b \\geq 0 \\\\ 0 & \\text{otherwise} \\end{cases}',
          explain: 'Perceptron 是 linear binary classifier（threshold function）：w 是 weight vector，b 是 bias，θ = [b, w] 是待估计参数，w·x 是 dot product，w·x + b = 0 是 decision boundary。',
        },
        {
          kind: 'p',
          html: '参数估计：最小化误分类数（misclassification），即 $\\hat w, \\hat b = \\arg\\min_{w,b} \\sum_{i=1}^{N_{train}} |y^{train}_i - \\hat y^{train}_i|$。训练就是不断修正被错分的样本直到收敛或停止；sklearn 中用 <code>Perceptron()</code>，<code>max_iter</code> 与 <code>n_iter_no_change</code> 控制迭代。',
        },
        {
          kind: 'term',
          en: 'Linearly separable data',
          zh: '如果两类数据能被一条线性 decision boundary 完全分开，则称 linearly separable；否则 linearly non-separable。',
        },
        {
          kind: 'steps',
          title: 'Perceptron 训练的两个保证（考试核心结论）',
          items: [
            '若训练数据 <b>linearly separable</b>：训练<b>保证</b>能找到一条分开训练数据的线性边界；但这样的边界可能有很多条，perceptron 停在<b>其中任意一条</b>上，质量参差不齐（这正是 SVM 要解决的问题）。',
            '若训练数据 <b>not linearly separable</b>：训练停在一个"妥协"的线性边界上，即在最小化 misclassification 意义下的折中。错分的黄点把边界往左拉、蓝点往右拉，最终达到折中。',
          ],
        },
        {
          kind: 'trap',
          claim: '只要训练数据 linearly separable，perceptron 训练得到的决策边界就是唯一且最优的。',
          verdict: 'F',
          explain: 'Perceptron 只保证找到"一条"能分开数据的线性边界；可能存在很多条，perceptron 可能停在任意一条上，质量不同。寻找"最优"（margin 最大）边界是 SVM 的目标。',
        },
        {
          kind: 'trap',
          claim: '训练数据不可线性分时，perceptron 的训练会失败且得不到任何边界。',
          verdict: 'F',
          explain: '不可分时训练会停在一个折中的线性边界上——在最小化 misclassification 的意义下达到左右拉扯的平衡，而不是失败。',
        },
      ],
    },
    {
      id: 'l10-s6',
      title: 'SVM 引入：Margin 与硬间隔',
      titleEn: 'SVM: Margin & Hard Margin Classifier',
      blocks: [
        { kind: 'p', html: '对 linearly separable 数据，perceptron 能找到很多条边界，哪条更好？直觉：<b>DB1 比 DB2 好</b>，因为两者都没有 bias，而 DB1 对训练数据的小扰动更 robust。这个直觉用 <b>margin</b> 和 <b>support vector</b> 来严格表述：DB1 更好是因为它有 <b>larger margin</b>。' },
        {
          kind: 'term',
          en: 'Margin', zh: '间隔', note: '分开两类的两条 parallel hyperplanes 之间的垂直距离。',
        },
        {
          kind: 'term',
          en: 'Support vectors', zh: '落在两条边界 hyperplane 上（即落在最大间隔上）的数据点。',
        },
        {
          kind: 'list',
          items: [
            '<b>Maximum-margin decision boundary</b>：到两侧最近数据点距离都最大的边界（maximizing the margin between the two classes）。',
            '<b>No data points are allowed to fall within the margin!</b> 任何点都不允许落在间隔内部。',
            '<b>Maximal margin classifier 只取决于 support vectors</b>：移动 support vectors 会改变边界；移动其他点边界不变。',
          ],
        },
        {
          kind: 'formula',
          tex: '\\hat w, \\hat b = \\arg\\min_{w, b} \\|w\\|, \\quad \\text{subject to } y^{train}_i (w \\cdot x^{train}_i + b) \\geq 1,\\ \\forall i',
          explain: '最大化 margin ⇔ 最小化 ‖w‖（约束条件 y_i(w·x_i+b) ≥ 1 把所有训练样本挡在间隔外）。课件里 y ∈ {−1, 1}（注意与 perceptron 的 {0,1} 不同！）。',
        },
        {
          kind: 'figure',
          src: 'svm_margin_C.png',
          title: '最大间隔决策边界与支持向量',
          caption: '虚线是间隔边界，落在虚线上的点就是 support vectors；决策边界在两条虚线正中间，且间隔内不允许有任何数据点。',
          guide: '考试画图题：①标出 support vectors（贴着虚线的点）；②决策边界在两条虚线正中间；③硬间隔要求间隔内零数据点；④哪些点移动会改变边界？只有 support vectors。',
        },
        {
          kind: 'term',
          en: 'Hard margin classifier',
          zh: '硬间隔分类器',
          note: '对 linearly separable 数据，找到没有任何点落入 margin、也没有误分类的线性边界；maximal margin classifier 就是一种 hard margin classifier。',
        },
        {
          kind: 'p',
          html: '<b>Hard margin 的局限</b>：训练数据 linearly nonseparable 时不存在满足全部约束 y_i(w·x_i+b) ≥ 1 的 (w, b)，硬间隔分类器<b>无解</b>——这就是下一讲 soft margin 要解决的问题。',
        },
        {
          kind: 'trap',
          claim: 'Maximal margin classifier 不只依赖 support vectors，训练集中的每个点对决策边界都有影响。',
          verdict: 'F',
          explain: 'Maximal margin classifier ONLY depends on the support vectors：移动非支持向量点边界完全不变；只有移动 support vectors 才会改变边界与间隔。',
        },
      ],
    },
    {
      id: 'l10-s7',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 10 自测题',
          questions: [
            { q: 'T/F：Bag of Words 方法会保留文本中单词的顺序信息。', type: 'tf', answer: 'F', explain: 'BoW 忽略词序和语法，只统计词频。' },
            { q: '在 TF-IDF 中，一个在所有文档中都出现的词，其 IDF（ ）。', type: 'mcq', options: ['很大', '很小（接近 1）', '等于 0', '等于词频'], answer: '很小（接近 1）' },
            { q: '写出 TF-IDF 的计算公式，并解释 TF 和 IDF 各自的含义。', type: 'sa', answer: 'tf-idf(d,v) = tf(d,v) × idf(v)；tf 是词 v 在文档 d 中的归一化词频（raw count / 文档总词数），idf = log((1+N)/(1+df)) + 1 衡量词在整个 corpus 中的稀有程度，词越稀有 idf 越大、信息量越大。' },
            { q: 'T/F：Perceptron 中，参数通过最小化 misclassification（误分类数）来估计。', type: 'tf', answer: 'T' },
            { q: 'T/F：训练数据 linearly separable 时，perceptron 训练保证找到唯一的最优决策边界。', type: 'tf', answer: 'F' },
            { q: 'Maximal margin classifier 的参数估计问题是什么？约束条件的含义是？', type: 'sa', answer: 'min ‖w‖ s.t. y_i(w·x_i+b) ≥ 1 对所有训练样本成立（最小化 ‖w‖ 即最大化 margin；约束保证所有点被正确分类且落在间隔外，即间隔内不允许有数据点）。' },
            { q: 'T/F：移动训练集中不是 support vector 的数据点，maximal margin classifier 的决策边界会改变。', type: 'tf', answer: 'F' },
            { q: '为什么 linearly nonseparable 数据上没有 hard margin classifier？', type: 'sa', answer: '因为不存在任何 (w,b) 能同时满足所有约束 y_i(w·x_i+b) ≥ 1——总会有点被错分或落入间隔，优化问题无解。' },
          ],
        },
      ],
    },
  ],
};

export default l10;
