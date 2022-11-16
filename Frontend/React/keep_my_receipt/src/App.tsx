import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navigation from './header';
import SimpleBottomNavigation from './footer';
import Landing from './domain/Landing';

import AlertIndex from './domain/Alert/Index';
import LoginIndex from './domain/Account/Login';
import SignUpIndex from './domain/Account/SignUp';
import ClubIndex from './domain/Club/Index';
import ClubCreate from './domain/Club/Create';
import ClubSearch from './domain/Club/Search';
import BookIndex from './domain/Book/Index';
import BookCreate from './domain/Book/Create';
import BookDetail from './domain/Book/Detail';

import SettingIndex from './domain/Setting/Index';
import CameraIndex from './domain/Receipt/Camera';
import RequestIndex from './domain/Receipt/Request';
import RequestListIndex from './domain/Receipt/RequestList';
import ApproveIndex from './domain/Receipt/Approve';
import ManageIndex from './domain/Manage';
import MainChartIndex from './domain/Analytics';
import SubChartIndex from './domain/Analytics/MediumTagChart';
import BudgetReport from './domain/Report/Budget';
import AssetReport from './domain/Report/Asset';
import BookSearch from './domain/Book/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Outlet />}>
          <Route index element={<LoginIndex />} />
        </Route>
        <Route path="signup" element={<Outlet />}>
          <Route index element={<SignUpIndex />} />
        </Route>
        <Route path="alert" element={<CheckLoginPage />}>
          <Route index element={<AlertIndex />} />
        </Route>
        <Route path="setting" element={<CheckLoginPage />}>
          <Route index element={<SettingIndex />} />
        </Route>
        {/* 밑에 Route들 추가하시면 됩니다! */}
        <Route path="/" element={<RootPage />}>
          <Route index element={<Landing />} />
          <Route path="club" element={<CheckLoginPage />}>
            <Route index element={<ClubIndex />} />
            <Route path="create" element={<ClubCreate />} />
            <Route path="search" element={<ClubSearch />} />
            <Route path=":id" element={<Outlet />}>
              <Route path="book" element={<Outlet />}>
                <Route index element={<BookIndex />} />
                <Route path="search" element={<BookSearch />} />
                <Route path="create" element={<BookCreate />} />
                <Route path="detail" element={<BookDetail />} />
              </Route>
              <Route path="receipt" element={<Outlet />}>
                <Route path="camera" element={<CameraIndex />} />
                <Route path="request" element={<RequestIndex />} />
                <Route path="requestList" element={<RequestListIndex />} />
                <Route path="approve" element={<ApproveIndex />} />
              </Route>
              <Route path="analytics" element={<Outlet />}>
                <Route path="mainChart" element={<MainChartIndex />} />
                <Route path="subChart" element={<SubChartIndex />} />
                {/* 추가 */}
              </Route>
              <Route path="report" element={<Outlet />}>
                <Route path="asset" element={<AssetReport />} />
                <Route path="budget" element={<BudgetReport />} />
              </Route>
              <Route path="manage" element={<Outlet />}>
                <Route index element={<ManageIndex />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* baseUrl/book이면 book index로 접속 */}
        <Route path="/login/index" element={<LoginIndex />} />
        <Route path="/setting/index" element={<SettingIndex />} />
      </Routes>
    </BrowserRouter>
  );
}

function RootPage() {
  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    // header accessToken 설정
    axios.defaults.headers.common['Authorization'] = `${accessToken}`;
    if (!accessToken) {
    }
  }, []);

  return (
    <>
      <Navigation />
      <Outlet />
      <SimpleBottomNavigation />
    </>
  );
}
function CheckLoginPage() {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken]);
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
