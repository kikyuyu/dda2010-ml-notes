// 图片缓存版本号：每次重新生成 figures 后更新此值，
// 可确保浏览器/CDN 立即获取新图，而不是使用旧缓存。
export const FIG_V = '20261112a';

export function fig(src: string): string {
  const s = src.replace(/^figures\//, '');
  return `figures/${s}?v=${FIG_V}`;
}
