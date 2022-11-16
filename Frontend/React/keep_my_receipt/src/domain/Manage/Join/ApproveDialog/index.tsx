import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  IconButton,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface DialogType {
  open: boolean;
  setOpen: any;
  clubCrewInfo: any;
  updateInfo: any;
}

export default function JoinApproveDialog({
  open,
  setOpen,
  clubCrewInfo,
  updateInfo,
}: DialogType) {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const { clubCrewId, name, email } = clubCrewInfo;
  const handleClose = () => {
    setOpen(false);
  };
  const approveCrew = async () => {
    setLoading2(true);
    console.log('멤버 승인');
    await axios
      .put(
        `https://k6d104.p.ssafy.io/api/spring/club/crew/${clubCrewId}/request`,
      )
      .then((res) => {
        console.log(res);
        setLoading2(false);
      })
      .catch((e) => {
        console.log(e);
      });
    handleClose();
    updateInfo();
  };
  const denyCrew = async () => {
    setLoading(true);
    console.log('멤버 거부');
    await axios
      .delete(
        `https://k6d104.p.ssafy.io/api/spring/club/crew/${clubCrewId}/request`,
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    handleClose();
    updateInfo();
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
        가입 승인
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText id="join-dialog-description" color="black">
          {name}
        </DialogContentText>
        <DialogContentText id="join-dialog-description2" color="black">
          {email}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box sx={{ m: 0, position: 'relative' }}>
          <Button onClick={denyCrew} disabled={loading}>
            거부
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
        <Box sx={{ m: 0, position: 'relative' }}>
          <Button onClick={approveCrew} disabled={loading2}>
            승인
          </Button>
          {loading2 && (
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
