import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Logo() {
  const navigate = useNavigate();
  const onClickButton = (url: string) => {
    navigate(url);
  };

  return (
    <Button
      onClick={() => {
        onClickButton('/');
      }}
    >
      <img width="150rem" src="/images/randing/last.png"></img>
    </Button>
  );
}
