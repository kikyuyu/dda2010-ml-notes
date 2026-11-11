import type { Lecture } from '../types';

const l16: Lecture = {
  id: 'l16',
  num: 16,
  titleEn: 'Elbow Method, K-means Pros/Cons & Agglomerative Clustering',
  titleZh: '肘部法则、K-means 优缺点与凝聚式层次聚类',
  sections: [
    {
      id: 'l16-s1',
      title: '肘部法则（Elbow Method）选 K',
      titleEn: 'Determine the Number of Clusters',
      blocks: [
        {
          kind: 'term',
          en: 'Elbow method',
          zh: '肘部法则',
          note: '把 WCSS（within-cluster sum of squares）对簇数 K 作图，选取曲线的"肘部"（elbow）作为簇数。肘部是收益递减的拐点：过了它再增加 K，WCSS 的下降不再值得额外成本。',
        },
        {
          kind: 'figure',
          src: 'cl_elbow.png',
          title: 'WCSS–K 曲线与肘部',
          caption: 'K 增大 WCSS 单调下降；在肘部（本例 K=3）之后曲线明显变平缓，说明增加簇的收益递减。',
          guide: '考试读图：横轴 K、纵轴 WCSS（inertia_）；找"拐弯处"（斜率突变点）即最佳 K。Iris 上肘部在 K=3，与真实类别数一致。',
        },
        { kind: 'p', html: 'sklearn 拿 WCSS：<code>model = KMeans(n_clusters=k, random_state=0); model.fit(X); wcss = model.inertia_</code>。Iris 验证：K=3 时 Rand index = <b>0.82</b>，K=4 时降到 <b>0.74</b>——肘部选出的 K 确实更好。' },
        {
          kind: 'trap',
          claim: '用 elbow method 选 K 时，应选 WCSS 最小的 K。',
          verdict: 'F',
          explain: 'WCSS 随 K 增大单调下降（K=N 时为 0），选最小毫无意义。应选曲线的 elbow——WCSS 下降由快转慢的拐点，即 diminishing returns 的开始点。',
        },
      ],
    },
    {
      id: 'l16-s2',
      title: 'K-means 的 Pros and Cons',
      titleEn: 'Pros and Cons of K-means',
      blocks: [
        {
          kind: 'table',
          title: 'K-means 优缺点（简答题模板）',
          header: ['Pros', 'Cons'],
          rows: [
            ['relatively easy to understand and implement（直观、易实现）', 'K needs to be specified in advance；选错 K 会导致糟糕的聚类结果'],
            ['suitable for a wide range of applications：image segmentation、text categorization、market segmentation', 'sensitive to the initial placement of cluster centroids——different initializations may lead to different results'],
          ],
        },
        {
          kind: 'p',
          html: '<b>Customer segmentation 案例</b>：用 age、annual income、spending score 做 K-means（elbow 选 K=5），再对每个簇计算均值、统计男女比例，得到 5 类客户画像（如 cluster 3：低收入高消费、均龄 26）。注意案例演示了<b>换 random_state 结果会变</b>（对初始化敏感）。',
        },
        {
          kind: 'trap',
          claim: 'K-means 的聚类结果与初始 centroid 的选取无关，任意初始化都得到相同结果。',
          verdict: 'F',
          explain: 'K-means is sensitive to the initial placement of cluster centroids：不同初始化可能导致不同结果（cons 之一），工程上用 random_state 固定或多次运行取优。',
        },
      ],
    },
    {
      id: 'l16-s3',
      title: '层次聚类与 Dendrogram',
      titleEn: 'Hierarchical Clustering & Dendrogram',
      blocks: [
        {
          kind: 'p',
          html: '<b>Hierarchical clustering</b>：构建簇的层次结构（hierarchy of clusters）。分两类：<b>Agglomerative clustering</b>（bottom-up：每个点开始是 singleton cluster，逐步合并直到只剩一个簇）和 <b>Divisive clustering</b>（top-down：所有点开始在一个簇，逐步分裂直到每点自成一簇）。Divisive 与 agglomerative 相反，<b>实际中不常用</b>。',
        },
        {
          kind: 'term',
          en: 'Dendrogram',
          zh: '树状图',
          note: '表示树形结构的图，展示簇如何被层次地合并/分裂；每个节点代表一个簇，每个叶节点代表 singleton cluster（只含一个数据点）。',
        },
        {
          kind: 'steps',
          title: 'Agglomerative clustering 主流程',
          items: [
            '每个数据点是一个 singleton cluster；',
            '计算数据点（singleton cluster）之间的距离；',
            '合并最近的两个簇；',
            '更新簇之间的距离；',
            '重复 3–4 直到只剩一个簇；',
            '画出 dendrogram 表示聚类结果。',
          ],
        },
        {
          kind: 'p',
          html: '关键操作：①簇间距离度量（linkage method，不同选择 → 不同算法）；②如何画 dendrogram。',
        },
      ],
    },
    {
      id: 'l16-s4',
      title: '四种 Linkage 方法',
      titleEn: 'Distance Metrics between Clusters',
      blocks: [
        {
          kind: 'table',
          title: 'Linkage methods（定义簇 C_i 与 C_j 之间的距离）',
          header: ['Linkage', '公式', '含义'],
          rows: [
            ['Single', 'd(Cᵢ,Cⱼ) = min{d(p,q): p∈Cᵢ, q∈Cⱼ}', '两簇中<b>最近</b>点对之间的距离'],
            ['Complete', 'd(Cᵢ,Cⱼ) = max{d(p,q): p∈Cᵢ, q∈Cⱼ}', '两簇中<b>最远</b>点对之间的距离'],
            ['Average', 'd(Cᵢ,Cⱼ) = Σd(p,q)/(Nᵢ×Nⱼ)', '所有跨簇点对距离的<b>平均</b>'],
            ['Centroid', 'd(Cᵢ,Cⱼ) = d(cᵢ, cⱼ)', '两簇 <b>centroid</b>（均值点）之间的距离'],
          ],
        },
        { kind: 'p', html: '注意 p、q 本身也可以是簇（递归定义）。点间距离 d(p,q) 本身又可用 Euclidean、Manhattan、Chebyshev、Minkowski 等。' },
        {
          kind: 'trap',
          claim: 'Single linkage 用两个簇中相距最远的点对之间的距离定义簇间距离。',
          verdict: 'F',
          explain: '恰好相反：single linkage 用<b>最近</b>点对（min）；<b>最远</b>点对（max）是 complete linkage。',
        },
      ],
    },
    {
      id: 'l16-s5',
      title: '如何画 Dendrogram',
      titleEn: 'How to Draw a Dendrogram',
      blocks: [
        {
          kind: 'formula',
          tex: '\\text{branch length} = \\frac{d(a, b)}{2}',
          explain: '节点 z 连接簇 a、b 的分支长度 = 两簇距离的一半。分支长度是簇间距离的度量：合流位置越高（分支越长），两簇离得越远。',
        },
        {
          kind: 'steps',
          title: '课件五样本例子（a,b,c,d,e，single linkage）',
          items: [
            '最近点对 d(a,b)=12 → 合并成 u=(a,b)，a、b 到 u 的分支长度 = 12/2 = <b>6</b>；',
            '更新距离：d(u,c)=min(18,18)=18，d(u,d)=min(40,35)=35，d(u,e)=min(18,18)=18；',
            '最小值 18 出现两次（u–c、u–e）→ 合并 u、c、e 成 v，三支长度 = 18/2 = <b>9</b>；',
            '再更新：d(v,d)=min(35,19,32)=19 → 合并 v 与 d，两支长度 = 19/2 = <b>9.5</b>。',
          ],
        },
        {
          kind: 'figure',
          src: 'cl_dendrogram_linkage.png',
          title: 'Dendrogram 示例',
          caption: '底部每个叶是一个样本；两簇合并处的高度 = 簇间距离（分支长度为其一半）；横线切在哪里就得到多少个簇。',
          guide: '考试画图要点：①先合并最近的点对，合流高度等于它们的距离；②新簇与旧簇的距离按 linkage 规则（如 single linkage 取 min）更新；③分支长度 = 合并距离 ÷ 2；④切一条水平线，与几条竖线相交就得到几个簇。',
        },
        {
          kind: 'trap',
          claim: 'Dendrogram 中分支长度等于被合并两簇之间的完整距离 d(a,b)。',
          verdict: 'F',
          explain: '分支长度 = d(a,b)/2（两簇各"承担"一半）；合流处的高度才等于 d(a,b)。分支长度是簇间距离的度量。',
        },
      ],
    },
    {
      id: 'l16-s6',
      title: '本讲自测',
      titleEn: 'Quiz',
      blocks: [
        {
          kind: 'quiz',
          title: 'Lecture 16 自测题',
          questions: [
            { q: 'T/F：elbow method 选择使 WCSS 最小的 K 作为簇数。', type: 'tf', answer: 'F', explain: '选曲线的 elbow（拐点），即 WCSS 收益开始递减的点。' },
            { q: 'K-means 的 cons 包括（多选概念）：①K 需事先给定；②对初始 centroid 敏感。', type: 'tf', answer: 'T' },
            { q: '写出 single linkage 与 complete linkage 的簇间距离定义。', type: 'sa', answer: 'single：两簇间最近点对距离 min d(p,q)；complete：最远点对距离 max d(p,q)。' },
            { q: 'd(a,b)=12 合并 a、b，则 a 到新节点 u 的 branch length 为（ ）。', type: 'mcq', options: ['12', '6', '24', '3'], answer: '6' },
            { q: 'T/F：在 dendrogram 上切一条水平线，与几条竖线相交就得到几个簇。', type: 'tf', answer: 'T' },
            { q: 'Agglomerative 与 divisive clustering 的区别是？', type: 'sa', answer: 'Agglomerative 是 bottom-up（从 singleton 逐步合并到一个簇）；divisive 是 top-down（从一个簇逐步分裂到 singleton），且 divisive 实际中不常用。' },
            { q: 'T/F：dendrogram 中合流位置越高，说明被合并的两簇距离越远。', type: 'tf', answer: 'T' },
          ],
        },
      ],
    },
  ],
};

export default l16;
