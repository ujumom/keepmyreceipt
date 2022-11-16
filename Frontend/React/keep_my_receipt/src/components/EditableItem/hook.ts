import { useState } from 'react';

export type EditableItemControllerType = ReturnType<typeof useEditableItem>;

export default function useEditableItem(
  itemValue: string | number,
  changeItemValue?: (
    prevValue: string | number,
    newValue: string | number,
  ) => void,
  editOnMount?: boolean,
) {
  const [isEditing, setIsEditing] = useState(editOnMount ? true : false);
  const [changedValue, setChangedValue] = useState(itemValue);

  const onItemChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const newValue = event.target.value;
    // 숫자 형식이면 숫자로 저장하고, 아니면 문자열로 저장
    setChangedValue(Number(newValue) ? Number(newValue) : newValue);
  };

  const onItemEdit = (state: boolean) => {
    setIsEditing(state);
  };

  const onItemEditConfirm = () => {
    if (itemValue === changedValue) {
      alert('이전 값과 수정한 값이 같습니다!');
      return;
    }

    if (!changedValue) {
      alert('0이나 빈 값은 입력할 수 없습니다!');
      return;
    }
    changeItemValue && changeItemValue(itemValue, changedValue);
    setIsEditing(false);
  };

  return {
    changedValue,
    isEditing,
    onItemChange,
    onItemEdit,
    onItemEditConfirm,
  };
}
