import React, { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import * as qs from 'qs';
import CrewMenu from './Menu';
import CrewListItem from '../../../components/CrewListItem';
import CrewCheckBoxFilter from './CheckBoxFilter';

interface listItemTypes {
  clubCrewId: number;
  name: string;
  email: string;
  auth: string;
}

interface resopnseType {
  pageNumber: number;
  size: number;
  totalPages: number;
  numberOfElements: number;
  totalElements: number;
  list: listItemTypes[];
}

export default function ManageCrew({ clubInfo }: { clubInfo: any }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { id, name, description, image } = clubInfo;
  const [res, setRes] = useState<resopnseType>({
    pageNumber: 0,
    size: 0,
    totalPages: 0,
    numberOfElements: 0,
    totalElements: 0,
    list: [],
  });
  const { list } = res;

  // axios
  const crewListAxios = axios.create({
    // 파라미터 값에 배열로 넣기
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  const getCrewList = async (page?: number, auth?: string) => {
    await crewListAxios
      .get(`https://k6d104.p.ssafy.io/api/spring/club/${id}/crews`, {
        params: {
          auth: auth ? auth : 'ALL',
          page: page ? page : 0,
          size: 5,
          sort: ['auth', 'id'],
        },
      })
      .then((res) => {
        // console.log(res);
        const output = res.data.output;
        if (output === 200) {
          // console.log(res.data.data);
          setRes(res.data.data);
          setLoading(false);
        } else if (output === 0) {
          console.log(res.data.msg);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCrewList();
  }, []);
  return (
    <>
      {loading ? (
        <Stack alignItems="center" marginTop="5rem">
          <CircularProgress sx={{ color: '#ffa500' }} />
        </Stack>
      ) : (
        <Stack>
          {/* 필터(관리자/회원) */}
          <CrewCheckBoxFilter getCrewList={getCrewList} setFilter={setFilter} />
          {/* 내용 */}
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            marginTop={1}
          >
            {/* 리스트 */}
            {list.length ? (
              list.map((crewInfo: any) => (
                <CrewListItem
                  crewInfo={crewInfo}
                  key={crewInfo.clubCrewId}
                  getCrewList={getCrewList}
                  filter={filter}
                />
              ))
            ) : (
              <p>회원이 없습니다.</p>
            )}

            {/* Pagination */}
            <Pagination
              pageInfo={res}
              paginationSize={5}
              onClickPage={getCrewList}
              bgColor="#ffaa00"
              filter={filter}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
}
