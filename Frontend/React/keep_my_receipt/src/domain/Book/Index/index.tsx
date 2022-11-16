import {
  Container,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';
import IndexHeader from './Header';
import IndexList from './List';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as qs from 'qs';

export default function BookIndex() {
  const [loading, setLoading] = useState(true);
  // clubId
  const { id } = useParams();
  // 날짜
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [date, setDate] = useState(1);
  const target = new Date(year, month, date);
  const targetEnd = new Date(year, month + 1, 0);
  const [checked, setChecked] = useState(false);
  // 수입, 지출, 거래내역
  const [res, setRes] = useState({
    expenditure: 0,
    income: 0,
    result: {
      list: [],
    },
  });
  const { expenditure, income, result } = res;
  // 현재 잔액
  const [balance, setBalance] = useState();

  // axios
  const HistoryAxios = axios.create({
    // 파라미터 값에 배열로 넣기
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  // 수입, 지출, 거래내역 가져오기
  const [checkAdd, setCheckAdd] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const getHistory = async (page?: number) => {
    const accessToken = sessionStorage.getItem('accessToken');
    await HistoryAxios.get(`/api/spring/club/${id}/transactions`, {
      headers: {
        Authorization: accessToken,
      },
      params: {
        // clubId: id,
        start: `${target.getFullYear()}-${
          target.getMonth() + 1 > 9
            ? target.getMonth() + 1
            : '0' + (target.getMonth() + 1)
        }-01`,
        end: `${targetEnd.getFullYear()}-${
          targetEnd.getMonth() + 1 > 9
            ? targetEnd.getMonth() + 1
            : '0' + (targetEnd.getMonth() + 1)
        }-${
          today.getMonth() === targetEnd.getMonth()
            ? today.getDate()
            : targetEnd.getDate()
        }`,
        page: page ? page : 0,
        size: 10,
        sort: ['pay_date,DESC', 'id,DESC'],
      },
    })
      .then((res) => {
        // console.log(res.data.data);
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
  // 현재 예산 잔액 가져오기
  const getBalance = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    await axios
      .get(`/api/spring/ascategory/${id}/현금 및 현금성자산`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((res) => {
        // console.log(res.data.data);
        if (res.data.data.length) {
          setBalance(res.data.data[0].balance);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (
      today.getFullYear() === target.getFullYear() &&
      today.getMonth() === target.getMonth()
    ) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [target]);

  useEffect(() => {
    getBalance();
    getHistory();
    window.scrollTo(0, 0);
  }, [month]);

  return (
    <Container maxWidth="md" sx={{ paddingY: 0, paddingX: '1rem' }}>
      <Grid container direction="column" sx={{ marginBottom: 1 }}>
        {/* 상단 (월, 지출, 수입) */}
        <IndexHeader
          month={month}
          setMonth={setMonth}
          target={target}
          expenditure={expenditure}
          income={income}
          checked={checked}
          balance={balance ? balance : 0}
          setHistoryList={setHistoryList}
        />
        {/* 거래내역 */}
        {loading ? (
          <Stack alignItems="center" marginTop="5rem">
            <CircularProgress sx={{ color: '#ffa500' }} />
          </Stack>
        ) : result.list.length > 0 ? (
          <Box>
            <IndexList
              result={result}
              historyList={historyList}
              getHistory={getHistory}
              checkAdd={checkAdd}
            />
          </Box>
        ) : (
          <Typography sx={{ textAlign: 'center', marginTop: '2rem' }}>
            이번 달 내역이 없습니다
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
