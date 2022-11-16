import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

export default function NoClub() {
  const navigate = useNavigate();
  const onClickButton = (url: string) => {
    navigate(url);
  };

  return (
    <>
      <BottomNavigation
        sx={{
          width: '100%',
          float: 'right',
        }}
        showLabels
      >
        {/* 홈으로 가기*/}
        <BottomNavigationAction
          sx={{
            padding: 0,
            '@media (max-width: 768px)': {
              minWidth: 'auto',
              padding: '6px 0',
            },
          }}
          onClick={() => {
            onClickButton(`/`);
          }}
          label={'홈'}
          icon={<HomeIcon />}
        ></BottomNavigationAction>

        {/* 내 모임 */}
        <BottomNavigationAction
          sx={{
            padding: 0,
            '@media (max-width: 768px)': {
              minWidth: 'auto',
              padding: '6px 0',
            },
          }}
          onClick={() => {
            onClickButton(`/club`);
          }}
          label={'내 모임'}
          icon={<CelebrationIcon />}
        ></BottomNavigationAction>

        {/* 전체 모임 검색 */}
        <BottomNavigationAction
          sx={{
            padding: 0,
            '@media (max-width: 768px)': {
              minWidth: 'auto',
              padding: '6px 0',
            },
          }}
          onClick={() => {
            onClickButton(`/club/search`);
          }}
          label={'모임 검색'}
          icon={<SearchIcon />}
        ></BottomNavigationAction>
      </BottomNavigation>
    </>
  );
}
