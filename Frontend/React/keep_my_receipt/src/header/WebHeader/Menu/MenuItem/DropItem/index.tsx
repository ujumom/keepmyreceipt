import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Content1 } from '../../../../styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import Typography from '@mui/material/Typography';

export default function DropItem(props: any) {
  const navigate = useNavigate();
  const [listMenu, setListMenu] = React.useState<null | HTMLElement>(null);
  // 클릭하면 하단 메뉴 등장
  const handleOpenListMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (listMenu == null) {
      setListMenu(event.currentTarget);
    } else {
      setListMenu(null);
    }
  };
  // 클릭하면 하단 메뉴 닫기
  const handleCloseListMenu = () => {
    setListMenu(null);
  };

  // 하단 메뉴 클릭 시 url로 이동, 아래로 내려온 menu 닫기
  const listMenuClick = (url: any) => {
    navigate(url);
    setListMenu(null);
  };

  return (
    <>
      <Button
        onClick={handleOpenListMenu}
        sx={{
          my: 2,
          mr: 1,
          color: 'black',
          display: 'block',
          float: 'right',
        }}
      >
        <Content1>{props.content}</Content1>
        {/* 부모 메뉴 */}
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={listMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(listMenu)}
          onClose={handleCloseListMenu}
        >
          {/* 하단 메뉴 */}
          <MenuItem
            onClick={() => {
              listMenuClick(props.url1);
            }}
          >
            <Typography textAlign="center">{props.droppedContent1}</Typography>
          </MenuItem>
          {/* 하단 메뉴 */}
          <MenuItem
            onClick={() => {
              listMenuClick(props.url2);
            }}
          >
            <Typography textAlign="center">{props.droppedContent2}</Typography>
          </MenuItem>
        </Menu>
      </Button>
    </>
  );
}
