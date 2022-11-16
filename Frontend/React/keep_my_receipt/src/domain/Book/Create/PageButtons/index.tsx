import { memo } from 'react';
import { Box, Pagination, Stack } from '@mui/material';

import { CustomPaginationItem } from './style';

interface PageButtonType {
  count: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function PageButtons({ count, page, setPage }: PageButtonType) {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#e8e4e4',
        marginX: -2,
        paddingX: 2,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginY={0.5}
      >
        {/* 페이지네이션 */}
        <Pagination
          count={count}
          siblingCount={1}
          boundaryCount={1}
          page={page}
          onChange={handleChange}
          size="small"
          variant="outlined"
          renderItem={(item) => <CustomPaginationItem {...item} />}
        />
      </Stack>
    </Box>
  );
}

export default memo(PageButtons);
