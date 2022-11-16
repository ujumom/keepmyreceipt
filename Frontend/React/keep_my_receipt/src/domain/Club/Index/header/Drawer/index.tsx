import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  SwipeableDrawer,
  Box,
  Stack,
  IconButton,
  Container,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ClubListItem from '../../../../../components/ClubListItem';
import Pagination from '../../../../../components/Pagination';

interface IndexHeaderDrawerProps {
  state: boolean;
  setState: any;
}

interface listItemTypes {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface resopnseType {
  pageNumber: number;
  size: number;
  totalPages: number;
  numberOfElements: number;
  totalElements: number;
  list: listItemTypes[];
}

export default function IndexHeaderDrawer({
  state,
  setState,
}: IndexHeaderDrawerProps) {
  // 모임 목록 조회
  const [res, setRes] = useState<resopnseType>({
    pageNumber: 0,
    size: 0,
    totalPages: 0,
    numberOfElements: 0,
    totalElements: 0,
    list: [],
  });
  const { list } = res || null;
  const getClubList = async (page?: number) => {
    await axios
      .get('https://k6d104.p.ssafy.io/api/spring/clubs/requested', {
        params: {
          page: page ? page : 0,
          size: 5,
          sort: 'id,DESC',
        },
      })
      .then((res) => {
        setRes(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getClubList();
  }, []);
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={state}
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      sx={{ position: 'relative' }}
    >
      <IconButton
        onClick={() => {
          setState(false);
        }}
        sx={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}
      >
        <Close sx={{ color: 'black', fontSize: '2rem' }} />
      </IconButton>
      <Container maxWidth="md" sx={{ padding: 0 }}>
        <Box
          sx={{
            height: '90vh',
            paddingX: '2rem',
            paddingY: '1rem',
          }}
        >
          {/* 상단 */}
          <Stack direction="row" justifyContent="center" alignItems="center">
            <h3>가입 신청 목록</h3>
          </Stack>
          {/* 목록 */}
          <Stack direction="column" alignItems="center">
            {list.length ? (
              list.map((info: any) => (
                <ClubListItem key={info.id} clubInfo={info} checkJoin={true} />
              ))
            ) : (
              <p>신청한 모임이 없습니다.</p>
            )}
            {/* 페이지네이션 */}
            <Stack marginY="1rem">
              <Pagination
                pageInfo={res}
                paginationSize={5}
                onClickPage={getClubList}
                bgColor="#ffaa00"
              />
            </Stack>
          </Stack>
        </Box>
      </Container>
    </SwipeableDrawer>
  );
}
