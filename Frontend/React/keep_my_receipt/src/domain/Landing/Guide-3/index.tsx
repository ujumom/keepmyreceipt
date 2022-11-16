import { Box, Container, Grid } from '@mui/material';
import { Title, Description, Point2 } from './styles';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import 'animate.css/animate.min.css';
function LandingSecond() {
  return (
    <Container
      sx={{
        width: '100%',
        marginY: '20%',
      }}
      fixed
      maxWidth="lg"
    >
      <Grid
        container
        sx={{
          width: '100%',
        }}
        spacing={2}
      >
        {/* 설명 */}
        <Grid item xs={12} sm={6}>
          <AnimationOnScroll animateIn="animate__fadeIn">
            <Box
              sx={{
                marginBottom: '40px',
                paddingTop: '200px',
              }}
            >
              <Point2>#분석 #자산현황표 #예산운영표</Point2>
              <Title>차트와 보고서</Title>
              <Description>함께 사용하는 모임의 자산 목록과</Description>
              <Description>
                예산이 어떻게 사용되는지 자세하게 알 수 있어요.{' '}
              </Description>
            </Box>
          </AnimationOnScroll>
        </Grid>
        {/* 휴대폰 사진 */}
        <Grid item xs={12} sm={6}>
          <AnimationOnScroll animateIn="animate__fadeIn animate__slower">
            <Box textAlign="center" width={'100%'}>
              <img
                src="/images/randing/chart.png"
                width="70%"
                height="40%"
              ></img>
            </Box>
          </AnimationOnScroll>
        </Grid>

        <Grid item xs={12} sm={6}>
          <AnimationOnScroll animateIn="animate__fadeIn animate__slower">
            <Box textAlign="center" width={'100%'}>
              <img
                src="/images/randing/report2.png"
                width="70%"
                height="40%"
              ></img>
            </Box>
          </AnimationOnScroll>
        </Grid>
        {/* 휴대폰 사진 2 */}
        <Grid item xs={12} sm={6}>
          <AnimationOnScroll animateIn="animate__fadeIn animate__slower">
            <Box textAlign="center" width={'100%'}>
              <img
                src="/images/randing/asset.png"
                width="70%"
                height="40%"
              ></img>
            </Box>
          </AnimationOnScroll>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LandingSecond;
