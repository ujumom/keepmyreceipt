import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Profile from './Profile';

// drawer 최상단 디자인
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function (props: any) {
  const theme = useTheme();
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const onClickButton = (url: string) => {
    navigate(url);
    setOpen(false);
  };

  return (
    <>
      {/* 상단 부분  */}
      <DrawerHeader>
        {/* > 버튼 클릭시, drawer 닫힘 */}
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      {/* 프로필 */}
      <Profile />
      <Divider />
      {/* drawer 리스트 */}
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <>
          {/* 영수증 등록 버튼 */}
          <ListItemButton
            onClick={() => {
              onClickButton(`/club/${props.id}/receipt/camera`);
            }}
            sx={{ pl: 4 }}
          >
            <ListItemText primary="영수증 등록" />
          </ListItemButton>

          {/* 관리자 이상인 경우 거래 등록 버튼 */}
          {props.userAuthNum <= 2 ? (
            <>
              {' '}
              <ListItemButton
                onClick={() => {
                  onClickButton(`/club/${props.id}/book/create`);
                }}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="거래 등록" />
              </ListItemButton>
            </>
          ) : (
            ''
          )}

          <Divider />

          {/* 영수증 내역 버튼 */}
          <ListItemButton
            onClick={() => {
              onClickButton(`/club/${props.id}/receipt/requestList`);
            }}
            sx={{ pl: 4 }}
          >
            <ListItemText primary="영수증 내역" />
          </ListItemButton>

          {/* 관리자 이상인 경우 거래내역 버튼 */}
          {props.userAuthNum <= 2 ? (
            <>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  onClickButton(`/club/${props.id}/book`);
                }}
              >
                <ListItemText primary="거래 내역" />
              </ListItemButton>
            </>
          ) : (
            ''
          )}

          <Divider />
          {/* 차트 버튼 */}
          <ListItemButton
            sx={{ pl: 4 }}
            onClick={() => {
              onClickButton(`/club/${props.id}/analytics/mainChart`);
            }}
          >
            <ListItemText primary="차트" />
          </ListItemButton>

          {/* 보고서 버튼 */}
          <ListItemButton
            onClick={() => {
              onClickButton(`/club/${props.id}/report/asset`);
            }}
            sx={{ pl: 4 }}
          >
            <ListItemText primary="보고서" />
          </ListItemButton>

          <Divider />
          {/* 리더인 경우 모임관리 버튼 */}
          {props.userAuthNum <= 2 ? (
            <>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  onClickButton(`/club/${props.id}/manage`);
                }}
              >
                <ListItemText primary="모임관리" />
              </ListItemButton>
            </>
          ) : (
            ''
          )}
        </>
        <Divider />

        {/* 설정버튼 */}
        <ListItemButton
          sx={{ pl: 4 }}
          onClick={() => {
            onClickButton(`/setting`);
          }}
        >
          <ListItemText primary="설정" />
        </ListItemButton>
        {/* 홈으로 가기 버튼 */}
        <ListItemButton
          sx={{ pl: 4 }}
          onClick={() => {
            onClickButton(`/`);
          }}
        >
          <ListItemText primary="홈" />
        </ListItemButton>
      </List>
    </>
  );
}
