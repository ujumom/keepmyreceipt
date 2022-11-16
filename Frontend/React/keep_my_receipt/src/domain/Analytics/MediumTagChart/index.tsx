import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  useMediaQuery,
  Grid,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import Graph from './Graph';
import ItemIndex from './Item';
import sample2 from './sample2.json';

interface ItemType {
  id: string;
  value: string;
  rate: string;
}

/* Deprecated */
export default function SubChartIndex() {
  const { params } = useParams();
  const matches = useMediaQuery('(min-width:500px)');
  const navigate = useNavigate();
  const { state }: { state: any } = useLocation();
  const [items, setItems] = useState([
    { id: '샘플', value: '12345', rate: '100%' },
  ]);
  const id = state.id;
  const sumValue = state.sumValue;
  useEffect(() => {
    // fetch("http://k6d104.p.ssafy.io/api/spring/")
    //   .then((res) => res.json())
    //   .then((data) => setRequests(data));
    console.log(state.id);
    setItems(sample2);
  }, []);

  return (
    <Container maxWidth="md">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={0.5}
        style={{ width: '100%', marginTop: 10 }}
      >
        <Stack spacing={2} style={{ width: '100%' }}>
          <Grid container justifyContent="start">
            <ArrowBackIcon
              onClick={() => navigate(-1)}
              style={{ marginTop: 20, marginLeft: 15 }}
            />
          </Grid>
          <Grid container justifyContent="center" style={{ width: '100%' }}>
            <Graph items={items} />
          </Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ width: '100%', marginTop: 20 }}
          >
            {items.map((item: ItemType) => (
              <ItemIndex item={item} key={item.id} />
            ))}
          </Grid>
          <Paper
            variant="outlined"
            style={{
              padding: 15,
              width: '100%',
              background: '#FFF5E1',
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid xs={7} sm={7} md={7} container>
                <Typography style={{ fontWeight: 'bold' }}>
                  합계 금액
                </Typography>
              </Grid>
              <Grid xs={5} sm={5} md={5} container justifyContent="end">
                <Typography>
                  {String(sumValue)
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    .concat('원')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Grid>
    </Container>
  );
}
