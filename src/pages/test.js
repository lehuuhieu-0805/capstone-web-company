import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { Container, Grid, Stack, Typography, Tab, Tabs, Box, Alert, IconButton, Snackbar, } from '@mui/material';
// hooks

import Page from '../components/Page';
import Label from '../components/Label';
import Iconify from '../components/Iconify';

import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import EmptyContent from '../components/EmptyContent';

// sections
import { api } from '../constants';
import ConfirmJobPostCard from '../sections/@dashboard/Approval/ApprovalJobpost';
import useTabs from '../hooks/useTabs';
import CustomNoRowsOverlay from '../components/CustomNoRowsOverlay';

// ----------------------------------------------------------------------

export default function Approval() {
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [listJobPost, setListJobPost] = useState([]);
  const { currentTab, onChangeTab } = useTabs('jobpost');
  const [visible, setVisible] = useState(false);
  const [refreshDataJobPost, setRefreshDataJobPost] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisible);



  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts?status=2&companyId=${localStorage.getItem('company_id')}`,
      method: 'get',
    })
      .then((response) => {
        setListJobPost(response.data.data);
      })
      .catch((error) => console.log(error));
    setRefreshDataJobPost(false);
  }, [refreshDataJobPost]);

  const handleJobPostRow = (id) => {

    // console.log(response.status);

    const deleteRow = listJobPost.filter((row) => row.id !== id);

    setListJobPost(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận duyệt bài tuyển dụng thành công');
    if (listJobPost.length === 0) {
      setRefreshDataJobPost(true);
      onChangeTab('jobpost');
    }

  };
  const handleError = () => {

    setOpenAlert(true);
    setSeverity('error');
    setMessageAlert('Đã xảy ra lỗi.Vui lòng thử lại');
    // handleRefresh();
    // setRefreshData(!refreshData);
    setRefreshDataJobPost(true);
  };



  const handleRejectJobPostRow = (id) => {

    // console.log(response.status);

    const deleteRow = listJobPost.filter((row) => row.id !== id);

    setListJobPost(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận từ chối bài tuyển dụng thành công');
    if (listJobPost.length === 0) {
      setRefreshDataJobPost(true);
      onChangeTab('jobpost');
    }

  };



  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <Page title="Xét Duyệt">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Xét Duyệt"
          links={[
            { name: 'Trang chủ', href: '/dashboard/app' },
            { name: 'Xét Duyệt', href: '/dashboard/app' },
          ]}
        />

        <Grid container spacing={3}>
          <Grid item xs>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {(() => {
              if (listJobPost === undefined || listJobPost.length === 0) {
                return (
                  <Stack spacing={3}>
                    <CustomNoRowsOverlay />

                  </Stack>
                );
              }
              return (
                <Stack spacing={3}>
                  {listJobPost.map((jp) => (
                    <ConfirmJobPostCard key={jp.id} jobpost={jp} onDeleteRow={() => handleJobPostRow(jp.id)} onErrorRow={() => handleError(jp.id)} onRejectRow={() => handleRejectJobPostRow(jp.id)} />
                  ))}
                </Stack>
              );


            })()}


          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
        </Grid>
        <IconButton
          style={{
            position: 'fixed',
            bottom: 25,
            right: 25,
            display: visible ? 'block' : 'none',
          }}
          onClick={scrollToTop}
        >
          <Iconify icon={'cil:arrow-circle-top'} color="success" width={40} height={40} />
        </IconButton>
      </Container>
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
