import { Stack } from '@mui/material';
import { useState } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LeaveAppDialog from '../../Dialog/LeaveAppDialog';
import { Content } from '../../../../Landing/Banner/styles';

export default function LeaveApp() {
  const [open, setOpen] = useState(false);
  const onClick = () => {
    setOpen(true);
  };

  return (
    <>
      <LeaveAppDialog open={open} setOpen={setOpen} />
      <Stack alignItems="center">
        <Stack className="board" onClick={onClick}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center">
              <ErrorOutlineIcon className="icon" />
              <Content>회원 탈퇴</Content>
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
