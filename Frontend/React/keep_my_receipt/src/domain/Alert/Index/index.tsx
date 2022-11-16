import { Container, Grid } from '@mui/material';
import BackBar from '../../BackHeader';
import List from './List';
export default function AlertIndex() {
  return (
    <Container maxWidth="md">
      <Grid style={{ width: '100%' }}>
        <BackBar content={'알림'}></BackBar>
        <List />
      </Grid>
    </Container>
  );
}
