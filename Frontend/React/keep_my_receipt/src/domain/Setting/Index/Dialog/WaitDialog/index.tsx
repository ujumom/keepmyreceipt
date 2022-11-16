import React from 'react';
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
}

export default function SearchWaitDialog({
  open,
  setOpen,
  clubInfo,
}: DialogType) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="wait-dialog-title"
      aria-describedby="wait-dialog-description"
    >
      <DialogTitle id="wait-dialog-title">{`${clubInfo.name}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="wait-dialog-description">
          가입 신청이 수락되면 '알림'으로 알려드립니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>확인</Button>
      </DialogActions>
    </Dialog>
  );
}
