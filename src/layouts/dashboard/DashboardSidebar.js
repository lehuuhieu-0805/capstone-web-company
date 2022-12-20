import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Grid, Link, Stack, Typography } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { minusMoney } from '../../slices/moneySlice';
import AlertMessage from '../../components/AlertMessage';
import NavSection from '../../components/NavSection';
import Scrollbar from '../../components/Scrollbar';
import { api } from '../../constants';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { updatePremium } from '../../slices/premiumSlice';
//
// import navConfig from './NavConfig';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  maxWidth: 250,
}));

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

let navConfig = [];

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, company, employee }) {
  const token = localStorage.getItem('token');
  const { pathname } = useLocation();
  const [loadingButton, setLoadingButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  const isDesktop = useResponsive('up', 'lg');
  const dispatch = useDispatch();
  const isPremium = useSelector(state => state.premiums);
  const [upgradeFee, setUpgradeFee] = useState(0);

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_CONFIGURATION}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then((response) => {
      setUpgradeFee(response.data.upgrade);
    }).catch(error => console.log(error));
  }, [token]);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const role = localStorage.getItem('role');

    switch (role) {
      case 'EMPLOYEE':
        navConfig = [
          {
            title: 'Trang chủ',
            path: '/employee/dashboard',
            icon: getIcon('eva:pie-chart-2-fill'),
          },
          {
            title: 'Bài viết tuyển dụng',
            path: '/employee/job-post',
            icon: getIcon('bi:file-earmark-post-fill'),
          },
        ];
        break;
      case 'COMPANY':
        navConfig = [
          {
            title: 'Trang chủ',
            path: '/company/dashboard',
            icon: getIcon('eva:pie-chart-2-fill'),
          },
          {
            title: 'Bài viết tuyển dụng',
            path: '/company/job-post',
            icon: getIcon('eva:file-text-fill'),
          },
          {
            title: 'Nạp tiền',
            path: '/company/deposit',
            icon: getIcon('uil:money-insert'),
          },
          {
            title: 'Quản lý nhân viên',
            path: '/company/employee',
            icon: getIcon('eva:people-fill'),
          },
          {
            title: 'Lịch sử giao dịch',
            path: '/company/history-transaction',
            icon: getIcon('icon-park-outline:transaction'),
          },
          {
            title: 'Lịch sử kết nối',
            path: '/company/history-matching',
            icon: getIcon('mdi:user-check'),
          },
        ];
        break;

      default:
        break;
    }
  }, []);

  useEffect(() => {
    console.log(company);
    if (company) {
      const action = updatePremium(company.is_premium);
      dispatch(action);
    }
  }, [company, dispatch]);
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        {/* <Logo /> */}
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        {/* <Link underline="none" component={RouterLink} to="#"> */}
        <AccountStyle>
          <Avatar src={company?.logo} alt="photoURL" />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
              {company?.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'green' }}>
              {isPremium ? 'Premium' : ''}
            </Typography>
          </Box>
        </AccountStyle>
        {/* </Link> */}
        <Box sx={{ mt: 2 }}>
          <AccountStyle>
            <Box sx={{ ml: 2 }}>
              {(() => {
                if (localStorage.getItem('role') === 'COMPANY') {
                  return (
                    <Grid item xs={12}>
                      <h4> Quản lý</h4>
                      <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                        {company?.email}
                      </Typography>
                    </Grid>
                  );
                }
                return (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      {employee?.name} (Nhân viên)
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      {employee?.email}
                    </Typography>
                  </Grid>
                );


              })()}
            </Box>
          </AccountStyle>
        </Box>

      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      {(() => {
        if (localStorage.getItem('role') === 'COMPANY') {
          if (isPremium) {
            return null;
          }
          return (
            <Box sx={{ px: 1.5, pb: 3, mt: 10 }}>
              <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
                <Box
                  component="img"
                  src="https://firebasestorage.googleapis.com/v0/b/captone-dfc3c.appspot.com/o/images%2Ffind-applicant.png?alt=media&token=5701d0af-94b1-4aaa-8ef3-48d718d6144a"
                  sx={{ width: 100, position: 'absolute', top: -50 }}
                />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography gutterBottom variant="h6">
                    Bạn muốn tìm kiếm ứng viên?
                  </Typography>
                  {/* <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      Giá chỉ 5000
                    </Typography> */}
                </Box>
                <Button variant="contained" disabled={!localStorage.getItem('company_id')} onClick={() => setOpenDialog(true)}>
                  Nâng cấp premium
                </Button>
              </Stack>
            </Box>
          );

        }
      })()}


      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          `Bạn chắc chắn muốn nâng cấp tài khoản lên premium với phí là {upgradeFee} Tagent coin?`
        </DialogTitle>
        <DialogContent>
          <Typography variant='subtitle1' gutterBottom>Khi bạn nâng cấp tài khoản lên premium:</Typography>
          <ul>
            <li><Typography variant='body2' gutterBottom>Hệ thống sẽ gợi ý những ứng viên phù hợp với bài viết tuyển dụng</Typography></li>
            <li><Typography variant='body2' gutterBottom>Dễ dàng tìm kiếm được những ứng viên phù hợp cho bài viết tuyển dụng</Typography></li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant='outlined'>Đóng</Button>
          <LoadingButton loading={loadingButton} onClick={() => {
            setLoadingButton(true);
            axios({
              url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WALLET}?companyId=${localStorage.getItem('company_id')}`,
              method: 'get',
              // headers: {
              //   Authorization: `Bearer ${token}`,
              // }
            }).then((response) => {
              if (response.data.data[0].balance < upgradeFee) {
                setSeverity('error');
                setAlertMessage('Số dư trong ví không đủ để nâng cấp tài khoản');
                setOpenAlert(true);
                setLoadingButton(false);
                setOpenDialog(false);
              } else {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_UPGRADE_COMPANY}?id=${localStorage.getItem('company_id')}`,
                  method: 'put',
                  headers: {
                    Authorization: `Bearer ${token}`
                  },
                  data: {
                    id: localStorage.getItem('company_id'),
                    is_premium: true
                  }
                }).then(() => {
                  setLoadingButton(false);
                  setOpenDialog(false);
                  setOpenAlert(true);
                  setSeverity('success');
                  setAlertMessage('Nâng cấp tài khoản thành công');
                  let action = updatePremium(true);
                  dispatch(action);
                  action = minusMoney(upgradeFee);
                  dispatch(action);
                }).catch(error => {
                  console.log(error);
                  setOpenDialog(false);
                  setOpenAlert(true);
                  setSeverity('error');
                  setAlertMessage('Có lỗi xảy ra vui lòng thử lại sau');
                });
              }
            });
          }} variant='contained'>Đồng ý</LoadingButton>
        </DialogActions>
      </Dialog>
      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} severity={severity} />
    </Scrollbar >
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
};
