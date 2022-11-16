import React from 'react';
import axios from 'axios';
import { IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { ManageAccounts } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface crewInfoTypes {
  clubCrewId: number;
  name: string;
  email: string;
  auth?: any;
}

interface CrewMenuProps {
  crewInfo: crewInfoTypes;
  getCrewList: any;
  filter?: string;
}

export default function CrewMenu({
  crewInfo,
  getCrewList,
  filter,
}: CrewMenuProps) {
  const navigate = useNavigate();
  const { clubCrewId, name, email, auth } = crewInfo;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const changeAuth = async (newAuth: any) => {
    await axios
      .put(
        `https://k6d104.p.ssafy.io/api/spring/club/crew/${clubCrewId}/auth/${newAuth}`,
      )
      .then((res) => {
        console.log(res);
        if (newAuth === 'LEADER') {
          // 내 모임으로 이동
          navigate('../../../');
        } else {
          // 관리자 <-> 회원 변경은 새로 조회
          getCrewList(0, filter);
        }
      })
      .catch((e) => {
        console.log(e.response.data.msg);
      });
    setAnchorEl(null);
  };
  const deleteCrew = async () => {
    await axios
      .delete(
        `https://k6d104.p.ssafy.io/api/spring/club/crew/${clubCrewId}/kick`,
      )
      .then((res) => {
        console.log(res);
        getCrewList(0, filter);
      })
      .catch((e) => {
        console.log(e.response.data.msg);
      });
    setAnchorEl(null);
  };

  return (
    <>
      {auth !== '리더' ? (
        <>
          <IconButton
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <ManageAccounts sx={{ fontSize: '2rem' }} />
          </IconButton>

          {/* 메뉴 */}
          <Menu
            id="long-menu"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: '8rem',
              },
            }}
          >
            <MenuItem
              onClick={() => {
                const target = auth === '관리자' ? 'NORMAL' : 'MANAGER';
                changeAuth(target);
              }}
            >
              {auth === '관리자' ? '회원으로' : '관리자로'} 변경
            </MenuItem>
            <MenuItem onClick={() => changeAuth('LEADER')}>리더 위임</MenuItem>
            <MenuItem onClick={deleteCrew}>추방</MenuItem>
          </Menu>
        </>
      ) : null}
    </>
  );
}
