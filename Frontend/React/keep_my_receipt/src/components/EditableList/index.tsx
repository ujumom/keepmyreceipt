import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

import EditableItem from '../EditableItem';

interface EditableListType {
  originalList: string[];
  onSelect?: (value: string | number) => void;
}

export default function EditableList(props: EditableListType) {
  const [isAdding, setIsAdding] = useState(false);

  // 리스트의 첫 번째 요소가 null이 아닌 경우, 리스트 존재
  const hasList = () => props.originalList[0];

  return (
    <>
      <List disablePadding>
        {/* 리스트 아이템들 출력 */}
        {props.originalList.map((item: string, index: number) => (
          <EditableItem
            originalValue={item}
            prefixElement={<div style={{ marginRight: '1.5rem' }}></div>}
            onEdit={(prevVal, newVal) => {
              console.log('수정 요청 API: ', prevVal, '->', newVal);
              console.log('목록 요청 API');
            }}
            onErase={(value) => {
              console.log('삭제 요청 API: ', value);
              console.log('목록 요청 API');
            }}
            onSelect={props.onSelect}
            key={index}
          />
        ))}

        {/* 리스트 마지막에 태그 추가 버튼 */}
        {/* 목록이 있을 때만 추가 버튼 표시 */}
        {hasList() &&
          // 첫 상태는 그냥 추가 버튼만 표시
          (!isAdding ? (
            <ListItem disablePadding>
              <ListItemButton onClick={() => setIsAdding(true)}>
                {/* 내용 앞 공백 */}
                <div style={{ marginRight: '1.5rem' }}></div>
                {/* 내용 */}
                <ListItemText>추가</ListItemText>
                {/* 더하기 아이콘 */}
                <ListItemIcon>
                  <AddCircleOutline />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ) : (
            // 추가 버튼 클릭 시 입력란 띄움
            <EditableItem
              originalValue={''}
              editOnMount
              onEdit={(prevVal, newVal) => {
                // 수정 시 수정 API 대신 추가 API 호출
                console.log('추가 요청 API: ', newVal);
                console.log('목록 요청 API');
              }}
              onCancel={() => {
                setIsAdding(false);
              }}
            />
          ))}
      </List>
    </>
  );
}
