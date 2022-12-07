import { useEffect, useState, useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
 LinearProgress, TableHead, TableRow, TableCell
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// hooks


import useTable, { getComparator, emptyRows } from '../hooks/useTable';

// components

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { api } from '../constants';
import JobPostTableRow from '../sections/@dashboard/Approval/JobPostTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '' },
  { id: 'name', label: 'Ngày tạo', align: 'left' },
  { id: 'price', label: 'Người tạo', align: 'left' },
  { id: 'price', label: 'Tiêu đề', align: 'left' },
  { id: 'quantity', label: 'Số tiền', align: 'left' },
  { id: 'quantity', label: 'Hành động', align: 'left' },
  // { id: '' }
];

// ----------------------------------------------------------------------

export default function Approval() {
  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  // const [openDialogOrder, setOpenDialogOrder] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
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
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts?status=2&companyId=${localStorage.getItem('company_id')}`,
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
      .catch((error) => console.log(error));
  }, [refreshData]);
  
  const handleJobPostRow = (id) => {

    // console.log(response.status);

    const deleteRow = tableData.filter((row) => row.id !== id);

    setTableData(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận duyệt bài tuyển dụng thành công');
    // setRefreshData(!refreshData);
    if (tableData.length === 0) {
      setRefreshData(!refreshData);

    }
  };
  const handleError = () => {

    setOpenAlert(true);
    setSeverity('error');
    setMessageAlert('Đã xảy ra lỗi.Vui lòng thử lại');
    // handleRefresh();
    // setRefreshData(!refreshData);
    setRefreshData(!refreshData);
  };
  const handleRejectJobPostRow = (id) => {

    // console.log(response.status);

    const deleteRow = tableData.filter((row) => row.id !== id);

    setTableData(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận từ chối bài tuyển dụng thành công');
    if (tableData.length === 0) {
      setRefreshData(!refreshData);

    }

  };


  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    
  });

  //   const dataFiltered = dataFiltereds.map((user, i)=> ({ 'No': i + 1, ...user }))

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length || dataFiltered.length === 0 ;

  return (
    <Page title="Xét Duyệt">
      <Container maxWidth={'lg'}>
        <HeaderBreadcrumbs
          heading="Xét duyệt bài tuyển dụng"
          links={[
            { name: 'Trang chủ', href: '/dashboard/app' },
            { name: 'Xét duyệt', href: '/dashboard/app' },

          ]}
         
        />

        <Card>
          <Divider />

          
          {loadingData ? (
            <LinearProgress fullwidth="true" />
          ) : (
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                 
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rows) => (
                      <JobPostTableRow
                        key={rows.id}
                        rows={rows}
                        
                        onReject={() => handleRejectJobPostRow(rows.id)}
                        onDeleteRow={() => handleJobPostRow(rows.id)}
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
              labelRowsPerPage={"Số hàng mỗi trang"}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count} `}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Thu nhỏ"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
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

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
