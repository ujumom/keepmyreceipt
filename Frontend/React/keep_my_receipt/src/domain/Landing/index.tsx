import axios from 'axios';
import { useEffect } from 'react';
import Banner from './Banner';
import GuideFirst from './Guide-1';
import GuideSecond from './Guide-2';
import GuideThird from './Guide-3';

export default function Landing() {
  useEffect(() => {
    // 모바일 기기일 경우,
    if (window['Android']) {
      // 자동 로그인 설정해놓은 경우에 로그인 axios useeffect로 요청
      if (window['Android']['getAutoLogin']()) {
        const id = window['Android']['getId']();
        const password = window['Android']['getPassword']();
        const mobileToken = window['Android']['requestToken']();

        axios
          .post('/api/spring/crew/login', {
            email: id,
            password: password,
            fcmToken: mobileToken,
          })
          .then(function (response) {
            const { accessToken } = response.data.data;
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${accessToken}`;
            sessionStorage.setItem('accessToken', `Bearer ${accessToken}`);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }, []);

  return (
    <div>
      <Banner />
      <GuideFirst />
      <GuideSecond />
      <GuideThird />
    </div>
  );
}
