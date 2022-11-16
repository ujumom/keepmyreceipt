import { Chip, Stack } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import DialogWithIconButton from '../../../../components/DialogWithIconButton';
import { MainTypeGuide } from '../ItemGuide/classification';
import { BookItemType } from '../bookReducer';

/** 주요 유형별 이름 & 각 유형별 토글 버튼 색상 묶음 */
const mainTypes: { name: string; color: string }[] = [
  { name: '자산', color: 'orange' },
  { name: '지출', color: 'red' },
  { name: '수입', color: 'blue' },
  { name: '예산', color: 'green' },
];

type ItemMainTypeProps = {
  item: BookItemType;
  setMainCategory: (value: string) => void;
};

export default function ItemMainType(props: ItemMainTypeProps) {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginTop={4}
      >
        {/* 유형 선택 토글 버튼 */}
        <Stack direction="row" alignItems="center">
          <span>유형</span>
          <Stack
            direction="row"
            alignItems="center"
            marginLeft={(theme) => (theme.breakpoints.down('sm') ? 1 : 5)}
            spacing={1}
          >
            {mainTypes.map((eachType) => (
              <Chip
                label={eachType.name}
                variant={
                  // 현재 유형 이름 == 선택된 유형 이름이
                  // 같은 경우 filled로 설정, 다르면 outlined로 설정
                  eachType.name === props.item.type ? 'filled' : 'outlined'
                }
                onClick={() => {
                  // 클릭 시 콜백 함수 실행
                  props.setMainCategory(eachType.name);
                }}
                sx={
                  eachType.name === props.item.type
                    ? // 선택된 경우 filled 유형의 CSS 적용
                      {
                        '&.MuiChip-filled': {
                          color: 'white',
                          backgroundColor: eachType.color,
                        },
                      }
                    : // 선택되지 않은 경우 그냥 CSS 적용
                      { color: eachType.color, borderColor: eachType.color }
                }
                key={eachType.name}
              />
            ))}
          </Stack>
        </Stack>

        {/* 아이콘 버튼 & 다이얼로그 */}
        <DialogWithIconButton
          icon={<InfoOutlined />}
          content={<MainTypeGuide />}
        />
      </Stack>
    </>
  );
}
