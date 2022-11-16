import { Box, Grid, useMediaQuery } from '@mui/material';
import WebHeader from './WebHeader';
import MobileHeader from './MobileHeader';
import { NavBarContainer } from './styles';

export default function NavBar() {
  const matches = useMediaQuery('(min-width:1030px)');

  return (
    <Box height="62px">
      <NavBarContainer>
        <Grid
          container
          sx={{
            float: 'right',
          }}
        >
          {/* 네비게이션 모바일 ver */}
          {!matches ? (
            <>
              <MobileHeader />
            </>
          ) : (
            // 네비게이션 웹 ver
            <>
              <WebHeader />
            </>
          )}
        </Grid>
      </NavBarContainer>
    </Box>
  );
}
