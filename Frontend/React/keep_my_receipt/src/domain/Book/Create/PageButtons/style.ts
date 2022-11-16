import { PaginationItem, PaginationItemProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomPaginationItem = styled(PaginationItem)<PaginationItemProps>(
  () => ({
    // 글자 색은 검정, 바탕은 하양
    color: 'black',
    backgroundColor: '#ffffff',

    // 선택된 아이템의 global class 값 덮어쓰기
    // 참고: https://mui.com/material-ui/customization/how-to-customize/#2-reusable-component
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: '#5e5e5e',
    },
  }),
);
