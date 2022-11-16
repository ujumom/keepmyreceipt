import styled, { keyframes } from 'styled-components';
import { yellow } from '@mui/material/colors';

export const MyBanner = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0px auto;
  position: relative;
`;

export const Info = styled.div`
  position: absolute;
  width: 90%;
  padding-left: 10%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media only screen and (max-width: 768px) {
    font-size: 8vw;
    padding-left: 0;
  }
`;

export const Video = styled.video`
  width: 100%;
  opacity: 0.8;
`;

const focus = keyframes`
    0% {
      filter:blur(12px);opacity:0
    }
    100% {
      filter:blur(0);opacity:1
    }
`;

export const Content = styled.p`
  padding-top: 14px;
  font-size: 1.5vw;
  font-family: NanumGothicBold;
  letter-spacing: 0px;
  margin: 0 0 0 0;
  @media only screen and (max-width: 768px) {
    font-size: 4.5vw;
    padding-top: 9px;
  }
`;

export const Content1 = styled.p`
  font-size: 3vw;
  font-family: NanumGothicBold;
  font-weight: bold;
  letter-spacing: -5px;
  margin: 0 0 0 0;
  animation: ${focus} 0.3s cubic-bezier(0.55, 0.85, 0.68, 0.53) both;
  animation-delay: 0.8s;

  @media only screen and (max-width: 768px) {
    font-size: 6vw;
  }
`;

export const Content2 = styled.p`
  font-size: 3vw;
  font-weight: bold;
  font-family: NanumGothicBold;
  letter-spacing: -5px;
  margin: 0 0 0 0;
  animation: ${focus} 0.3s cubic-bezier(0.55, 0.85, 0.68, 0.53) both;
  animation-delay: 0.8s;

  @media only screen and (max-width: 768px) {
    font-size: 6vw;
  }
`;

export const Content3 = styled.p`
  font-size: 3vw;
  font-weight: bold;
  color: black,
  font-family: NotoSansKRBold;
  margin: 0 0 0 0;
  animation: ${focus} 0.3s cubic-bezier(0.55, 0.85, 0.68, 0.53) both;
  animation-delay: 2.0s;
`;

export const BannerButton = styled('button')`
  margin: 20px 10px;
  font-family: NotoSansKRBold;
  font-weight: bold;
  font-size: 2rem;
  background-color: ${yellow[700]};
  padding: 13px 25px;
  border-radius: 30px;
  color: white;
  border: none;
  width: 2vm;
    @media only screen and (max-width: 768px) {
    font-size: 4vw;

`;
