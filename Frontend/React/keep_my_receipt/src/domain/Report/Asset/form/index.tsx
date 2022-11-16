import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import {
  GreenTableCell,
  LargeCategoryTypography,
  StyledTableRow,
  TableCellNoBorder,
  TableHeadTypography,
} from '../style';
import toCurrency from '../../../../services/toCurrency';

interface ReportType {
  lcName: string;
  list: ItemType[];
  total: number;
}

interface ItemType {
  scName: string;
  balance: number;
}

export default function ReportIndex({
  title,
  itemList,
  catList,
  sumValue,
}: {
  title: string;
  itemList: ReportType[];
  catList: string[];
  sumValue: number;
}) {
  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* 예산 */}
            <GreenTableCell>
              <TableHeadTypography>{title}</TableHeadTypography>
            </GreenTableCell>

            {/* 예산 총 금액 */}
            <GreenTableCell align="right">
              <TableHeadTypography>{toCurrency(sumValue)}</TableHeadTypography>
            </GreenTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* 대분류들 출력 */}
          {itemList.map((item) => (
            <>
              <StyledTableRow hover key={item.lcName}>
                {/* 대분류명 */}
                <TableCell sx={{ paddingLeft: 4, paddingTop: 3 }}>
                  <LargeCategoryTypography>
                    {item.lcName}
                  </LargeCategoryTypography>
                </TableCell>

                {/* 해당 대분류 금액 총합 */}
                <TableCell align="right">
                  <LargeCategoryTypography>
                    {toCurrency(item.total)}
                  </LargeCategoryTypography>
                </TableCell>
              </StyledTableRow>

              {/* 대분류 안 중분류들 출력 */}
              {item.list.map((eachCat) => (
                <StyledTableRow hover key={eachCat.scName}>
                  {/* 중분류명 */}
                  <TableCellNoBorder sx={{ paddingLeft: 7 }}>
                    {eachCat.scName}
                  </TableCellNoBorder>

                  {/* 해당 중분류 금액 총합 */}
                  <TableCellNoBorder align="right">
                    {toCurrency(eachCat.balance)}
                  </TableCellNoBorder>
                </StyledTableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
