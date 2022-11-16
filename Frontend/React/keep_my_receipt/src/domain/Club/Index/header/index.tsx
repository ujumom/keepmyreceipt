import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, IconButton, Fade, useMediaQuery } from '@mui/material';
import { Add, Search, AccessTime } from '@mui/icons-material';
import IndexHeaderDrawer from './Drawer';

export default function IndexHeader() {
  const matches = useMediaQuery('(min-width:500px)');
  const navigate = useNavigate();
  // Drawer
  const [state, setState] = useState(false);
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ position: 'relative', paddingLeft: '2rem' }}
    >
      <h2>내 모임</h2>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ position: 'absolute', right: 0 }}
      >
        <IconButton
          onClick={() => {
            setState(true);
          }}
        >
          <AccessTime sx={{ color: '#000000', fontSize: '2rem' }} />
        </IconButton>
        <IndexHeaderDrawer state={state} setState={setState} />
        <IconButton
          color="primary"
          onClick={() => {
            navigate('./create');
          }}
        >
          <Add sx={{ fontSize: '2rem' }} />
        </IconButton>
        {matches ? (
          <IconButton
            onClick={() => {
              navigate('./search');
            }}
          >
            <Search sx={{ color: '#000000', fontSize: '2rem' }} />
          </IconButton>
        ) : null}
      </Stack>
    </Stack>
  );
}
