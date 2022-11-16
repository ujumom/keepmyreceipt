import { IconButton } from '@mui/material';
import { AddCircle } from '@mui/icons-material/';

import { BookAction, createItem } from '../bookReducer';

interface AddDeleteButtonType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  dispatch?: React.Dispatch<BookAction>;
}

export default function AddButton({
  page,
  setPage,
  dispatch,
}: AddDeleteButtonType) {
  return (
    <>
      {/* 페이지 추가 버튼 */}
      <IconButton
        onClick={() => {
          // 현재 페이지 뒤에 추가
          dispatch && dispatch(createItem(page + 1));
          setPage((page) => page + 1);
        }}
      >
        <AddCircle />
      </IconButton>
    </>
  );
}
