import React from 'react';
import { IconButton, Chip, Grid, Stack, Typography, Card } from '@mui/material';
import { Add } from '@mui/icons-material';
import CrewMenu from '../domain/Manage/Crew/Menu';

interface CrewInfoTypes {
  clubCrewId: number;
  name: string;
  email: string;
  auth?: any;
}

export default function CrewListItem({
  crewInfo,
  onClickToApprove,
  getCrewList,
  filter,
}: {
  crewInfo: CrewInfoTypes;
  onClickToApprove?: any;
  getCrewList?: any;
  filter?: string;
}) {
  const { clubCrewId, name, email, auth } = crewInfo;

  const onClick = () => {
    if (auth) {
      //   console.log('회원');
    } else if (onClickToApprove) {
      //   console.log('가입 대기');
      onClickToApprove(crewInfo);
    }
  };
  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        boxShadow: 1,
        ':hover': {
          boxShadow: 6,
          // backgroundColor: '#FFF5E1',
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        onClick={onClick}
        sx={{ padding: '0.8rem' }}
      >
        <Stack direction="column" width="15rem">
          {auth ? (
            <Chip
              label={auth}
              variant={auth !== '리더' ? 'outlined' : 'filled'}
              sx={{
                backgroundColor: auth === '리더' ? '#ffaa00' : null,
                width: '5rem',
                height: '1.3rem',
                color: auth === '리더' ? 'white' : 'black',
                borderColor: auth === '관리자' ? '#ffaa00' : null,
              }}
            />
          ) : null}
          <Typography variant="h6" paddingLeft={1}>
            {name}
          </Typography>

          <Typography paddingLeft={1}>{email}</Typography>
        </Stack>
        {auth ? (
          <CrewMenu
            crewInfo={crewInfo}
            getCrewList={getCrewList}
            filter={filter}
          />
        ) : (
          <IconButton color="primary">
            <Add sx={{ fontSize: '2rem' }} />
          </IconButton>
        )}
      </Stack>
    </Card>
  );
}
