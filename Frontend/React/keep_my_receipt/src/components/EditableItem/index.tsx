import {
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Cancel, CheckCircle, Delete, Edit } from '@mui/icons-material';

import useEditableItem from './hook';
import toCurrency from '../../services/toCurrency';
import { EditableItemControllerType } from './hook';
type EditableItemViewType = Parameters<typeof EditableItemContainer>[0];

export default function EditableItemContainer(props: {
  originalValue: string | number;
  onEdit?: (prevValue: string | number, newValue: string | number) => void;
  editOnMount?: boolean;

  onCancel?: () => void;
  onErase?: (value: string | number) => void;
  onSelect?: (value: string | number) => void;

  prefixElement?: JSX.Element;
  rootHighlight?: boolean;
  isCurrency?: boolean;
}) {
  const editableItem = useEditableItem(
    props.originalValue,
    props.onEdit,
    props.editOnMount,
  );

  return (
    <>
      <ListItem disablePadding>
        <Grid flexGrow={1}>
          {/* 아이템 내용 */}
          {props.onSelect ? (
            // 선택 가능하면 버튼 형태로 반환
            <ListItemButton
              onClick={() => {
                // 현재 클릭한 값으로 바꿈
                props.onSelect && props.onSelect(props.originalValue);
              }}
            >
              <EditableItemContent props={props} editableItem={editableItem} />
            </ListItemButton>
          ) : (
            // 아니면 그냥 텍스트만 반환
            <EditableItemContent props={props} editableItem={editableItem} />
          )}
        </Grid>

        {/* 아이콘들 */}
        <EditableItemActions props={props} editableItem={editableItem} />
      </ListItem>
    </>
  );
}

function EditableItemContent({
  props,
  editableItem,
}: {
  props: EditableItemViewType;
  editableItem: EditableItemControllerType;
}) {
  return (
    <Stack direction="row" alignItems="center">
      {/* 텍스트 앞쪽에 놓을 아이콘 or 글 */}
      {props.prefixElement && props.prefixElement}

      {/* 수정 중이 아닌 경우엔 글씨 보임 */}
      {!editableItem.isEditing && (
        <ListItemText
          primary={
            <Typography
              // 글씨 강조 옵션
              fontSize={props.rootHighlight ? 'large' : '1rem'}
              fontWeight={props.rootHighlight ? 'bold' : 'medium'}
            >
              {/* 금액이면 금액 형식으로 출력 */}
              {props.isCurrency
                ? toCurrency(props.originalValue as number)
                : props.originalValue}
            </Typography>
          }
        />
      )}

      {/* 수정 중이면 텍스트 필드 보임 */}
      {props.onEdit && editableItem.isEditing && (
        <TextField
          value={editableItem.changedValue}
          onChange={editableItem.onItemChange}
          onKeyDown={(e) => {
            // Enter 누르면 저장
            if (e.key === 'Enter') {
              editableItem.onItemEditConfirm();
            }
          }}
          size="small"
          autoFocus // 첫 렌더링 시 자동 포커싱
        />
      )}
    </Stack>
  );
}

function EditableItemActions({
  props,
  editableItem,
}: {
  props: EditableItemViewType;
  editableItem: EditableItemControllerType;
}) {
  return (
    <>
      {/* 아이템 수정 버튼 */}
      {props.onEdit && !editableItem.isEditing && (
        <IconButton onClick={() => editableItem.onItemEdit(true)}>
          <Edit />
        </IconButton>
      )}

      {/* 아이템 수정 확인 버튼 */}
      {props.onEdit && editableItem.isEditing && (
        <IconButton
          onClick={() => {
            editableItem.onItemEditConfirm();
          }}
        >
          <CheckCircle />
        </IconButton>
      )}

      {/* 아이템 수정 취소 버튼 */}
      {props.onEdit && editableItem.isEditing && (
        <IconButton
          onClick={() => {
            editableItem.onItemEdit(false);
            props.onCancel && props.onCancel();
          }}
        >
          <Cancel />
        </IconButton>
      )}

      {/* 아이템 삭제 버튼 */}
      {props.onErase && !editableItem.isEditing && (
        <IconButton
          onClick={() => {
            props.onErase && props.onErase(props.originalValue);
          }}
        >
          <Delete />
        </IconButton>
      )}
    </>
  );
}
