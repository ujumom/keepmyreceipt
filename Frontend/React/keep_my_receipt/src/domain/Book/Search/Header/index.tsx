import {
  Box,
  IconButton,
  Stack,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { ArrowLeft, ArrowRight, ArrowBackIos } from '@mui/icons-material';
import toCurrency from '../../../../services/toCurrency';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../../../../components/SearchBar';

interface IndexHeaderProps {
  expenditure: number;
  income: number;
  value: string;
  setValue: any;
  onSearch: any;
  targetStart: Date;
  targetEnd: Date;
  setTargetStart: any;
  setTargetEnd: any;
}

export default function SearchHeader({
  expenditure,
  income,
  value,
  setValue,
  onSearch,
  targetStart,
  targetEnd,
  setTargetStart,
  setTargetEnd,
}: IndexHeaderProps) {
  const navigate = useNavigate();
  const onChangeStart = (e) => {
    setTargetStart(new Date(e.target.value));
  };
  const onChangeEnd = (e) => {
    setTargetEnd(new Date(e.target.value));
  };

  const toCustomDateString = (inputDate: Date, type?: boolean) => {
    const check = (num: number) => {
      if (num < 10) {
        if (type) {
          return ` ${num}`;
        } else {
          return `0${num}`;
        }
      } else {
        return `${num}`;
      }
    };
    const year = inputDate.getFullYear();
    const month = check(inputDate.getMonth() + 1);
    const date = check(inputDate.getDate());
    return type ? `${year}.${month}.${date}` : `${year}-${month}-${date}`;
  };
  const onClick = (e) => {
    const txt = e.target.textContent;
    const today = new Date();
    const date1 = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
    );
    const date2 = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      today.getDate() + 1,
      0,
    );
    const date3 = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate() + 1,
      0,
    );
    if (txt === '오늘') {
      setTargetStart(date1);
      setTargetEnd(date1);
    } else if (txt === '3개월') {
      setTargetStart(date2);
      setTargetEnd(date1);
    } else if (txt === '6개월') {
      setTargetStart(date3);
      setTargetEnd(date1);
    }
  };
  return (
    <Stack width="100%">
      <Stack paddingLeft="1rem">
        {/* 검색 */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ position: 'relative' }}
        >
          <IconButton
            onClick={() => {
              // navigate('../');
              navigate(-1);
            }}
            color="inherit"
            sx={{ position: 'absolute', left: 0 }}
          >
            <ArrowBackIos sx={{ fontSize: '1.8rem' }} />
          </IconButton>
          {/* 검색 창 */}
          <SearchBar
            value={value}
            setValue={setValue}
            onSearch={onSearch}
            navi={'.'}
            placeholder="내역 및 태그를 입력해주세요"
          />
        </Stack>

        {/* 지출 & 수입 */}
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
        {/* 기간 */}
        <Stack spacing={0.5} sx={{ marginBottom: '1rem' }}>
          {/* 선택 버튼 */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              variant="outlined"
              onClick={onClick}
              sx={{ padding: '0.2rem' }}
            >
              오늘
            </Button>
            <Button
              variant="outlined"
              onClick={onClick}
              sx={{ padding: '0.2rem' }}
            >
              3개월
            </Button>
            <Button
              variant="outlined"
              onClick={onClick}
              sx={{ padding: '0.2rem' }}
            >
              6개월
            </Button>
          </Stack>
          {/* 검색 기간 확인/선택 */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              type="date"
              value={toCustomDateString(targetStart)}
              // defaultValue={targetStart}
              onChange={onChangeStart}
              variant="standard"
            />
            <p>~</p>
            <TextField
              type="date"
              value={toCustomDateString(targetEnd)}
              // defaultValue={targetEnd}
              onChange={onChangeEnd}
              variant="standard"
            />
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
