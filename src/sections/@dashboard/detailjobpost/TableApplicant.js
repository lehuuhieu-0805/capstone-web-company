/* eslint-disable camelcase */
import { LoadingButton } from "@mui/lab";
import { Avatar, CircularProgress, Dialog, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import AlertMessage from "../../../components/AlertMessage";
import CustomNoRowsOverlay from "../../../components/CustomNoRowsOverlay";
import Iconify from "../../../components/Iconify";
import { api } from "../../../constants";
import InfoProfileApplicant from "./InfoProfileApplicant";

export default function TableApplicant(props) {
  const [listProfileApplicant, setListProfileApplicant] = useState([]);
  const [listJobPosition, setListJobPosition] = useState([]);
  const [listWorkingStyle, setListWorkingStyle] = useState([]);
  const [listProfileApplicantSkill, setListProfileApplicantSkill] = useState([]);
  const [listJobPost, setListJobPost] = useState([]);
  const [listJobPostSkill, setListJobPostSkill] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [profileApplicant, setProfileApplicant] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [totalRow, setTotalRow] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingLikeButton, setLoadingLikeButton] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [reloadData, setReloadData] = useState(false);

  const [applicantDetail, setAPplicantDetail] = useState();
  const [jobPositionDetail, setJobPositionDetail] = useState();

  const jobPostId = props.id;
  const { status } = props;

  useEffect(() => {
    setLoadingData(true);
    setListProfileApplicant([]);
    // not yet paging
    if (status === 0) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_SORT_BY_SYSTEM}?jobPostId=${jobPostId}&status=0&page-size=${rowsPerPage}&page=${page + 1}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        const listProfileApplicantTemp = response.data.data;

        Promise.all(listProfileApplicantTemp.map((profileApplicant) => axios({
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
        }).catch((error) => console.log(error))))
          .then(() => {
            setListProfileApplicant(listProfileApplicantTemp);
            setLoadingData(false);
          }).catch((error) => console.log(error));

      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_SORT_BY_SYSTEM}?jobPostId=${jobPostId}&status=0`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        setTotalRow(response.data.data.length);
      }).catch(error => console.log(error));

    } else if (status === 1) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_LIKED_JOBPOST}?jobPostId=${jobPostId}&page-size=${rowsPerPage}&page=${page + 1}&status=0`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        if (response.data.data?.length > 0) {
          Promise.all(response.data.data.map((profileApplicant) => axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${profileApplicant.applicant_id}`,
            method: 'get',
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // }
          }).then((response) => {
            profileApplicant.name = response.data.data.name;
            profileApplicant.phone = response.data.data.phone;
            profileApplicant.email = response.data.data.email;
            profileApplicant.avatar = response.data.data.avatar;
            profileApplicant.gender = response.data.data.gender;
            profileApplicant.dob = response.data.data.dob;

            setListProfileApplicant((prev) => ([...prev, profileApplicant]));
          }).catch(error => console.log(error))))
            .then(() => {
              setLoadingData(false);
            }).catch(error => console.log(error));
        } else {
          setLoadingData(false);
        }
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_LIKED_JOBPOST}?jobPostId=${jobPostId}&status=0`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        setTotalRow(response.data.data.length);
      }).catch(error => console.log(error));

    } else if (status === 2) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_JOBPOST_LIKED}?jobPostId=${jobPostId}&page-size=${rowsPerPage}&page=${page + 1}&status=0`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        if (response.data.data?.length > 0) {
          Promise.all(response.data.data.map((profileApplicant) => axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${profileApplicant.applicant_id}`,
            method: 'get',
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // }
          }).then((response) => {
            profileApplicant.name = response.data.data.name;
            profileApplicant.phone = response.data.data.phone;
            profileApplicant.email = response.data.data.email;
            profileApplicant.avatar = response.data.data.avatar;
            profileApplicant.gender = response.data.data.gender;
            profileApplicant.dob = response.data.data.dob;

            setListProfileApplicant((prev) => ([...prev, profileApplicant]));
          }).catch(error => console.log(error))))
            .then(() => {
              setLoadingData(false);
            }).catch(error => console.log(error));
        } else {
          setLoadingData(false);
        }
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT_JOBPOST_LIKED}?jobPostId=${jobPostId}&status=0`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        setTotalRow(response.data.data.length);
      }).catch(error => console.log(error));
    } else if (status === 3) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_LIKE}?match=1&jobPostId=${jobPostId}&page-size=${rowsPerPage}&page=${page + 1}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        if (response.data.data?.length > 0) {
          Promise.all(response.data.data.map((like) => axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT}/${like.profile_applicant_id}`,
            method: 'get',
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // }
          }).then((response) => {
            like.job_position_id = response.data.data.job_position_id;
            like.working_style_id = response.data.data.working_style_id;
            like.applicant_id = response.data.data.applicant_id;
            like.id = response.data.data.id;

            axios({
              url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${response.data.data.applicant_id}`,
              method: 'get',
              // headers: {
              //   Authorization: `Bearer ${token}`,
              // }
            }).then((response) => {
              like.name = response.data.data.name;
              like.phone = response.data.data.phone;
              like.email = response.data.data.email;
              like.avatar = response.data.data.avatar;
              like.gender = response.data.data.gender;
              like.dob = response.data.data.dob;

              setListProfileApplicant((prev) => ([...prev, like]));
            }).catch(error => console.log(error));
          }).catch(error => console.log(error))))
            .then(() => {
              setLoadingData(false);
            }).catch(error => console.log(error));
        } else {
          setLoadingData(false);
        }
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_LIKE}?match=1&jobPostId=${jobPostId}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        setTotalRow(response.data.data.length);
      }).catch(error => console.log(error));
    }

    axios({
      method: "get",
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}`,
      // header: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      setListJobPosition(response.data.data);
    }).catch(error => console.log(error));

    axios({
      method: "get",
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WORKINGSTYLE}`,
      // header: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      setListWorkingStyle(response.data.data);
    }).catch(error => console.log(error));

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
          .then(() => { })
          .catch(error => console.log(error));
      });
    }).catch(error => console.log(error));

  }, [page, rowsPerPage, jobPostId, status, reloadData]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReloadData(!reloadData);
  };

  const handleDialog = (profileApplicantId) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT}/${profileApplicantId}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).then((response) => {
      setProfileApplicant(response.data.data);

      const a = axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${response.data.data.applicant_id}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        setAPplicantDetail(response.data.data);
      }).catch(error => console.log(error));

      const b = axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}/${response.data.data.job_position_id}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => setJobPositionDetail(response.data.data))
        .catch(error => console.log(error));

      Promise.all([a, b]).then(() => setOpenDialog(true)).catch(error => console.log(error));
    }).catch(error => console.log(error));
  };

  const handleLikeButton = (profile_applicant_id, index) => {
    setLoadingLikeButton(index);
    if (status === 0) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_LIKE}`,
        method: 'post',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
        data: {
          profile_applicant_id,
          job_post_id: jobPostId,
          is_job_post_like: true,
          is_profile_applicant_like: false
        }
      }).then(() => {
        setSeverity('success');
        setAlertMessage('Bạn đã thích ứng viên thành công');
        setOpenAlert(true);
        setLoadingLikeButton(-1);
        setReloadData(!reloadData);
      }).catch(error => {
        console.log(error);
        setSeverity('error');
        setAlertMessage('Có lỗi xảy ra');
        setOpenAlert(true);
        setLoadingLikeButton(-1);
        setReloadData(!reloadData);
      });
    } else if (status === 1) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_COMPANY_ACCEPT_LIKE}`,
        method: 'put',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        data: {
          job_post_id: jobPostId,
          profile_applicant_id
        }
      }).then(() => {
        setSeverity('success');
        setAlertMessage('Bạn đã thích ứng viên thành công');
        setOpenAlert(true);
        setLoadingLikeButton(-1);
        setReloadData(!reloadData);
      }).catch(error => {
        console.log(error);
        setSeverity('error');
        setAlertMessage('Có lỗi xảy ra');
        setOpenAlert(true);
        setLoadingLikeButton(-1);
        setReloadData(!reloadData);
      });
    }
  };

  return (
    <>
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
                  <TableCell>Địa chỉ email</TableCell>
                  {/* <TableCell>Kĩ năng</TableCell> */}
                  <TableCell>Vị trí công việc</TableCell>
                  <TableCell>Hình thức làm việc</TableCell>
                  <TableCell align='right'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listProfileApplicant?.length > 0 ? listProfileApplicant.map((profileApplicant, index) => (
                  <TableRow
                    hover
                    key={index}
                    tabIndex={-1}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell component="th" scope="row" padding="normal">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={index.toString()} src={profileApplicant.avatar} />
                        <Typography variant="subtitle2" noWrap>
                          {profileApplicant.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{profileApplicant.email}</TableCell>
                    {profileApplicant?.job_position_id ? listJobPosition.map((item) => item.id === profileApplicant.job_position_id ? <TableCell align="left">{item.name}</TableCell> : null) : <TableCell align="left">{null}</TableCell>}
                    {profileApplicant?.working_style_id ? listWorkingStyle.map((item) => item.id === profileApplicant.working_style_id ? <TableCell align="left">{item.name}</TableCell> : null) : <TableCell align="left">{null}</TableCell>}
                    <TableCell align="right" style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify icon='akar-icons:info' width={22} height={22} style={{ cursor: 'pointer', color: 'green' }} onClick={() => handleDialog(profileApplicant.id)} />
                      {status !== 2 && status !== 3 ? <LoadingButton loading={index === loadingLikeButton} variant='contained' style={{ marginRight: 10 }} onClick={() => handleLikeButton(profileApplicant.id, index)}>Thích</LoadingButton> : null}
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
          {listProfileApplicant?.length > 0 && (
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

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="xl"
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
              <InfoProfileApplicant profileApplicant={profileApplicant} applicant={applicantDetail} jobPosition={jobPositionDetail} jobPostId={jobPostId} handleCloseDialog={handleCloseDialog} setOpenAlert={setOpenAlert} setAlertMessage={setAlertMessage} setSeverity={setSeverity} />
            </DialogContent>
          </Dialog>

          <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} severity={severity} />
        </>
      )}
    </>
  );
}