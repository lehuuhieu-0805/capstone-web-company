import { LoadingButton } from "@mui/lab";
import { Menu, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, IconButton } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MoreVert } from '@mui/icons-material';
import axios from "axios";
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../../components/AlertMessage";
import CustomNoRowsOverlay from "../../../components/CustomNoRowsOverlay";
import Iconify from "../../../components/Iconify";
import TableMoreMenu from '../../../components/TableMoreMenu';
import TableToolbar from '../../../components/TableToolbar';
import { api } from "../../../constants";
import { minusMoney } from '../../../slices/moneySlice';

export default function TableListJobPost(props) {
  const { loadingData, sortCreateDate, handleChangeSortCreateDate, listJobPost, totalRow, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage, handleEditJobPost, statusJobPost, handleOpenDialogHidden, filterName, handleFilterName, setOpenAlert, setSeverity, setAlertMessage, setRefreshData, refreshData } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  // const [openMenu, setOpenMenu] = useState();
  const [openDialogChangeDate, setOpenDialogChangeDate] = useState(false);
  const [changeDateValue, setChangeDateValue] = useState(dayjs().add(1, 'day'));
  const [openDialogRechargeMoney, setOpenDialogRechargeMoney] = useState(false);
  const [changeMoney, setChangeMoney] = useState('1.000');
  const [moneyError, setMoneyError] = useState({
    error: false,
    msg: ''
  });
  const [jobPostId, setJobPostId] = useState('');
  const [loadingButton, setLoadingButton] = useState(false);

  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    // setOpenMenu(null);
  };

  return (
    <>
      <div style={{ paddingTop: 10 }}>
        <TableToolbar filterName={filterName} onFilterName={handleFilterName} placeholder='Tìm kiếm bài viết tuyển dụng...' />
      </div>
      <Card style={loadingData ? { display: 'flex', justifyContent: 'center' } : {}}>
        {loadingData ? <CircularProgress /> :
          (
            <>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>
                      <TableCell >Tiêu đề bài viết tuyển dụng</TableCell>
                      <TableCell >
                        {listJobPost?.length > 0 ? (
                          <TableSortLabel
                            active
                            direction={sortCreateDate}
                            onClick={handleChangeSortCreateDate}
                          >
                            Ngày tạo
                          </TableSortLabel>
                        ) : 'Ngày tạo'}
                      </TableCell>
                      {statusJobPost !== 2 && statusJobPost !== 3 && (<TableCell >Ngày duyệt</TableCell>)}
                      {statusJobPost === 0 && (<TableCell >Ngày kết thúc</TableCell>)}
                      {statusJobPost === 3 && (<TableCell >Lý do</TableCell>)}
                      <TableCell>Tagent coin</TableCell>
                      <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listJobPost?.length > 0 ? listJobPost.map((jobPost, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell >{jobPost.title}</TableCell>
                        <TableCell >{dayjs(jobPost.create_date).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
                        {statusJobPost !== 2 && statusJobPost !== 3 && (<TableCell >{jobPost?.approve_date ? dayjs(jobPost.approve_date).format('DD-MM-YYYY HH:mm:ss') : null}</TableCell>)}
                        {statusJobPost === 0 && (<TableCell >{jobPost?.end_time ? dayjs(jobPost.end_time).format('DD-MM-YYYY') : null}</TableCell>)}
                        {statusJobPost === 3 && (<TableCell >{jobPost.reason}</TableCell>)}
                        <TableCell>{jobPost.money}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-haspopup="true"
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setJobPostId(jobPost.id);
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <CustomNoRowsOverlay />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {listJobPost?.length > 0 && (
                <TablePagination
                
                labelRowsPerPage={'Số hàng mỗi trang'}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count} `}
                  rowsPerPageOptions={[5, 10, 15, 20]}
                  component="div"
                  count={totalRow}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}

              <Dialog
                open={openDialogChangeDate}
                onClose={() => setOpenDialogChangeDate(false)}
                fullWidth
                maxWidth='sm'>
                <DialogTitle>
                  Thay đổi ngày kết thúc tuyển dụng
                </DialogTitle>
                <DialogContent >
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DesktopDatePicker
                      label="Ngày kết thúc tuyển dụng"
                      inputFormat="DD-MM-YYYY"
                      // disabled={disabledEndDay}
                      minDate={dayjs().add(1, 'day')}
                      value={changeDateValue}
                      onChange={(newValue) => setChangeDateValue(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                    />
                  </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => {
                    setOpenDialogChangeDate(false);
                    setChangeDateValue(dayjs().add(1, 'day'));
                  }}>
                    Huỷ
                  </Button>
                  <LoadingButton loading={loadingButton} variant="contained" onClick={() => {
                    setLoadingButton(true);
                    axios({
                      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${jobPostId}`,
                      method: 'get',
                      // headers: {
                      //   Authorization: `Bearer ${token}`,
                      // }
                    }).then((response) => {
                      const jobpost = response.data.data;
                      jobpost.end_time = changeDateValue.format('YYYY-MM-DD');
                      axios({
                        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_JOBPOST}/${jobPostId}`,
                        method: 'put',
                        // headers: {
                        //   Authorization: `Bearer ${token}`,
                        // },
                        data: jobpost
                      }).then(() => {
                        setSeverity('success');
                        setAlertMessage('Thay đổi ngày kết thúc bài viết thành công');
                        setOpenAlert(true);
                        setLoadingButton(false);
                        setOpenDialogChangeDate(false);
                        setRefreshData(!refreshData);
                        setChangeDateValue(dayjs().add(1, 'day'));
                      }).catch(error => {
                        console.log(error);
                        setSeverity('error');
                        setAlertMessage('Thay đổi ngày kết thúc bài viết thất bại');
                        setOpenAlert(true);
                        setLoadingButton(false);
                        setOpenDialogChangeDate(false);
                        setChangeDateValue(dayjs().add(1, 'day'));
                      });
                    }).catch(error => console.log(error));

                  }}>
                    Lưu
                  </LoadingButton>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openDialogRechargeMoney}
                onClose={() => setOpenDialogRechargeMoney(false)}
                fullWidth
                maxWidth='sm'>
                <DialogTitle>
                  Nạp thêm tiền cho bài viết tuyển dụng
                </DialogTitle>
                <DialogContent>
                  <TextField type='text' variant='outlined' value={changeMoney} label='Số tiền cho bài viết' fullWidth sx={{ mt: 2 }} onChange={(event) => {
                    const format1 = event.target.value.replaceAll('.', '');
                    const money = new Intl.NumberFormat().format(format1);
                    if (format1 < 1000) {
                      setMoneyError({
                        error: true,
                        msg: 'Nạp tối thiểu là 1.000 Tagent coin'
                      });
                    } else {
                      setMoneyError({
                        error: false,
                        msg: ''
                      });
                    }
                    const format2 = money.replaceAll(',', '.');
                    setChangeMoney(format2);
                  }} />
                  {moneyError.error && <p style={{ color: 'red' }}>*{moneyError.msg}</p>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => {
                    setOpenDialogRechargeMoney(false);
                    setChangeMoney('1.000');
                    setMoneyError({
                      error: false,
                      msg: ''
                    });
                  }}>
                    Huỷ
                  </Button>
                  <LoadingButton loading={loadingButton} variant="contained" onClick={() => {
                    setLoadingButton(true);
                    axios({
                      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_UPDATE_MONEY}/${jobPostId}`,
                      method: 'put',
                      data: {
                        id: jobPostId,
                        money_for_job_post: changeMoney.replace('.', '')
                      }
                    }).then(() => {
                      setSeverity('success');
                      setAlertMessage(`Nạp ${changeMoney} Tagent coin vào bài viết thành công`);
                      setOpenAlert(true);
                      setLoadingButton(false);
                      setRefreshData(!refreshData);
                      setOpenDialogRechargeMoney(false);
                      const action = minusMoney(changeMoney.replace('.', ''));
                      dispatch(action);
                    }).catch(error => {
                      console.log(error);
                      setSeverity('error');
                      setAlertMessage('Số dư trong ví không đủ');
                      setOpenAlert(true);
                      setLoadingButton(false);
                      setOpenDialogRechargeMoney(false);
                    });
                  }}>
                    Lưu
                  </LoadingButton>
                </DialogActions>
              </Dialog>

              <Menu
                open={open}
                onClose={handleCloseMenu}
                anchorEl={anchorEl}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {statusJobPost === 0 ? <>
                  <MenuItem onClick={() => {
                    setOpenDialogChangeDate(true);
                    setAnchorEl(null);
                  }} sx={{ color: 'blue' }}>
                    <Iconify icon='mdi:clipboard-text-date-outline' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
                    Gia hạn
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setOpenDialogRechargeMoney(true);
                    setAnchorEl(null);
                  }} sx={{ color: 'red' }}>
                    <Iconify icon='uil:money-insert' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
                    Nạp tiền
                  </MenuItem>
                </> : null}
                {statusJobPost === 0 || statusJobPost === 4 || statusJobPost === 2 ? (
                  <MenuItem onClick={() => {
                    handleOpenDialogHidden(jobPostId);
                    setAnchorEl(null);
                  }} >
                    <Iconify icon='dashicons:hidden' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
                    Ẩn
                  </MenuItem>
                ) : null}
                {statusJobPost === 2 ? (
                  <MenuItem onClick={() => {
                    setAnchorEl(null);
                    navigate(`/dashboard/job-post/edit/${jobPostId}`);
                  }} sx={{ color: 'blue' }}>
                    <Iconify icon='ant-design:edit-outlined' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
                    Chỉnh sửa
                  </MenuItem>
                ) : null}
                {statusJobPost === 1 || statusJobPost === 3 ? (
                  <MenuItem onClick={() => {
                    setAnchorEl(null);
                    navigate(`/dashboard/job-post/create?jobPostId=${jobPostId}`);
                  }} >
                    <Iconify icon='system-uicons:reuse' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
                    Sử dụng lại
                  </MenuItem>
                ) : null}
                <MenuItem onClick={() => {
                  navigate(`/dashboard/job-post/detail/${jobPostId}`);
                  setAnchorEl(null);
                }} sx={{ color: 'green' }}>
                  <Iconify icon='akar-icons:info' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
                  Xem thông tin
                </MenuItem>
              </Menu>
            </>
          )
        }
      </Card>
    </>
  );
}