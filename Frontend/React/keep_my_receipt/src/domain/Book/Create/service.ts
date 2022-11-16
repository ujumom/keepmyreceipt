import { ReadTransactionResType } from '../api/bookReadApi';
import { ReceiptStateType } from './types';
import { BookState } from './bookReducer';

/** 날짜와 금액이 수정 가능한지 알아보는 함수   
 : 영수증 ID가 없으면 수정 가능 */
export const isEditable = (params: ReceiptStateType | ReadTransactionResType) =>
  params === null || (params && params.requestId === null);

/** 기존 거래 내역 수정 중인지 알아보는 함수  
 : 거래 ID가 있으면 기존 거래 수정 중 */
export const isUpdating = (params: ReceiptStateType | ReadTransactionResType) =>
  params && 'transactionId' in params;

/** 금액 총합을 누적해서 계산 */
export const sumTotalValue = (state: BookState) => {
  const newTotalValue = state.items.reduce((prev, cur) => {
    return prev + (cur.price ? cur.price : 0);
  }, 0);
  return newTotalValue;
};
