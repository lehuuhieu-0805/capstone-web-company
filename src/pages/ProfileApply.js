import { useLocation } from 'react-router-dom';
// @mui
import axios from 'axios';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Container,
  Typography,
  Avatar,
  Button,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

// components
import Page from '../components/Page';

import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { Profile } from '../sections/@dashboard/profile';
import cssStyles from '../utils/cssStyles';

import Image from '../components/Image';

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
    top: 0,
    zIndex: 5,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function UserProfile() {
  const [Applicantinfo, setApplicantinfo] = useState([]);
  const [JobPosition, setJobPosition] = useState([]);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const user = location.state;
  console.log(user);

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/applicants/${user.user.applicant_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setApplicantinfo(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [user.user.applicant_id]);

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-positions/${user.user.job_position_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setJobPosition(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [user.user.job_position_id]);
  const jobpostId = localStorage.getItem('id_jobpost');
  console.log(jobpostId);
  const onSubmit = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes`,
      method: 'post',
      data: {
        job_post_id: jobpostId,
        profile_applicant_id: user.user.id,
        is_applicant_like: 0,
        is_job_post_like: 1,
      },
    })
      .then((response) => {
        // if (response?.status === 201) {
        console.log(response);
        setOpenAlert(true);
        setSeverity('success');
        setMessageAlert('Like thành công');
      })
      .catch((error) => {
        console.log(error);
        setOpenAlert(true);
        setSeverity('error');
        setMessageAlert('Like thất bại');
      });
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const handleCloseDialog = () => {
    // setName('') ;
    setOpenDialog(false);
  };
  return (
    <Page title={Applicantinfo.name}>
      <Container maxWidth={'100%'}>
        <HeaderBreadcrumbs
          heading="Hồ sơ"
          links={[
            { name: 'Trang chủ', href: '/dashboard/app' },
            { name: 'Danh sách ', href: '/dashboard/applyjob' },
            { name: Applicantinfo.name },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <RootStyle>
            <InfoStyle>
              <Avatar
                alt={Applicantinfo.name}
                src={Applicantinfo.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  zIndex: 11,
                  left: 0,
                  right: 0,
                  bottom: 65,
                  mx: 'auto',
                  position: 'absolute',
                }}
              />
              <Box
                sx={{
                  ml: { md: 3 },
                  mt: { xs: 1, md: 0 },
                  color: 'common.white',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Typography variant="h4">{Applicantinfo.name}</Typography>
                <Typography sx={{ opacity: 0.72 }}>{JobPosition.name}</Typography>
              </Box>
            </InfoStyle>
          </RootStyle>
        </Card>
        <Profile myProfile={user} />
        {/* <Card /> */}
      </Container>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">Thành công</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Bạn đã Matching thành công</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus href='/dashboard/applyjob' onClick={handleCloseDialog}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant="filled">
          {messageAlert}
        </Alert>
      </Snackbar>
    </Page>
  );
}
