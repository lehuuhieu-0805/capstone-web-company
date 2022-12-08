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


/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { LoadingButton } from "@mui/lab";
import { Chip, CircularProgress, Paper, Tab, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tabs, TextField } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
import Page from "../components/Page";
import TableToolbar from "../components/TableToolbar";
import TabPanel from "../components/TabPanel";
import { api, common } from '../constants';
import useTable, { getComparator } from "../hooks/useTable";
import TableHeadCustom from "../TableHeadCustom";

let TABLE_HEAD = [
  { id: 'no', label: 'No.', algin: 'left' },
  { id: 'create_date', label: 'Ngày tạo giao dịch', algin: 'left' },
  { id: 'total', label: 'Số tiền', algin: 'left' },
  { id: 'type_of_transaction', label: 'Loại giao dịch', algin: 'left' },
];

export default function HistoryTransaction() {
  const [tabValue, setTabValue] = useState(0);
  const [startDay, setStartDay] = useState(dayjs());
  const [endDay, setEndDay] = useState(dayjs());
  const [loadingButton, setLoadingButton] = useState(false);
  const [listHistory, setListHistory] = useState([]);

  const onChangeStartDay = (newValue) => {
    setStartDay(newValue);
  };

  const onChangeEndDay = (newValue) => {
    setEndDay(newValue);
  };

  return (
    <Page title='Lịch sử giao dịch'>
      <Container maxWidth='xl'>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <HeaderBreadcrumbs
            heading="Lịch sử giao dịch"
            links={[
              { name: 'Trang chủ', href: '/company/dashboard' },
              { name: 'Lịch sử giao dịch', href: '/company/history-transaction' },
            ]}
          />
        </Stack>

        <Tabs value={tabValue} onChange={(event, newTabValue) => setTabValue(newTabValue)} aria-label="basic tabs example">
          <Tab label='Tất cả' id='simple-tab-0' aria-controls='simple-tabpanel-0' />
          <Tab label='Nạp tiền' id='simple-tab-1' aria-controls='simple-tabpanel-1' />
          <Tab label='Bài viết' id='simple-tab-2' aria-controls='simple-tabpanel-2' />
        </Tabs>

        {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Tabs value={tabValue} onChange={(event, newTabValue) => setTabValue(newTabValue)} aria-label="basic tabs example">
            <Tab label='Tất cả' id='simple-tab-0' aria-controls='simple-tabpanel-0' />
            <Tab label='Nạp tiền' id='simple-tab-1' aria-controls='simple-tabpanel-1' />
            <Tab label='Bài viết' id='simple-tab-2' aria-controls='simple-tabpanel-2' />
          </Tabs>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Từ ngày"
                inputFormat="DD-MM-YYYY"
                value={startDay}
                onChange={onChangeStartDay}
                renderInput={(params) => <TextField {...params} sx={{ mr: 2 }} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Đến ngày"
                inputFormat="DD-MM-YYYY"
                value={endDay}
                onChange={onChangeEndDay}
                renderInput={(params) => <TextField {...params} sx={{ mr: 2 }} />}
              />
            </LocalizationProvider>
            <LoadingButton variant="contained" loading={loadingButton} onClick={() => {
              axios({
                url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_TRANSACTION}?fromDate=${startDay.format('YYYY-MM-DD')}&toDate=${endDay.format('YYYY-MM-DD')}`,
                method: 'GET',
                // headers: {
                //   Authorization: `Bearer ${token}`
                // }
              }).then((response) => {
                setListHistory(response.data.data);
              }).catch(error => console.log(error));
            }}>
              Tìm kiếm
            </LoadingButton>
          </div>
        </Stack> */}

        <TabPanel value={tabValue} index={0}>
          <HistoryTransactionTable value={tabValue} list={listHistory} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <HistoryTransactionTable value={tabValue} list={listHistory} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <HistoryTransactionTable value={tabValue} list={listHistory} />
        </TabPanel>

      </Container>
    </Page>
  );
}

function HistoryTransactionTable({ value }) {
  const [listHistory, setListHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [filterName, setFilterName] = useState('');

  const {
    onSort,
    page,
    rowsPerPage,
    setPage,
    onChangePage,
    onChangeRowsPerPage,
    order,
    orderBy
  } = useTable();

  console.log(listHistory);

  useEffect(() => {
    setLoadingData(true);
    TABLE_HEAD = [
      { id: 'no', label: 'No.', algin: 'left' },
      { id: 'create_date', label: 'Ngày tạo giao dịch', algin: 'left' },
      { id: 'total', label: 'Số tiền', algin: 'left' },
      { id: 'type_of_transaction', label: 'Loại giao dịch', algin: 'left' },
    ];
    if (value === 0) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WALLET}?companyId=${localStorage.getItem("company_id")}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        const walletId = response.data.data[0].id;
        axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_TRANSACTION}?walletId=${walletId}`,
          method: 'get',
          // headers: {
          //   Authorization: `Bearer ${token}`
          // }
        }).then((response) => {
          const listTransaction = response.data.data;
          setListHistory(listTransaction);
          setLoadingData(false);
        }).catch(error => console.log(error));
      }).catch(error => console.log(error));
    } else if (value === 1) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WALLET}?companyId=${localStorage.getItem("company_id")}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        const walletId = response.data.data[0].id;
        axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_TRANSACTION}?walletId=${walletId}&typeOfTransaction=Money recharge`,
          method: 'get',
          // headers: {
          //   Authorization: `Bearer ${token}`
          // }
        }).then((response) => {
          const listTransaction = response.data.data;
          setListHistory(listTransaction);
          setLoadingData(false);
        }).catch(error => console.log(error));
      }).catch(error => console.log(error));
    } else if (value === 2) {
      TABLE_HEAD = [
        { id: 'no', label: 'No.', algin: 'left' },
        { id: 'title', label: 'Tên bài viết tuyển dụng', algin: 'left' },
        { id: 'create_date', label: 'Ngày tạo giao dịch', algin: 'left' },
        { id: 'total', label: 'Số tiền', algin: 'left' },
        { id: 'type_of_transaction', label: 'Loại giao dịch', algin: 'left' },
      ];
      setListHistory([]);
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WALLET}?companyId=${localStorage.getItem("company_id")}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        const walletId = response.data.data[0].id;
        axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_TRANSACTION}?walletId=${walletId}&typeOfTransaction=Create job post`,
          method: 'get',
          // headers: {
          //   Authorization: `Bearer ${token}`
          // }
        }).then((response) => {
          const listTransaction = response.data.data || [];
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_TRANSACTION}?walletId=${walletId}&typeOfTransaction=Return money`,
            method: 'get',
            // headers: {
            //   Authorization: `Bearer ${token}`
            // }
          }).then((response) => {
            console.log(response.data.data);
            if (response.data.data?.length > 0) {
              listTransaction.push(...response.data.data);
            }
            axios({
              url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_TRANSACTION}?walletId=${walletId}&typeOfTransaction=Top up for job post`,
              method: 'get',
              // headers: {
              //   Authorization: `Bearer ${token}`
              // }
            }).then((response) => {
              if (response.data.data?.length > 0) {
                listTransaction.push(...response.data.data);
              }
              console.log(listTransaction);
              Promise.all(listTransaction.map((item) => {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${item.create_by}`,
                  method: 'get',
                  // headers: {
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then((response) => {
                  item.title = response.data.data.title;
                  setListHistory(prev => [...prev, item]);
                }).catch(error => console.log(error));
              })).then(() => {
                setTimeout(() => {
                  setLoadingData(false);
                }, 300);
              }).catch(error => console.log(error));
            });
          }).catch(error => console.log(error));
        }).catch(error => console.log(error));
      }).catch(error => console.log(error));
    }
  }, [value]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const dataFilter = applySortFilter({
    listHistory,
    filterName,
    comparator: getComparator(order, orderBy),
  });
  const dataFiltered = dataFilter?.length > 0 ? dataFilter.map((user, i) => ({ 'no': i + 1, ...user })) : [];

  return (
    <>
      {loadingData ? (<Box style={{ display: 'flex', justifyContent: 'center' }} >
        <CircularProgress />
      </Box >) : (
        <>
          <TableContainer sx={{ minWidth: 800 }} component={Paper}>
            {value === 2 && <TableToolbar filterName={filterName} onFilterName={handleFilterName} placeholder="Tìm kiếm bài viết tuyển dụng..." />}
            <Table>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                onSort={onSort}
                rowCount={dataFiltered.length}
                order={order}
                orderBy={orderBy}
              />
              <TableBody>
                {dataFiltered?.length > 0 ? dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.no} hover>
                    <TableCell>{item.no}</TableCell>
                    {value === 2 && <TableCell>{item.title}</TableCell>}
                    <TableCell>{dayjs(item.create_date).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                      {common.TYPE_OF_TRANSACTION.map((type) => {
                        if (type.value === item.type_of_transaction) {
                          if (item.type_of_transaction === 'Money recharge') {
                            return (<Chip label={type.label} color='success' />);
                          } else if (item.type_of_transaction === 'Create job post') {
                            return (<Chip label={type.label} color='secondary' />);
                          } else if (item.type_of_transaction === 'Upgrade') {
                            return (<Chip label={type.label} color='default' />);
                          } else if (item.type_of_transaction === 'Return money') {
                            return (<Chip label={type.label} color='warning' />);
                          } else if (item.type_of_transaction === 'Top up for job post') {
                            return (<Chip label={type.label} color='info' />);
                          }
                        }
                      })}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <CustomNoRowsOverlay />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage={'Số hàng mỗi trang'}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count} `}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
}

function applySortFilter({ listHistory, comparator, filterName }) {
  if (listHistory?.length > 0) {
    const stabilizedThis = listHistory.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    listHistory = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      listHistory = listHistory.filter((item) => item.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
    }
  }

  return listHistory;
}