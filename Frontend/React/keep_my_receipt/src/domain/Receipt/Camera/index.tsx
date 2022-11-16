import React, { useState } from 'react';
import { Stack, Container, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CreateImage from './image';
import CreateForm from './form';
import axios from 'axios';

interface formProps {
  type: string;
  imgFile?: any;
}

// 영수증 이미지를 등록하는 페이지
export default function ReceiptCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const matches = useMediaQuery('(min-width:500px)');

  const [check, setCheck] = useState(false);
  // form
  const [form, setForm] = useState<formProps>({
    type: '',
    imgFile: '',
  });
  const { type, imgFile } = form;
  const onFormChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const onImgChange = (file: any) => {
    setForm({
      ...form,
      imgFile: file,
    });
  };

  // 사용자가 올린 이미지를 받아서 FastAPI로 넘겨주는 axios
  const createReceipt = async () => {
    if (form.type === '') {
      setCheck(true);
      alert('영수증 종류를 선택해주세요');
      return;
    } else {
      setCheck(false);
    }
    axios.defaults.withCredentials = false;
    const axiosUrl =
      form.type === 'paper'
        ? 'https://k6d104.p.ssafy.io/fast/ocr/receipt/photo'
        : 'https://k6d104.p.ssafy.io/fast/ocr/receipt/img';
    axios.defaults.withCredentials = false;
    await axios
      .post(
        axiosUrl,
        { receipt: imgFile },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then((res) => {
        navigate(`/club/${id}/receipt/request`, {
          state: {
            date: res.data['거래날짜'],
            value: res.data['금액'],
            receiptUrl: res.data['이미지 url'],
          },
        });
      })
      .catch((e) => {
        console.log(e);
        return;
      });
  };

  return (
    <Container maxWidth="md">
      <Stack
        direction="column"
        spacing={3}
        style={
          matches
            ? { marginTop: 0, marginBottom: 30, width: '100%' }
            : { marginTop: 0, marginBottom: 100, width: '100%' }
        }
      >
        <br></br>
        {/* 본문 */}
        <Stack spacing={3}>
          {/* 이미지 */}
          <CreateImage onImgChange={onImgChange} />

          {/* Form */}
          <CreateForm
            type={type}
            check={check}
            onChange={onFormChange}
            onClick={createReceipt}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
