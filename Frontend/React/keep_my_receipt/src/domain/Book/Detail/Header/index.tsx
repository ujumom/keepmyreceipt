import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, Stack, Typography, Button } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import toCurrency from '../../../../services/toCurrency';
import { apiDeleteTransaction } from '../../api/bookReadApi';
import { ConfirmSwal } from '../../../../services/customSweetAlert';
import DialogWithIconButton from '../../../../components/DialogWithIconButton';

interface DetailHeaderProps {
  state: any;
  params: any;
}

export default function DetailHeader({ state, params }: DetailHeaderProps) {
  const navigate = useNavigate();
  const { date, totalPrice, receiptUrl } = state;
  return (
    <Stack width="100%">
      <Stack direction="row" alignItems="center">
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          color="inherit"
        >
          <ArrowBackIos sx={{ fontSize: '1.8rem' }} />
        </IconButton>
        <h2>거래내역 상세</h2>
      </Stack>

      <Stack paddingX="1rem">
        {/* 날짜, 총금액 */}
        <Stack marginY={1}>
          <Stack direction="row" spacing="1rem" justifyContent="space-between">
            <Typography sx={{ fontSize: '1rem' }}>날짜</Typography>
            <Typography sx={{ fontSize: '1rem' }}>
              <b>{date}</b>
            </Typography>
          </Stack>
          <Stack direction="row" spacing="1rem" justifyContent="space-between">
            <Typography sx={{ fontSize: '1rem' }}>총금액</Typography>
            <Typography sx={{ fontSize: '1rem' }}>
              <b>{toCurrency(totalPrice)}</b>
            </Typography>
          </Stack>
        </Stack>
        {/* 영수증 확인 */}
        {receiptUrl ? (
          <DialogWithIconButton
            icon={
              <Button fullWidth variant="outlined" color="secondary">
                영수증 확인
              </Button>
            }
            content={<img src={receiptUrl} />}
          />
        ) : (
          <Button disabled variant="outlined">
            영수증 없음
          </Button>
        )}

        {/* 수정, 삭제 버튼 */}
        <Stack direction="row" justifyContent="end" marginTop={1}>
          <Button
            onClick={() => {
              navigate('../create', { state: state });
            }}
            variant="text"
          >
            수정
          </Button>
          <Button
            onClick={async () => {
              ConfirmSwal('삭제하시겠습니까?').then(async (res) => {
                if (res.isConfirmed) {
                  await apiDeleteTransaction(params.transactionId).then(
                    (res) => {
                      if (res.data.output === 200) {
                        Swal.fire('삭제 성공!').then(() => {
                          navigate('../');
                        });
                      }
                    },
                  );
                }
              });
            }}
            variant="text"
            color="warning"
          >
            삭제
          </Button>
        </Stack>
      </Stack>
      {/* 경계선 */}
      <Box
        width="100%"
        height="0.5rem"
        sx={{ backgroundColor: '#eeeeee', marginBottom: '1rem' }}
      />
    </Stack>
  );
}
