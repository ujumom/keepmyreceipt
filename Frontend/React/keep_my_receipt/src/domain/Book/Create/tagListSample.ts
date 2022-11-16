/** string 배열로 구성된 객체 타입 일반화.  
 자세한 건 TypeScript의 인덱스 시그니처 참고 */
interface StringArrayObjectType {
  [key: string]: string[];
}

/** 유형 목록 */
export const mainCategories = ['자산', '지출', '수입', '예산'];

/**타입 단언 (as ...)을 씀으로써 리터럴 타입만 쓰게 하는 걸 방지.  
 자세한 건 TypeScript의 리터럴 타입과 타입 단언 참고 */
export const largeCategories = {
  자산: ['현금 및 현금성자산', '유형자산', '선급금', '기타자산'],
  예산: ['전기예산', '활동지원금', '회비', '후원비'],
  지출: ['복리후생비', '여비교통비', '소모품비', '기타비용'],
  수입: ['수입', '기타수입'],
  '': [],
} as StringArrayObjectType;

export const mediumCategories = {
  '': [],
  '현금 및 현금성자산': ['현금'],
  유형자산: ['비품', '차량'],
  선급금: ['회원권'],
  기타자산: ['미분류자산'],

  전기예산: ['전기예산'],
  활동지원금: ['활동지원금'],
  회비: ['회비'],

  복리후생비: ['회식', '식비', 'MT'],
  여비교통비: ['교통비'],
  소모품비: ['사무용품', '생활용품'],
  기타비용: ['미분류비용'],

  상금수익: ['상금수익'],
  부스수익: ['부스수익'],
  이자수익: ['이자수익'],
} as StringArrayObjectType;

export const tag1Categories = ['한식', '중식', '양식', '일식'];

export const tag2Categories = {
  '': [],
  한식: ['국밥', '갈비'],
  중식: ['짜장면', '탕수육', '팔보채'],
  양식: ['치킨', '피자', '파스타'],
  일식: ['돈까츠', '스시'],
} as StringArrayObjectType;
