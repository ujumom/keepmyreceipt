import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
} from '@mui/material';
import {
  Title,
  Description,
  CardTitle,
  CardDescription,
} from '../Guide-2/styles';
import { AnimationOnScroll } from 'react-animation-on-scroll';

import 'animate.css/animate.min.css';

export default function GuideSecond() {
  return (
    <div
      style={{
        paddingTop: '1vw',
        paddingBottom: '1vw',
        background: '#f6f4ee',
        objectFit: 'cover',
      }}
    >
      <Container
        sx={{
          width: '100%',
          marginY: '10vw',
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
          <Grid item xs={12} sm={12} sx={{ textAlign: 'center' }}>
            <AnimationOnScroll animateIn="animate__fadeIn">
              <Box
                sx={{
                  marginBottom: '20px',
                }}
              >
                <Title>거래 등록</Title>
                <Description></Description>
              </Box>
            </AnimationOnScroll>
          </Grid>
          {/* 카드1 */}
          <Grid item xs={12} sm={4}>
            <AnimationOnScroll animateIn="animate__fadeIn">
              <Card
                sx={{
                  marginLeft: ' 2vw',
                  marginRight: '2vw',
                  padding: '2vm',
                }}
              >
                <CardMedia
                  sx={{
                    paddingTop: '20px',
                    paddingLeft: '10px',
                  }}
                >
                  <img src="/images/randing/download.png"></img>
                </CardMedia>
                <CardContent
                  sx={{
                    padding: '10px',
                    height: '10rem ',
                  }}
                >
                  <CardTitle>영수증 업로드</CardTitle>
                  <CardDescription>
                    언제 어디서든, 원할 때 간편하게 영수증 사진을 찍어
                    관리자에게 보낼 수 있어요.
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimationOnScroll>
          </Grid>{' '}
          <Grid item xs={12} sm={4}>
            <AnimationOnScroll animateIn="animate__fadeIn">
              <Card
                sx={{
                  marginLeft: ' 2vw',
                  marginRight: '2vw',
                  padding: '2vm',
                }}
              >
                <CardMedia
                  sx={{
                    paddingTop: '20px',
                    paddingLeft: '10px',
                  }}
                >
                  <img src="/images/randing/search.png"></img>
                </CardMedia>
                <CardContent
                  sx={{
                    padding: '10px',
                    height: '10rem ',
                  }}
                >
                  <CardTitle>AI 인식</CardTitle>
                  <CardDescription>
                    AI가 영수증 사진을 분석해 총 금액과 날짜를 자동으로 인식
                    해줘요.
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimationOnScroll>
          </Grid>{' '}
          <Grid item xs={12} sm={4}>
            <AnimationOnScroll animateIn="animate__fadeIn">
              <Card
                sx={{
                  marginLeft: ' 2vw',
                  marginRight: '2vw',
                  padding: '2vm',
                }}
              >
                <CardMedia
                  sx={{
                    paddingTop: '20px',
                    paddingLeft: '20px',
                  }}
                >
                  <img src="/images/randing/speaker.png"></img>
                </CardMedia>
                <CardContent
                  sx={{
                    padding: '10px',
                    height: '10rem ',
                  }}
                >
                  <CardTitle>요청과 알림</CardTitle>
                  <CardDescription>
                    영수증을 제출하면 관리자에게 알림을 보내드려요. 요청이
                    들어올 때마다 바로 확인하세요.
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimationOnScroll>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
