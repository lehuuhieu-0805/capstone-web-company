/* eslint-disable no-nested-ternary */
// material
import {
  Alert,
  Avatar, Button, Card, CardContent, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, Snackbar, Stack, Table, TableBody,
  TableCell, TableContainer,
  TableHead,
  TablePagination,
  // Button,
  // Checkbox,
  TableRow, Typography
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { api } from '../constants';

export default function ProfileApplicant() {
  const [listProfileApplicant, setListProfileApplicant] = useState([]);
  const [listJobPosition, setListJobPosition] = useState([]);
  const [listWorkingStyle, setListWorkingStyle] = useState([]);
  const [listProfileApplicantSkill, setListProfileApplicantSkill] = useState([]);
  const [listJobPost, setListJobPost] = useState([]);
  const [isSelectJobPost, setIsSelectJobPost] = useState({
    isSelect: false,
    jobPostId: ''
  });
  const [listJobPostSkill, setListJobPostSkill] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [profileApplicant, setProfileApplicant] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [totalRow, setTotalRow] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT}?page-size=${rowsPerPage}&page=${page + 1}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      setTotalRow(response.data.paging.total);
      const listProfileApplicantTemp = response.data.data;

      axios({
        method: "get",
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
        // header: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        const listSkill = response.data.data;

        axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_SKILL}`,
          method: 'get',
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // }
        }).then((response) => {
          response.data.data.forEach((profileApplicantSkill) => {
            listSkill.forEach((skill) => {
              if (profileApplicantSkill.skill_id === skill.id) {
                profileApplicantSkill.skill_name = skill.name;
              }
            });
          });
          setListProfileApplicantSkill(response.data.data);
        }).catch(error => console.log(error));

      }).catch(error => console.log(error));


      Promise.all(response.data.data.map((profileApplicant) => axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${profileApplicant.applicant_id}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        listProfileApplicantTemp.forEach((profileApplicant) => {
          if (profileApplicant.applicant_id === response.data.data.id) {
            profileApplicant.name = response.data.data.name;
            profileApplicant.phone = response.data.data.phone;
            profileApplicant.email = response.data.data.email;
            profileApplicant.avatar = response.data.data.avatar;
            profileApplicant.gender = response.data.data.gender;
            profileApplicant.dob = response.data.data.dob;
          }
        });
      }).catch((error) => console.log(error)))
      ).then(() => {
        setListProfileApplicant(listProfileApplicantTemp);
      }).catch((error) => console.log(error));

    }).catch(error => console.log(error));
  }, [page, rowsPerPage]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}`,
      // header: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      setListJobPosition(response.data.data);
    }).catch(error => console.log(error));
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WORKINGSTYLE}`,
      // header: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      setListWorkingStyle(response.data.data);
    }).catch(error => console.log(error));
  }, []);

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?companyId=${localStorage.getItem('company_id')}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      const listJobPost = response.data.data;
      setListJobPost(response.data.data);

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        const listSkill = response.data.data;

        Promise.all(listJobPost.map((jobPost) => axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSTSKILL}?jobPostId=${jobPost.id}`,
          method: 'get',
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // }
        }).then((response) => {
          response.data.data.forEach((jobPostSkill) => {
            listSkill.forEach((skill) => {
              if (skill.id === jobPostSkill.skill_id) {
                jobPostSkill.skill_name = skill.name;
              }
            });
          });
          listJobPostSkill.push(...response.data.data);
        }).catch(error => console.log(error))))
          .then(() => {
            setLoadingData(true);
          }).catch(error => console.log(error));

      });
    }).catch(error => console.log(error));
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialog = (profileApplicantId) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT}/${profileApplicantId}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      console.log(response.data.data);
      setProfileApplicant();
      const profileApplicantTemp = response.data.data;
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${profileApplicantTemp.applicant_id}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        profileApplicantTemp.name = response.data.data.name;
        profileApplicantTemp.phone = response.data.data.phone;
        profileApplicantTemp.email = response.data.data.email;
        profileApplicantTemp.avatar = response.data.data.avatar;
        profileApplicantTemp.gender = response.data.data.gender;
        profileApplicantTemp.dob = response.data.data.dob;
        profileApplicantTemp.address = response.data.data.address;
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_SKILL}?profileApplicantId=${profileApplicantId}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        const profileApplicantSkill = response.data.data;

        profileApplicantTemp.skill = [];
        if (profileApplicantSkill?.length > 0) {
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
            method: 'get',
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // }
          }).then((response) => {
            const listSkill = response.data.data;

            profileApplicantSkill.forEach((profileApplicantSkill) => {
              listSkill.forEach((skill) => {
                if (skill.id === profileApplicantSkill.skill_id) {
                  profileApplicantTemp.skill.push({
                    skill_level: profileApplicantSkill.skill_level,
                    skill_name: skill.name
                  });
                }
              });
            });
            setProfileApplicant(profileApplicantTemp);
            setOpenDialog(true);
          }).catch(error => console.log(error));
        } else {
          setProfileApplicant(profileApplicantTemp);
          setOpenDialog(true);
        }

      }).catch(error => console.log(error));

    }).catch(error => console.log(error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(listJobPosition.length, listJobPost.length, listWorkingStyle.length, listJobPostSkill.length);

  return (
    <Page title="User">
      <Container>
        {isSelectJobPost.isSelect ? (
          <>
            <HeaderBreadcrumbs
              heading='Hồ sơ ứng viên'
              links={[
                { name: 'Trang chủ', href: '/dashboard/app' },
                { name: 'Hồ sơ ứng viên', href: '/dashboard/profile-applicant' },
              ]}
            />
            <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={2}>
              <Button variant="outlined" onClick={() => setIsSelectJobPost({ isSelect: false, jobPostId: '' })}>
                Chọn bài viết tuyển dụng khác
              </Button>
            </Stack>
            <Card>
              <Scrollbar>
                {listProfileApplicant.length > 0 && listJobPosition.length > 0 && listWorkingStyle.length > 0 && listProfileApplicantSkill.length > 0 ? (
                  <>
                    <TableContainer sx={{ minWidth: 800 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Địa chỉ email</TableCell>
                            <TableCell>Kĩ năng</TableCell>
                            <TableCell>Vị trí công việc</TableCell>
                            <TableCell>Hình thức làm việc</TableCell>
                            <TableCell>Hành động</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listProfileApplicant.map((profileApplicant, index) => (
                            <TableRow
                              hover
                              key={index}
                              tabIndex={-1}
                            >

                              <TableCell align="left">{index + 1}</TableCell>
                              <TableCell component="th" scope="row" padding="normal">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar alt={index} src={profileApplicant.avatar} />
                                  <Typography variant="subtitle2" noWrap>
                                    {profileApplicant.name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{profileApplicant.email}</TableCell>
                              <TableCell align="left">
                                <ul>
                                  {listProfileApplicantSkill.map((profileApplicantSkill, index) => profileApplicantSkill.profile_applicant_id === profileApplicant.id ? (<li key={index}>{profileApplicantSkill.skill_name} - {profileApplicantSkill.skill_level}</li>) : null)}
                                </ul>
                              </TableCell>
                              {profileApplicant?.job_position_id ? listJobPosition.map((item) => item.id === profileApplicant.job_position_id ? <TableCell align="left">{item.name}</TableCell> : null) : <TableCell align="left">{null}</TableCell>}
                              {profileApplicant?.working_style_id ? listWorkingStyle.map((item) => item.id === profileApplicant.working_style_id ? <TableCell align="left">{item.name}</TableCell> : null) : <TableCell align="left">{null}</TableCell>}
                              <TableCell align="right" style={{ display: 'flex', alignItems: 'center' }}>
                                <Iconify icon='akar-icons:info' width={22} height={22} style={{ cursor: 'pointer', color: 'green' }} onClick={() => handleDialog(profileApplicant.id)} />
                                <Button variant='contained' style={{ marginRight: 10 }} onClick={() => {
                                  axios({
                                    url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_LIKE}`,
                                    method: 'post',
                                    // headers: {
                                    //   Authorization: `Bearer ${token}`,
                                    // }
                                    data: {
                                      profile_applicant_id: profileApplicant.id,
                                      job_post_id: isSelectJobPost.jobPostId,
                                      is_job_post_like: 1,
                                      is_applicant_like: 0
                                    }
                                  }).then(() => {
                                    setOpenAlert(true);
                                  }).catch(error => console.log(error));
                                }}>Thích</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
                  </>
                ) : <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>}
              </Scrollbar>
            </Card>
          </>
        ) : listJobPosition.length > 0 && listJobPost.length > 0 && listWorkingStyle.length > 0 && listJobPostSkill.length > 0 && loadingData ? (
          <>
            <HeaderBreadcrumbs
              heading='Chọn bài viết tuyển dụng'
              links={[
                { name: 'Trang chủ', href: '/dashboard/app' },
                { name: 'Chọn bài viết tuyển dụng', href: '/dashboard/profile-applicant' },
              ]}
            />
            <Grid container spacing={4}>
              {listJobPost.map((jobPost, index) => (
                <Grid key={index} item xs={6} >
                  <Card sx={{
                    '&:hover': {
                      cursor: 'pointer',
                    }
                  }} onClick={() => {
                    setIsSelectJobPost({ isSelect: true, jobPostId: jobPost.id });
                  }}>
                    <CardContent>
                      <Typography variant='body1' gutterBottom>Tiêu đờ bài tuyển dụng: {jobPost.title}</Typography>
                      <Typography variant='body1' gutterBottom>Mô tả: {jobPost.description}</Typography>
                      <Typography variant='body1' gutterBottom>Ngày bắt đầu tuyển dụng: {dayjs(jobPost.start_time).format('DD-MM-YYYY')}</Typography>
                      <Typography variant='body1' gutterBottom>Ngày kết thúc tuyển dụng: {dayjs(jobPost.end_time).format('DD-MM-YYYY')}</Typography>
                      {listJobPosition.map((jobPosition) => jobPosition.id === jobPost.job_position_id ? <Typography variant='body1' gutterBottom>Vị trí công việc: {jobPosition.name}</Typography> : null)}
                      {listWorkingStyle.map((workingStyle) => workingStyle.id === jobPost.working_style_id ? <Typography variant='body1' gutterBottom>Hình thức làm việc: {workingStyle.name}</Typography> : null)}
                      <div style={{ display: 'flex', }}>
                        <Typography variant='body1' gutterBottom style={{ marginRight: 30 }}>Kĩ năng:</Typography>
                        <ul>
                          {listJobPostSkill.map((jobPostSkill, index) => jobPostSkill.job_post_id === jobPost.id ? <li key={index}>{jobPostSkill.skill_name} - {jobPostSkill.skill_level}</li> : null)}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>) : <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>}
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <DialogTitle id="alert-dialog-title">
            Thông tin ứng viên
          </DialogTitle>
          <Iconify icon='ant-design:close-circle-outlined' sx={{
            width: 30, height: 30, marginRight: 2, '&:hover': {
              cursor: 'pointer',
            }
          }} onClick={handleCloseDialog} />
        </Stack>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar alt='hinhanh' src={profileApplicant?.avatar} sx={{ width: 100, height: 100 }} imgProps={{ objectfit: 'contain' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>Tên: {profileApplicant?.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>Ngày tháng năm sinh: {dayjs(profileApplicant?.dob).format('DD-MM-YYYY')}</Typography>
            </Grid>
            <Grid item xs={12}>
              {(() => {
                if (profileApplicant?.gender === 0) {
                  return (<Typography variant='body1' gutterBottom>Giới tính: Nữ</Typography>);
                }
                if (profileApplicant?.gender === 1) {
                  return (<Typography variant='body1' gutterBottom>Giới tính: Nam</Typography>);
                }
                if (profileApplicant?.gender === 2) {
                  return (<Typography variant='body1' gutterBottom>Giới tính: Khác</Typography>);
                }
              })()}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>Số điện thoại: {profileApplicant?.phone}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>ĝịa chỉ email: {profileApplicant?.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>ĝịa chỉ: {profileApplicant?.address}</Typography>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex' }}>
              <Typography variant='body1' gutterBottom style={{ marginRight: 30 }}>Kĩ năng:</Typography>
              <ul>
                {profileApplicant?.skill.map((skill, index) => <li key={index}>{skill.skill_name} - {skill.skill_level}</li>)}
              </ul>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>Trường hờc: {profileApplicant?.education}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>Github link: {profileApplicant?.github_link}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>Linkedin link: {profileApplicant?.linkedin_link}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' gutterBottom>Facebook link: {profileApplicant?.facebook_link}</Typography>
            </Grid>
            <Grid item xs={12}>
              {listJobPosition.map((jobPosition) => jobPosition.id === profileApplicant?.job_position_id ? <Typography variant='body1' gutterBottom>Vị trí công việc: {jobPosition.name}</Typography> : null)}
            </Grid>
            <Grid item xs={12}>
              {listWorkingStyle.map((workingStyle) => workingStyle.id === profileApplicant?.working_style_id ? <Typography variant='body1' gutterBottom>Hình thức làm việc: {workingStyle.name}</Typography> : null)}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Snackbar open={openAlert} autoHideDuration={5000} onClose={() => setOpenAlert(false)} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
        <Alert onClose={() => setOpenAlert(false)} severity='success' sx={{ width: '100%' }} variant='filled'>
          Bạn đã thích hồ sơ ứng viên thành công!
        </Alert>
      </Snackbar>
    </Page>
  );
}
