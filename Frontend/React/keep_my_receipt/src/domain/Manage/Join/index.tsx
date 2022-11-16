import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Stack, CircularProgress } from '@mui/material';
import Pagination from '../../../components/Pagination';
import JoinApproveDialog from './ApproveDialog';
import CrewListItem from '../../../components/CrewListItem';

interface crewInforTypes {
  clubCrewId: number;
  name: string;
  email: string;
}

interface resopnseType {
  pageNumber: number;
  size: number;
  totalPages: number;
  numberOfElements: number;
  totalElements: number;
  list: crewInforTypes[];
}

export default function ManageJoin({ clubInfo }: { clubInfo: any }) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
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
  const [dialogInfo, setDialogInfo] = useState<crewInforTypes>({
    clubCrewId: 0,
    name: '',
    email: '',
  });
  // 모임 가입 신청자 리스트 조회
  const getRequestList = async (page?: number) => {
    await axios
      .get(`https://k6d104.p.ssafy.io/api/spring/club/${id}/crews/requests`, {
        params: {
          page: page ? page : 0,
          size: 5,
          sort: 'id,ASC',
        },
      })
      .then((response) => {
        // console.log(response.data.data.list[0].name);
        const output = response.data.output;
        if (output === 200) {
          // console.log(response.data.data);
          setRes(response.data.data);
          setLoading(false);
        } else if (output === 0) {
          console.log(response.data.msg);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onClick = (crewInfo: crewInforTypes) => {
    setDialogInfo(crewInfo);
    setOpen(true);
  };

  useEffect(() => {
    getRequestList();
  }, []);
  return (
    <Stack>
      {/* Dialog */}
      <JoinApproveDialog
        open={open}
        setOpen={setOpen}
        clubCrewInfo={dialogInfo}
        updateInfo={getRequestList}
      />
      {/* 내용 */}
      {loading ? (
        <Stack alignItems="center" marginTop="5rem">
          <CircularProgress sx={{ color: '#ffa500' }} />
        </Stack>
      ) : (
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
                onClickToApprove={onClick}
              />
            ))
          ) : (
            <p>신청자가 없습니다.</p>
          )}

          {/* Pagination */}
          <Pagination
            pageInfo={res}
            paginationSize={5}
            onClickPage={getRequestList}
            bgColor="#ffaa00"
          />
        </Stack>
      )}
    </Stack>
  );
}
