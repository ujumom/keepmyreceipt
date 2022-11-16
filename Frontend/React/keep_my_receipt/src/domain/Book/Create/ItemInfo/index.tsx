import React from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';

import { BookAction, BookItemType, updateItem } from '../bookReducer';
import { toNumberOnly } from '../../../../services/toCurrency';

interface ItemInfoType {
  item: BookItemType;
  itemIndex: number;
  dispatch: React.Dispatch<BookAction>;
  currencyEditable: boolean;
}

export default function ItemInfo(props: ItemInfoType) {
  return (
    <Box>
      {/* 항목 이름 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          marginBottom: 1,
        }}
      >
        {/* <LocalOffer sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
        <TextField
          label="내용"
          value={props.item.name}
          onChange={(event) => {
            props.dispatch(
              updateItem(props.itemIndex, 'name', event.target.value),
            );
          }}
          variant="standard"
          fullWidth
          required
        />
      </Box>

      {/* 항목 금액 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* <Money sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
        <TextField
          label="금액"
          value={
            props.item.price ? props.item.price.toLocaleString() : undefined
          }
          onChange={(event) => {
            props.dispatch(
              updateItem(
                props.itemIndex,
                'price',
                toNumberOnly(event.target.value),
              ),
            );
          }}
          InputProps={
            props.item.price
              ? {
                  startAdornment: (
                    <InputAdornment position="start">￦</InputAdornment>
                  ),
                }
              : undefined
          }
          disabled={!props.currencyEditable}
          helperText={
            !props.currencyEditable ? '영수증 등록 금액과 같아야 합니다' : ''
          }
          required
          variant="standard"
          fullWidth
        />
      </Box>

      {/* 항목 메모 */}
      {/* <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '50%' }}>
        <Notes sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          label="메모"
          value={item.memo}
          onChange={(event) => {
            dispatch(updateItem(itemIndex, 'memo', event.target.value));
          }}
          variant="standard"
          multiline
        />
      </Box> */}
    </Box>
  );
}
