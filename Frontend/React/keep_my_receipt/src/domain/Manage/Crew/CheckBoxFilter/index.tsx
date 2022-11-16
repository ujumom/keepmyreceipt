import React, { useEffect, useState } from 'react';
import { Stack, Checkbox, FormControlLabel } from '@mui/material';

interface Props {
  getCrewList: any;
  setFilter: any;
}

export default function CrewCheckBoxFilter({ getCrewList, setFilter }: Props) {
  // checkBox
  const [checked, setChecked] = useState([true, false, false]);
  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setChecked([true, false, false]);
    }
  };
  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setChecked([false, true, false]);
    } else {
      setChecked([true, false, false]);
    }
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setChecked([false, false, true]);
    } else {
      setChecked([true, false, false]);
      setFilter('ALL');
    }
  };
  useEffect(() => {
    if (checked[0]) {
      setFilter('ALL');
      getCrewList();
    } else if (checked[1]) {
      setFilter('MANAGER');
      getCrewList(0, 'MANAGER');
    } else if (checked[2]) {
      setFilter('NORMAL');
      getCrewList(0, 'NORMAL');
    }
  }, [checked]);
  return (
    <Stack direction="row">
      <FormControlLabel
        label="전체"
        control={
          <Checkbox
            checked={checked[0]}
            onChange={handleChange1}
            // inputProps={{ 'aria-label': 'controlled' }}
          />
        }
      />
      <FormControlLabel
        label="관리자"
        control={
          <Checkbox
            checked={checked[1]}
            onChange={handleChange2}
            // inputProps={{ 'aria-label': 'controlled' }}
          />
        }
      />
      <FormControlLabel
        label="회원"
        control={
          <Checkbox
            checked={checked[2]}
            onChange={handleChange3}
            // inputProps={{ 'aria-label': 'controlled' }}
          />
        }
      />
    </Stack>
  );
}
