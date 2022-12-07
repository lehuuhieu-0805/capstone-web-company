// material
import { CircularProgress, Backdrop } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCompany } from '../../slices/companySlice';
import { updateEmployee } from '../../slices/employeeSlice';
import { onMessageListener, subscribeToTopic, unSubscribeToTopic } from '../../utils/firebase';
import { api } from '../../constants';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  // const [company, setCompany] = useState();
  const [openBackDrop, setOpenBackDrop] = useState(false);

  const dispatch = useDispatch();
  const company = useSelector(state => state.companys);
  const employee = useSelector(state => state.employees);
  useEffect(() => {
    setOpenBackDrop(true);
    if (localStorage.getItem('company_id')) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_COMPANY}/${localStorage.getItem('company_id')}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        // setCompany(response.data.data);
        const action = updateCompany(response.data.data);
        dispatch(action);
        setOpenBackDrop(false);
      }).catch(error => console.log(error));
    }

  }, [dispatch]);
  useEffect(() => {
    setOpenBackDrop(true);
    if (localStorage.getItem('user_id')) {
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/employees/${localStorage.getItem('user_id')}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        console.log(response.data.data);
        // setEmployee(response.data.data);
        const action = updateEmployee(response.data.data);
        dispatch(action);
        setOpenBackDrop(false);
      }).catch(error => console.log(error));
    }

  }, [dispatch]);

  return (
    <>
      {company ? (
        <RootStyle>
          <DashboardNavbar company={company} onOpenSidebar={() => setOpen(true)} />
          <DashboardSidebar company={company} employee={employee} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
          <MainStyle>
            <Outlet />
          </MainStyle>
        </RootStyle>
      ) :
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackDrop}>
          <CircularProgress color='inherit' />
        </Backdrop>
      }
      {/* <RootStyle>
        <DashboardNavbar company={company}  onOpenSidebar={() => setOpen(true)} />
        <DashboardSidebar company={company} employee={employee} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        <MainStyle>
          <Outlet />
        </MainStyle>
      </RootStyle> */}
    </>
  );
}

// <Box style={{ display: 'flex', justifyContent: 'center' }}>
//   <CircularProgress />
// </Box>