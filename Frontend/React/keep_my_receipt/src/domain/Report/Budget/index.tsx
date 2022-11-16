import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  Select,
  MenuItem,
  DialogActions,
  Container,
} from '@mui/material';
import ReportIndex from './form/index';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// 유형 객체 (=== 대분류 객체배열)
interface ListType {
  type: string;
  list: ReportType[];
}

// 대분류 객체 (=== 소분류 객체배열)
interface ReportType {
  lcName: string;
  list: ItemType[];
  total: number;
}

// 소분류 객체
interface ItemType {
  scName: string;
  balance: number;
}

export default function BudgetReport() {
  // 유형별 대분류 객체배열 default값 설정
  const defaultData = [
    {
      lcName: 'test',
      list: [{ scName: 'test', balance: 0 }],
      total: 0,
    },
  ];
  const [budgetList, setBudgetList]: [ReportType[], Function] =
    useState(defaultData);
  const [expenseList, setExpenseList]: [ReportType[], Function] =
    useState(defaultData);
  const [revenueList, setRevenueList]: [ReportType[], Function] =
    useState(defaultData);
  const [sumBudget, setSumBudget] = useState(0);
  const [sumExpense, setSumExpense] = useState(0);
  const [sumRevenue, setSumRevenue] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const date = new Date();
  const year = String(date.getFullYear());
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const [curYear, setYear] = useState(year);
  const [curMonth, setMonth] = useState(month);
  const yearList = ['2022', '2021', '2020', '2019', '2018'];
  const [monthList, setMonthList] = useState(getMonthList);
  const [open, setOpen] = useState(false);
  const moveAssetReport = () => {
    navigate(`/club/${id}/report/asset`);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    loadData();
    setOpen(false);
  };
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
  function changeYear(e: any) {
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
  function changeMonth(e: any) {
    let tmpMonth = e.target.value;
    if (tmpMonth.length < 2) {
      tmpMonth = '0'.concat(tmpMonth);
    }
    setMonth(tmpMonth);
  }
  // 유효성 검사 결과 유효하지 않을 시 모든 유형 객체배열 및 자산총합 초기화
  function clearData() {
    setBudgetList(defaultData);
    setSumBudget(0);
    setExpenseList(defaultData);
    setSumExpense(0);
    setRevenueList(defaultData);
    setSumRevenue(0);
  }
  // 유형별 객체배열 유효성 검사
  const checkEmpty = (previousList: ListType[]) => {
    console.log('checkEmpty', previousList);
    if (previousList === null) {
      clearData();
      return false;
    }
    const tmpList = [...previousList];
    const checkList = [];
    tmpList.forEach((list) => {
      checkList.push(list.type);
    });
    checkList.forEach((type) => {
      if (!(type in ['지출', '예산', '수입'])) {
        if (type === '지출') {
          setExpenseList(defaultData);
          setSumExpense(0);
        }
        if (type === '예산') {
          setBudgetList(defaultData);
          setSumBudget(0);
        }
        if (type == '수입') {
          setRevenueList(defaultData);
          setSumRevenue(0);
        }
      }
    });
    return true;
  };
  // 예산, 지출, 수입 객체배열 데이터를 비동기 요청
  const loadData = async () => {
    // Todo API connect
    await axios
      .get(
        `https://k6d104.p.ssafy.io/api/spring/${id}/report/budget?date=${curYear
          .concat('-')
          .concat(curMonth)}`,
      )
      .then((response) => {
        const lists = response.data.data;
        if (!checkEmpty(lists)) {
          return;
        }
        // 예산의 대분류별 총계를 추출하기 위한 로직
        lists.forEach((mainCat) => {
          if (mainCat.type === '예산') {
            const tmpList = [...mainCat.list];
            console.log('tmpList');
            tmpList.sort(function (a, b) {
              return a.lcName < b.lcName ? -1 : a.lcName > b.lcName ? 1 : 0;
            });
            console.log(tmpList);
            let tmp = 0;
            tmpList.forEach((lcName) => {
              let tmp2 = 0;
              lcName.list.forEach((rcName) => {
                tmp += rcName.balance;
                tmp2 += rcName.balance;
              });
              lcName['total'] = tmp2;
            });
            setSumBudget(tmp);
            setBudgetList(tmpList);
            console.log(budgetList);
            // 지출의 대분류별 총계를 추출하기 위한 로직
          } else if (mainCat.type === '지출') {
            const tmpList = [...mainCat.list];
            let tmp = 0;
            tmpList.forEach((lcName) => {
              let tmp2 = 0;
              lcName.list.forEach((rcName) => {
                tmp += rcName.balance;
                tmp2 += rcName.balance;
              });
              lcName['total'] = tmp2;
            });
            setSumExpense(tmp);
            setExpenseList(tmpList);
            // 수입의 대분류별 총계를 추출하기 위한 로직
          } else if (mainCat.type === '수입') {
            const tmpList = [...mainCat.list];
            let tmp = 0;
            tmpList.forEach((lcName) => {
              let tmp2 = 0;
              lcName.list.forEach((rcName) => {
                tmp += rcName.balance;
                tmp2 += rcName.balance;
              });
              lcName['total'] = tmp2;
            });
            setSumRevenue(tmp);
            setRevenueList(tmpList);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const budgetMainCategories = ['전기예산', '활동지원금', '회비', '후원금'];
  const expenseMainCategories = [
    '복리후생비',
    '여가교통비',
    '소모품비',
    '기타 비용',
  ];
  const revenueMainCategories = ['수입', '기타 수입'];
  // 다운로드 버튼 클릭 시 엑셀 파일 다운로드
  const clickDownload = async () => {
    console.log('다운로드 버튼 클릭!');
    await axios
      .get(`https://k6d104.p.ssafy.io/api/spring/${id}/report/budget/excel`, {
        responseType: 'blob',
      })
      .then((result) => {
        console.log(result);
        console.log(result.headers['content-type']);
        const url = window.URL.createObjectURL(
          new Blob([result.data], {
            type: result.headers['content-type'],
          }),
        );
        if (window['Android']) {
          const reader = new FileReader();
          reader.readAsDataURL(result.data);
          reader.onloadend = function () {
            window['Android']['getBase64FromBlobData'](reader.result);
          };
        } else {
          const link = document.createElement('a');
          link.href = url;
          link.download = 'example.xlsx';
          link.click();
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // 예산운영표 페이지 첫 렌더링 시, 자산 객체배열 비동기 요청
  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container maxWidth="md">
      {/* 기간변경 다이알로그 */}
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
      {/* 기간설정 컴포넌트 */}
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={6} sm={6} md={6} style={{ width: '50%' }}>
          <Card
            variant="outlined"
            style={{
              width: '100%',
              paddingTop: 15,
              paddingBottom: 15,
            }}
            onClick={moveAssetReport}
          >
            <Typography textAlign="center">자산현황표</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={6} style={{ width: '50%' }}>
          <Card
            variant="outlined"
            style={{
              width: '100%',
              paddingTop: 15,
              paddingBottom: 15,
              backgroundColor: '#FFF5E1',
            }}
          >
            <Typography textAlign="center">예산운영표</Typography>
          </Card>
        </Grid>
      </Grid>
      <Card
        variant="outlined"
        style={{
          width: '100%',
          paddingTop: 15,
          paddingBottom: 15,
          marginTop: 15,
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          style={{ width: '100%' }}
        >
          <Grid xs={8} sm={8} md={8} item justifyContent="start">
            <Typography
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%',
              }}
            >
              {curYear}년&nbsp;
              {curMonth[0] === '0' ? curMonth[1] : curMonth}
              월&nbsp;예산운영표
            </Typography>
          </Grid>
          <Grid xs={4} sm={4} md={4} item justifyContent="end">
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
      {/* 예산운영표 - 전기이월 예산 컴포넌트 */}
      <ReportIndex
        title="예산"
        itemList={budgetList}
        catList={budgetMainCategories}
        sumValue={sumBudget}
      />
      {/* 예산운영표 - 지출 컴포넌트 */}
      <ReportIndex
        title="지출"
        itemList={expenseList}
        catList={expenseMainCategories}
        sumValue={sumExpense}
      />
      {/* 예산운영표 - 수입 컴포넌트 */}
      <ReportIndex
        title="수입"
        itemList={revenueList}
        catList={revenueMainCategories}
        sumValue={sumRevenue}
      />
      {/* 예산운영표 - 차기이월 예산 컴포넌트 */}
      <ReportIndex
        title="합계"
        itemList={[
          {
            lcName: '차기예산',
            list: [],
            total: sumBudget - sumExpense + sumRevenue,
          },
        ]}
        catList={['차기예산']}
        sumValue={sumBudget - sumExpense + sumRevenue}
      />
      <br></br>
      <br></br>
      {/* 엑셀 파일 다운로드 버튼 */}
      <Grid container justifyContent="center" alignItems="center">
        <Button variant="contained" color="primary" onClick={clickDownload}>
          다운로드
        </Button>
      </Grid>
      <br></br>
    </Container>
  );
}
