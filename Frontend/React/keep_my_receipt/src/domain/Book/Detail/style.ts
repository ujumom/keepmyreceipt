import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const OuterBox = styled(Box)(() => ({
  backgroundColor: '#f8f4f4',
  margin: '0 -1rem',
  padding: '1rem',
}));

export const InnerBox = styled(Box)(() => ({
  padding: '2rem',
  borderRadius: '3rem',
  backgroundColor: 'white',
}));
