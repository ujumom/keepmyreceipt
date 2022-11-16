import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Content1 } from '../../../styles';
import AlarmItem from '../../../AlarmItem';
import SettingItem from '../../../SettingItem';
import ButtonItem from './ButtonItem';
import DropItem from './DropItem';

export default function ListItem() {
  const [isLogin, setIsLogin] = useState(false);
  const myAccessToken = sessionStorage.getItem('accessToken');

  const { id } = useParams();
  const navigate = useNavigate();
  let userAuth = '';

  const [userAuthNum, setUserAuthNum] = useState(3);
  const fcmToken = sessionStorage.getItem('fcmToken');

  //렌더링 될 때마다, 로그인 상태인지? 모임에서 어떤 권한 가지고 있는지? 확인하기
  useEffect(() => {
    if (myAccessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

    // 모임 선택한 경우 유저 권한 수정
    if (id) {
      axios
        .get(`api/spring/club/${id}/crew/auth`)
        .then((res) => {
          if (res.data) {
            const check = res.data;
            userAuth = check.data;
            if (userAuth === '리더') {
              setUserAuthNum(1);
            } else if (userAuth === '관리자') {
              setUserAuthNum(2);
            } else if (userAuth === '회원') {
              setUserAuthNum(3);
            }
          }
        })
        .catch((e) => {
          console.log(e);
          return;
        });
    }
    // 현재 유저 권한 조회하기
  }, [myAccessToken, id]);

  // 메뉴 > 로그인(토큰 잇는 경우) 또는 로그아웃
  let mystring = '로그인';
  if (myAccessToken) {
    axios.defaults.headers.common['Authorization'] = myAccessToken;
    mystring = '로그아웃';
  }

  //로그아웃 클릭 시
  const onLogout = () => {
    if (myAccessToken) {
      axios
        .post('/api/spring/crew/logout', { fcmToken: fcmToken })
        .then(function () {
          sessionStorage.removeItem('accessToken');
          axios.defaults.headers.common['Authorization'] = '';
          navigate('/');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    // 로그인 클릭 시
    else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* 로그인 후 모임 선택한 경우, 상단네비게이션 menu */}
      {id ? (
        <>
          <DropItem
            content="분석"
            url1={`/club/${id}/analytics/mainChart`}
            url2={`/club/${id}/report/asset`}
            droppedContent1="차트"
            droppedContent2="보고서"
          />

          <DropItem
            content="내역"
            url1={`/club/${id}/receipt/requestList`}
            url2={`/club/${id}/book`}
            droppedContent1="영수증 내역"
            droppedContent2="거래 내역"
          />

          <ButtonItem
            url={`/club/${id}/receipt/camera`}
            content="영수증 등록"
          />

          {/* 리더만 확인할 수 있는 모임관리 */}
          {userAuthNum == 1 ? (
            <ButtonItem url={`/club/${id}/manage`} content="모임관리" />
          ) : (
            ''
          )}

          {/* 관리자 이상만 할 수 있는 거래 등록 */}
          {userAuthNum <= 2 ? (
            <ButtonItem url={`/club/${id}/book/create`} content="거래 등록" />
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}

      {/* 로그아웃 버튼   */}
      <Button
        onClick={onLogout}
        sx={{
          my: 2,
          mr: 1,
          color: 'black',
          display: 'block',
          float: 'right',
        }}
      >
        <Content1> {mystring}</Content1>
      </Button>

      {/* 모임 선택 없이, 로그인만 한 상태라면 내모임과 설정, 알림 아이콘 */}
      {isLogin ? (
        <>
          <ButtonItem url={`/club`} content="내 모임" />
          <ButtonItem content={<AlarmItem />} />
          <ButtonItem content={<SettingItem />} />
        </>
      ) : (
        ''
      )}
    </>
  );
}
