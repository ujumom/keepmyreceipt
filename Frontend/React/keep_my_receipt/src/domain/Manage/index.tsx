import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Tabs,
  Tab,
  Box,
  Stack,
  Avatar,
  styled,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import ManageClub from './Club';
import ManageCrew from './Crew';
import ManageJoin from './Join';

import Navigation from '../../header';

interface ClubInfoType {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const ManageTabs = styled(Tabs)({
  // borderBottom: '1px solid #ffaa00',
  '& .MuiTabs-indicator': {
    backgroundColor: '#ffaa00',
  },
});
const ManageTab = styled(Tab)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightRegular,
  '&:hover': {
    color: '#ffaa00',
    fontWeight: theme.typography.fontWeightBold,
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#ffaa00',
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default function ManageIndex() {
  const navigate = useNavigate();
  // 모임 정보 가져오기
  const { id } = useParams();
  const [clubInfo, setClubInfo] = useState<ClubInfoType>({
    id: 0,
    name: '',
    description: '',
    image: '',
  });
  const checkCrewAuth = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    // 모임 내 권한 조회를 통해 가입 여부& 권한 확인
    await axios
      .get(`https://k6d104.p.ssafy.io/api/spring/club/${id}/crew/auth`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((res) => {
        if (res.data) {
          const check = res.data;
          if (check.data !== '리더') {
            // 내 모임으로 이동
            alert('권한이 없습니다.');
            navigate(`/club`);
            window.scrollTo(0, 0);
          }
        }
      })
      .catch((e) => {
        console.log(e);
        return;
      });
  };

  const getClubInfo = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    await axios
      .get(`https://k6d104.p.ssafy.io/api/spring/club/${id}`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((res) => {
        // console.log(res.data.data);
        const output = res.data.output;
        if (output === 200) {
          // console.log(res.data.data);
          setClubInfo(res.data.data);
        } else if (output === 0) {
          console.log(res.data.msg);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // tab
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
    );
  };
  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      //   'aria-controls': `simple-tabpanel-${index}`,
    };
  };
  useEffect(() => {
    checkCrewAuth();
    getClubInfo();
  }, []);
  return (
    <Container maxWidth="md" sx={{ paddingY: 0, paddingX: '1rem' }}>
      <Grid container direction="column" sx={{ marginBottom: 1 }}>
        {/* Header */}
        <Stack marginTop="1rem" spacing="0.5rem">
          <h2>모임 관리</h2>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Avatar
              // variant="rounded"
              sx={{
                width: '2rem',
                height: '2rem',
              }}
              src={clubInfo ? clubInfo.image : ''}
            >
              {clubInfo ? (!clubInfo.image ? clubInfo.name[0] : null) : null}
            </Avatar>
            <h4>{clubInfo ? clubInfo.name : null}</h4>
          </Stack>
        </Stack>

        {/* Tab */}
        <Stack direction="column" alignItems="center">
          <Box
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <ManageTabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              centered
            >
              <ManageTab
                label="회원"
                {...a11yProps(0)}
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
              <ManageTab
                label="가입 대기"
                // {...a11yProps(1)}
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
              <ManageTab
                label="모임 정보"
                // {...a11yProps(2)}
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            </ManageTabs>
          </Box>
          {/* Tab content */}
          <TabPanel value={value} index={0}>
            <ManageCrew clubInfo={clubInfo} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ManageJoin clubInfo={clubInfo} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ManageClub clubInfo={clubInfo} getClubInfo={getClubInfo} />
          </TabPanel>
        </Stack>
      </Grid>
    </Container>
  );
}
