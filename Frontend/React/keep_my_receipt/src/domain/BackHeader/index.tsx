import { Box, Grid, useMediaQuery } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { NavBarContainer, Content1 } from './styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
export default function BackBar(props: any) {
  const matches = useMediaQuery('(min-width:500px)');

  const navigate = useNavigate();
  const onClick = () => {
    navigate(-1);
  };

  return (
    <Box height="62px">
      <NavBarContainer>
        <Grid
          container
          sx={{
            float: 'right',
          }}
        >
          <Grid item sx={{ paddingTop: '2px' }}>
            <ArrowBackIosIcon onClick={onClick} />
          </Grid>
          <Grid item>
            <Content1>{props.content}</Content1>
          </Grid>
        </Grid>
      </NavBarContainer>
    </Box>
  );
}
