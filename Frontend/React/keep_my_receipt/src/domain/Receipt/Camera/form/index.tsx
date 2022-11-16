import React, { useState } from 'react';
import {
  Button,
  Stack,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface CreateFormProps {
  type: string;
  check: boolean;
  onChange: any;
  onClick: any;
}

export default function CreateForm({
  type,
  check,
  onChange,
  onClick,
}: CreateFormProps) {
  // 등록 누르면 loading으로 바꾸고 버튼 클릭 못하게 막기
  const [isLoading, setLoading] = useState(false);
  function clickHandler() {
    setLoading(true);
    onClick();
  }
  return (
    <Stack justifyContent="center">
      <Container maxWidth="sm">
        <Grid container rowSpacing={2} justifyContent="center">
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="receipt-type-label">종류</InputLabel>
              <Select
                labelId="receipt-type-label"
                id="receipt-type-select"
                name="type"
                value={type}
                label="Type"
                required
                onChange={onChange}
              >
                <MenuItem value={'paper'}>종이 영수증</MenuItem>
                <MenuItem value={'mobile'}>모바일 영수증</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 1 }}>
            {!isLoading && (
              <Button
                onClick={clickHandler}
                variant="contained"
                fullWidth
                sx={{ marginBottom: 3 }}
              >
                등록
              </Button>
            )}
            {isLoading && (
              <Button variant="contained" fullWidth sx={{ marginBottom: 3 }}>
                이미지 분석 중...
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}
