import { useEffect, useReducer, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Card, Stack } from '@mui/material';

import Header from './Header';
import Item from './Item';
import AddButton from './AddButton';
import DeleteButton from './DeleteButton';
import bookReducer, { updateBook, initBookState } from './bookReducer';
import {
  apiCreateTransaction,
  apiUpdateTransaction,
  apiValidateCreateTransaction,
  toTransactionType,
} from '../api/bookWriteApi';
import { ConfirmSwal } from '../../../services/customSweetAlert';
import { isEditable, isUpdating, sumTotalValue } from './service';
import { ReadTransactionResType } from '../api/bookReadApi';
import { ReceiptStateType } from './types';

export default function BookCreate() {
  const navigate = useNavigate(); // 다음 페이지로 보내기 위한 변수 선언
  const { id: clubId } = useParams(); // 주소에 있는 모임 ID 가져옴
  const location = useLocation(); // 이전 페이지에서 보낸 데이터 받음
  const params = location.state as ReceiptStateType | ReadTransactionResType;

  // 거래 내역 상태 초기화
  const [state, dispatch] = useReducer(
    bookReducer,
    initBookState(params, Number(clubId)),
  );

  // 거래 내역 세부 항목 인덱스
  const [page, setPage] = useState(1);

  // 거래 내역 추가 함수
  const createTransaction = async () => {
    // 영수증 ID가 있는 경우 가져옴
    const requestId = params && params.requestId;
    // API 요청 형식에 맞춰 형태 변환
    const payload = toTransactionType(state, requestId);
    // 유효성 검증
    if (apiValidateCreateTransaction(payload)) {
      // 확인 알림 창 띄우기
      ConfirmSwal('등록하시겠습니까?').then(async (res) => {
        // 확인을 누른 경우
        if (res.isConfirmed) {
          // 거래 내역 추가 API 요청
          await apiCreateTransaction(Number(clubId), payload).then((res) => {
            // 결과 메시지가 성공이면 거래 내역 목록으로 보냄
            res.data.msg === '성공' ? navigate(`/club/${clubId}/book`) : null;
          });
        }
      });
    }
  };

  // 거래 내역 수정 함수
  const updateTransaction = async () => {
    const requestId = 'requestId' in params ? params.requestId : null;
    const payload = toTransactionType(state, requestId);

    if (apiValidateCreateTransaction(payload)) {
      // 확인 알림 창 표시
      ConfirmSwal('수정하시겠습니까?').then(async (res) => {
        // 확인을 누른 경우
        if (res.isConfirmed) {
          // 거래 내역 ID 가져 옴
          const transactionId =
            'transactionId' in params ? params.transactionId : null;
          // 거래 내역 수정 요청
          await apiUpdateTransaction(transactionId, payload).then((res) => {
            // 결과가 성공인 경우, 상세 페이지로 보냄
            res.data.msg === '성공'
              ? navigate(`/club/${clubId}/book/detail`, {
                  state: {
                    transactionId: transactionId,
                    transactionDetailId: state.items[0].transactionDetailId,
                  },
                })
              : null;
          });
        }
      });
    }
  };

  useEffect(() => {
    dispatch(updateBook('totalPrice', sumTotalValue(state)));
  }, [state.items]);

  return (
    <Container maxWidth="md" sx={{ display: 'grid', marginBottom: 8 }}>
      {/* 페이지 제목 */}
      <h2>{isUpdating(params) ? '거래수정' : '거래등록'}</h2>

      {/* 거래 정보: 날짜, 총금액, 영수증 이미지 등 */}
      <Header
        date={state.date}
        totalValue={state.totalPrice}
        imageUrl={state.imageUrl}
        dispatch={dispatch}
        // 이전 페이지에서 넘어온 값이 없거나 || 넘어온 값에 requestId가 없으면 수정 가능
        editable={isEditable(params)}
      />

      {/* 페이지네이션 버튼들 */}
      {/* <PageButtons
        count={state.items.length}
        page={page}
        setPage={setPage}
        dispatch={dispatch}
        editable={!params}
      /> */}

      {/* 각각의 항목 정보들 */}
      <Stack spacing={2}>
        {state.items.map((item, index) => (
          <Card
            variant="outlined"
            sx={{
              BoxShadow: 2,
              paddingY: '1rem',
              paddingX: '0.7rem',
            }}
            key={index}
          >
            <Item
              clubId={clubId}
              item={item}
              itemIndex={index}
              dispatch={dispatch}
              currencyEditable={isEditable(params)}
            />
          </Card>
        ))}
      </Stack>

      {/* 항목 추가 & 삭제 버튼  */}
      <Box justifySelf="end">
        항목
        <AddButton page={page} setPage={setPage} dispatch={dispatch} />
        <DeleteButton page={page} setPage={setPage} dispatch={dispatch} />
      </Box>

      {/* 등록 버튼 */}
      <Button
        onClick={isUpdating(params) ? updateTransaction : createTransaction}
        variant="contained"
      >
        등록!
      </Button>
    </Container>
  );
}
