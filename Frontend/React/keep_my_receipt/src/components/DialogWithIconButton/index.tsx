/**
 * 보통 다이얼로그(팝업 창)을 쓸 때는, 어떤 '버튼'을 눌러서 다이얼로그를 띄웁니다.
 * 여기서 다이얼로그를 띄우는 행위는 대부분 똑같고,
 * '버튼'에 해당하는 부분과 다이얼로그 '내부'만 다릅니다.
 * 그래서 이 '버튼'과 '내부'만 인자로 받는 컴포넌트를 만들었습니다.
 */

import React, { memo } from 'react';
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { Transition } from './service';

/**
 * icon과 content라는 인자 둘 다 컴포넌트(JSX.Element)를 받습니다.
 * - icon은 굳이 아이콘이 아니어도, 버튼이나 텍스트여도 상관이 없습니다.
 * - icon에 넣은 컴포넌트를 클릭 시, 다이얼로그가 뜹니다.
 * - content는 다이얼로그의 내용이 됩니다.
 */
interface DialogWithIconButtonType {
  icon: JSX.Element;
  content: JSX.Element;
}

function DialogWithIconButton({ icon, content }: DialogWithIconButtonType) {
  const [open, setOpen] = React.useState(false);

  // 다이얼로그 열기
  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 아이콘 클릭 시 겹치는 메뉴 열리는 이벤트 차단
    setOpen(true);
  };

  // 다이얼로그 닫기
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleOpen}>{icon}</div>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={Transition}
        closeAfterTransition
        BackdropComponent={Backdrop}
        // BackdropProps={{ timeout: 500 }}
        fullWidth
        maxWidth="xs"
      >
        {/* 다이얼로그 내용 */}
        <DialogContent dividers>{content}</DialogContent>

        {/* 다이얼로그 닫기 버튼 */}
        <DialogActions>
          <Button disableRipple onClick={handleClose}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default memo(DialogWithIconButton);
