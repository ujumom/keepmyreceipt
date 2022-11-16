import { IconButton } from '@mui/material';
import { RemoveCircle } from '@mui/icons-material/';

import { BookAction, deleteItem } from '../bookReducer';

interface AddDeleteButtonType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  dispatch?: React.Dispatch<BookAction>;
}

export default function DeleteButton({
  page,
  setPage,
  dispatch,
}: AddDeleteButtonType) {
  return (
    <>
      {/* 페이지 삭제 버튼 */}
      <IconButton
        onClick={() => {
          // 현재 페이지 삭제
          dispatch && dispatch(deleteItem(page - 1));
          // 페이지 2개 이상일 때만 1 줄임
          if (page >= 2) {
            setPage((page) => page - 1);
          }
        }}
      >
        <RemoveCircle />
      </IconButton>
    </>
  );
}
