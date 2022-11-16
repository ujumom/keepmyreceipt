import styled, { keyframes } from 'styled-components';
import 'animate.css/animate.min.css';

const focus = keyframes`
    0% {
      filter:blur(12px);opacity:0
    }
    100% {
      filter:blur(0);opacity:1
    }
`;

export const Title = styled.div`
  font-family: NanumGothicBold;
  font-weight: bold;
  font-size: 3.5vw;
  letter-spacing: -5px;
  color: black;
  margin-left: 8px;
  @media only screen and (max-width: 768px) {
    font-size: 8vw;
  }
`;

export const Description = styled.div`
  margin-left: 10px;
  margin-right: 15px;
  font-family: NanumGothicRegular;
  font-size: 1.5vw;
  letter-spacing: -2px;
  color: gray;
  @media only screen and (max-width: 768px) {
    font-size: 4vw;
  }
`;
export const Point = styled.div`
  font-family: NanumGothicRegular;
  font-weight: bold;
  font-size: 1.5vw;
  letter-spacing: -2px;
  color: #ffa500;
  margin: 8px;

  @media only screen and (max-width: 768px) {
    font-size: 3vw;
  }
`;
export const Point2 = styled.div`
  font-family: NanumGothicRegular;
  font-weight: bold;
  font-size: 1.5vw;
  letter-spacing: -2px;
  color: #3d6ef4;
  margin-left: 8px;

  @media only screen and (max-width: 768px) {
    font-size: 6vw;
  }
`;
