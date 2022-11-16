import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Content1 } from '../../../../styles';

export default function ButtonItem(props: any) {
  const navigate = useNavigate();
  const onClickButton = (url: string) => {
    navigate(url);
  };

  return (
    <Button
      onClick={() => {
        onClickButton(props.url);
      }}
      sx={{
        my: 2,
        mr: 1,
        color: 'black',
        display: 'black',
        float: 'right',
      }}
    >
      <Content1>{props.content}</Content1>
    </Button>
  );
}
