import styled from 'styled-components';

export const LogoButton = styled.button`
  marginleft: 20vm;
`;

export const NavBarContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  background: '#ffffff';
  @media only screen and (max-width: 768px) {
    margin-top: 30;
    padding-top: 30px;
  }
`;
export const Content1 = styled.p`
  font-size: 1rem;
  font-family: NanumGothicBold;
  letter-spacing: -2px;
  margin: 0 0 0 0;
  color: #494949;
  @media only screen and (max-width: 768px) {
    font-size: 5vw;
  }
`;

export const Content2 = styled.p`
  font-size: 1.2vw;
  font-family: NanumGothicBold;
  letter-spacing: -2px;
  margin: 0 0 0 0;
  color: #494949;
  @media only screen and (max-width: 768px) {
    font-size: 4vw;
  }
`;
