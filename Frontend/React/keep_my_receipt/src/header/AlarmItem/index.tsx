import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { Divider, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

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

export default function AlarmItem() {
  const navigate = useNavigate();

  // 알림 아이콘 클릭 시 토글창 on/off 기능 구현을 위한 변수
  const [anchorElUser2, setAnchorElUser2] = React.useState<null | HTMLElement>(
    null,
  );
  const handleOpenUserMenu2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser2(event.currentTarget);
  };
  const handleCloseUserMenu2 = () => {
    setAnchorElUser2(null);
  };

  // 새로운 알림 클릭 시 읽음 처리 && 알림 목적에 따라 navigate
  function connectNotification(alarm: AlarmType) {
    updateNotification(alarm.notificationId);
    const notiCode = alarm.notiCode;
    if (notiCode === '가입') {
      handleCloseUserMenu2();
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
          handleCloseUserMenu2();
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
  // 알림 페이지로 navigate
  const navigateAlarms = () => {
    navigate('/alert');
  };
  // 알림 객체 default 값으로 초기화한 useState
  const [alarms, setAlarms] = React.useState([
    {
      notificationId: 0,
      title: 'test',
      body: 'test',
      date: '2022-05-12',
      notiCode: '테스트',
      clubId: 0,
      requestId: 0,
      read: 'false',
    },
  ]);
  // 알림 객체배열 default 값으로 초기화한 useState
  const [res, setRes] = React.useState<ResponseType>({
    pageNumber: 0,
    size: 0,
    totalPages: 0,
    numberOfElements: 0,
    totalElements: 0,
    list: [],
  });
  // 알림 객체배열을 비동기로 로드하는 axios
  const getAlarms = async (page?: number) => {
    await axios
      .get('https://k6d104.p.ssafy.io/api/spring/notifications', {
        params: {
          page: page ? page : 0,
          size: 3,
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
  // 알림 아이콘이 표기되는 모든 페이지가 처음 렌더링될 때 알림 객체배열을 로드한다.
  React.useEffect(() => {
    getAlarms();
  }, []);

  return (
    <Box>
      {/* 알림 아이콘 */}
      <IconButton onClick={handleOpenUserMenu2} sx={{ p: 0, pl: 2 }}>
        <NotificationsIcon></NotificationsIcon>
      </IconButton>

      {/* 알림 아이콘 클릭 시 on/off 되는 토글창 */}
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser2}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser2)}
        onClose={handleCloseUserMenu2}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '20px',

            padding: '10px',
            paddingLeft: '18px',
            paddingBottom: '20px',
          }}
        >
          알림
        </Typography>
        {/* 알림 객체배열이 렌더링 되는 곳 */}
        {alarms.map((alarm) => (
          <div key={alarm.notificationId.toString()}>
            <MenuItem
              key={alarm.notificationId.toString()}
              sx={{
                paddingX: 2,
                paddingY: 0.2,
                ':hover': {
                  backgroundColor: '#FFF5E1',
                },
              }}
              style={{ maxWidth: '90vw' }}
            >
              <Grid
                sx={{
                  borderRadius: '16px',
                  padding: '5px',
                }}
                container
                justifyContent="space-between"
              >
                {/* 날짜 */}
                <Grid item xs={11}>
                  <Typography
                    fontSize="15px"
                    onClick={() => connectNotification(alarm)}
                  >
                    {alarm.date.split('T')[0].substring(5)[0] === '0'
                      ? alarm.date.split('T')[0].substring(6).replace('-', '/')
                      : alarm.date.split('T')[0].substring(5).replace('-', '/')}
                  </Typography>
                </Grid>

                {/* 취소버튼 */}
                <Grid item xs={1}>
                  <ClearOutlinedIcon
                    fontSize="small"
                    color="disabled"
                    onClick={() => deleteNotification(alarm.notificationId)}
                  />
                </Grid>

                {/*내용 */}
                <Grid item xs={12} alignItems="space-between">
                  <Typography
                    style={
                      alarm.read.toString() === 'false'
                        ? { fontWeight: 'bold' }
                        : {}
                    }
                    onClick={() => connectNotification(alarm)}
                  >
                    {alarm.title}
                  </Typography>
                </Grid>
              </Grid>
            </MenuItem>
            <Divider />
          </div>
        ))}
        <Typography
          fontSize="0.8rem"
          color="primary"
          textAlign="center"
          onClick={navigateAlarms}
        >
          더보기
        </Typography>
        {/* <hr></hr> */}

        {alarms.length < 1 ? (
          <Typography textAlign="center">
            &nbsp;&nbsp;알림이 존재하지 않습니다.&nbsp;&nbsp;
          </Typography>
        ) : (
          ''
        )}
      </Menu>
    </Box>
  );
}
