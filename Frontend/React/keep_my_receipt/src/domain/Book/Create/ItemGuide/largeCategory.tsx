import { Box, Divider, Typography } from '@mui/material';
import { GreyText } from './style';

export function AssetLargeCategoryGuide() {
  return (
    <Box sx={{ wordBreak: 'keep-all' }}>
      <Typography variant="h6">자산 대분류 가이드</Typography>
      <Divider />
      <br />
      <Typography variant="h6" fontWeight="bold">
        현금 및 현금성 자산
      </Typography>
      <Box marginLeft={1}>
        현금이나 만기가 3개월 이내 남은 금융자산을 뜻합니다.
        <br />
        <GreyText>예시) 현금, 만기가 3개월 이내로 남은 예/적금, 수표</GreyText>
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        유형자산
      </Typography>
      <Box marginLeft={1}>
        눈으로 볼 수 있으며, 앞으로도 사용될 수 있는 자산을 뜻합니다.
        <br />
        <GreyText>예시) 책, 책상, 축구공</GreyText>
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        선급금
      </Typography>
      <Box marginLeft={1}>
        물품이나 서비스를 이용하기 위해 미리 지급한 금액입니다.
        <br />
        <GreyText>예시) 1년치 선결제한 서비스,인쇄비, 연습실 대여비</GreyText>
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        기타자산
      </Typography>
      <Box marginLeft={1}>
        기타의 자산을 뜻합니다.
        <br />
        <GreyText>예시) 특허권, 공통으로 투자한 주식</GreyText>
      </Box>
    </Box>
  );
}

export function ExpenditureLargeCategoryGuide() {
  return (
    <Box sx={{ wordBreak: 'keep-all' }}>
      <Typography variant="h6">지출 대분류 가이드</Typography>
      <Divider />
      <br />
      <Typography variant="h6" fontWeight="bold">
        복리후생비{' '}
      </Typography>
      <Box marginLeft={1}>
        회원들의 복리를 증진하기 위한 비용을 뜻합니다. 현금이나 만기가 3개월
        이내 남은 금융자산을 뜻합니다.
        <br />
        <GreyText>예시) 행사비, 회식비, 경조사비, 선물</GreyText>
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        여비교통비
      </Typography>
      <Box marginLeft={1}>
        모임과 관련된 활동으로 발생하는 교통 비용을 뜻합니다.
        <br />
        <GreyText>예시) 버스, 택시, 지하철,통행료, 주차비 등</GreyText>
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        소모품비
      </Typography>
      <Box marginLeft={1}>
        사무용품, 소모적인 물품을 구입할 때 발생하는 비용을 뜻합니다. <br />
        <br />
        <GreyText>
          예시) 휴지, A4용지, 필기구, 프린터 부품교체비, 건전지
        </GreyText>
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        기타비용
      </Typography>
      <Box marginLeft={1}>
        복리후생비, 여비교통비, 소모품비에 해당하지 않는 비용을 말합니다. <br />
        <br />
        <GreyText>예시) 임대료, 공과금, 기부금, 금융수수료</GreyText>
      </Box>
    </Box>
  );
}

export function RevenueLargeCategoryGuide() {
  return (
    <Box sx={{ wordBreak: 'keep-all' }}>
      <Typography variant="h6">수입 대분류 가이드</Typography>
      <Divider />
      <br />
      <Typography variant="h6" fontWeight="bold">
        수입
      </Typography>
      <Box marginLeft={1}>
        행사, 판매, 이자 수익 등 여러 방법들로부터 발생한 수입을 뜻합니다
        <br />
        <GreyText>
          예시) 행사 수익, 굿즈 판매 수익, 바자회 수익, 상금 수익
        </GreyText>
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        기타수입
      </Typography>
      <Box marginLeft={1}>
        이 외 다양한 방식의 수입을 뜻합니다.
        <br />
        <GreyText>예시) 계좌 잔액으로부터의 이자 수익</GreyText>
      </Box>
      <br />
    </Box>
  );
}

export function BudgetLargeCategoryGuide() {
  return (
    <Box sx={{ wordBreak: 'keep-all' }}>
      <Typography variant="h6">예산 대분류 가이드</Typography>
      <Divider />
      <br />
      <Typography variant="h6" fontWeight="bold">
        전기예산
      </Typography>
      <Box marginLeft={1}>
        전기에 사용 후 남아 다음 기에 사용될 예산을 뜻합니다.
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        활동지원금
      </Typography>
      <Box marginLeft={1}>기관이나 단체 등에서 지원 받은 예산을 뜻합니다.</Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        회비
      </Typography>
      <Box marginLeft={1}>
        회원에게 일시적, 정기적으로 받은 예산을 뜻합니다.
      </Box>
      <br />

      <Typography variant="h6" fontWeight="bold">
        후원비
      </Typography>
      <Box marginLeft={1}>
        개인, 관계자에게 받은 예산을 뜻합니다. <br />
      </Box>
      <br />
    </Box>
  );
}
