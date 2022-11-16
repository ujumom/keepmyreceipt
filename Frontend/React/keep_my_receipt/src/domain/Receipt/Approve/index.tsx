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
import ListItem from './Item';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

// 청구된 영수증을 승인하는 페이지
export default function ApproveIndex() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state }: { state: any } = useLocation();
  const [newDate, setDate] = useState(state.date);
  const [newMoney, setMoney] = useState(state.value);
  const imgUrl = state.receiptUrl;
  const [newItems, setItems] = useState([
    { id: Math.random().toString(36).substr(2, 11), content: '', money: '' },
  ]);
  // 현재 인터페이스가 웹인지 앱인지 구분하는 변수
  const matches = useMediaQuery('(min-width:500px)');

  // + 버튼 누르면 입력할 수 있는 form 추가
  function createItem() {
    const nextItems = [...newItems];
    const newSize = nextItems.length;
    nextItems[newSize] = {
      id: Math.random().toString(36).substr(2, 11),
      content: '',
      money: '',
    };
    setItems(nextItems);
  }

  // form이 변할 때마다 다시 렌더링 해주는 함수
  function renderingItems() {
    return newItems.map((item) => (
      <ListItem
        id={item.id}
        content={item.content}
        money={item.money}
        setItems={setItems}
        newItems={newItems}
        key={item.id}
      />
    ));
  }

  // (총금액 !== 항목별 금액 합계) 유효성 검사 -> 거래 등록 페이지로 이동
  function approveHandler(event: any) {
    event.preventDefault();

    let sum = 0;
    newItems.forEach((item) => {
      if (item.money === '' || item.content === '') {
        alert('비어있는 항목이 존재합니다');
        return;
      }
      sum += parseInt(item.money);
    });
    if (sum !== parseInt(newMoney)) {
      alert(
        `항목 금액의 총계(${sum
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          .concat('원')})가 총금액(${newMoney
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          .concat('원')})과 일치하지 않습니다`,
      );
      return;
    }
    // date 및 money 제약사항
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
    if (isNaN(newMoney)) {
      alert('금액에는 숫자만 기입할 수 있습니다');
      setMoney('');
    }
    const prop = {
      requestId: state.requestId,
      imgUrl: imgUrl,
      date: newDate,
      money: newMoney,
      items: newItems,
    };
    console.log('submit', prop);
    navigate(`/club/${id}/book/create`, { state: prop });
  }

  // 청구된 영수증을 거절할 때 실행되는 함수
  function rejectHandler(event: any) {
    event.preventDefault();
    axios
      .put(
        `https://k6d104.p.ssafy.io/api/spring/club/request/${state.requestId}/refusal`,
      )
      .then((response) => {
        console.log(`${state.requestId} request refusal: ${response}`);
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
          direction={matches ? 'row' : 'column'}
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
            <br></br>
          </Stack>
          {renderingItems()}
        </Grid>
        <br></br>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignContent="center"
        >
          <AddCircleIcon onClick={createItem} />
        </Grid>
        <br></br>
        <br></br>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignContent="center"
        >
          <Grid item xs={5.8} sm={4.8} md={3.8}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={rejectHandler}
            >
              거부
            </Button>
          </Grid>
          <Grid item xs={5.8} sm={4.8} md={3.8}>
            <Button variant="contained" fullWidth onClick={approveHandler}>
              승인
            </Button>
          </Grid>
        </Grid>
        <br></br>
      </div>
    </Container>
  );
}
