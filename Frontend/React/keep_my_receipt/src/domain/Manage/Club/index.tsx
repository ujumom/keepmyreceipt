import React, { useEffect, useState } from 'react';
import { IconButton, Stack, Container } from '@mui/material';
import axios from 'axios';
import ClubUpdateForm from './UpdateForm';
import { useNavigate } from 'react-router-dom';

interface FormType {
  formName: string;
  formDes?: string;
  formImage?: string;
}
interface ClubInfoType {
  id: number;
  name: string;
  description: string;
  image: string;
}
interface ManageClubProps {
  clubInfo: ClubInfoType;
  getClubInfo: any;
}

export default function ManageClub({ clubInfo, getClubInfo }: ManageClubProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [imgFile, setImgFile] = useState();
  const { id, name, description, image } = clubInfo;
  const [form, setForm] = useState<FormType>({
    formName: name,
    formDes: description,
    formImage: image,
  });
  const { formName, formDes, formImage } = form;

  const onChange = (e: any) => {
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
    if (formName === '') {
      setCheck(true);
      console.log('모임 이름은 필수');
      return;
    }
    setLoading(true);
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
    // 모임 정보 수정
    await axios
      .put(`https://k6d104.p.ssafy.io/api/spring/club/${id}`, {
        name: formName,
        description: formDes,
        image: imgUrl ? imgUrl : image,
      })
      .then((response) => {
        setLoading(false);
        window.scrollTo(0, 0);
        // console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
    getClubInfo();
  };
  return (
    <Container maxWidth="md" sx={{ padding: 0 }}>
      {/* Form */}
      <ClubUpdateForm
        clubInfo={clubInfo}
        formName={formName}
        formDes={formDes}
        formImage={formImage}
        check={check}
        onChange={onChange}
        onClick={onClick}
        onImgChange={onImgChange}
        loading={loading}
      />
    </Container>
  );
}
