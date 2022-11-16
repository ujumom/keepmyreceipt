import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

interface DialogType {
  open: boolean;
  setOpen: any;
}

export default function LeaveAppDialog({ open, setOpen }: DialogType) {
  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  const LeaveApp = () => {
    axios
      .delete('api/spring/crew')
      .then(function (response) {
        if (response.data.msg == '모임의 리더는 탈퇴할 수 없습니다.') {
          alert('모임의 리더는 탈퇴할 수 없습니다.');
        } else {
          navigate('/');
        }
      })
      .catch(function (error) {
        console.log(error);
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
      <DialogContent>
        <DialogContentText id="join-dialog-description">
          '영수증을 부탁해'를 탈퇴하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          sx={{
            '&.MuiButton-text': { color: '#ff0000' },
          }}
          onClick={LeaveApp}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
