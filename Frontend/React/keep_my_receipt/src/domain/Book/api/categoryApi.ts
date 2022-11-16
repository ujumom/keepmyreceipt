import axios from 'axios';
import { WarningToast } from '../../../services/customSweetAlert';
import { TypeNameKeys } from '../Create/bookReducer';

const BASE_URL = 'https://k6d104.p.ssafy.io/api/spring';

const setToken = () => {
  const token = sessionStorage.getItem('accessToken');
  const config = {
    Authorization: `${token}`,
  };
  return config;
};

/** 거래 유형에 따라 자산(as) 소분류 접두어, 혹은 예산(bs) 소분류 접두어를 반환 */
const matching = (typeName: TypeNameKeys) =>
  typeName === '자산' ? 'as' : 'bs';

/** 소분류 추가 API */
export const apiCreateCategory = async (
  clubId: number,
  typeName: TypeNameKeys,
  largeCategoryName: string,
  smallCategoryName: string,
) => {
  return await axios({
    method: 'post',
    url: `${BASE_URL}/${matching(typeName)}category`,
    data: {
      clubId,
      lcName: largeCategoryName,
      // 인자로 받은 유형 이름 (typeName)에 따라
      // 대응하는 소분류 key 생성
      [`${matching(typeName)}cName`]: smallCategoryName,
    },
    headers: setToken(),
  })
    .then((res) => {
      if (res.data.output !== 200) {
        WarningToast.fire({
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

/** 소분류 수정 API */
export const apiUpdateCategory = async (
  clubId: number,
  typeName: TypeNameKeys,
  largeCategoryName: string,
  smallCategoryName: string,
  categoryId: number,
) => {
  return await axios({
    method: 'put',
    // 유형에 따라 대응되는 URL로 보냄
    url: `${BASE_URL}/${matching(typeName)}category/${categoryId}`,
    data: {
      clubId,
      lcName: largeCategoryName,
      [`${matching(typeName)}cName`]: smallCategoryName,
    },
    headers: setToken(),
  })
    .then((res) => {
      if (res.data.output !== 200) {
        WarningToast.fire({
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

/** 소분류 목록 읽어오는 API */
export const apiReadAllCategory = async (
  clubId: string,
  typeName: TypeNameKeys,
  largeCategoryName: string,
) => {
  return await axios({
    method: 'get',
    url: `${BASE_URL}/${matching(
      typeName,
    )}category/${clubId}/${largeCategoryName}`,
    headers: setToken(),
  })
    .then((res) => {
      if (res.data.output !== 200) {
        WarningToast.fire({
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

/** 소분류 삭제 API */
export const apiDeleteCategory = async (
  typeName: TypeNameKeys,
  categoryId: number,
) => {
  return await axios({
    method: 'delete',
    url: `${BASE_URL}/${matching(typeName)}category/${categoryId}`,
    headers: setToken(),
  })
    .then((res) => {
      if (res.data.output !== 200) {
        WarningToast.fire({
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
