import { useEffect, useState } from 'react';

import axios from 'axios';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Divider,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Snackbar,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Stack,
  TextField,
  InputAdornment,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';

// hooks
import useTabs from '../hooks/useTabs';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';

// components
import Label from '../components/Label';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { api } from '../constants';
import Iconify from '../components/Iconify';
import JobpostComanyTableRow from '../sections/jobpostCompany/JobpostCompanyRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'No.', align: 'left' },
  { id: 'title', label: 'Tiêu đề', align: 'left' },
  { id: 'create_date', label: 'Ngày tạo', align: 'left' },
  { id: 'employee', label: 'Người tạo', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'action', label: 'Hành động', align: 'left' },
];

const TABLE_HEAD_FOR_APPROVE = [
  { id: 'no', label: 'No.', align: 'left' },
  { id: 'title', label: 'Tiêu đề', align: 'left' },
  { id: 'create_date', label: 'Ngày tạo', align: 'left' },
  { id: 'employee', label: 'Người tạo', align: 'left' },
  { id: 'money', label: 'Tagent coin', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'action', label: 'Hành động', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CompanyJobPost() {
  const [tableData, setTableData] = useState([]);
  // const [loadingButton, setLoadingButton] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshdata, setRefreshData] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');

  const [openAlert, setOpenAlert] = useState(false);
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(5);
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  useEffect(() => {
    // setLoadingButton(true)
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts?companyId=${localStorage.getItem('company_id')}`,
      method: 'get',
    })
      .then((response) => {
        if (response.data === "") {
          setTableData([]);
          setLoadingData(false);
          console.log(response);
          setRefreshData(false);
        } else {
          setTableData(response.data.data);
          setLoadingData(false);
          console.log(response);
          setRefreshData(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshdata]);

  const handleJobPostRow = (id) => {

    // console.log(response.status);

    const deleteRow = tableData.filter((row) => row.id !== id);

    setTableData(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận duyệt bài tuyển dụng thành công');
    // setRefreshData(!refreshData);
    if (tableData.length === 0) {
      setRefreshData(!refreshdata);

    }
  };
  const handleError = () => {

    setOpenAlert(true);
    setSeverity('error');
    setMessageAlert('Đã xảy ra lỗi.Vui lòng thử lại');
    // handleRefresh();
    // setRefreshData(!refreshData);
    setRefreshData(!refreshdata);
  };
  const handleRejectJobPostRow = (id) => {

    // console.log(response.status);

    const deleteRow = tableData.filter((row) => row.id !== id);

    setTableData(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận từ chối bài tuyển dụng thành công');
    if (tableData.length === 0) {
      setRefreshData(!refreshdata);

    }

  };
  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };


  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const TABS = [
    // { value: 5, label: 'Tất cả', color: 'info', count: tableData.length },
    { value: 0, label: 'Đang hoạt động', color: 'error', count: getLengthByStatus(0) },
    { value: 4, label: 'Chờ hoạt động', color: 'error', count: getLengthByStatus(4) },
    { value: 1, label: 'Đã ẩn', color: 'success', count: getLengthByStatus(1) },
    { value: 2, label: 'Đang đợi duyệt', color: 'warning', count: getLengthByStatus(2) },
  ];

  console.log(dataFiltered.length === 0);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || dataFiltered.length === 0;

  return (
    <Page title="Ứng viên">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Bài viết tuyển dụng"
          links={[
            { name: 'Trang chủ', href: 'PATH_DASHBOARD.general.one' },
            { name: 'Bài viết tuyển dụng', href: ' ' },
          ]}
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                // icon={<Label color={tab.color}> {tab.count} </Label>}
                label={<Typography variant="h7" component="div">
                  <Label color={tab.color}> {tab.count}  </Label>
                  {tab.label}
                </Typography>}
              />
            ))}
          </Tabs>
          <Divider />


          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>


            <TextField
              fullWidth
              value={filterName}
              onChange={(event) => handleFilterName(event.target.value)}
              placeholder="Tìm kiếm bài tuyển dụng..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>

                ),
              }}
            />
          </Stack>
          {loadingData ? (
            <LinearProgress fullwidth="true" />
          ) : (
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={filterStatus === 2 ? TABLE_HEAD_FOR_APPROVE : TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (

                      <JobpostComanyTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        filterStatus={filterStatus}
                        onReject={() => handleRejectJobPostRow(row.id)}
                        onDeleteRow={() => handleJobPostRow(row.id)}
                        onError={() => handleError()}
                      />

                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          )}
          <Box sx={{ position: 'relative' }}>
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

            {/* <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Thu nhỏ"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            /> */}
          </Box>
        </Card>
      </Container>

    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterStatus !== 5) {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
//--------------------------------------------------------------------------
