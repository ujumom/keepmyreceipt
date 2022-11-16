import React, { useEffect, useState } from 'react';
import { Stack, IconButton, Box, Typography } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

interface pageInfoType {
  pageNumber: number;
  size?: number;
  totalPages: number;
  numberOfElements?: number;
  totalElements?: number;
}
export default function Pagination({
  pageInfo,
  paginationSize,
  onClickPage,
  bgColor,
  filter,
  showOne,
}: {
  pageInfo: pageInfoType;
  paginationSize: number;
  onClickPage: any;
  bgColor?: string;
  filter?: string;
  showOne?: boolean;
}) {
  // api로 받은 page 정보
  const { pageNumber, size, totalPages, numberOfElements, totalElements } =
    pageInfo;
  // Pagination number
  const pagiNum = Math.floor(pageNumber / paginationSize);
  const totalPagiNum = Math.ceil(totalPages / paginationSize);

  // 새 page를 얻기 위한 api 요청
  const onClick = (newPage: number) => {
    if (filter) {
      onClickPage(newPage, filter);
    } else {
      onClickPage(newPage);
    }
  };
  const onClickForword = () => {
    onClickPage(paginationSize * (pagiNum + 1));
  };
  const onClcikBack = () => {
    onClickPage(paginationSize * (pagiNum - 1) + paginationSize - 1);
  };

  // Pagination
  const pagiResult = () => {
    const array = [];
    for (let i = 0; i < paginationSize; i++) {
      const num = i + paginationSize * pagiNum;
      array.push(
        <IconButton
          key={num}
          color="inherit"
          sx={
            // 'pagination 페이지 = api 현재 페이지' AND 'api 전체 페이지 개수가 1 이상'
            // 'pagination 페이지 < 전체 페이지 개수'이면 표시 아니면 hidden(공간 차지)
            num === pageNumber && totalPages > 0
              ? {
                  color: 'white',
                  fontStyle: 'bold',
                  backgroundColor: bgColor ? bgColor : '#42a5f5',
                  width: '2.2rem',
                  height: '2.2rem',
                  '&:hover': {
                    backgroundColor: bgColor ? bgColor : '#42a5f5',
                    opacity: 0.8,
                  },
                }
              : num < totalPages
              ? {
                  fontStyle: 'bold',
                  width: '2.2rem',
                  height: '2.2rem',
                }
              : {
                  visibility: 'hidden',
                  fontStyle: 'bold',
                  width: '2.2rem',
                  height: '2.2rem',
                }
          }
          onClick={() => onClick(num)}
        >
          <Box sx={{ width: '1.8rem' }}>
            <Typography fontSize="1.3rem">{num + 1}</Typography>
          </Box>
        </IconButton>,
      );
    }
    return (
      <Stack direction="row" justifyContent="center" alignItems="center">
        <IconButton
          onClick={onClcikBack}
          color="inherit"
          sx={pagiNum === 0 ? { visibility: 'hidden' } : null}
        >
          <ArrowBackIosNew sx={{ fontSize: '1.5rem' }} />
        </IconButton>
        {array}
        <IconButton
          onClick={onClickForword}
          color="inherit"
          sx={
            pagiNum === totalPagiNum - 1 || totalPagiNum === 0
              ? { visibility: 'hidden' }
              : null
          }
        >
          <ArrowForwardIos sx={{ fontSize: '1.5rem' }} />
        </IconButton>
      </Stack>
    );
  };
  // 참고
  const paginationInfo = () => {
    return (
      <Stack>
        Pagination
        <p>
          페이지: {pageNumber}/{totalPages > 0 ? totalPages - 1 : 0} (0...n) __
          리얼 현재 페이지: {pageNumber + 1}
        </p>
        <p>
          현재 페이지 개체 수(사이즈) / 전체 개체 수: {numberOfElements}({size})
          /{totalElements}
        </p>
        <p>
          paginum/pagiTotal: {pagiNum}/
          {totalPages > 0 ? Math.ceil(totalPages / paginationSize) - 1 : 0}{' '}
          _______ pagiSize: {paginationSize}
        </p>
      </Stack>
    );
  };
  return (
    <Stack>
      {!showOne ? (totalPages === 1 ? null : pagiResult()) : pagiResult()}
      {/* {paginationInfo()} */}
    </Stack>
  );
}
