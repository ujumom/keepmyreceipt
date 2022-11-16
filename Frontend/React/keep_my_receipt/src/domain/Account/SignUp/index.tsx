import './index.css';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Button,
  ButtonProps,
  Stack,
  TextField,
  Container,
  Box,
  Grid,
} from '@mui/material';
import { yellow } from '@mui/material/colors';
import BackBar from '../../BackHeader';

export default function SignUpForm() {
  // 스타일
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(yellow[50]),
    '&.MuiButton-contained': {
      color: 'white',
    },
    backgroundColor: yellow[800],
    '&:hover': {
      backgroundColor: yellow[800],
    },
  }));

  //회원가입 - 로그인 형식바꾸는 부분
  const switchAuthModeHandler = () => {
    navigate('/login');
  };

  // 대기중 버튼
  const [isLoading, setIsLoading] = useState(false);

  //이름, 이메일, 비밀번호, 비밀번호 확인
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  //오류메시지 상태저장
  const [nameMessage, setNameMessage] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] =
    useState<string>('');

  // 유효성 검사
  const [isName, setIsName] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isOverlap, setOverlap] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(false);

  // 📍이름
  const onChangeName = useCallback((e: any) => {
    setName(e.target.value);
    if (e.target.value.length < 2 || e.target.value.length > 5) {
      setNameMessage('2글자 이상 5글자 미만으로 입력해주세요.');
      setIsName(false);
    } else {
      setNameMessage('올바른 이름 형식입니다');
      setIsName(true);
    }
  }, []);

  // 📍이메일
  const onChangeEmail = useCallback((e: any) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);

    if (!emailRegex.test(emailCurrent)) {
      setEmailMessage('이메일 형식이 올바르지 않습니다');
      setIsEmail(false);
    } else {
      setEmailMessage('올바른 이메일 형식입니다');
      setIsEmail(true);
    }
  }, []);

  //이메일 중복확인

  const onClick = () => {
    console.log(email);
    axios
      .get(`/api/spring/crew/checkEmail/` + email)
      .then(function (response) {
        console.log(response.data);
        if (response.data.data == true) {
          setEmailMessage('중복된 이메일입니다');
          setIsEmail(false);
          setOverlap(false);
          alert('중복된 이메일입니다!');
        } else {
          setEmailMessage('올바른 이메일 형식입니다');
          setIsEmail(true);
          setOverlap(true);
          alert('사용할 수 있는 이메일입니다');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 📍비밀번호
  const onChangePassword = useCallback((e: any) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    const passwordCurrent = e.target.value;
    setPassword(passwordCurrent);

    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordMessage(
        '숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요',
      );
      setIsPassword(false);
    } else {
      setPasswordMessage('안전한 비밀번호입니다');
      setIsPassword(true);
    }
  }, []);

  // 📍비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    (e: any) => {
      const passwordConfirmCurrent = e.target.value;
      setPasswordConfirm(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPasswordConfirmMessage('비밀번호가 일치합니다');
        setIsPasswordConfirm(true);
      } else {
        setPasswordConfirmMessage('비밀번호가 일치하지 않습니다');
        setIsPasswordConfirm(false);
      }
    },
    [password],
  );

  // 회원가입 후 페이지 이동
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await axios
          .post('/api/spring/crew/signup', {
            email: email,
            password: password,
            name: name,
          })
          .then((res) => {
            setIsLoading(false);
            console.log('response:', res);

            if (res.data.output != 0) {
              alert('회원가입에 성공했습니다!');
              navigate('/login', { replace: true });
            }
          });
      } catch (err) {
        console.error(err);
      }
    },
    [email, name, password],
  );

  return (
    <Container maxWidth="sm">
      <BackBar content={''} />
      <h1 className="h1">회원가입</h1>
      <form onSubmit={onSubmit}>
        <TextField
          onChange={onChangeName}
          helperText={nameMessage}
          type="text"
          required
          fullWidth
          label="이름"
          variant="outlined"
          size="small"
          sx={{
            marginBottom: '10px',
          }}
        />

        <Grid
          container
          spacing={1}
          sx={{
            marginBottom: '10px',
          }}
        >
          <Grid item xs={8} sm={10}>
            <TextField
              onChange={onChangeEmail}
              placeholder="이메일을 입력해주세요"
              required
              fullWidth
              label="이메일"
              type="email"
              helperText={emailMessage}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <Button
              fullWidth
              onClick={onClick}
              sx={{
                border: '2px solid #ffa500',
                backgroundColor: '#ffa500',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#ffa500',
                  color: 'white',
                },
              }}
            >
              중복확인
            </Button>
          </Grid>
        </Grid>

        <TextField
          onChange={onChangePassword}
          required
          fullWidth
          label="비밀번호"
          type="password"
          variant="outlined"
          helperText={passwordMessage}
          size="small"
          sx={{
            marginBottom: '10px',
          }}
        />

        <TextField
          onChange={onChangePasswordConfirm}
          type="password"
          fullWidth
          label="비밀번호 확인"
          helperText={passwordConfirmMessage}
          variant="outlined"
          size="small"
          required
          sx={{
            marginBottom: '10px',
          }}
        />

        {/* 이름, 이메일, 패스워드, 패스워드 확인이 다 맞다면 색있는 버튼으로 */}
        <div>
          <section>
            {!isLoading && (
              <Button
                fullWidth
                type="submit"
                disabled={
                  !(
                    isName &&
                    isEmail &&
                    isOverlap &&
                    isPassword &&
                    isPasswordConfirm
                  )
                }
                sx={{
                  backgroundColor: '#ffa500',
                  color: 'white',
                }}
              >
                확인
              </Button>
            )}
            {isLoading && <Button variant="contained">로딩중...</Button>}
          </section>
        </div>
      </form>

      <Box sx={{ textAlign: 'center' }}>
        <Button type="button" onClick={switchAuthModeHandler}>
          <h5>계정이 있으신가요? 로그인 하러가기</h5>
        </Button>
      </Box>
    </Container>
  );
}
