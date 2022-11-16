import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Card,
  Stack,
  Grid,
  Typography,
} from '@mui/material';

import Header from '../Create/Header';
import PageButtons from '../Create/PageButtons';
import {
  // apiDeleteTransaction,
  apiGetTransaction,
  ReadTransactionResType,
  initialReadResponse,
} from '../api/bookReadApi';
import { DetailParamType } from './types';
import toCurrency from '../../../services/toCurrency';
import {
  TitleTypographyWithSpace,
  ContentTypography,
} from '../../../styles/typography';
import { OuterBox, InnerBox } from './style';
import DetailHeader from './Header';
import Pagination from '../../../components/Pagination';
import { Box } from '@mui/system';

const createDictItem = (key: string, value: string) => ({
  key,
  value,
});

const detailItemInfo = [
  createDictItem('내용', 'name'),
  createDictItem('금액', 'price'),
  createDictItem('유형', 'type'),
  createDictItem('대분류', 'largeCategory'),
  createDictItem('소분류', 'smallCategory'),
  createDictItem('태그', 'largeTag'),
  createDictItem('메모', 'memo'),
];

interface pageInfoType {
  pageNumber: number;
  size?: number;
  totalPages: number;
  numberOfElements?: number;
  totalElements?: number;
}

export default function BookDetail() {
  const location = useLocation();
  const params = location.state as DetailParamType;

  const [state, setState] =
    useState<ReadTransactionResType>(initialReadResponse);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState<pageInfoType>({
    pageNumber: 0,
    totalPages: 0,
  });

  // 거래내역 상세 조회
  const readTransaction = async (transactionId: number) => {
    await apiGetTransaction(transactionId).then((res) => {
      // console.log('readTransaction', res.data.data);

      // 거래내역 상세 리스트를 data에 저장
      const data: ReadTransactionResType = res.data.data;
      setState(data);

      // 페이지 설정
      if (params) {
        const targetItems = data.items.filter(
          (item) => item.transactionDetailId === params.transactionDetailId,
        );
        setPage(data.items.indexOf(targetItems[0]) + 1);
        setPageInfo({
          pageNumber: data.items.indexOf(targetItems[0]),
          totalPages: data.items.length,
        });
      }
    });
  };

  // 페이지 설정( for 페이지네이션 )
  const getBookPage = (page: number) => {
    const targetItems = state.items.filter(
      (item) =>
        item.transactionDetailId === state.items[page].transactionDetailId,
    );
    setPage(state.items.indexOf(targetItems[0]) + 1);
    setPageInfo({
      pageNumber: state.items.indexOf(targetItems[0]),
      totalPages: state.items.length,
    });
  };
  useEffect(() => {
    const transactionId = params ? params.transactionId : 21;
    readTransaction(transactionId);
  }, []);

  return (
    <Container maxWidth="md" sx={{ paddingY: 0, paddingX: '1rem' }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ marginBottom: 1 }}
      >
        {/* 상단 */}
        <DetailHeader state={state} params={params} />

        {/* 페이지네이션 */}
        <Pagination
          pageInfo={pageInfo}
          paginationSize={5}
          onClickPage={(page: number) => {
            setPage(page + 1);
            getBookPage(page);
          }}
          // showOne={true}
        />

        {/* 거래내역 상세 */}
        <Card
          variant="outlined"
          sx={{
            BoxShadow: 1,
            margin: '1rem',
            padding: '0.5rem',
            width: '18rem',
          }}
        >
          <Stack direction="column">
            {/* 내용 */}
            <Stack alignItems="start" marginBottom={1} paddingX={0.5}>
              <Stack direction="row" paddingTop={0.5} marginBottom={0.5}>
                <Typography fontSize="1.2rem">
                  <b>{state.items[page - 1].name}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} paddingTop={0.5}>
                <Typography sx={{ width: '4rem', color: '#757575' }}>
                  금액
                </Typography>
                <Typography>
                  <b>{toCurrency(state.items[page - 1].price)}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} paddingTop={0.5}>
                <Typography sx={{ width: '4rem', color: '#757575' }}>
                  유형
                </Typography>
                <Typography>
                  <b>{state.items[page - 1].type}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} paddingTop={0.5}>
                <Typography sx={{ width: '4rem', color: '#757575' }}>
                  대분류
                </Typography>
                <Typography>
                  <b>{state.items[page - 1].largeCategory}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} paddingTop={0.5}>
                <Typography sx={{ width: '4rem', color: '#757575' }}>
                  소분류
                </Typography>
                <Typography>
                  <b>{state.items[page - 1].smallCategory}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} paddingTop={0.5}>
                <Typography sx={{ width: '4rem', color: '#757575' }}>
                  태그
                </Typography>
                <Typography>
                  <b>{state.items[page - 1].largeTag}</b>
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Container>
  );
}
