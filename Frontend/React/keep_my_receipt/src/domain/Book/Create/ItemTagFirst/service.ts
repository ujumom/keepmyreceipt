import { createFilterOptions } from '@mui/material';
import { TagType } from '../types';
import { OptionType } from './type';

export const filter = createFilterOptions<OptionType>();

export const toFilterOption = (objectArray: TagType[]) =>
  objectArray
    .map((obj) => ({
      ...obj,
      name: obj.tagName,
    }))
    .concat({ name: '', tagId: 0, tagName: '', parentTag: '' });
