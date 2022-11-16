import { Box, Divider, Typography } from '@mui/material';
import { BlueText, GreenText, GreyText, OrangeText, RedText } from './style';

export function MainTypeGuide() {
  return (
    <Box sx={{ wordBreak: 'keep-all' }}>
      <Typography variant="h6">유형이란?</Typography>
      <Divider />
      <br />
      모임 보고서에 기록될 <b>첫 번째 분류</b> 기준입니다.
      <br />
      <br />
      <Typography variant="h6">자산</Typography>
      <Box marginLeft={1}>
        <OrangeText fontWeight="bold">자산</OrangeText>은 모임이 가지는{' '}
        <OrangeText>물품 및 권리</OrangeText>로 재산과 같은 개념입니다.
      </Box>
      <br />
      <Typography variant="h6">지출</Typography>
      <Box marginLeft={1}>
        <RedText fontWeight="bold">지출</RedText>은 모임의 목적 달성, 기타
        이유로 <RedText>사용</RedText>한 돈을 뜻합니다.
        <br />(<RedText>자산 구매를 제외</RedText>한 사용한 돈을 뜻합니다.)
        <br />
        <GreyText>예: 식비, 택시비</GreyText>
      </Box>
      <br />
      <Typography variant="h6">수입</Typography>
      <Box marginLeft={1}>
        <BlueText fontWeight="bold">수입</BlueText>은 행사, 판매, 이자 수익 등
        여러 방법들로부터 돈이 <BlueText>들어온 </BlueText>
        경우를 뜻합니다.
        <br />(<BlueText>지출의 결과</BlueText>로 돈이 들어온 경우를 뜻합니다.)
        <br />
        <GreyText>예: 맥주의 재료를 구매한 다음, 맥주를 만들어 판매</GreyText>
      </Box>
      <br />
      <Typography variant="h6">예산</Typography>
      <Box marginLeft={1}>
        <GreenText fontWeight="bold">예산</GreenText>은 모임의 존속을 위해{' '}
        <GreenText>회원, 관계자들로부터</GreenText> 받아 정해진 곳에 함께
        사용하는 금액입니다.
        <br />(<GreenText>지출과 상관 없이</GreenText> 돈이 들어온 경우를
        뜻합니다.)
        <br />
        <GreyText>예: 회비 </GreyText>
      </Box>
    </Box>
  );
}

export function SmallCategoryGuide() {
  return (
    <Box sx={{ wordBreak: 'keep-all' }}>
      <Typography variant="h6">소분류란?</Typography>
      <Divider />
      <br />
      모임에서 <b>자주 사용하는 분류</b>를 자유롭게 적으시면 됩니다.
      <br />
      <br />
      <GreyText>
        예) 지출 ＞ 복리후생비 ＞ <b>회식비</b>
      </GreyText>
    </Box>
  );
}

export function TagGuide() {
  return (
    <Box sx={{ wordBreak: 'keep-all' }}>
      <Typography variant="h6">태그란?</Typography>
      <Divider />
      <br />
      모임의 자산과 지출에 대한 <b>분석 결과</b>를 보고싶을 때 사용하세요.
      (수입과 예산은 적용되지 않습니다.)
      <br />
      <br />
      예: 회식으로 삼겹살을 자주 먹는지, 회를 자주 먹는지, 태그를 이용하면
      한눈에 볼 수 있습니다.
    </Box>
  );
}
