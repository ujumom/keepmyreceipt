import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Box,
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
}

export default function SearchJoinDialog({
  open,
  setOpen,
  clubInfo,
}: DialogType) {
  const [loading, setLoading] = useState(false);
  const { id, name, description, image } = clubInfo;
  const handleClose = () => {
    setOpen(false);
  };
  const JoinClub = async () => {
    setLoading(true);
    // 가입 신청
    await axios
      .post(`https://k6d104.p.ssafy.io/api/spring/club/${id}/crew`)
      .then((res) => {
        console.log(res);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="join-dialog-title"
      aria-describedby="join-dialog-description"
    >
      <DialogTitle id="join-dialog-title">{`${name}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="join-dialog-description">
          가입 신청이 수락되면 '알림'으로 알려드립니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Box sx={{ m: 0, position: 'relative' }}>
          <Button onClick={JoinClub} autoFocus disabled={loading}>
            가입하기
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: '#ffa500',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
