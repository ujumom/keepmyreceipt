import { styled } from '@mui/system';
import {
  TableCell,
  tableCellClasses,
  TableRow,
  Typography,
} from '@mui/material';

export const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const GreenTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FFF5E1',
  },
}));

export const TableCellNoBorder = styled(TableCell)(() => ({
  border: 0,
}));

export const TableHeadTypography = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '1.25rem',
}));

export const LargeCategoryTypography = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '1rem',
}));
