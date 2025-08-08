// 색상 팔레트 (피그마 디자인 기반)
export const colorPalette = [
  '#153641',
  '#22556e',
  '#4799b7',
  '#6db3bf',
  '#94cfc9',
  '#be6c84',
  '#665f79',
  '#355e7c',
  '#f6b192',
  '#f0747f',
  '#f94045',
  '#f99620',
  '#fcc651',
  '#92bd6b',
  '#57758f',
  '#665076',
  '#c75554',
  '#f08f6e',
  '#778c63',
  '#b2bc77',
] as const;

export type ColorPaletteType = typeof colorPalette[number];
