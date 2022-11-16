import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface DialogType {
  open: boolean;
  setOpen: any;
}

export default function EditUserInfoDialog({ open, setOpen }: DialogType) {
  // 유저 이름 받아오기
  const [userName, setUserName] = useState('');

  //취소 버튼
  const handleClose = () => {
    setOpen(false);
  };

  //확인 버튼 눌렀을 때, userName input value로 바꾸기
  const changeName = (e: any) => {
    setUserName(e.target.value);
  };

  // 유저 이름 수정 axios 요청
  const onChangeName = () => {
    axios
      .put(`api/spring/crew/info/?name=${userName}`, {
        name: userName,
      })
      .then(function (response) {
        console.log(response);
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
        {/* 다이얼로그 글 부분 */}
        <DialogContentText
          id="join-dialog-description"
          sx={{ paddingTop: '40px' }}
        >
          <TextField
            onChange={changeName}
            type="text"
            id="nickname"
            name="nickname"
            fullWidth
            label="이름"
            autoComplete="current-password"
            variant="outlined"
            size="small"
          />
        </DialogContentText>
      </DialogContent>
      {/* 다이얼로그 액션 버튼 */}
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          sx={{
            '&.MuiButton-text': { color: '#ff0000' },
          }}
          onClick={onChangeName}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
