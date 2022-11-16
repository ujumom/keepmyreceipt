import { useState, useEffect } from 'react';
import ListItem from '../Listitem';
import axios from 'axios';
import Pagination from '../../../../components/Pagination';
import { Grid, Typography } from '@mui/material';

// axios로 받는 알림 객체
interface AlarmType {
  notificationId: number;
  title: string;
  body: string;
  date: string;
  notiCode: string;
  clubId: number;
  requestId: number;
  read: string;
}

// axios로 받는 알림 객체배열 및 Pagination에 필요한 데이터
interface ResponseType {
  pageNumber: number;
  size: number;
  totalPages: number;
  numberOfElements: number;
  totalElements: number;
  list: AlarmType[];
}

export default function AlertList() {
  // 알림 객체 default 값으로 초기화한 useState
  const [alarms, setAlarms] = useState([
    {
      notificationId: 0,
      title: 'test',
      body: 'test',
      date: '2022-05-12T04:22:01',
      notiCode: '테스트',
      clubId: 0,
      requestId: 0,
      read: 'false',
    },
  ]);
  // 알림 객체배열 default 값으로 초기화한 useState
  const [res, setRes] = useState<ResponseType>({
    pageNumber: 0,
    size: 0,
    totalPages: 0,
    numberOfElements: 0,
    totalElements: 0,
    list: [],
  });
  // 알림 객체배열을 비동기로 로드하는 axios
  const getAlarms = async (page?: number) => {
    console.log(axios.defaults.headers);
    await axios
      .get('https://k6d104.p.ssafy.io/api/spring/notifications', {
        params: {
          page: page ? page : 0,
          size: 5,
          sort: 'id,DESC',
        },
      })
      .then((response) => {
        setRes(response.data.data);
        setAlarms(response.data.data.list);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // 알림 페이지가 처음 렌더링될 때 알림 객체배열을 로드한다.
  useEffect(() => {
    getAlarms();
  }, []);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ width: '100%' }}
    >
      {/* 알림 객체배열이 렌더링 되는 곳 */}
      {alarms.map((alarm) => (
        <ListItem
          item={alarm}
          key={alarm.notificationId.toString()}
          getAlarms={getAlarms}
        />
      ))}
      <br></br>
      {alarms.length < 1 ? (
        <Typography textAlign="center">
          &nbsp;&nbsp;알림이 존재하지 않습니다.&nbsp;&nbsp;
        </Typography>
      ) : (
        <Pagination
          pageInfo={res}
          paginationSize={5}
          onClickPage={getAlarms}
          bgColor="#ffaa00"
        />
      )}
    </Grid>
  );
}
