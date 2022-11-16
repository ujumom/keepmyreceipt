import React, { useEffect, useState } from 'react';
import { IconButton, Stack, Container, Grid } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateImage from './image';
import CreateForm from './form';

interface formProps {
  name: any;
  intro?: any;
}

export default function ClubCreate() {
  const navigate = useNavigate();
  // 모임 이름 check
  const [check, setCheck] = useState(false);
  // form
  const [imgFile, setImgFile] = useState();
  const [form, setForm] = useState<formProps>({
    name: '',
    intro: '',
  });
  const { name, intro } = form;

  const onFormChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const onImgChange = (file: any) => {
    setImgFile(file);
  };

  const onClick = async () => {
    if (form.name === '') {
      setCheck(true);
      console.log('모임 이름은 필수');
      return;
    }
    // 이미지 파일 업로드하여 url 가져오기
    axios.defaults.withCredentials = false;
    const imgUrl = imgFile
      ? await axios
          .post(
            'https://k6d104.p.ssafy.io/fast/uploadImage',
            { image: imgFile },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          .then((res) => {
            console.log(res.data.file);
            return res.data.file;
          })
          .catch((e) => {
            console.log(e);
            return;
          })
      : '';
    // console.log(imgUrl);
    // 모임 생성
    await axios
      .post('https://k6d104.p.ssafy.io/api/spring/club', {
        name: name,
        description: intro,
        image: imgUrl ? imgUrl : '',
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
    // 내 모임으로 이동
    navigate('..');
  };
  return (
    <Container maxWidth="md" sx={{ paddingY: 0, paddingX: '1rem' }}>
      <Grid container direction="column" sx={{ marginBottom: 1 }}>
        {/* 상단 */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ position: 'relative' }}
        >
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            color="inherit"
            sx={{ position: 'absolute', left: 0 }}
          >
            <ArrowBackIos sx={{ fontSize: '2rem' }} />
          </IconButton>
          <h2>모임 만들기</h2>
        </Stack>

        {/* 본문 */}
        <Stack spacing={3}>
          {/* 이미지 */}
          <CreateImage onImgChange={onImgChange} />
          {/* Form */}
          <CreateForm
            name={name}
            intro={intro}
            check={check}
            onChange={onFormChange}
            onClick={onClick}
          />
        </Stack>
      </Grid>
    </Container>
  );
}
