import axios from 'axios';
import { WarningToast } from '../../../services/customSweetAlert';
import { BookState, TypeNameKeys } from '../Create/bookReducer';

export const BASE_URL = 'https://k6d104.p.ssafy.io/api/spring';

export const setToken = () => {
  const token = sessionStorage.getItem('accessToken');
  const config = {
    Authorization: `${token}`,
  };
  return config;
};

/** 거래 내역 등록 API의 Request Body 형식 */
export type CreateTransactionReqType = {
  date: string;
  totalPrice: number;
  requestId?: number;
  list: {
    name: string;
    price: number;
    type: TypeNameKeys;
    largeCategory: string;
    smallCategory: string;
    largeTag?: string;
    smallTag?: string;
    memo?: string;
  }[];
};

/** 프론트의 상태를 API 요청 형식에 맞춰 바꿔주는 함수 */
export const toTransactionType = (
  bookState: BookState,
  requestId?: number,
): CreateTransactionReqType => ({
  ...(requestId && { requestId: requestId }),
  totalPrice: bookState.totalPrice,
  date: bookState.date,
  list: bookState.items.map((item) => ({
    name: item.name,
    price: item.price,
    type: item.type,
    largeCategory: item.largeCategory,
    smallCategory: item.smallCategory,
    largeTag: item.largeTag ? item.largeTag : '',
    smallTag: item.smallTag ? item.smallTag : '',
    memo: item.memo ? item.memo : '',
  })),
});

/** 요청 전 데이터 검증 */
export const apiValidateCreateTransaction = (
  data: CreateTransactionReqType,
): boolean => {
  // 데이터가 한 개인 경우
  if (data.list.length === 1) {
    if (data.list[0].name === '') {
      WarningToast.fire({
        title: '내용을 입력해주세요',
      });
      return false;
    } else if (data.list[0].price === 0) {
      WarningToast.fire({
        title: '금액은 0보다 커야 합니다',
      });
      return false;
    } else if (data.list[0].smallCategory === '') {
      WarningToast.fire({
        title: '대분류와 소분류를 선택해주세요',
      });
      return false;
    }
    return true;
  }

  // 데이터가 여러 개인 경우, 몇 번째 아이템인지 추가로 표시
  let index = 1;
  for (const item of data.list) {
    if (item.name === '') {
      WarningToast.fire({
        title: `${index}번째 항목의 \n 내용을 입력해주세요`,
      });
      return false;
    } else if (item.price === 0) {
      WarningToast.fire({
        title: `${index}번째 항목의 \n 금액은 0보다 커야 합니다`,
      });
      return false;
    } else if (item.smallCategory === '') {
      WarningToast.fire({
        title: `${index}번째 항목의 \n 대분류와 소분류를 \n 선택해주세요`,
      });
      return false;
    }
    index += 1;
  }
  return true;
};

/** 거래 내역 추가 API */
export const apiCreateTransaction = async (
  clubId: number,
  data: CreateTransactionReqType,
) => {
  return await axios({
    method: 'post',
    url: `${BASE_URL}/club/${clubId}/transaction`,
    data: data,
    headers: setToken(),
  })
    .then((res) => {
      if (res.data.output == 200) {
        console.log(res.data.msg);
      }
      return res;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};

/** 거래 내역 수정 API */
export const apiUpdateTransaction = async (
  transactionId: number,
  data: CreateTransactionReqType,
) => {
  return await axios({
    method: 'put',
    url: `${BASE_URL}/club/transaction/${transactionId}`,
    data: data,
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
