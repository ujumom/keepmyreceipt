import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';

import LargeTagChart from './LargeTagChart';
import FlowChart from './FlowChart';
import {
  apiLoadFirstChartData,
  apiLoadFlowChartData,
  FirstChartResponseType,
  toTagItemType,
} from './api';

export default function MainChartIndex() {
  const { id } = useParams();
  const matches = useMediaQuery('(min-width:500px)');

  const date = new Date();
  const year = String(date.getFullYear());
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const [curYear, setYear] = useState(year);
  const [curMonth, setMonth] = useState(month);
  const yearList = ['2022', '2021', '2020', '2019', '2018'];
  const [monthList, setMonthList] = useState(getMonthList);

  // 선택한 연도가 현재 연도일 경우, 선택가능한 월 리스트를 가공하여 리턴
  function getMonthList() {
    return [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ].filter((item) => parseInt(item) <= parseInt(month));
  }
  // 기간변경 토글창에서 연도 변경 시 유효성 체크 후 state 변경
  function changeYear(e: SelectChangeEvent<string>) {
    const newYear = e.target.value;
    if (newYear > year) {
      alert(`${curYear}년 이후의 날짜로 설정할 수 없습니다.`);
      e.target.value = newYear;
      return;
    }
    setYear(e.target.value);
    if (newYear === year) {
      setMonthList(
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].filter(
          (item) => parseInt(item) <= parseInt(month),
        ),
      );
    } else {
      setMonthList([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ]);
    }
    if (newYear === year && curMonth > month) {
      setMonth(month);
    }
  }
  // 기간변경 토글창에서 월 변경 시 state 변경
  function changeMonth(e: SelectChangeEvent<string>) {
    setMonth(e.target.value);
  }

  /** 밑으로 내려보낼 데이터들 */
  // id는 태그 이름, value는 금액, rate는 퍼센트
  const [tagItems, setTagItems] = useState([
    { id: 'no data', value: '-1', rate: '0' },
  ]);
  const [sumTagValue, setSumTagValue] = useState(0);
  const [flowItems, setFlowItems] = useState([
    { year: 2022, month: 5, totalCost: 0 },
  ]);
  const [sumFlowValue, setSumFlowValue] = useState(0);

  /** 태그 데이터 API 요청 함수 */
  const loadTagDataFromServer = async () => {
    console.log('Analytics : load Data from DB');
    // API 요청
    await apiLoadFirstChartData(id, curYear, curMonth).then((response) => {
      // 결과값 받음
      const responseData: FirstChartResponseType[] = response.data.data;
      // 결과값을 현재 컴포넌트에서 쓰는 형태로 변환
      if (responseData.length > 0) {
        const { tagItems, tagTotalCost } = toTagItemType(responseData);
        setTagItems(tagItems);
        setSumTagValue(tagTotalCost);
      } else {
        setTagItems([
          {
            id: 'no data',
            value: '-1',
            rate: '100',
          },
        ]);
        setSumTagValue(0);
      }
    });
  };

  /* 플로우 차트 데이터를 샘플로부터 가져옴 */
  const loadFlowDataFromSample = async () => {
    await apiLoadFlowChartData(id, curYear, curMonth).then((response) => {
      const flowChartData = response.data.data;
      let tmpSumFlowValue = 0;
      // 1년 간 지출 통계를 별도로 추출하기 위한 로직
      flowChartData.forEach((item) => {
        tmpSumFlowValue += parseInt(item.totalCost);
      });
      setSumFlowValue(tmpSumFlowValue);
      setFlowItems(flowChartData);
    });
  };
  // 기간변경 토글창 on/off
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    loadTagDataFromServer();
    loadFlowDataFromSample();
    setOpen(false);
  };
  // 지출분석 페이지가 처음 렌더링 될 때, 태그별 통계 및 월별 추이 구성에 필요한 데이터를 비동기 요청
  useEffect(() => {
    loadTagDataFromServer();
    loadFlowDataFromSample();
  }, []);

  return (
    <Container maxWidth="md">
      {/* 기간 설정 클릭 시 뜨는 다이얼로그 창 */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={5.8} sm={5.8} md={5.8}>
              {/* 연도 변경을 선택할 수 있는 UI */}
              <Select
                id="year"
                value={curYear}
                onChange={changeYear}
                autoWidth
                label="Year"
              >
                {yearList.map((item) => (
                  <MenuItem value={item}>{item}년</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={5.8} sm={5.8} md={5.8}>
              {/* 월 변경을 선택할 수 있는 UI */}
              <Select
                id="month"
                value={curMonth[0] === '0' ? curMonth[1] : curMonth}
                onChange={changeMonth}
                autoWidth
                label="Month"
              >
                {monthList.map((item) => (
                  <MenuItem value={item}>{item}월</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 페이지 내용 */}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={0.5}
        style={
          matches
            ? { marginTop: 20, marginBottom: 30, width: '100%' }
            : { marginTop: 0, marginBottom: 100, width: '100%' }
        }
      >
        <Stack spacing={2} style={{ width: '100%' }}>
          {/* 기간 설정 창 */}
          <Card
            variant="outlined"
            style={{
              padding: 15,
              width: '100%',
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              style={{ width: '100%' }}
            >
              <Grid item xs={8} sm={8} md={8} container justifyContent="start">
                <Typography
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  {curYear}년&nbsp;
                  {curMonth[0] === '0' ? curMonth[1] : curMonth}
                  월&nbsp;지출&nbsp;분석
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4} md={4} container justifyContent="end">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ fontWeight: 'bold' }}
                  onClick={handleOpen}
                >
                  기간설정
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* 분석 차트들 */}
          <LargeTagChart sumValue={sumTagValue} items={tagItems} />
          <FlowChart sumValue={sumFlowValue} items={flowItems} />
        </Stack>
      </Grid>
    </Container>
  );
}
