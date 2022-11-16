import { ASType, BSType } from '../types';

export type OptionType = BSType &
  ASType & {
    inputValue?: string;
    name: string;
  };
