import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import YesClub from './YesClub';
import NoClub from './NoClub';

export default function SimpleBottomNavigation() {
  // 로그인 한 경우에만 하단 nav 보여주는 역할
  const [isLogin, setIsLogin] = useState(false);
  const myAccessToken = sessionStorage.getItem('accessToken');
  const { id } = useParams();
  useEffect(() => {
    if (myAccessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [myAccessToken]);

  // 하단 nav 전체 레이아웃
  const Box = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    [theme.breakpoints.up(420)]: {
      display: 'none',
      height: '56px',
      padding: '10px',
    },
  }));

  return (
    <>
      {isLogin ? (
        <>
          <Box
            sx={{
              borderTop: '1px solid gray',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 0,
              height: '56px',
              marginTop: '30px',
            }}
          >
            {/* 내 모임 선택하지 한 경우  */}
            {id ? (
              <>
                <YesClub />
              </>
            ) : (
              // 내 모임 선택하지 않은 경우
              <>
                <NoClub />
              </>
            )}
          </Box>
        </>
      ) : (
        ''
      )}
    </>
  );
}
