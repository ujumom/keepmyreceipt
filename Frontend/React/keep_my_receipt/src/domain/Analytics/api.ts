import axios from 'axios';
import { TagItemType } from './types';

// axios 요청하는 url의 공통 부분
const BASE_URL = 'https://k6d104.p.ssafy.io/api/spring';

// 태그별 통계 요청에 따른 Response Type 지정
export type FirstChartResponseType = {
  tagName: string;
  percentage: number;
  cost: number;
  totalCost: number;
};

// 태그별 통계 차트 구현에 필요한 데이터를 비동기 요청
export const apiLoadFirstChartData = async (
  clubId: string,
  year: string,
  month: string,
) => {
  return await axios
    .get(`${BASE_URL}/chart/${clubId}/${year}/${month}`)
    .then((response) => {
      console.log('analytics API test', response);
      return response;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};

// 2차 태그 분석차트데이터 요청 이전에 1차 태그 데이터 재구성
export const toTagItemType = (tags: FirstChartResponseType[]) => {
  const tagItems: TagItemType[] = tags.map((tag) => ({
    id: tag.tagName,
    rate: tag.percentage.toString(),
    value: tag.cost.toString(),
  }));

  tagItems.sort((a, b) => Number(b.rate) - Number(a.rate));

  const tagTotalCost = tags[0].totalCost;

  return { tagItems, tagTotalCost };
};

// 2차 태그 분석차트 구현에 필요한 데이터를 비동기 요청
export const apiLoadSecondChartData = async (
  clubId: string,
  year: string,
  month: string,
  parentTag: string,
) => {
  return await axios
    .get(`${BASE_URL}/chart/${clubId}/${year}/${month}/${parentTag}`)
    .then((response) => {
      console.log('analytics API test', response);
      return response;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};

// 월별 추이 플로우차트 구현에 필요한 데이터를 비동기 요청
export const apiLoadFlowChartData = async (
  clubId: string,
  year: string,
  month: string,
) => {
  return await axios
    .get(`${BASE_URL}/chart/line/${clubId}/${year}/${month}`)
    .then((response) => {
      return response;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};
