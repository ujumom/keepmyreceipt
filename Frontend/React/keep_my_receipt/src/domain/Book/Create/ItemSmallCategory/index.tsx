import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Grid,
  IconButton,
  Typography,
  Stack,
  TextField,
} from '@mui/material';
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { DeleteOutline, EditOutlined, InfoOutlined } from '@mui/icons-material';

import DialogWithIconButton from '../../../../components/DialogWithIconButton';
import { SmallCategoryGuide } from '../ItemGuide/classification';
import { Transition } from '../../../../components/DialogWithIconButton/service';
import { filter, toFilterOption, getCategoryId } from './service';
import {
  apiCreateCategory,
  apiUpdateCategory,
  apiReadAllCategory,
  apiDeleteCategory,
} from '../../api/categoryApi';
import { TypeNameKeys } from '../bookReducer';
import { OptionType } from './type';

type ItemSmallCategoryType = {
  label: string;
  clubId: string;
  typeName: TypeNameKeys;
  largeCatName: string;
  value: string;
  setValue: (value: string | number) => void;
  requestCreateValue: (value: string | number) => void;
};

export default function ItemSmallCategory(props: ItemSmallCategoryType) {
  const [options, setOptions] = useState([]);

  const getAllCategory = async () => {
    if (props.largeCatName) {
      await apiReadAllCategory(
        props.clubId,
        props.typeName,
        props.largeCatName,
      ).then((res) => {
        console.log('getAllCategory', res);
        setOptions(toFilterOption(res.data.data));
      });
    }
  };

  const createCategory = async (smallCategory: string) => {
    await apiCreateCategory(
      Number(props.clubId),
      props.typeName,
      props.largeCatName,
      smallCategory,
    ).then(() => getAllCategory());
  };

  const updateCategory = async (smallCatName: string, smallCatId: number) => {
    await apiUpdateCategory(
      Number(props.clubId),
      props.typeName,
      props.largeCatName,
      smallCatName,
      smallCatId,
    ).then(() => getAllCategory());
  };

  const deleteCategory = async (smallCatId: number) => {
    await apiDeleteCategory(props.typeName, smallCatId).then(() =>
      getAllCategory(),
    );
  };

  const [nameOnEdit, setNameOnEdit] = React.useState('');
  const [idOnEdit, setIdOnEdit] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameOnEdit(event.target.value);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>,
    tagName: string,
    tagId: number,
  ) => {
    // 아이콘 클릭 시 겹치는 메뉴 열리는 이벤트 차단
    e.stopPropagation();
    setOpen(true);
    setNameOnEdit(tagName);
    setIdOnEdit(tagId);
  };

  const handleClose = () => {
    setOpen(false);
    setNameOnEdit('');
    setIdOnEdit(0);
  };

  const handleUpdate = () => {
    if (!nameOnEdit) {
      alert('빈 값은 입력할 수 없습니다');
      return;
    }
    updateCategory(nameOnEdit, idOnEdit);
    handleClose();
  };

  useEffect(() => {
    getAllCategory();
  }, [props.largeCatName]);

  return (
    <>
      <Autocomplete
        /** 1. 옵션 리스트 렌더링 */
        options={options}
        renderOption={(props, option: OptionType) => (
          <li {...props}>
            {option.name ? (
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>{option.name}</Typography>
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={(e) => {
                        handleOpen(e, option.name, getCategoryId(option));
                      }}
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        deleteCategory(getCategoryId(option));
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            ) : option.inputValue ? (
              <Typography>{option.inputValue} 추가</Typography>
            ) : (
              <Typography>추가하려면 새로 입력!</Typography>
            )}
          </li>
        )}
        /** 2. 옵션 검색 결과 */
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.name,
          );
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              name: `Add "${inputValue}"`,
              bscName: '',
              bscId: 0,
              ascName: '',
              ascId: 0,
            });
          }

          return filtered;
        }}
        /** 3. 옵션 결과 중 선택 */
        renderInput={(params) => (
          <Stack
            direction="row"
            alignItems="flex-end"
            spacing={1}
            marginBottom={1}
          >
            <TextField {...params} label={props.label} variant="standard" />
            <DialogWithIconButton
              icon={<InfoOutlined />}
              content={<SmallCategoryGuide />}
            />
          </Stack>
        )}
        getOptionLabel={(option: OptionType) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.name;
        }}
        /** 4. 값 바뀌면서 트리거 발동 */
        value={{ name: props.value }}
        isOptionEqualToValue={(option: OptionType, value) =>
          option.name === value.name
        }
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            props.setValue(newValue);
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            createCategory(newValue.inputValue);
            props.setValue(newValue.inputValue);
          } else if (newValue && newValue.name) {
            props.setValue(newValue.name);
          } else {
            props.setValue('');
          }
        }}
        // autoHighlight
        // disableCloseOnSelect
        selectOnFocus
        clearOnEscape
        clearOnBlur
        handleHomeEndKeys
      />

      {/* 수정 다이얼로그 */}
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={Transition}
        closeAfterTransition
        BackdropComponent={Backdrop}
        // BackdropProps={{ timeout: 500 }}
        // fullWidth
        // maxWidth="xs"
      >
        <DialogContent dividers>
          <TextField
            label="소분류 이름 변경"
            value={nameOnEdit}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate}>확인</Button>
          <Button onClick={handleClose} color="secondary">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
