import React, { useEffect, useState } from 'react';
import {
  Container,
  IconButton,
  Box,
  Grid,
  Stack,
  CircularProgress,
  Typography,
} from '@mui/material';
import SearchBar from '../../../components/SearchBar';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import * as qs from 'qs';
import SearchList from './List';
import SearchHeader from './Header';

export default function BookSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyWord = searchParams.get('query');

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState('');

  // 날짜
  const today = new Date();
  // 기본 1년 전
  const [targetStart, setTargetStart] = useState<Date>(
    new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1),
  );
  const [targetEnd, setTargetEnd] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  // history
  const [res, setRes] = useState({
    expenditure: 0,
    income: 0,
    result: {
      list: [],
    },
  });
  const { expenditure, income, result } = res;
  const [checkAdd, setCheckAdd] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  // 날짜 형식 변환
  const toCustomDateString = (inputDate: Date, type?: boolean) => {
    const check = (num: number) => {
      if (num < 10) {
        if (type) {
          return ` ${num}`;
        } else {
          return `0${num}`;
        }
      } else {
        return `${num}`;
      }
    };
    const year = inputDate.getFullYear();
    const month = check(inputDate.getMonth() + 1);
    const date = check(inputDate.getDate());
    return type ? `${year}.${month}.${date}` : `${year}-${month}-${date}`;
  };

  // axios
  const HistoryAxios = axios.create({
    // 파라미터 값에 배열로 넣기
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  const getHistory = async (page?: number) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token.length) return;
    if (targetStart > targetEnd) {
      // console.log(targetStart, targetEnd);
      alert('검색 시작일이 종료일보다 큽니다');
      return;
    }
    await HistoryAxios.get(`/api/spring/club/${id}/transactions`, {
      headers: {
        Authorization: token,
      },
      params: {
        // clubId: id,
        start: toCustomDateString(targetStart),
        end: toCustomDateString(targetEnd),
        page: page ? page : 0,
        size: 10,
        sort: ['pay_date,DESC', 'id,DESC'],
        query: keyWord ? keyWord : word,
      },
    })
      .then((res) => {
        // console.log(targetStart + ' ~ ' + targetEnd);
        const response = res.data.data;
        setRes(response);
        if (historyList.length === 0) {
          setHistoryList(response.result.list);
        } else {
          setHistoryList((prev) => [...prev, ...response.result.list]);
        }
        if (response.result.pageNumber < response.result.totalPages - 1) {
          setCheckAdd(true);
        } else {
          setCheckAdd(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const onSearch = () => {
    setHistoryList([]);
    getHistory();
  };

  useEffect(() => {
    if (keyWord) {
      setWord(keyWord);
      getHistory();
    } else {
      getHistory();
    }
  }, [keyWord]);
  return (
    <Container maxWidth="md" sx={{ paddingY: 0, paddingX: '1rem' }}>
      <Grid container direction="column" sx={{ marginBottom: 1 }}>
        {/* 상단 & 검색창*/}
        <SearchHeader
          expenditure={expenditure}
          income={income}
          value={word}
          setValue={setWord}
          onSearch={onSearch}
          targetStart={targetStart}
          targetEnd={targetEnd}
          setTargetStart={setTargetStart}
          setTargetEnd={setTargetEnd}
        />
        {/* 거래내역 검색 결과 */}
        {loading ? (
          <Stack alignItems="center" marginTop="5rem">
            <CircularProgress sx={{ color: '#ffa500' }} />
          </Stack>
        ) : result.list.length > 0 ? (
          <Box>
            <SearchList
              result={result}
              historyList={historyList}
              getHistory={getHistory}
              checkAdd={checkAdd}
            />
          </Box>
        ) : (
          <Typography sx={{ textAlign: 'center', marginTop: '2rem' }}>
            검색 결과가 없습니다
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
