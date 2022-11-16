import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardActions, CardContent, Button, Card, Grid } from '@mui/material';
import ClubListItem from '../../../../components/ClubListItem';
import LeaveClubDialog from '../LeaveDialog';

export default function IndexList({
  clubList,
  getClubList,
}: {
  clubList: any;
  getClubList: any;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({
    id: 0,
    name: '',
    description: '',
    image: '',
  });
  // 클릭하면 모임 거래내역 페이지로 이동
  const onClick = (info: any) => {
    navigate(`./${info.id}/book`);
    window.scrollTo(0, 0);
  };
  const onClickToLeave = (info: any) => {
    setDialogInfo(info);
    setOpen(true);
  };
  return (
    <Grid container justifyContent="center">
      <LeaveClubDialog
        open={open}
        setOpen={setOpen}
        clubInfo={dialogInfo}
        getClubList={getClubList}
      />
      {clubList.map((info: any) => (
        <ClubListItem
          onClick={() => {
            onClick(info);
          }}
          key={info.id}
          clubInfo={info}
          leave={true}
          onClickToLeave={() => {
            onClickToLeave(info);
          }}
        />
      ))}
    </Grid>
  );
}
