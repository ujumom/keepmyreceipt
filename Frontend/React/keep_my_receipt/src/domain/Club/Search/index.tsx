import React, { useEffect, useState } from 'react';
import {
  Container,
  IconButton,
  Grid,
  Stack,
  CircularProgress,
} from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/SearchBar';
import SearchList from './List';
import axios from 'axios';
import Pagination from '../../../components/Pagination';

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

export default function GroupSearch() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyWord = searchParams.get('query');
  const [word, setWord] = useState('');
  const [res, setRes] = useState<resopnseType>({
    pageNumber: 0,
    size: 0,
    totalPages: 0,
    numberOfElements: 0,
    totalElements: 0,
    list: [],
  });
  const { list } = res || null;

  useEffect(() => {
    if (keyWord) {
      // 새로고침해도 현재 키워드로 검색 결과 보여주기
      setWord(keyWord);
      getClubList();
    } else {
      getClubList();
    }
  }, [keyWord]);

  // 검색 결과 가져오기
  const getClubList = async (page?: number) => {
    const accessToken = sessionStorage.getItem('accessToken');
    await axios
      .get('https://k6d104.p.ssafy.io/api/spring/clubs', {
        headers: {
          Authorization: accessToken,
        },
        params: {
          name: keyWord ? keyWord : word,
          page: page ? page : 0,
          size: 5,
          sort: 'id,DESC',
        },
      })
      .then((response) => {
        setRes(response.data.data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container maxWidth="md" sx={{ paddingY: 0, paddingX: '1rem' }}>
      <Grid container direction="column" sx={{ marginBottom: 1 }}>
        {/* 상단 */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          marginTop={2}
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
            value={word}
            setValue={setWord}
            onSearch={getClubList}
            navi={'.'}
          />
        </Stack>

        {/* 검색 결과 */}
        {loading ? (
          <Stack alignItems="center" marginTop="5rem">
            <CircularProgress sx={{ color: '#ffa500' }} />
          </Stack>
        ) : (
          <>
            <Stack
              direction="column"
              spacing={2}
              alignItems="center"
              sx={{ marginTop: '1rem' }}
            >
              {/* 리스트 */}
              {list.length ? (
                <SearchList clubList={list} />
              ) : (
                <p>검색된 모임이 없습니다.</p>
              )}
              {/* 페이지네이션 */}
              <Pagination
                pageInfo={res}
                paginationSize={5}
                onClickPage={getClubList}
                bgColor="#ffaa00"
              />
            </Stack>
          </>
        )}
      </Grid>
    </Container>
  );
}
