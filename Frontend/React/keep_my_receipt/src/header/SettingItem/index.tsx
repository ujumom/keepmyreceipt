import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
export default function SettingItem() {
  const navigate = useNavigate();
  const onClick = () => {
    navigate('/setting');
  };
  return (
    <>
      <IconButton onClick={onClick} sx={{ p: 0, marginLeft: 2 }}>
        <SettingsIcon />
      </IconButton>
    </>
  );
}
