/** MUI의 Typography의 스타일을 바꿉니다. */

import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { grey } from '../styles/Colors';

export const PageTitleTypography = styled(Typography)(() => ({
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
}));

export const TitleTypography = styled(Typography)(() => ({
  color: grey[400],
  fontWeight: 'bold',
}));

export const TitleTypographyWithSpace = styled(TitleTypography)(
  ({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      minWidth: '30%',
    },
    minWidth: '15%',
  }),
);

export const ContentTypography = styled(Typography)(() => ({
  wordBreak: 'keep-all',
  fontWeight: 'bold',
}));
