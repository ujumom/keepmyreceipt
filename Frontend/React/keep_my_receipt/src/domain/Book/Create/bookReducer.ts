/** useState 대신에 useReducer를 활용하여 상태 관리
 * 자세한 건 '벨로퍼트 모던 리액트 강의 참고'
 */

import { WarningToast } from '../../../services/customSweetAlert';
import { ReadTransactionResType } from '../api/bookReadApi';
import { ReceiptStateType } from './types';

//////////////////////////////////////////////////
// 상태
//////////////////////////////////////////////////

/** 4가지 유형 리터럴 타입 */
export type TypeNameKeys = '자산' | '지출' | '수입' | '예산' | '';

/** 거래 내역의 세부 항목 형식
 * - 옵션: 세부 항목 ID, 메모
 */
export type BookItemType = {
  transactionDetailId?: number;
  name: string;
  price: number;
  type: TypeNameKeys;
  largeCategory: string;
  smallCategory: string;
  // categoryId: number;
  largeTag: string;
  smallTag: string;
  // tagId?: number;
  memo?: string;
};

/** 거래 내역의 세부 항목 형식의 리터럴 타입 */
export type BookItemKeys =
  | 'name'
  | 'price'
  | 'type'
  | 'largeCategory'
  | 'smallCategory'
  | 'categoryId'
  | 'largeTag'
  | 'smallTag'
  | 'tagId'
  | 'memo';

/** 거래 내역의 형식
 * - 옵션: 거래 내역 ID, 영수증 ID, 영수증 이미지
 */
export type BookState = {
  date: string;
  totalPrice: number;
  clubId: number;
  transactionId?: number;
  receiptId?: number;
  imageUrl?: string;
  items: BookItemType[];
};

/** 거래 내역 세부 항목의 초기값 */
export const blankBookItem: BookItemType = {
  name: '',
  price: 0,
  type: '',
  largeCategory: '',
  smallCategory: '',
  // categoryId: 0,
  largeTag: '',
  smallTag: '',
  // tagId: 0,
  memo: '',
};

/** 거래 내역의 초기값 */
export const blankBook: BookState = {
  clubId: 0,
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
  totalPrice: 0,
  items: [blankBookItem],
};

/** useParam으로 넘겨받은 데이터에 따라
 * 거래 내역 초기값을 반환해주는 함수
 */
export const initBookState = (
  param: ReceiptStateType | ReadTransactionResType,
  clubId: number,
): BookState => {
  // 영수증 없이 거래 등록하는 경우
  if (!param) {
    return {
      // 빈 거래 내역 반환
      ...blankBook,
      clubId: clubId,
    };
  }
  // 거래 내역 ID가 있는 기존 거래 내역을 수정하는 경우
  else if ('transactionId' in param) {
    return {
      // 기존 내역의 정보를 그대로 값으로 씀
      date: param.date,
      totalPrice: param.totalPrice,
      clubId: clubId,
      transactionId: param.transactionId,
      receiptId: param.requestId,
      imageUrl: param.receiptUrl,
      items: param.items,
    };
  }
  // 영수증 승인으로부터 거래 등록하는 경우
  else if ('requestId' in param) {
    return {
      // 영수증 승인에서 넘어온 갑들로 초기화
      clubId: clubId,
      date: param.date,
      totalPrice: param.money,
      imageUrl: param.imgUrl,
      items: param.items.map((item) => ({
        ...blankBookItem,
        name: item.content,
        price: Number(item.money),
      })),
    };
  }
};

//////////////////////////////////////////////////
// 액션
//////////////////////////////////////////////////

/* 액션 타입 */
const MODULE_NAME = 'book';
const UPDATE_BOOK = `${MODULE_NAME}/UPDATE_BOOK` as const;
const CREATE_ITEM = `${MODULE_NAME}/CREATE_ITEM` as const;
const UPDATE_ITEM = `${MODULE_NAME}/UPDATE_ITEM` as const;
const DELETE_ITEM = `${MODULE_NAME}/DELETE_ITEM` as const;

/* 액션 생성 함수 */
export const updateBook = (keyName: string, keyValue: string | number) => ({
  type: UPDATE_BOOK,
  keyName,
  keyValue,
});

export const createItem = (
  indexToInsert?: number,
  itemName?: string,
  itemValue?: number,
) => ({
  type: CREATE_ITEM,
  indexToInsert,
  itemName,
  itemValue,
});

export const updateItem = (
  itemIndex: number,
  keyName: BookItemKeys,
  keyValue: string | number,
) => ({
  type: UPDATE_ITEM,
  itemIndex,
  keyName,
  keyValue,
});

export const deleteItem = (itemIndex: number) => ({
  type: DELETE_ITEM,
  itemIndex,
});

/* 액션 생성함수 타입 */
export type BookAction =
  | ReturnType<typeof updateBook>
  | ReturnType<typeof createItem>
  | ReturnType<typeof updateItem>
  | ReturnType<typeof deleteItem>;

//////////////////////////////////////////////////
// 리듀서
//////////////////////////////////////////////////

export default function bookReducer(
  state: BookState,
  action: BookAction,
): BookState {
  switch (action.type) {
    case UPDATE_BOOK:
      /** 거래 내역 수정 */
      return {
        ...state,
        [action.keyName]: action.keyValue,
      };

    case CREATE_ITEM:
      /** 거래 내역에 새로운 항목 추가 */
      // 새로 넣을 아이템 정의
      const newItem: BookItemType = {
        ...blankBookItem,
        // 이름과 가격이 주어진 경우에는 넣고, 없으면 빈 값으로 초기화
        name: action.itemName ? action.itemName : '',
        price: action.itemValue ? action.itemValue : 0,
      };

      return {
        ...state,
        items: action.indexToInsert
          ? [
              // 0번 인덱스부터 삽입하려는 인덱스 전까지
              ...state.items.slice(0, action.indexToInsert),
              // 원하는 인덱스에 삽입
              newItem,
              // 원래 인덱스부터 끝까지
              ...state.items.slice(action.indexToInsert),
            ]
          : //삽입할 인덱스가 주어지지 않으면 맨 끝에 추가
            state.items.concat(newItem),
      };

    case UPDATE_ITEM:
      /** 거래 내역 세부 항목 배열에서 해당 인덱스를 찾은 경우,
       * 해당 항목의 일부 내용을 수정 후 반환 */
      return {
        ...state,
        items: state.items.map((item, index) =>
          // dispatch에 인자로 넣은 키와 일치하는 키를 찾아 값 갱신
          index === action.itemIndex
            ? { ...item, [action.keyName]: action.keyValue }
            : item,
        ),
      };

    case DELETE_ITEM:
      /** 거래 내역 세부 항목들에서 해당 인덱스를 빼고, 나머지 반환 */
      if (state.items.length < 2) {
        WarningToast.fire({
          title: '항목은 \n 1개 이상 있어야 합니다!',
        });
        return state;
      }

      return {
        ...state,
        items: [
          // 처음부터 해당 인덱스 전까지 슬라이싱
          ...state.items.slice(0, action.itemIndex),
          // 해당 인덱스 건너뛰고 다음부터 끝까지 슬라이싱
          ...state.items.slice(action.itemIndex + 1),
        ],
      };
    default:
      return state;
  }
}
