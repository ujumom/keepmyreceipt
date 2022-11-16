import { memo, useState } from 'react';
import { Collapse, List, ListItemButton } from '@mui/material';
import { ExpandLess, ExpandMore, Info } from '@mui/icons-material';

import DialogWithIconButton from '../DialogWithIconButton';
import EditableItem from '../EditableItem';
import EditableList from '../EditableList';
import EditableListFixed from '../EditableListFixed';

interface EditableListWrappedType {
  categoryName: string;
  dialogContent: JSX.Element;
  originalList: string[];
  onSelect: (value: string | number) => void;
  selected: string;
  fixed?: boolean;
}

function EditableListWrapped(props: EditableListWrappedType) {
  // 세부 목록 열림 / 닫힘 상태
  const [open, setOpen] = useState(false);

  // 세부 목록 열림 / 닫힘 조작
  const handleExpand = () => {
    setOpen(!open);
  };

  // fixed 여부에 따라 수정 가능 / 불가능 컴포넌트 선택
  const EditableListInterface = !props.fixed ? EditableList : EditableListFixed;

  return (
    <>
      <List disablePadding>
        <ListItemButton onClick={handleExpand} disableRipple disableGutters>
          {/* 아이콘 버튼 with 다이얼로그 */}
          <DialogWithIconButton icon={<Info />} content={props.dialogContent} />

          {/* 분류명 & 선택된 항목 */}
          <EditableItem
            prefixElement={
              <div style={{ marginRight: '2rem' }}>{props.categoryName}</div>
            }
            originalValue={props.selected}
            rootHighlight
          />

          {/* 열기 / 닫기 화살표 */}
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        {/* 화살표 눌렀을 때 나오는 리스트들 */}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <EditableListInterface
            originalList={props.originalList}
            onSelect={(value: string | number) => {
              setOpen(false);
              props.onSelect(value);
            }}
          />
        </Collapse>
      </List>
    </>
  );
}

export default memo(EditableListWrapped);
