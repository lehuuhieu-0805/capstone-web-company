import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
// @mui
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Table,
  Switch,
  Button,
  Divider,
  TableBody,
  Container,
  TextField,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Alert,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl, LinearProgress, Stack
} from '@mui/material';
// routes
// hooks
import * as yup from 'yup';

import useTable, { getComparator, emptyRows } from '../hooks/useTable';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { EmployeeTableToolbar, EmployeeTableRow } from '../sections/@dashboard/employee';
import { api } from '../constants';

import { FormProvider, RHFTextField } from '../components/hook-form';
import RoleBasedGuard from '../hooks/RoleBasedGuard';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'No.', align: 'left' },
  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'left' },
  { id: 'action', label: 'Hành động', align: 'left' }
];

// ----------------------------------------------------------------------

export default function User() {
  const token = localStorage.getItem('token');
  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingButtonRegister, setLoadingButtonRegister] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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
    // onSelectRow,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/employees?status=1&companyId=${localStorage.getItem('company_id')}`,
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


  const [filterName, setFilterName] = useState('');
  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };
  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xoá thành công');
  };
  const NewUserSchema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên nhân viên'),
    email: yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
    phone: yup.string().required('Vui lòng nhập số điện thoại').matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").min(10, 'Số điện thoại không hợp lệ').max(10, 'Số điện thoại không hợp lệ'),

  });




  const defaultValues = useMemo(
    () => ({
      name: '',
      email: '',
      phone: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps

  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    setLoadingButtonRegister(true);
    console.log(data);

    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/employees`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_id: localStorage.getItem('company_id')
      }
    }).then((response) => {
      console.log(response);
      // setLoadingButtonRegister(false);
      setSeverity('success');
      setMessageAlert('Tạo nhân viên thành công');
      setOpenAlert(true);
      setRefreshData(true);
      setLoadingButtonRegister(false);
      handleCloseDialog();
    }).catch(error => {
      console.log(error);
      if (error?.response?.data?.detail.trim() === 'Email already exists!!!') {
        setLoadingButtonRegister(false);
        setSeverity('error');
        setMessageAlert('Địa chỉ email đã tồn tại trong hệ thống');
        setOpenAlert(true);
      } else {
        setLoadingButtonRegister(false);
        setSeverity('error');
        setMessageAlert('Tạo nhân viên không thành công');
        setOpenAlert(true);
      }
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const dataFiltereds = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataFiltered = dataFiltereds.map((user, i) => ({ 'No': i + 1, ...user }));

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || tableData.length === 0;

  return (
    <Page title="Nhân viên">
      <Container maxWidth="xl">
        <RoleBasedGuard hasContent roles={['COMPANY']}>
          <HeaderBreadcrumbs
            heading="Danh sách nhân viên"
            links={[
              { name: 'Trang chủ', href: '/company/dashboard' },
              { name: 'Nhân viên', href: '/company/dashboard' },

            ]}

            action={
              <Button
                variant="contained"
                component={RouterLink}
                to="#"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                Tạo nhân viên
              </Button>
            }
          />

          <Card>
            <Divider />

            <EmployeeTableToolbar filterName={filterName} onFilterName={handleFilterName} />
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
                    // onSelectAllRows={(checked) =>
                    //   onSelectAllRows(
                    //     checked,
                    //     tableData.map((row) => row.id)
                    //   )
                    // }
                    />

                    <TableBody>
                      {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <EmployeeTableRow
                          key={row.id}
                          row={row}
                          onDeleteRow={() => handleDeleteRow(row.id)}
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
            </Box>
          </Card>
        </RoleBasedGuard>
      </Container>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title" sx={{ position: 'relative' }} >Tạo nhân viên</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <RHFTextField name="name" label='Tên nhân viên' />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField name="email" label='Email' />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField name="phone" label='Số điện thoại' />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseDialog}>Huỷ</Button>
            <LoadingButton type="submit" variant="contained" loading={loadingButtonRegister}>
              Lưu
            </LoadingButton>
          </DialogActions>
        </FormProvider>

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
