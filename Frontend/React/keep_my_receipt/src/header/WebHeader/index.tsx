import { Box, Grid, useMediaQuery } from '@mui/material';
import Logo from './Logo';
import Menu from './Menu';

export default function WebHeader() {
  return (
    <>
      <Grid item xs={2} sm={6} sx={{ p: 0 }}>
        <Logo />
      </Grid>
      <Grid item xs={0} sm={6} sx={{ pr: 5 }}>
        <Menu />
      </Grid>
    </>
  );
}
