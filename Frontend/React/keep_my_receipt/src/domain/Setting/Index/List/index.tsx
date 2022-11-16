import { Container } from '@mui/material';
import AlarmToggle from '../ListItem/AlarmToggle';
import EditUserInfo from '../ListItem/EditUserInfo';
import LeaveApp from '../ListItem/LeaveApp';
import Logout from '../ListItem/Logout';
import Notice from '../ListItem/Notice';
import './index.css';

export default function SettingList() {
  return (
    <Container maxWidth="md" sx={{ marginTop: '0px' }}>
      <Notice />
      <AlarmToggle />
      <EditUserInfo />
      <LeaveApp />
      <Logout />
    </Container>
  );
}
