/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { LoadingButton } from "@mui/lab";
import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import AlertMessage from "../components/AlertMessage";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
import Page from "../components/Page";
import { api, common } from "../constants";

export default function Block() {
  const [loadingData, setLoadingData] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [listApplicant, setListApplicant] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [totalRow, setTotalRow] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [reloadData, setReloadData] = useState(false);
  const [applicantId, setApplicantId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setListApplicant([]);
    setLoadingData(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_BLOCK}?companyId=${localStorage.getItem('company_id')}&blockBy=${localStorage.getItem('company_id')}&page-size=${rowsPerPage}&page=${page + 1}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      response.data.data?.forEach((item) => {
        axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${item.applicant_id}`,
          method: 'get',
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // }
        }).then((response) => {
          setListApplicant((prev) => [...prev, response.data.data]);
        }).catch(error => console.log(error));
      });
      setLoadingData(false);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_BLOCK}?companyId=${localStorage.getItem('company_id')}&blockBy=${localStorage.getItem('company_id')}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      setTotalRow(response.data.data?.length);
    }).catch(error => console.log(error));

  }, [page, rowsPerPage, reloadData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUnblockButton = () => {
    setLoadingButton(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_BLOCK}?companyId=${localStorage.getItem('company_id')}&blockBy=${localStorage.getItem('company_id')}&applicantId=${applicantId}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.DELETE_BLOCK}/${response.data.data[0].id}`,
        method: 'delete',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then(() => {
        setSeverity('success');
        setAlertMessage('Bỏ chặn ứng viên thành công');
        setOpenAlert(true);
        setLoadingButton(false);
        setOpenDialog(false);
        setReloadData(!reloadData);
      }).catch(error => {
        console.log(error);
        setSeverity('error');
        setAlertMessage('Có lỗi xảy ra');
        setOpenAlert(true);
        setLoadingButton(false);
        setOpenDialog(false);
        setReloadData(!reloadData);
      });
    }).catch(error => console.log(error));
  };

  return (
    <Page title='Ứng viên bị chặn'>
      <Container maxWidth='xl'>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <HeaderBreadcrumbs
            heading="Ứng viên bị chặn"
            links={[
              { name: 'Trang chủ', href: '/dashboard/app' },
              { name: 'Ứng viên bị chặn', href: '/dashboard/block' },
            ]}
          />
        </Stack>

        {loadingData ? (
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ minWidth: 800 }} component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell align='right'>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listApplicant?.length > 0 ? listApplicant.map((applicant, index) => (
                    <TableRow
                      hover
                      key={index}
                      tabIndex={-1}
                    >
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell component="th" scope="row" padding="normal">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={index.toString()} src={applicant.avatar} />
                          <Typography variant="subtitle2" noWrap>
                            {applicant.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{applicant.email}</TableCell>
                      <TableCell align="left">{applicant.phone}</TableCell>
                      {common.GENDER.map((gender) => {
                        if (gender.value === applicant.gender) {
                          return (<TableCell align="left">{gender.label}</TableCell>);
                        }
                      })}
                      <TableCell align="left">{applicant.address}</TableCell>
                      <TableCell align="right" style={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant='contained' style={{ marginRight: 10 }} onClick={() => {
                          setOpenDialog(true);
                          setApplicantId(applicant.id);
                        }}>Bỏ chặn</Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <CustomNoRowsOverlay />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {listApplicant?.length > 0 && (
              <TablePagination
              labelRowsPerPage={'Số hàng mỗi trang'}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count} `}
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                component="div"
                count={totalRow}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
            <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} severity={severity} />
          </>
        )}

        <Dialog open={openDialog}>
          <DialogTitle>
            {"Bạn có chắc chắn muốn bỏ chặn ứng viên này?"}
          </DialogTitle>
          <DialogActions>
            <Button variant='outlined' onClick={() => setOpenDialog(false)}>Huỷ</Button>
            <LoadingButton loading={loadingButton} variant='contained' onClick={handleUnblockButton}>Xác nhận</LoadingButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}