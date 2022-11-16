import { Grid, Card, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { teal } from '@mui/material/colors';

// 상위 컴포넌트에서 넘겨받은 알림 객체
interface ItemType {
  notificationId: number;
  title: string;
  body: string;
  date: string;
  notiCode: string;
  clubId: number;
  requestId: number;
  read: string;
}

export default function ListItem({
  item,
  getAlarms,
}: {
  item: ItemType;
  getAlarms: any;
}) {
  const navigate = useNavigate();
  const grey = teal[500];
  // 새로운 알림 클릭 시 읽음 처리 && 알림 목적에 따라 navigate
  function connectNotification(alarm: ItemType) {
    updateNotification(alarm.notificationId);
    const notiCode = alarm.notiCode;
    if (notiCode === '가입') {
      navigate(`/club/${alarm.clubId}/manage`);
    } else if (notiCode === '청구') {
      navigateApprove(alarm.clubId, alarm.requestId);
    } else {
      getAlarms();
    }
  }
  // 새로운 알림 클릭 시 읽음 처리
  const updateNotification = async (notificationId: number) => {
    await axios
      .put(
        `https://k6d104.p.ssafy.io/api/spring/notification/${notificationId}`,
      )
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // x 버튼 클릭 시 해당 알림 삭제 처리
  const deleteNotification = async (notificationId: number) => {
    await axios
      .delete(
        `https://k6d104.p.ssafy.io/api/spring/notification/${notificationId}`,
      )
      .then((response) => {
        console.log(response);
        getAlarms();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // 청구 목적의 알림 클릭 시 전달해야하는 prop 데이터 생성 후 승인페이지로 navigate
  const navigateApprove = async (clubId: number, requestId: number) => {
    axios
      .get(`https://k6d104.p.ssafy.io/api/spring/club/request/${requestId}`)
      .then((response) => {
        const data = response.data.data;
        if (data.state === '신청') {
          navigate(`/club/${clubId}/receipt/approve`, {
            state: {
              requestId: data.requestId,
              date: data.payDate,
              value: data.price,
              receiptUrl: data.receiptUrl,
            },
          });
        } else {
          alert('이미 처리된 청구입니다');
          getAlarms();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // 클럽 이미지와 이름을 담는 useState
  const [clubImg, setClubImg] = useState('');
  const [clubName, setClubName] = useState('');
  // 각각의 알림이 요청되는 클럽의 이미지와 이름을 로드하기 위한 비동기 요청
  const getClubInfo = async (clubId: number) => {
    axios
      .get(`https://k6d104.p.ssafy.io/api/spring/club/${clubId}`)
      .then((response) => {
        setClubImg(response.data.data.image);
        setClubName(response.data.data.name);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // 알림 페이지가 처음 렌더링될 때, 현재 페이지네이션에 로드된 클럽들의 이미지와 이름을 비동기 요청
  useEffect(() => {
    getClubInfo(item.clubId);
  }, []);

  return (
    <Card style={{ width: '100%' }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        style={{ width: '100%', paddingTop: 10, paddingBottom: 10 }}
        sx={{
          ':hover': {
            backgroundColor: '#FFF5E1',
          },
        }}
      >
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          container
          justifyContent="center"
          alignItems="center"
          style={{ width: '100%' }}
        >
          {/* axios로 로드한 클럽 이미지파일 유효성 체크 후 이미지 자르기 */}
          {clubImg.substring(0, 4) === 'http' ? (
            <img src={clubImg} style={{ maxWidth: '10vw' }} />
          ) : (
            <Typography fontSize="0.7rem">No Image</Typography>
          )}
        </Grid>
        <Grid
          item
          xs={8}
          sm={8}
          md={8}
          container
          direction="column"
          justifyContent="space-between"
          alignItems="start"
          onClick={() => connectNotification(item)}
        >
          {/* 아직 읽지 않은 알림이면 bold체로 표현 */}
          <Typography
            fontSize="0.7rem"
            style={
              item.read.toString() === 'false' ? { fontWeight: 'bold' } : {}
            }
          >
            {item.title}
          </Typography>
          <Typography
            fontSize="1rem"
            style={
              item.read.toString() === 'false' ? { fontWeight: 'bold' } : {}
            }
          >
            {item.body}
          </Typography>
          <Typography
            fontSize="0.7rem"
            color={grey}
            style={
              item.read.toString() === 'false' ? { fontWeight: 'bold' } : {}
            }
          >
            {/* 날짜를 MM/dd 로 표현 */}
            {item.date.split('T')[0].substring(5)[0] === '0'
              ? item.date.split('T')[0].substring(6).replace('-', '/')
              : item.date.split('T')[0].substring(5).replace('-', '/')}
            &nbsp;&nbsp;&nbsp;
            {item.date.split('T')[1].substring(0, 5)}
            &nbsp;&nbsp;&nbsp;
            {clubName}
          </Typography>
        </Grid>
        <Grid item xs={1} sm={1} md={1}>
          {/* x 버튼 클릭 시 해당 알림 삭제 */}
          <CancelIcon
            onClick={() => deleteNotification(item.notificationId)}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
