import Box from '@mui/material/Box';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PaidIcon from '@mui/icons-material/Paid';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import YesDraw from './YesDraw';

type Anchor = 'left';

export default function () {
  // drawer 어디에 배치할 지
  const [state, setState] = React.useState({
    left: false,
  });
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  // drawer 기본 값 설정
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  // 햄버거 메뉴 클릭시 보여줄 draw안의 list (YesDraw)
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: '250px' }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <YesDraw id={id} userAuthNum={userAuthNum} />
    </Box>
  );

  // 모임 id와 현재 유저의 권한 확인
  const { id } = useParams();
  const [userAuthNum, setUserAuthNum] = useState(3);
  useEffect(() => {
    axios
      .get(`api/spring/club/${id}/crew/auth`)
      .then((res) => {
        if (res.data) {
          const check = res.data;
          const userAuth = check.data;
          if (userAuth === '리더') {
            setUserAuthNum(1);
          } else if (userAuth === '관리자') {
            setUserAuthNum(2);
          } else if (userAuth === '회원') {
            setUserAuthNum(3);
          }
        }
      })
      .catch((e) => {
        return;
      });
  }, [id]);

  // drawer 안의 메뉴 선택할 때마다 이동하고, drawer 닫히게 설정
  const onClickButton = (url: string) => {
    navigate(url);
    setOpen(false);
  };

  return (
    <>
      <div>
        {/* 하단 navbar 전체 레이아웃 */}
        <BottomNavigation
          sx={{
            width: '100%',
            float: 'right',
          }}
          showLabels
        >
          {/* 하단 navbar 햄버거 버튼  */}
          <BottomNavigationAction
            sx={{
              ...(open && { display: 'none' }),
              padding: 0,
              '@media (max-width: 768px)': {
                minWidth: 'auto',
                padding: '6px 0',
              },
            }}
            onClick={toggleDrawer('left', true)}
            label={'전체'}
            icon={<MenuIcon />}
          ></BottomNavigationAction>

          {/* 하단 navbar 거래 내역 버튼 */}
          <BottomNavigationAction
            sx={{
              padding: 0,
              '@media (max-width: 768px)': {
                minWidth: 'auto',
                padding: '6px 0',
              },
            }}
            onClick={() => {
              onClickButton(`/club/${id}/book`);
            }}
            label={'거래 내역'}
            icon={<PlaylistAddIcon />}
          ></BottomNavigationAction>

          {/* 하단 navbar 거래 등록 버튼 관리자 이상만 띄워주기,  */}
          {userAuthNum <= 2 ? (
            <BottomNavigationAction
              sx={{
                padding: 0,
                '@media (max-width: 768px)': {
                  minWidth: 'auto',
                  padding: '6px 0',
                },
              }}
              onClick={() => {
                onClickButton(`/club/${id}/book/create`);
              }}
              label={'거래등록'}
              icon={<PeopleAltIcon />}
            ></BottomNavigationAction>
          ) : (
            ''
          )}

          {/* 하단 navbar 버튼 영수증 내역 */}
          <BottomNavigationAction
            sx={{
              padding: 0,
              '@media (max-width: 768px)': {
                minWidth: 'auto',
                padding: '6px 0',
              },
            }}
            onClick={() => {
              onClickButton(`/club/${id}/receipt/requestList`);
            }}
            label={'영수증내역'}
            icon={<PaidIcon />}
          ></BottomNavigationAction>
          {/* 하단 navbar 버튼 분석차트 */}
          <BottomNavigationAction
            sx={{
              padding: 0,
              '@media (max-width: 768px)': {
                minWidth: 'auto',
                padding: '6px 0',
              },
            }}
            onClick={() => {
              onClickButton(`/club/${id}/analytics/mainChart`);
            }}
            label={'분석차트'}
            icon={<InsertChartIcon />}
          ></BottomNavigationAction>
        </BottomNavigation>

        {/* 하단 navbar 햄버거 버튼 클릭시 열릴 drawer */}
        <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          {list('left')}
        </Drawer>
      </div>
    </>
  );
}
