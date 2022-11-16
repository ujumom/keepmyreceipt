import { createFilterOptions } from '@mui/material';
import { OptionType } from './type';

export const filter = createFilterOptions<OptionType>();

export const toFilterOption = (objectArray: OptionType[]) =>
  objectArray
    .map((obj) => ({
      ...obj,
      name: obj.ascName ? obj.ascName : obj.bscName,
    }))
    .concat({ name: '', ascId: 0, ascName: '', bscId: 0, bscName: '' });

export const getCategoryId = (option: OptionType) =>
  option.ascId ? option.ascId : option.bscId;
