export interface ItemScoutShoppingKeyword {
  rank: number;
  keyword: string;
  category: string;
  searchVolume: number;
  productCount: number;
  competitionRatio: number; // productCount / searchVolume (e.g. 0.72)
  isHoneyKeyword: boolean; // competitionRatio < 1.0
  trendBadge?: string;
}

export const ITEMSCOUT_DAILY_TRENDS_SEED: ItemScoutShoppingKeyword[] = [
  { rank: 1, keyword: "자라", category: "크로스백", searchVolume: 1542200, productCount: 1108538, competitionRatio: 0.72, isHoneyKeyword: true, trendBadge: "NEW" },
  { rank: 2, keyword: "유니클로", category: "패션잡화", searchVolume: 1588300, productCount: 255672, competitionRatio: 0.16, isHoneyKeyword: true, trendBadge: "UP" },
  { rank: 3, keyword: "베스트드라이브", category: "차량용선풍기", searchVolume: 750400, productCount: 22611, competitionRatio: 0.03, isHoneyKeyword: true, trendBadge: "NEW" },
  { rank: 4, keyword: "돌체앤가바나", category: "시계/잡화", searchVolume: 469700, productCount: 131389, competitionRatio: 0.28, isHoneyKeyword: true },
  { rank: 5, keyword: "캠핑의자", category: "자갈캠핑", searchVolume: 466300, productCount: 625918, competitionRatio: 1.34, isHoneyKeyword: false, trendBadge: "UP" },
  { rank: 6, keyword: "한샘", category: "가구", searchVolume: 424400, productCount: 212329, competitionRatio: 0.5, isHoneyKeyword: true },
  { rank: 7, keyword: "닌텐도스위치2", category: "휴대용게임기", searchVolume: 416900, productCount: 122207, competitionRatio: 0.29, isHoneyKeyword: true, trendBadge: "NEW" },
  { rank: 8, keyword: "아이폰16프로", category: "휴대폰케이스", searchVolume: 352800, productCount: 102400, competitionRatio: 0.29, isHoneyKeyword: true },
  { rank: 9, keyword: "에어컨13평", category: "스탠드에어컨", searchVolume: 299000, productCount: 1345, competitionRatio: 0.004, isHoneyKeyword: true, trendBadge: "NEW" },
  { rank: 10, keyword: "인스파이어", category: "테마파크/티켓", searchVolume: 279200, productCount: 11851, competitionRatio: 0.04, isHoneyKeyword: true },
];

export function getShoppingKeywordAnalysis(query: string = "") {
  const cleanQ = query.trim();
  let list = [...ITEMSCOUT_DAILY_TRENDS_SEED];

  if (cleanQ) {
    const qLower = cleanQ.toLowerCase();
    list = list.filter((item) => item.keyword.toLowerCase().includes(qLower) || item.category.toLowerCase().includes(qLower));
    
    if (list.length === 0) {
      // Dynamic generated item
      const vol = Math.floor(Math.random() * 500000) + 50000;
      const prods = Math.floor(vol * (Math.random() * 1.5));
      const ratio = Number((prods / vol).toFixed(2));
      list = [
        {
          rank: 1,
          keyword: cleanQ,
          category: "디지털/가전",
          searchVolume: vol,
          productCount: prods,
          competitionRatio: ratio,
          isHoneyKeyword: ratio < 1.0,
          trendBadge: "BEST",
        },
        ...ITEMSCOUT_DAILY_TRENDS_SEED.slice(0, 5),
      ];
    }
  }

  return {
    query: cleanQ,
    total: list.length,
    dailyTrends: list,
    weeklyTrends: list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      searchVolume: Math.floor(item.searchVolume * 6.5),
    })),
  };
}
