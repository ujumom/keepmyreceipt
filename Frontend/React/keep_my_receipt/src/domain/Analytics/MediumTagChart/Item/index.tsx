import React from 'react';
import { Grid, Card, Typography } from '@mui/material';

interface ItemType {
  id: String;
  value: String;
  rate: String;
}

/* Deprecated */
export default function ItemIndex({ item }: { item: ItemType }) {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        variant="outlined"
        style={{
          padding: 15,
          width: '100%',
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={7} sm={7} md={7} container direction="row">
            <Typography style={{ fontWeight: 'bold' }}>{item.id}</Typography>
            &nbsp;&nbsp;
            <Typography style={{ color: 'gray' }}>{item.rate}</Typography>
          </Grid>
          <Grid xs={5} sm={5} md={5} container justifyContent="end">
            <Typography>
              {item.value
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                .concat('원')}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
