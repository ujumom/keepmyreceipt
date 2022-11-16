import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Logo from '../WebHeader/Logo';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Button, Grid, ListItemAvatar, Stack } from '@mui/material';
import AlarmItem from '../AlarmItem';
import { Content2, ClubName, Content3 } from '../styles';

// 햄버거버튼 메뉴 사이즈
const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

export default function PersistentDrawerRight() {
  const [isLogin, setIsLogin] = useState(false);
  const myAccessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    if (myAccessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [myAccessToken]);

  const { id } = useParams();
  const navigate = useNavigate();

  const [addMenu, setAddMenu] = React.useState<null | HTMLElement>(null);

  // drawer안에 로그아웃 기능
  const onLogout = () => {
    const fcmToken = sessionStorage.getItem('fcmToken');
    if (myAccessToken) {
      axios
        .post('/api/spring/crew/logout', { fcmToken: fcmToken })
        .then(function (response) {
          // 모바일 앱에서 로그아웃하는 경우, 자동 로그인 false로 바꿔주기
          if (window['Android']) {
            window['Android']['setAutoLogin'](false);
          }
          // 로그아웃 상황이기 때문에 accessToken 삭제, header도 빈값으로 바꿈
          sessionStorage.removeItem('accessToken');
          axios.defaults.headers.common['Authorization'] = '';
          navigate('/');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onClickButton = (url: string) => {
    navigate(url);
  };

  const [open, setOpen] = React.useState(false);
  const [clubImage, setClubImage] = useState('');
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    if (id) {
      // 동아리 이름과 이미지 받기
      axios
        .get(`/api/spring/club/${id}`)
        .then(function (response) {
          setClubImage(response.data.data.image);
          setClubName(response.data.data.name);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [id]);

  return (
    <Box sx={{ display: 'flex', height: '78px' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        open={open}
        sx={{ backgroundColor: 'white' }}
      >
        <Toolbar>
          {/* 로그인한 경우 */}
          {isLogin ? (
            <>
              <Grid container paddingLeft={1} paddingRight={2} paddingTop={1}>
                {/* 내 모임 선택한 경우 */}
                {id ? (
                  <>
                    <Grid item xs={10} textAlign="left">
                      <Stack direction="row">
                        <ListItemAvatar
                          onClick={() => {
                            onClickButton('/club');
                          }}
                          sx={{ pl: '20px', pt: '30px' }}
                        >
                          <img
                            width="30rem"
                            src="/images/randing/home3.png"
                          ></img>
                        </ListItemAvatar>
                        <Stack>
                          {id ? <ClubName>{clubName}</ClubName> : ''}
                        </Stack>
                      </Stack>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={9} textAlign="left">
                      <Stack direction="row">
                        <img
                          onClick={() => {
                            onClickButton('/');
                          }}
                          width="160rem"
                          src="/images/randing/last.png"
                        ></img>
                        <Stack>
                          {id ? <ClubName>{clubName}</ClubName> : ''}
                        </Stack>
                      </Stack>
                    </Grid>
                  </>
                )}

                {/* 알림 버튼 */}

                {id && isLogin ? (
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        my: 2,
                        color: 'black',
                        pt: '15px',
                      }}
                    >
                      <AlarmItem />
                    </Box>
                  </Grid>
                ) : (
                  <Grid item xs={3}>
                    <Box
                      sx={{
                        pt: '15px',
                      }}
                    >
                      <Button
                        onClick={onLogout}
                        sx={{
                          float: 'right',
                        }}
                      >
                        <Content3>로그아웃</Content3>
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                noWrap
                sx={{ flexGrow: 1 }}
                component="div"
              >
                <Logo />
              </Typography>

              <Button
                onClick={() => {
                  onClickButton('/login');
                }}
                sx={{
                  my: 2,
                  color: 'black',
                  float: 'right',
                }}
              >
                <Content2>로그인</Content2>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
