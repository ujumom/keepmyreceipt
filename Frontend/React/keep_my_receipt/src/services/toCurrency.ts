/** 숫자를 입력받으면 원화 단위로 만들어서 반환하는 함수 */
export default function toCurrency(value: number) {
  return String(value)
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    .concat('원');
}

/** 금액을 입력받으면 정규표현식을 활용해 숫자만 추출 */
export const toNumberOnly = (price: string) =>
  Number(price.replace(/[^0-9]/g, ''));
