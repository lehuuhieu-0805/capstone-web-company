import { LoadingButton } from '@mui/lab';
import { Alert, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Snackbar, TextField, Typography, Backdrop, CircularProgress } from '@mui/material';
// @mui
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LoginForm } from '../sections/auth/login';
import Logo from '../components/Logo';
// components
import Page from '../components/Page';
import { api } from '../constants';
import { getQueryParams } from '../utils/getQueryParams';
// hooks
import useResponsive from '../hooks/useResponsive';
import AuthSocial from '../sections/auth/AuthSocial';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openDialogConfirmMail, setOpenDialogConfirmMail] = useState(false);
  const [confirmMail, setConfirmMail] = useState({
    code: '',
    error: false,
    message: ''
  });
  const [email, setEmail] = useState('');
  const [loadingButtonConfirm, setLoadingButtonConfirm] = useState(false);
  const [disableButtonConfirm, setDisableButtonConfirm] = useState(true);
  // const [openBackdrop, setOpenBackdrop] = useState(false);
  // const getQueryParam = getQueryParams();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();

  // const handleErrorLogin = (error, email) => {
  //   console.log(error.response.data.detail);
  //   if (error.response.data.detail.trim() === 'Your account is not verified by email!!!') {
  //     setEmail(email);
  //     axios({
  //       url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_CODE_CONFIRM_MAIL}?email=${email}`,
  //       method: 'POST',
  //       // headers: {
  //       //   Authorization: `Bearer ${token}`
  //       // },
  //     }).then(() => setOpenDialogConfirmMail(true))
  //       .catch(error => {
  //         console.log(error);
  //         setSeverity('error');
  //         setMessageAlert('G???i email x??c th???c kh??ng th??nh c??ng');
  //         setOpenAlert(true);
  //       });
  //   }
  //   if (error.response.data.detail.trim() === 'Your account is not verified by admin!!!') {
  //     setSeverity('error');
  //     setMessageAlert('T??i kho???n c???a b???n ch??a ???????c x??c th???c b???i Admin');
  //     setOpenAlert(true);
  //   }
  // };

  // useEffect(() => {
  //   if (getQueryParam?.status === 'verified') {
  //     setSeverity('success');
  //     setMessageAlert('X??c th???c email th??nh c??ng');
  //     setOpenAlert(true);
  //   }
  // }, [getQueryParam?.status]);


  return (
    <Page title="????ng Nh???p">
      <RootStyle>
        <HeaderStyle>
          <Logo />

          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              B???n ch??a c?? t??i kho???n? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                ????ng k??
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ pl: 5, mt: 10, mb: 5 }}>
              Ch??o m???ng b???n ???? tr??? l???i
            </Typography>
            <img src="https://firebasestorage.googleapis.com/v0/b/captone-dfc3c.appspot.com/o/images%2FLOGO.png?alt=media&token=73cbdc4d-636b-4917-ac36-148a97140853" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
              ????ng nh???p
            </Typography>

            {/* <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below.</Typography> */}

            {/* <AuthSocial onErrorLogin={handleErrorLogin} /> */}

            <LoginForm />

            {/* {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don???t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )} */}
          </ContentStyle>
        </Container>
      </RootStyle>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={5000} onClose={() => setOpenAlert(false)}>
        <Alert variant='filled' severity={severity}>
          {messageAlert}
        </Alert>
      </Snackbar>

      {/* <Dialog
        open={openDialogConfirmMail}
        onClose={() => setOpenDialogConfirmMail(false)}
      >
        <DialogTitle>X??c th???c email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nh???p m?? ch??ng t??i ???? g???i ?????n <b>{email}</b>. N???u b???n kh??ng nh???n ???????c email, h??y ki???m tra th?? m???c r??c c???a b???n.
          </DialogContentText>
          <TextField value={confirmMail.code} style={{ marginTop: 10 }} label='Nh???p m?? x??c th???c' variant='standard' fullWidth onChange={(event) => {
            const { value } = event.target;
            if (!value.match(/^[0-9]+$/)) {
              setDisableButtonConfirm(true);
              return setConfirmMail({
                code: value,
                error: true,
                message: 'M?? x??c th???c ch??? ch???a c??c ch??? s???'
              });
            }
            if (value.length > 4) {
              setDisableButtonConfirm(true);
              return setConfirmMail({
                code: value,
                error: true,
                message: 'M?? x??c th???c g???m 4 ch??? s???'
              });
            }
            setDisableButtonConfirm(false);
            return setConfirmMail({ code: value, error: false, message: '' });
          }} />
          {confirmMail.error && <p style={{ color: 'red' }}>{confirmMail.message}</p>}
          <DialogActions>
            <LoadingButton disabled={disableButtonConfirm} loading={loadingButtonConfirm} style={{ marginTop: 20 }} variant='contained' onClick={() => {
              setLoadingButtonConfirm(true);
              axios({
                url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_CHECK_CODE_CONFIRM_MAIL}?code=${confirmMail.code}&email=${email}`,
                method: 'POST',
                // headers: {
                //   Authorization: `Bearer ${token}`
                // },
              }).then(() => {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_MAIL_TO_ADMIN}?email=${email}`,
                  method: 'post',
                  // headers:{
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then(() => {
                  setLoadingButtonConfirm(false);
                  setSeverity('success');
                  setMessageAlert('X??c th???c email th??nh c??ng, ch??ng t??i ???? g???i y??u c???u ????? Admin x??c th???c t??i kho???n c???a b???n');
                  setOpenAlert(true);
                  setTimeout(() => {
                    navigate(0);
                  }, 3000);
                }).catch(error => console.log(error));
              }).catch(error => {
                console.log(error);
                setLoadingButtonConfirm(false);
                setSeverity('error');
                setMessageAlert('X??c th???c kh??ng th??nh c??ng');
                setOpenAlert(true);
              });
            }}>Ho??n th??nh</LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog> */}

      {/* <Backdrop open={openBackdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </Page>
  );
}
