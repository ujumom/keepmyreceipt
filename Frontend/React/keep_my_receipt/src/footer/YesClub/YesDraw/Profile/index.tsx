import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

export default function Profile() {
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [clubImage, setClubImage] = useState('');
  const [clubName, setClubName] = useState('');
  const [userAuth, setUserAuth] = useState('');

  useEffect(() => {
    // 유저 이름 가져오기
    axios
      .get(`/api/spring/crew/info`)
      .then(function (response) {
        setUserName(response.data.data.name);
      })
      .catch(function (error) {
        console.log(error);
      });

    // 모임 이미지와 이름 가져오기
    axios
      .get(`/api/spring/club/${id}`)
      .then(function (response) {
        setClubImage(response.data.data.image);
        setClubName(response.data.data.name);
      })
      .catch(function (error) {
        console.log(error);
      });

    // 유저 권한 가져오기
    axios
      .get(`api/spring/club/${id}/crew/auth`)
      .then((res) => {
        if (res.data) {
          setUserAuth(res.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
        return;
      });
  }, []);

  return (
    <>
      {/* 전체 프로필 */}
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'orange',
        }}
      >
        <ListItem>
          {/* 모임 이미지 */}
          <ListItemAvatar>
            <Avatar src={clubImage} />
          </ListItemAvatar>
          {/* 모임 이름 */}
          <ListItemText
            primary={clubName}
            secondary={
              // 유저 이름, 권한
              <Typography
                sx={{ fontSize: '13px', wordBreak: 'keep-all' }}
              >{`안녕하세요!
              ${userAuth} ${userName}님`}</Typography>
            }
          />
        </ListItem>
      </List>
    </>
  );
}
