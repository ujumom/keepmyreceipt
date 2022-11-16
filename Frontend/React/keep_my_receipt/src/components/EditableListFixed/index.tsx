import { IconButton, List } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import EditableItem from '../EditableItem';

interface EditableListType {
  originalList: string[];
  onSelect?: (value: string | number) => void;
}

export default function EditableListFixed(props: EditableListType) {
  return (
    <>
      <List disablePadding>
        {/* 리스트 아이템들 출력 */}
        {props.originalList.map((item: string, index: number) => (
          <EditableItem
            originalValue={item}
            prefixElement={
              <IconButton>
                <InfoOutlined />
              </IconButton>
            }
            onSelect={props.onSelect}
            key={index}
          />
        ))}
      </List>
    </>
  );
}
