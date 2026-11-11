# DDA2010 Applied Machine Learning · 学习站

从零开始学习机器学习的公开学习网站（CUHK-SZ DDA2010, Tianshi Chen）。

- 18 讲课件知识点全覆盖，按 7 大主题组织（导论 / 回归 / kNN / 线性分类器 / 决策树 / 聚类 / 降维与 PCA）
- 专业术语与关键解释保留英文，详细讲解使用中文
- 每个算法配对比图示与读图指南（考试常考看图解释）
- 从 Assignment 1–3 反推 96 个判断题陷阱卡 + 每讲 Assignment 风格自测题
- 「我的标记」：选中文字即可高亮 + 备注，右下角按钮按讲次查看并跳转定位（数据存于浏览器 localStorage）
- 黑巴蓝简约风 + 微软雅黑

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build   # 输出到 dist/
```

## 更新内容

课件内容全部在 `src/content/lectures/l01.ts` ~ `l18.ts`（数据文件），
新增或修改课件只需编辑对应数据文件并在 `src/content/index.ts` 注册即可，
页面结构、样式、标记功能无需改动。

## 部署

推送到 main 分支后，GitHub Actions 自动构建并发布到 GitHub Pages
（见 `.github/workflows/pages.yml`）。
