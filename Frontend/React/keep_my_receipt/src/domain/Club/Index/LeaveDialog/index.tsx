import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ClubInfoType {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface DialogType {
  open: boolean;
  setOpen: any;
  clubInfo: ClubInfoType;
  getClubList: any;
}

export default function LeaveClubDialog({
  open,
  setOpen,
  clubInfo,
  getClubList,
}: DialogType) {
  const handleClose = () => {
    setOpen(false);
  };

  const LeaveClub = () => {
    axios
      .delete(`api/spring/club/${clubInfo.id}/crew`)
      .then((res) => {
        if (res.data.output === 0) {
          alert(res.data.msg);
        } else {
          getClubList();
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="join-dialog-title"
      aria-describedby="join-dialog-description"
    >
      <DialogTitle id="wait-dialog-title">{`${clubInfo.name}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="join-dialog-description">
          모임을 탈퇴하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          sx={{
            '&.MuiButton-text': { color: '#ff0000' },
          }}
          onClick={LeaveClub}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
