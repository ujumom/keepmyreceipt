import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const OrangeText = styled(Typography)<TypographyProps>(() => ({
  display: 'inline',
  color: 'orange',
}));

export const RedText = styled(Typography)<TypographyProps>(() => ({
  display: 'inline',
  color: 'red',
}));

export const BlueText = styled(Typography)<TypographyProps>(() => ({
  display: 'inline',
  color: 'blue',
}));

export const GreenText = styled(Typography)<TypographyProps>(() => ({
  display: 'inline',
  color: 'green',
}));

export const GreyText = styled(Typography)<TypographyProps>(() => ({
  display: 'inline-block',
  marginTop: '0.75rem',
  color: 'grey',
}));
