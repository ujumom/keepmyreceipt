import React from 'react';
import { Fade } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

/** 트랜지션 효과를 위한 변수 (공식문서에서 그대로 가져옴) */
export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: JSX.Element;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});
