import axios from 'axios';
import { WarningToast } from '../../../services/customSweetAlert';
import { TypeNameKeys } from '../Create/bookReducer';

/** API 기본 주소와 헤더 값 세팅하는 함수 가져옴 */
import { BASE_URL, setToken } from './bookWriteApi';

/** API 응답 형식 */
export type ReadTransactionResType = {
  date: string;
  totalPrice: number;
  transactionId: number;
  requestId?: number;
  receiptUrl?: string;
  items: {
    transactionDetailId: number;
    name: string;
    price: number;
    type: TypeNameKeys;
    largeCategory: string;
    smallCategory: string;
    largeTag: string;
    smallTag: string;
    memo: string;
  }[];
};

/** API 응답 형식과 같은 초기 값
 * 로딩 중에 데이터 없는 걸 방지 */
export const initialReadResponse: ReadTransactionResType = {
  date: '',
  totalPrice: 0,
  transactionId: 0,
  requestId: 0,
  receiptUrl: '',
  items: [
    {
      transactionDetailId: 0,
      name: '',
      price: 0,
      memo: '',
      type: '',
      largeCategory: '',
      smallCategory: '',
      largeTag: '',
      smallTag: '',
    },
  ],
};

/** 거래 내역 ID에 맞는 거래 내역 정보를 받아오는 API */
export const apiGetTransaction = async (transactionId: number) => {
  return await axios({
    method: 'get',
    url: `${BASE_URL}/club/transaction/${transactionId}`,
    headers: setToken(),
  })
    .then((res) => {
      // 응답 코드가 200이면 성공
      if (res.data.output == 200) {
        console.log(res.data.msg);
      } else {
        // 아니면 에러 메시지를 토스트로 띄움
        WarningToast.fire({
          icon: 'error',
          title: res.data.msg,
        });
      }
      return res;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};

/** 모든 거래 내역을 받아오는 함수
 * 검색어를 넣으면, 해당 쿼리에 해당하는 거래내역만 가져 옴 */
export const apiGetAllTransaction = async (
  clubId: number,
  searchKeyword?: string,
  start?: string,
  end?: string,
  page?: number,
) => {
  return await axios({
    method: 'get',
    url: `${BASE_URL}/club/${clubId}/transactions`,
    params: {
      query: searchKeyword,
      start,
      end,
      page,
    },
    headers: setToken(),
  }).catch((e) => {
    throw e;
  });
};

/**거래 내역 ID와 일치하는 거래 내역을 삭제하는 API */
export const apiDeleteTransaction = async (transactionId: number) => {
  return await axios({
    method: 'delete',
    url: `${BASE_URL}/club/transaction/${transactionId}`,
    headers: setToken(),
  })
    .then((res) => {
      if (res.data.output == 200) {
        console.log(res.data.msg);
      } else {
        WarningToast.fire({
          icon: 'error',
          title: res.data.msg,
        });
      }
      return res;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};
