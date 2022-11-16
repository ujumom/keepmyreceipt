import axios from 'axios';

const BASE_URL = 'https://k6d104.p.ssafy.io/api/spring';

const setToken = () => {
  const token = sessionStorage.getItem('accessToken');
  const config = {
    Authorization: `${token}`,
  };
  return config;
};

/** 태그 생성 API **/
export const apiCreateTag = async (
  clubId: string,
  tagName: string,
  parentTag: string | null,
) => {
  return await axios({
    method: 'post',
    url: `${BASE_URL}/tag`,
    data: {
      clubId,
      tagName,
      parentTag,
    },
    headers: setToken(),
  }).catch((e) => {
    throw e;
  });
};

/** 태그 수정 API */
export const apiUpdateTag = async (
  clubId: string,
  tagId: number,
  tagName: string,
  parentTag: string | null,
) => {
  return await axios({
    method: 'put',
    url: `${BASE_URL}/tag/${tagId}`,
    data: {
      clubId,
      tagName,
      parentTag,
    },
    headers: setToken(),
  }).catch((e) => {
    throw e;
  });
};

/** 1차 태그 읽어오는 API */
export const apiGetLargeTags = async (clubId: string) => {
  return await axios({
    method: 'get',
    url: `${BASE_URL}/tag/${clubId}`,
    headers: setToken(),
  }).catch((e) => {
    throw e;
  });
};

/** 2차 태그 읽어오는 API */
export const apiGetSmallTags = async (clubId: string, largeTagName: string) => {
  return await axios({
    method: 'get',
    url: `${BASE_URL}/tag/${clubId}/${largeTagName}`,
    headers: setToken(),
  }).catch((e) => {
    throw e;
  });
};

/** 태그 삭제하는 API */
export const apiDeleteTag = async (tagId: number) => {
  return await axios({
    method: 'delete',
    url: `${BASE_URL}/tag/${tagId}`,
    headers: setToken(),
  }).catch((e) => {
    throw e;
  });
};
