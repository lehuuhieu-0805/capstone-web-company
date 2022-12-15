import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import axios from 'axios';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, LinearProgress } from '@mui/material';
// components
import Page from '../components/Page';
import { api } from '../constants';
import Iconify from '../components/Iconify';
import { getQueryParams } from '../utils/getQueryParams';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import AlertMessage from '../components/AlertMessage';
import BankingBalanceStatistics from '../sections/@dashboard/app/BankingBalanceStatistics';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  const [listJobPost, setListJobPost] = useState([]);
  const [countActiveJobPost, setCountActiveJobPost] = useState(0);
  const [countHiddenJobPost, setCountHiddenJobPost] = useState(0);
  const [countPostingJobPost, setCountPostingJobPost] = useState(0);
  const [day0, setDay0] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loadingData, setLoadingData] = useState(true);

  const getQueryParam = getQueryParams();

  useEffect(() => {
    if (getQueryParam?.status === 'logged') {
      setSeverity('success');
      setMessageAlert('Đăng nhập thành công');
      setOpenAlert(true);
    }
  }, []);

  useEffect(() => {
    if(localStorage.getItem('role') === 'COMPANY' ){
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?companyId=${localStorage.getItem('company_id')}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setListJobPost(response.data.data);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?companyId=${localStorage.getItem('company_id')}&status=0`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setCountActiveJobPost(response.data.data?.length);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?companyId=${localStorage.getItem('company_id')}&status=1`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setCountHiddenJobPost(response.data.data?.length);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?companyId=${localStorage.getItem('company_id')}&status=4`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setCountPostingJobPost(response.data.data?.length);
    }).catch(error => console.log(error));
  }
  if(localStorage.getItem('role') === 'EMPLOYEE' ){
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setListJobPost(response.data.data);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=0`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setCountActiveJobPost(response.data.data?.length);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=1`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setCountHiddenJobPost(response.data.data?.length);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=4`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setCountPostingJobPost(response.data.data?.length);
    }).catch(error => console.log(error));
  }
  }, []);

  useEffect(() => {
    getAll()
  }, []);

  const getAll = async() => {
   
      await  axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-1, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
        // console.log(response)

      })
      .catch((error) => console.log(error));
      await  axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-2, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-1, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
      })
      .catch((error) => console.log(error));
      await   axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-3, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-2, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        console.log(response)
        day0.push(response.data);

      })
      .catch((error) => console.log(error));

      await   axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-4, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-3, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
        // console.log(response)
      })
      .catch((error) => console.log(error));
      await   axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-5, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-4, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
        // console.log(response)
      })
      .catch((error) => console.log(error));
      await   axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-6, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-5, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
        // console.log(response)
      })
      .catch((error) => console.log(error));
      await   axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-7, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-6, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
        // console.log(response)
      })
      .catch((error) => console.log(error));
      await  axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-8, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-7, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
        // console.log(response)
      })
      .catch((error) => console.log(error));
      await  axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/likes/company-date?companyId=${localStorage.getItem('company_id')}&fromDate=${dayjs().add(-9, 'day').format('YYYY-MM-DD')}&toDate=${dayjs().add(-8, 'day').format('YYYY-MM-DD')}`,
      method: 'get',
    })
      .then((response) => {
        day0.push(response.data);
        // console.log(response)
      })
      .catch((error) => console.log(error));
      
      setLoadingData(false);
  }

  return (
    <Page title="Trang chủ">
        {loadingData ? (
        <LinearProgress fullwidth="true" />
      ) : (
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Quản lý bài viết tuyển dụng
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Đang hoạt động" total={countActiveJobPost} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Đã hết hạn" total={countHiddenJobPost} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Chờ hoạt động" total={countPostingJobPost} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Tổng số bài viết" total={listJobPost?.length} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
        <Grid item xs={12}>
              <BankingBalanceStatistics
                title="Thống kê sử dụng"
                subheader="Lượt Like trong công ty"
                chartLabels={[`${dayjs().add(-8, 'day').format('DD/MM')}`, `${dayjs().add(-7, 'day').format('DD/MM')}`, `${dayjs().add(-6, 'day').format('DD/MM')}`, `${dayjs().add(-5, 'day').format('DD/MM')}`, `${dayjs().add(-4, 'day').format('DD/MM')}`, `${dayjs().add(-3, 'day').format('DD/MM')}`, `${dayjs().add(-2, 'day').format('DD/MM')}`, `${dayjs().add(-1, 'day').format('DD/MM')}`, `${dayjs().format('DD/MM')}`]}
                chartData={[
                  {
                    year: 'Ngày',
                    data: [
                      { name: 'Like', data: day0 },

                      // { name: 'Match', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                    
                    ],
                  },

                ]}
              />
            </Grid>
      </Container>
      )}
      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={messageAlert} severity={severity} />
    </Page>
  );
}
