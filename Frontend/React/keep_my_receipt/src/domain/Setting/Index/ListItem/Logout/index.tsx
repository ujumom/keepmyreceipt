import { Stack } from '@mui/material';
import { useState } from 'react';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutDialog from '../../Dialog/LogoutDialog';
import { Content } from '../../../../Landing/Banner/styles';

export default function Logout() {
  // 로그아웃 다이얼로그 변수와 함수
  const [open, setOpen] = useState(false);
  const onClick = () => {
    setOpen(true);
  };

  return (
    <>
      {/* 로그아웃 다이얼로그 컴포넌트 */}
      <LogoutDialog open={open} setOpen={setOpen} />
      <Stack alignItems="center">
        <Stack className="board" onClick={onClick}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center">
              <NoMeetingRoomIcon className="icon" />
              <Content>로그아웃</Content>
            </Stack>
            <div className="toggle">
              <ArrowForwardIosIcon color="disabled" />
            </div>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
