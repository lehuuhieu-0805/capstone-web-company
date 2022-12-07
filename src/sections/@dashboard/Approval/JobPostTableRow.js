import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
// @mui
import {
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  IconButton,
  Button,
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CardHeader,
  Box,
  ImageList,
  ImageListItem,

} from '@mui/material';
import ModalImage from 'react-modal-image';
import Iconify from '../../../components/Iconify';
import { api } from '../../../constants';

// ----------------------------------------------------------------------

JobPostTableRow.propTypes = {
  rows: PropTypes.object,
};

export default function JobPostTableRow({ rows, onDeleteRow, onError, onReject }) {
 console.log(rows)
 const [openDialogAccept, setOpenDialogAccept] = useState(false);
 const [openDialogReject, setOpenDialogReject] = useState(false);
 const [openDialogDetail, setOpenDialogDetail] = useState(false);
 const [skillDetail, setSkillDetail] = useState([]);
 const [employee, setEmployee] = useState('');
 const [reasons, setReason] = useState('');

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

  useEffect(() => {
    rows.job_post_skills.map((jobPostSkill) => axios( {
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
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/employees/${rows.employee_id}`,
        method: 'get',
      })
        .then((response) => {
          console.log(response.data.data.name)
          setEmployee(response.data.data.name)
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

//   const handleAccept = () => {

//     axios({
//       url: `https://stg-api-itjob.unicode.edu.vn/api/v1/emails/accept/join?email=${row.email}`,
//       method: 'get',
//     })
//       .then((response) => {
     
//         onDeleteRow();
//       })
//       .catch((error) => {
//         onError();
//         console.log(error);

//       });


//   };

//   const handleReject = () => {
//     axios({
//       url: `https://stg-api-itjob.unicode.edu.vn/api/v1/emails/reject/join?email=${rows.email}`,
//       method: 'get',
//     })
//       .then((response) => {
      
//         onReject();
//       }).catch(error => {
//       console.log(error);
//       onError()

//     });
//   };
dayjs.extend(isSameOrBefore)
  const handleAccept = () => {
    if(dayjs(rows.start_time).isSameOrBefore(dayjs())){
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts/approval?id=${rows.id}`,
        method: 'put',       
        data: {
          id: rows.id,
          status: 0,
          
        }
      }).then((response) => {
        console.log(response)
        onDeleteRow();
      }).catch(error => {
        onError();
        console.log(error);
      });
    
    } else {
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts/approval?id=${rows.id}`,
        method: 'put',       
        data: {
          id: rows.id,
          status: 4,
          
        }
      }).then((response) => {
        console.log(response)
        onDeleteRow();
      }).catch(error => {
        onError();
        console.log(error);
      });
    }
        
       
        
      };
      const handleReject = () => {
        axios({
          url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts/approval?id=${rows.id}`,
          method: 'put',       
          data: {
            id: rows.id,
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
    <>
    <TableRow hover >
   
    <TableCell align="right">
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
      </TableCell>
      <TableCell align="left">{dayjs(rows.create_date).format('DD/MM/YYYY')}{'  '}{dayjs(rows.create_date).format("HH:mm:ss")}</TableCell>
      <TableCell align="left">{employee}</TableCell>
      <TableCell align="left">{rows.title}</TableCell>
      <TableCell align="left">{rows.money}</TableCell>
      
      
      <TableCell align="left">
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
        </TableCell>
    </TableRow>
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
          <DialogTitle  id="alert-dialog-title"> Xác nhận từ chối</DialogTitle>
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
                    <Grid item xs={9}>
                      <h3>{rows.title}</h3>
                      <h4  variant="subtitle2" style={{ fontWeight: 'normal' }}>
                        {dayjs(rows.create_date).format('DD-MM-YYYY HH:mm:ss')}
                      </h4>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>  {(() => {
            if (rows.status === 0) {
              return (
                <Chip label=" Hoạt Động" color="success" />
              );
            }
            if (rows.status === 1) {
              return (
                <Chip label=" Ẩn" color="primary" />
              );
            }
            if (rows.status === 2) {
              return (
                <Chip label=" Chờ duyệt" color="warning" />
              );
            }
            if (rows.status === 3) {
              return (
                <Chip label="Từ chối" color="error" />
              );
            }
            if (rows.status === 4) {
              return (
                <Chip label="Chờ hoạt động" color="warning" />
              );
            }
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
                        {rows.quantity}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Hình thức làm việc:{' '}
                        </Box>
                        {rows.working_style.name}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Địa điểm làm việc:{' '}
                        </Box>
                        {rows.working_place}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          Vị trí công việc:{' '}
                        </Box>
                        {rows.job_position.name}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>

                <Stack direction="row">
                  <ImageList variant="standard" cols={2} gap={8}>
                    {rows.album_images &&
                      rows.album_images.map((item) => (
                        <ImageListItem key={item.id}>
                          {item.url_image && <ModalImage small={item.url_image} large={item.url_image} className="modal-image1"/>}
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
                        <h4 style={{ fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: rows?.description }} />
                      </Grid>
                      <Grid item xs={6}>
                        <h4>Bắt đầu:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>{dayjs(rows.start_time).format('DD-MM-YYYY')}</h4>
                      </Grid>
                      <Grid item xs={6}>
                        <h4>Kết thúc:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>{dayjs(rows.end_time).format('DD-MM-YYYY')}</h4>
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
   </>
  );
}
