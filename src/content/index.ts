// ===== 课程模块结构 & 讲次注册表 =====
import type { CourseModule, Lecture } from './types';

export const modules: CourseModule[] = [
  {
    id: 'intro',
    num: '01',
    titleEn: 'Introduction to Machine Learning',
    titleZh: '机器学习导论',
    desc: '什么是机器学习、五大任务类型、数据集与特征的基本概念，以及本课程的整体地图。',
    lectureIds: ['l01', 'l02'],
    examFocus: '判断任务类型（regression / classification / clustering / dimensionality reduction）、数据集与特征的基本术语。',
  },
  {
    id: 'regression',
    num: '02',
    titleEn: 'Regression',
    titleZh: '回归',
    desc: '从简单线性回归到多项式回归：Least Squares 参数估计、MSE / R² 评估、Bias-Variance 分解、Cross Validation 模型选择、LASSO 正则化与特征选择。',
    lectureIds: ['l03', 'l04', 'l05', 'l06', 'l07'],
    examFocus: '判断题高发区：CV 的用途、test MSE 与 training MSE 的关系、Bias-Variance 分解、LASSO 的性质、R² 与 MSE 的含义。',
  },
  {
    id: 'knn',
    num: '03',
    titleEn: 'kNN & Distance Metrics',
    titleZh: 'kNN 与距离度量',
    desc: 'k-nearest neighbors 分类器：距离度量（Euclidean / Manhattan / Minkowski）、特征缩放、K 的选择、weighted kNN。',
    lectureIds: ['l08', 'l09'],
    examFocus: '距离度量的计算与区别、k 对决策边界复杂度的影响、特征缩放的必要性、lazy learning 概念。',
  },
  {
    id: 'linear-classifier',
    num: '04',
    titleEn: 'Linear Classifiers',
    titleZh: '线性分类器',
    desc: 'Perceptron、SVM（Margin、Support Vectors、Kernel Trick、参数 C）、Logistic Regression（Sigmoid、概率输出）、多分类策略 OvO / OvR、Text Vectorization。',
    lectureIds: ['l10', 'l11', 'l12', 'l13'],
    examFocus: 'SVM 的 C 与 margin 关系、支持向量、核函数作用、sigmoid 输出范围、perceptron 收敛条件、OvO/OvR 的分类器数量。',
  },
  {
    id: 'tree',
    num: '05',
    titleEn: 'Decision Trees',
    titleZh: '决策树',
    desc: '决策树的递归划分、Information Entropy 与 Gini Index 分裂准则、过拟合与 Pruning（max_depth / ccp_alpha）。',
    lectureIds: ['l13', 'l14', 'l15'],
    examFocus: '剪枝的作用与效果、entropy/Gini 在纯结点处取最小值、树复杂度与过拟合。',
  },
  {
    id: 'clustering',
    num: '06',
    titleEn: 'Clustering',
    titleZh: '聚类',
    desc: 'K-Means（WCSS、Elbow Method、初始化敏感性）、Hierarchical Clustering（Agglomerative / Divisive、Linkage、Dendrogram）、聚类与分类的本质区别。',
    lectureIds: ['l15', 'l16', 'l17'],
    examFocus: '聚类目标（不是预测 unseen 标签！）、K-Means 不能靠 CV 选 K、elbow method、linkage 的含义、dendrogram 分支长度。',
  },
  {
    id: 'pca',
    num: '07',
    titleEn: 'Dimensionality Reduction & PCA',
    titleZh: '降维与 PCA',
    desc: 'Principal Component Analysis：主成分、方差最大化投影、Explained Variance、Kernel PCA。',
    lectureIds: ['l18'],
    examFocus: 'PCA 是 feature extraction、PC1 是方差最大方向、kernel PCA 与 kernel SVM 的搭配效果。',
  },
];

// 讲次元数据（详细内容在各 lecture 文件中）
import l01 from './lectures/l01';
import l02 from './lectures/l02';
import l03 from './lectures/l03';
import l04 from './lectures/l04';
import l05 from './lectures/l05';
import l06 from './lectures/l06';
import l07 from './lectures/l07';
import l08 from './lectures/l08';
import l09 from './lectures/l09';
import l10 from './lectures/l10';
import l11 from './lectures/l11';
import l12 from './lectures/l12';
import l13 from './lectures/l13';
import l14 from './lectures/l14';
import l15 from './lectures/l15';
import l16 from './lectures/l16';
import l17 from './lectures/l17';
import l18 from './lectures/l18';

export const lectures: Record<string, Lecture> = {
  l01, l02, l03, l04, l05, l06, l07, l08, l09, l10,
  l11, l12, l13, l14, l15, l16, l17, l18,
};

export function moduleById(id: string): CourseModule | undefined {
  return modules.find((m) => m.id === id);
}

export function getModuleLectures(mod: CourseModule): Lecture[] {
  return mod.lectureIds.map((id) => lectures[id]).filter(Boolean);
}
