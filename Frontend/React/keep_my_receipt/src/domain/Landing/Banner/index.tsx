import { useNavigate } from 'react-router-dom';
import {
  Video,
  Info,
  BannerButton,
  Content1,
  Content2,
  Content3,
  MyBanner,
} from './styles';

export default function Banner() {
  // Banner 바로가기 버튼 클릭 시 로그인 했다면 내 모임으로, 아니라면 login 페이지로
  const onClick = () => {
    const navigate = useNavigate();
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/club');
    } else {
      navigate('/login');
    }
  };

  return (
    <MyBanner>
      {/* 배경 비디오 */}
      <Video autoPlay muted loop>
        <source src="/videos/bill.mp4"></source>
      </Video>
      {/* 글자 */}
      <Info>
        <Content1>누구나 쉽게</Content1>
        <Content2>모임 관리부터 회계까지</Content2>
        <Content3>
          <BannerButton onClick={onClick}>바로가기</BannerButton>
        </Content3>
      </Info>
    </MyBanner>
  );
}
