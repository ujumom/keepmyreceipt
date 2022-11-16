import { Box, IconButton, Stack, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, Search } from '@mui/icons-material';
import toCurrency from '../../../../services/toCurrency';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface IndexHeaderProps {
  month: number;
  setMonth: any;
  target: any;
  expenditure: number;
  income: number;
  checked: boolean;
  balance: number;
  setHistoryList: any;
}

export default function IndexHeader({
  month,
  setMonth,
  target,
  expenditure,
  income,
  checked,
  balance,
  setHistoryList,
}: IndexHeaderProps) {
  const navigate = useNavigate();
  return (
    <Stack width="100%">
      <Stack paddingLeft="1rem">
        <h2>거래 내역</h2>
        {/* <Typography>예산: {toCurrency(balance)}</Typography> */}
      </Stack>
      {/* 현재 연월 표시 + 검색버튼 */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" width="20rem">
          <IconButton
            onClick={() => {
              setHistoryList([]);
              setMonth(month - 1);
            }}
          >
            <ArrowLeft sx={{ color: '#000000', fontSize: '2rem' }} />
          </IconButton>
          <Typography variant="h5">{target.getMonth() + 1}월 </Typography>
          <IconButton
            onClick={() => {
              setHistoryList([]);
              setMonth(month + 1);
            }}
            disabled={checked}
          >
            <ArrowRight
              sx={{ color: checked ? '#9e9e9e' : '#000000', fontSize: '2rem' }}
            />
          </IconButton>
        </Stack>
        <IconButton
          onClick={() => {
            navigate('./search');
          }}
        >
          <Search sx={{ color: '#000000', fontSize: '2rem' }} />
        </IconButton>
      </Stack>

      {/* 지출 & 수입 */}
      <Stack paddingLeft="1rem">
        <Stack marginY={1}>
          <Stack direction="row" spacing="1rem">
            <Typography sx={{ fontSize: '1.2rem' }}>지출</Typography>
            <Typography sx={{ fontSize: '1.2rem' }} color="#aa2626">
              <b>{toCurrency(expenditure)}</b>
            </Typography>
          </Stack>
          <Stack direction="row" spacing="1rem">
            <Typography sx={{ fontSize: '1.2rem' }}>수입</Typography>
            <Typography sx={{ fontSize: '1.2rem' }} color="#4caf50">
              <b>{toCurrency(income)}</b>
            </Typography>
          </Stack>
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
