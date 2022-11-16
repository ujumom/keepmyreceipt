import React, { memo } from 'react';
import { Button, Stack, TextField, Box } from '@mui/material';

import DialogWithIconButton from '../../../../components/DialogWithIconButton';
import {
  ContentTypography,
  TitleTypography,
} from '../../../../styles/typography';
import { BookAction, updateBook } from '../bookReducer';
import toCurrency from '../../../../services/toCurrency';

/** 헤더 타입
 * - 필수: 날짜, 총 금액, 수정 가능 여부
 * - 옵션: 이미지 주소, 상태 변경 함수
 */
interface HeaderType {
  date: string;
  totalValue: number;
  imageUrl?: string;
  dispatch?: React.Dispatch<BookAction>;
  editable: boolean;
}

function Header(props: HeaderType) {
  /** 거래 내역의 날짜를 갱신하는 함수 */
  const changeDate = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    props.dispatch && props.dispatch(updateBook('date', event.target.value));
  };

  return (
    <>
      <Stack>
        {/* 날짜 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={1}
        >
          <TitleTypography>날짜</TitleTypography>
          {props.editable ? (
            // 날짜 입력란
            <TextField
              type="date"
              defaultValue={props.date}
              onChange={changeDate}
              variant="standard"
            />
          ) : (
            // 영수증 승인에서 넘어온거면 날짜 수정 불가
            <ContentTypography>{props.date}</ContentTypography>
          )}
        </Stack>

        {/* 총금액 */}
        <Stack direction="row" justifyContent="space-between" marginBottom={1}>
          <TitleTypography>총금액</TitleTypography>
          <ContentTypography>{toCurrency(props.totalValue)}</ContentTypography>
        </Stack>

        {/* 영수증 사진 */}
        {props.imageUrl ? (
          <DialogWithIconButton
            icon={
              <Button
                variant="outlined"
                color="secondary"
                sx={{ marginBottom: 1 }}
                fullWidth
              >
                영수증 확인
              </Button>
            }
            content={<img src={props.imageUrl} />}
          />
        ) : (
          <Button disabled variant="outlined" sx={{ marginBottom: 1 }}>
            영수증 없음
          </Button>
        )}
        <Box
          width="100%"
          height="0.5rem"
          sx={{
            backgroundColor: '#eeeeee',
            marginBottom: '1rem',
            marginTop: '0.5rem',
          }}
        />
      </Stack>
    </>
  );
}

export default memo(Header);
