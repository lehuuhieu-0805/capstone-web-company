/* eslint-disable consistent-return */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { MoreVert } from '@mui/icons-material';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Avatar,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,

  Tooltip,
  Card,
  CardContent,
  Chip,
  Stack,
  CardHeader,
  Box,
  ImageList,
  ImageListItem,
  DialogContentText,
  TextField,
  Menu,
} from '@mui/material';
import { useDispatch } from 'react-redux';
// components
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import { TableMoreMenu } from '../../components/table';
import { api } from '../../constants';
import { minusMoney } from '../../slices/moneySlice';

// ----------------------------------------------------------------------

JobpostComanyTableRow.propTypes = {
  row: PropTypes.object,
};

export default function JobpostComanyTableRow({ row, onDeleteRow, onError, onReject, index, statusJobPost }) {
  const token = localStorage.getItem('token');

  const theme = useTheme();
  const [skillDetail, setSkillDetail] = useState([]);
  const [employee, setEmployee] = useState('');
  const [openDialogAccept, setOpenDialogAccept] = useState(false);
  const [openDialogReject, setOpenDialogReject] = useState(false);
  const [reasons, setReason] = useState('');
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setReason(event.target.value);
  };
  const handleCloseDialogAccept = () => {
    setOpenDialogAccept(false);
  };
  const handleCloseDialogReject = () => {
    setOpenDialogReject(false);
  };

  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    row.job_post_skills.map((jobPostSkill) => axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}/${jobPostSkill.skill_id}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setSkillDetail(prevState => ([...prevState, {
        skill: response.data.data.name,
        skillLevel: jobPostSkill.skill_level
      }]));
    }).catch(error => console.log(error)));
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/employees/${row.employee_id}`,
      method: 'get',
    })
      .then((response) => {
        console.log(response.data.data.name);
        setEmployee(response.data.data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [row.job_post_skills]);
  dayjs.extend(isSameOrBefore);
  console.log(dayjs(row.end_time).isSameOrBefore(dayjs()));
  const handleAccept = () => {
    if (dayjs(row.start_time).isSameOrBefore(dayjs())) {
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts/approval?id=${row.id}`,
        method: 'put',
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          id: row.id,
          status: 0,

        }
      }).then((response) => {
        console.log(response);
        onDeleteRow();
        const action = minusMoney(row.money);
        dispatch(action);
      }).catch(error => {
        onError();
        console.log(error);
      });

    } else {
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts/approval?id=${row.id}`,
        method: 'put',
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          id: row.id,
          status: 4,

        }
      }).then((response) => {
        console.log(response);
        onDeleteRow();
        const action = minusMoney(row.money);
        dispatch(action);
      }).catch(error => {
        onError();
        console.log(error);
      });
    }



  };
  const handleReject = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts/approval?id=${row.id}`,
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        id: row.id,
        reason: reasons,
        status: 3,
      }
    }).then((response) => {
      onReject();
    }).catch(error => {
      onError();
      console.log(error);
    });
  };

  return (
    <TableRow>
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell align="left" style={{ maxWidth: 400, overflow: 'hidden' }}>{row.title}</TableCell>
      <TableCell align="left">{dayjs(row.create_date).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
      <TableCell align="left">{dayjs(row.start_time).format('DD-MM-YYYY')}</TableCell>
      <TableCell align="left">{dayjs(row.end_time).format('DD-MM-YYYY')}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {employee}
      </TableCell>
      {statusJobPost === 3 ? (
        <TableCell align="left">{row.reason}</TableCell>
      ) : null}
      {statusJobPost === 2 ? (
        <TableCell align="left">{row.money}</TableCell>
      ) : null}
      <TableCell align="left">
        {(() => {
          if (row.status === 0) {
            return (
              <Label

                color={'info'}
                sx={{ textTransform: 'capitalize' }}
              >
                Đang hoạt Động
              </Label>

            );
          }
          if (row.status === 1) {
            return (
              <Label

                color={'warning'}
                sx={{ textTransform: 'capitalize' }}
              >
                Đã hết hạn
              </Label>

            );
          }
          if (row.status === 2) {
            return (
              <Label

                color={'info'}
                sx={{ textTransform: 'capitalize' }}
              >
                Đang duyệt
              </Label>

            );
          }
          if (row.status === 3) {
            return (
              <Label

                color={'error'}
                sx={{ textTransform: 'capitalize' }}
              >
                Từ chối
              </Label>

            );
          }
          if (row.status === 4) {
            return (
              <Label

                color={'info'}
                sx={{ textTransform: 'capitalize' }}
              >
                Chờ Hoạt Động
              </Label>

            );
          }
        })()}
      </TableCell>

      {/* <TableCell align="left">
        <Tooltip title="Xem chi tiết">
          <IconButton
            onClick={() => {
              setOpenDialogDetail(true);
            }}
            color="info"
          >
            <Iconify icon={'carbon:view-filled'} color="success" width={20} height={20} />
          </IconButton>
        </Tooltip>
        {(() => {
          if (statusJobPost === 2 && row.status === 2) {
            // if (row.status === 2) {
            return (<>
              <Tooltip title="Duyệt">
                <IconButton
                  onClick={() => {
                    setOpenDialogAccept(true);
                  }}
                  color="info"
                >
                  <Iconify icon={'line-md:circle-twotone-to-confirm-circle-twotone-transition'} color={'lawngreen'} width={20} height={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Từ chối">
                <IconButton
                  onClick={() => {
                    setOpenDialogReject(true);
                  }}
                  color="info"
                >
                  <Iconify icon={'bx:block'} color="#EE4B2B" width={20} height={20} />
                </IconButton>
              </Tooltip>
            </>
            );
          }
          // if (row.status === 2) {
          //   return (<>
          //     <Tooltip title="Duyệt">
          //       <IconButton
          //         onClick={() => {
          //           setOpenDialogAccept(true);
          //         }}
          //         color="info"
          //       >
          //         <Iconify icon={'line-md:circle-twotone-to-confirm-circle-twotone-transition'} color={'lawngreen'} width={20} height={20} />
          //       </IconButton>
          //     </Tooltip>
          //     <Tooltip title="Từ chối">
          //       <IconButton
          //         onClick={() => {
          //           setOpenDialogReject(true);
          //         }}
          //         color="info"
          //       >
          //         <Iconify icon={'bx:block'} color="#EE4B2B" width={20} height={20} />
          //       </IconButton>
          //     </Tooltip>
          //   </>
          //   );
          // }


        })()}
      </TableCell> */}
      <TableCell align="center">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-haspopup="true"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          <MoreVert />
        </IconButton>
      </TableCell>
      <Dialog
        open={openDialogDetail}
        onClose={handleCloseDialogDetail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle id="alert-dialog-title">Thông tin bài tuyển dụng</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>

                    <Grid item xs={10}>
                      <h3>{row.title}</h3>
                      <h4 style={{ fontWeight: 'normal' }}>
                        {dayjs(row.create_date).format('DD-MM-YYYY HH:mm:ss')}
                      </h4>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {(() => {
                        if (row.status === 0) {
                          return (
                            <Chip
                              label="Đang hoạt động"
                              color="info"
                            />
                          );
                        }
                        if (row.status === 1) {
                          return (
                            <Chip
                              label='Đã hết hạn'
                              color='warning'
                            />
                          );
                        }
                        if (row.status === 2) {
                          return (
                            <Chip
                              label='Đang duyệt'
                              color='info'
                            />
                          );
                        }
                        if (row.status === 4) {
                          return (
                            <Chip
                              label='Chờ hoạt động'
                              color='info'
                            />
                          );
                        }
                        return (
                          <Chip
                            label='Từ chối'
                            color='error'
                          />
                        );
                      })()}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader title="Thông tin" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Số lượng tuyển:{' '}
                        </Box>
                        {row.quantity}
                      </Typography>

                    </Stack>
                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Hình thức làm việc:{' '}
                        </Box>
                        {row.working_style.name}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Địa điểm làm việc:{' '}
                        </Box>
                        {row.working_place}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Vị trí công việc:{' '}
                        </Box>
                        {row.job_position.name}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Số tiền:{' '}
                        </Box>
                        {row.money}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
                <Typography variant="subtitle1">Hình ảnh</Typography>
                <Stack direction="row">

                  <ImageList variant="quilted" cols={2} gap={8}>
                    {row.album_images &&
                      row.album_images.map((item) => (
                        <ImageListItem key={item.id}>
                          {item.url_image &&


                            <ModalImage small={`${item.url_image}?w=164&h=164&fit=crop&auto=format`} medium={item.url_image} />

                          }
                        </ImageListItem>
                      ))}
                  </ImageList>

                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader title="Giới thiệu" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h4>Mô tả:</h4>
                        <h4 style={{ fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: row.description }} />
                      </Grid>
                      <Grid item xs={6}>
                        <h4>Bắt đầu:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>
                          {dayjs(row.start_time).format('DD-MM-YYYY')}
                        </h4>
                      </Grid>
                      <Grid item xs={6}>
                        <h4>Kết thúc:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>{dayjs(row.end_time).format('DD-MM-YYYY')}</h4>
                      </Grid>
                    </Grid>
                  </Stack>
                </Card>
                <Card>
                  <CardHeader title="Kỹ năng yêu cầu" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    {skillDetail &&
                      skillDetail.map((element) => (
                        <Stack key={element.id} spacing={15} direction="row">
                          <Typography variant="body2">-Ngôn ngữ: {element.skill}</Typography>
                          <Typography variant="body2">Trình độ : {element.skillLevel}</Typography>
                        </Stack>
                      ))}
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDetail} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialogAccept}
        onClose={handleCloseDialogAccept}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title"> Xác nhận duyệt</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogAccept} variant="outlined" color="inherit">
            Huỷ
          </Button>
          <Button
            onClick={() => {

              handleAccept();
              handleCloseDialogAccept();
            }}
            variant="contained"
            color="primary"
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialogReject}
        onClose={handleCloseDialogReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title"> Xác nhận từ chối</DialogTitle>
        <DialogContent sx={{ pt: 2 }} >
          <DialogContentText id="alert-dialog-slide-description">
            &nbsp;
          </DialogContentText>
          <TextField
            id="outlined-name"
            label="Lý do"
            value={reasons}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogReject} variant="outlined" color="inherit">
            Huỷ
          </Button>
          <Button
            onClick={() => {

              handleReject();
              handleCloseDialogReject();
            }}
            variant="contained"
            color="primary"
          >
            Từ chối
          </Button>
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
        <MenuItem onClick={() => {
          setOpenDialogDetail(true);
          setAnchorEl(null);
        }} sx={{ color: 'green' }}>
          <Iconify icon='akar-icons:info' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
          Xem thông tin
        </MenuItem>
        {statusJobPost === 2 ? (
          <>
            <MenuItem onClick={() => {
              setOpenDialogAccept(true);
              setAnchorEl(null);
            }} sx={{ color: 'blue' }}>
              <Iconify icon='mdi:approve' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
              Duyệt
            </MenuItem>
            <MenuItem onClick={() => {
              setOpenDialogReject(true);
              setAnchorEl(null);
            }} sx={{ color: 'red' }}>
              <Iconify icon='material-symbols:cancel' width={22} height={22} style={{ cursor: 'pointer', marginRight: 10 }} />
              Từ chối
            </MenuItem>
          </>
        ) : null}
      </Menu>
    </TableRow>
  );
}
