import React, { useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Card,
  TextField,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

// 영수증 등록 후 청구하기 위한 페이지
export default function RequestIndex() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state }: { state: any } = useLocation();
  const [newDate, setDate] = useState(state.date);
  const [newMoney, setMoney] = useState(state.value);
  const imgUrl = state.receiptUrl;
  const matches = useMediaQuery('(min-width:500px)');

  // 청구하기 전에 날짜 형식이 yyyy-MM-dd 형식인지 체크 -> 영수증 청구 처리
  function submitHandler(event: any) {
    event.preventDefault();

    const dateSlice = newDate.split('-');
    if (dateSlice.length !== 3) {
      alert('날짜 형식이 올바르지 않습니다 : xxxx-xx-xx');
      setDate('');
      return;
    }
    if (
      dateSlice[0].length != 4 ||
      dateSlice[1].length != 2 ||
      dateSlice[2].length != 2
    ) {
      alert('날짜 형식이 올바르지 않습니다 : xxxx-xx-xx');
      setDate('');
      return;
    }
    if (isNaN(Number(newMoney)) || newMoney.trim() === '') {
      alert('금액에는 숫자만 기입할 수 있습니다');
      setMoney('');
    }
    axios
      .post(`https://k6d104.p.ssafy.io/api/spring/club/${id}/request`, {
        date: newDate,
        price: parseInt(newMoney),
        receiptUrl: imgUrl,
      })
      .then((response) => {
        console.log(response);
        navigate(`/club/${id}/receipt/requestList`);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <Container maxWidth="md">
      <div
        style={
          matches
            ? { marginTop: 20, marginBottom: 0, width: '100%' }
            : { marginTop: 0, marginBottom: 70, width: '100%' }
        }
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ width: '100%' }}
        >
          <Stack spacing={2} style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 15, width: '100%' }}>
              <img src={imgUrl} alt="" style={{ width: '100%' }} />
            </Card>
            <br></br>
            <Card variant="outlined" style={{ padding: 15, width: '100%' }}>
              <TextField
                label="날짜"
                placeholder="xxxx-xx-xx"
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newDate}
                onChange={(e: any) => setDate(e.target.value)}
              />
              <TextField
                label="총금액"
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newMoney}
                onChange={(e: any) => setMoney(e.target.value)}
              />
            </Card>
          </Stack>
        </Grid>
        <br></br>
        <br></br>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignContent="center"
        >
          <Button
            variant="contained"
            fullWidth
            color="success"
            onClick={submitHandler}
          >
            승인요청
          </Button>
        </Grid>
        <br></br>
      </div>
    </Container>
  );
}
