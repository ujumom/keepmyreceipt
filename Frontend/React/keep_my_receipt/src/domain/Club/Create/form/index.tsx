import React from 'react';
import { Button, Stack, Grid, TextField, Container } from '@mui/material';

interface CreateFormProps {
  name: string;
  intro: string;
  check: boolean;
  onChange: any;
  onClick: any;
}

export default function CreateForm({
  name,
  intro,
  check,
  onChange,
  onClick,
}: CreateFormProps) {
  return (
    <Stack justifyContent="center">
      <Container maxWidth="sm">
        <Grid container rowSpacing={2} justifyContent="center">
          <Grid item xs={12}>
            <TextField
              error={check && !name ? true : false}
              helperText={check && !name ? '모임 이름은 필수입니다' : null}
              fullWidth
              required
              label="모임 이름"
              name="name"
              value={name}
              onChange={onChange}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="모임 소개"
              name="intro"
              value={intro}
              onChange={onChange}
              inputProps={{ maxLength: 50 }}
              maxRows={4}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 1 }}>
            <Button
              onClick={onClick}
              variant="contained"
              fullWidth
              sx={{ marginBottom: 3 }}
            >
              완료
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}
