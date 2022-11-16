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

export default function LogoutDialog({ open, setOpen }: DialogType) {
  const accessToken = sessionStorage.getItem('accessToken');
  const fcmToken = sessionStorage.getItem('fcmToken');
  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  const onLogout = () => {
    if (accessToken) {
      axios
        .post('/api/spring/crew/logout', { fcmToken: fcmToken })
        .then(function (response) {
          sessionStorage.removeItem('accessToken');
          axios.defaults.headers.common['Authorization'] = '';
          navigate('/', { replace: true });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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
          로그아웃 하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          sx={{
            '&.MuiButton-text': { color: '#ff0000' },
          }}
          onClick={onLogout}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
