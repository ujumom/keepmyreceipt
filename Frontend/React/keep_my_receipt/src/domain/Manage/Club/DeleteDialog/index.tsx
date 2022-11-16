import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DialogType {
  open: boolean;
  setOpen: any;
  clubInfo: any;
}

export default function ClubDeleteDialog({
  open,
  setOpen,
  clubInfo,
}: DialogType) {
  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const deleteClub = async () => {
    await axios
      .delete(`/api/spring/club/${clubInfo.id}`)
      .then((res) => {
        const result = res.data.msg;
        if (result === '성공') {
          navigate('/club');
        } else {
          alert(
            '리더를 제외한 회원(관리자)이 없는 경우에\n폐쇄할 수 있습니다.',
          );
          setOpen(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="join-dialog-title"
      aria-describedby="join-dialog-description"
    >
      <IconButton
        color="inherit"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 0 }}
      >
        <Close sx={{ fontSize: '1.8rem' }} />
      </IconButton>
      <DialogTitle
        id="join-dialog-title"
        width="15rem"
        color="black"
        fontWeight="bold"
      >
        모임 폐쇄
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}></DialogContent>
      <DialogActions>
        <Box sx={{ m: 0, position: 'relative' }}>
          <Button onClick={handleClose}>취소</Button>
        </Box>
        <Box sx={{ m: 0, position: 'relative' }}>
          <Button onClick={deleteClub}>폐쇄</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
