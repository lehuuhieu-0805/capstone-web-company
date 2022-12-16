import { Button, Card, CardContent, CardHeader, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, ImageList, ImageListItem, Paper, Stack, Table, TableCell, TableContainer, TablePagination, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import dayjs from 'dayjs';
import ModalImage from 'react-modal-image';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
import Page from "../components/Page";
import TableToolbar from "../components/TableToolbar";
import { api } from "../constants";
import useTable, { getComparator } from '../hooks/useTable';
import TableHeadCustom from "../TableHeadCustom";
import Iconify from "../components/Iconify";
import InfoProfileApplicant from "../sections/@dashboard/detailjobpost/InfoProfileApplicant";


const TABLE_HEAD = [
  { id: 'no', label: 'No.', algin: 'left' },
  { id: 'title', label: 'Tiêu đề bài tuyển dụng', algin: 'left' },
  { id: 'name', label: 'Tên ứng viên', algin: 'left' },
  { id: 'match_date', label: 'Ngày kết nối', algin: 'left' },
];

export default function HistoryMatching() {
  const [listHistory, setListHistory] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [openDialogDetailProfileApplicant, setOpenDialogDetailProfileApplicant] = useState(false);
  const [openDialogDetailJobPost, setOpenDialogDetailJobPost] = useState(false);
  const [jobPostDetail, setJobPostDetail] = useState();
  const [workingStyleDetail, setWorkingStyleDetail] = useState();
  const [jobPositionDetail, setJobPositionDetail] = useState();
  const [albumImageDetail, setAlbumImageDetail] = useState([]);
  const [jobPostSkillDetail, setJobPostSkillDetail] = useState([]);
  const [company, setCompany] = useState();
  const [skillDetail, setSkillDetail] = useState([]);
  const [profileApplicant, setProfileApplicant] = useState();
  const [applicantDetail, setApplicantDetail] = useState();
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

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  useEffect(() => {
    setLoadingData(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?companyId=${localStorage.getItem("company_id")}`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setListHistory([]);
      const listJobPost = response.data.data;
      if (listJobPost?.length > 0) {
        // eslint-disable-next-line array-callback-return
        Promise.all(listJobPost.map((item) => {
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_LIKE}?jobPostId=${item.id}&match=1`,
            method: 'get',
            // headers: {
            //   Authorization: `Bearer ${token}`
            // }
          }).then((response) => {
            const listLike = response.data.data;
            if (listLike?.length > 0) {
              listLike.forEach((item) => {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${item.profile_applicant.applicant_id}`,
                  method: "get",
                  // headers: {
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then((response) => {
                  const applicant = response.data.data;

                  item.name = applicant.name;
                  item.applicant = applicant;
                  console.log(item);
                  setListHistory(prev => [...prev, item]);
                });
              });
            }

          }).catch(error => console.log(error));
        })).then(() => setTimeout(() => {
          setLoadingData(false);
        }, 300))
          .catch(error => console.log(error));
      } else {
        setLoadingData(false);
      }
    });
  }, []);

  const handleOpenDialogDetailProfileApplicant = (id) => {
    console.log(id);

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT}/${id}`,
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
        setApplicantDetail(response.data.data);
      }).catch(error => console.log(error));

      const b = axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}/${response.data.data.job_position_id}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => setJobPositionDetail(response.data.data))
        .catch(error => console.log(error));

      Promise.all([a, b]).then(() => setOpenDialogDetailProfileApplicant(true)).catch(error => console.log(error));
    }).catch(error => console.log(error));
  };

  const handleOpenDialogDetailJobPost = (id) => {
    console.log(id);

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${id}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setJobPostDetail(response.data.data);
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WORKINGSTYLE}/${response.data.data.working_style_id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setWorkingStyleDetail(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_COMPANY}/${response.data.data.company_id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      }).then((response) => {
        setCompany(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}/${response.data.data.job_position_id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setJobPositionDetail(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_ALBUMIMAGE}?jobPostId=${id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setAlbumImageDetail(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSTSKILL}?jobPostId=${id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setSkillDetail([]);
        setJobPostSkillDetail(response.data.data);
        response.data.data.map((jobPostSkill) => axios({
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

      }).catch(error => console.log(error));

      setOpenDialogDetailJobPost(true);

    }).catch(error => console.log(error));

  };

  const dataFilter = applySortFilter({
    listHistory,
    filterName,
    comparator: getComparator(order, orderBy),
  });
  const dataFiltered = dataFilter.map((user, i) => ({ 'no': i + 1, ...user }));

  console.log(dataFiltered);
  return (
    <Page title='Lịch sử kết nối'>
      <Container maxWidth='xl'>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <HeaderBreadcrumbs
            heading="Lịch sử kết nối"
            links={[
              { name: 'Trang chủ', href: '/company/dashboard' },
              { name: 'Lịch sử kết nối', href: '/company/history-matching' },
            ]}
          />
        </Stack>
        {loadingData ? (<Box style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>) : (
          <>
            <TableContainer sx={{ minWidth: 800 }} component={Paper}>
              <TableToolbar filterName={filterName} onFilterName={handleFilterName} placeholder="Tìm kiếm bài viết tuyển dụng..." />
              <Table>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                  rowCount={dataFiltered.length}
                  order={order}
                  orderBy={orderBy}
                />
                {dataFiltered.length > 0 ? dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <>
                    {console.log(item)}
                    <TableRow key={item.no} hover>
                      <TableCell>{item.no}</TableCell>
                      <TableCell
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                        onClick={() => handleOpenDialogDetailJobPost(item.job_post_id)}
                      >
                        {item.job_post.title}
                      </TableCell>
                      <TableCell
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                        onClick={() => handleOpenDialogDetailProfileApplicant(item.profile_applicant_id)}
                      >{item.name}</TableCell>
                      <TableCell>{dayjs(item.match_date).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
                    </TableRow>

                    <Dialog
                      open={openDialogDetailJobPost}
                      onClose={() => { }}
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
                                  <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img style={{ borderRadius: '50%', objectFit: 'contain' }} src={company?.logo} alt={company?.name} />
                                  </Grid>
                                  <Grid item xs={11}>
                                    <h3>{jobPostDetail?.title}</h3>
                                    <h4 style={{ fontWeight: 'normal' }}>{dayjs(jobPostDetail?.create_date).format('DD-MM-YYYY HH:mm:ss')}</h4>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={4}>
                            <Card sx={{ mt: 2 }}>
                              <CardContent>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <Typography variant='h7' component='div'>
                                      <Box display='inline' fontWeight='fontWeightBold'>Vị trí công việc: {' '}</Box>
                                      {jobPositionDetail?.name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant='h7' component='div'>
                                      <Box display='inline' fontWeight='fontWeightBold'>Số lượng tuyển: {' '}</Box>
                                      {jobPostDetail?.quantity}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant='h7' component='div'>
                                      <Box display='inline' fontWeight='fontWeightBold'>Hình thức làm việc: {' '}</Box>
                                      {workingStyleDetail?.name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant='h7' component='div'>
                                      <Box display='inline' fontWeight='fontWeightBold'>Địa điểm làm việc: {' '}</Box>
                                      {jobPostDetail?.working_place}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant='h7' component='div'>
                                      <Box display='inline' fontWeight='fontWeightBold'>Số dư: {' '}</Box>
                                      {jobPostDetail?.money} coin
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                            <Grid item xs={12} style={{ marginTop: 16 }}>
                              <ImageList variant='standard' cols={2} gap={8}>
                                {albumImageDetail?.map((element, index) => (
                                  <ImageListItem key={index}>
                                    <ModalImage small={element.url_image} large={element.url_image} className='modal-image-detail' />
                                  </ImageListItem>
                                ))}
                              </ImageList>
                            </Grid>
                          </Grid>
                          <Grid item xs={8}>
                            <Card sx={{ mt: 2 }}>
                              <CardContent>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <h4>Mô tả:</h4>
                                    <h4 style={{ fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: jobPostDetail?.description }} />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <h4>Bắt đầu:</h4>
                                    <h4 style={{ fontWeight: 'normal' }}>{dayjs(jobPostDetail?.start_time).format('DD-MM-YYYY')}</h4>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <h4>Kết thúc:</h4>
                                    <h4 style={{ fontWeight: 'normal' }}>{dayjs(jobPostDetail?.end_time).format('DD-MM-YYYY')}</h4>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                            <Card sx={{ mt: 2 }}>
                              <CardContent>
                                <Grid item xs={12}>
                                  <h4 style={{ marginRight: 10 }}>Kĩ năng:</h4>

                                  {skillDetail.map((element, index) => <Grid key={index} container spacing={0}>
                                    <Grid item xs={2}>
                                      <h4 style={{ fontWeight: 'normal' }}>Ngôn ngữ:</h4>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <h4 style={{ fontWeight: 'normal' }}>{element.skill}</h4>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <h4 style={{ fontWeight: 'normal' }}>Trình độ:</h4>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <h4 style={{ fontWeight: 'normal' }}>{element.skillLevel}</h4>
                                    </Grid>
                                  </Grid>)}
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenDialogDetailJobPost(false)} variant="contained">
                          Đóng
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <Dialog
                      open={openDialogDetailProfileApplicant}
                      onClose={() => setOpenDialogDetailProfileApplicant(false)}
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
                        }} onClick={() => setOpenDialogDetailProfileApplicant(false)} />
                      </Stack>

                      <DialogContent>
                        <InfoProfileApplicant profileApplicant={profileApplicant} applicant={applicantDetail} jobPosition={jobPositionDetail} />
                      </DialogContent>
                    </Dialog>
                  </>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <CustomNoRowsOverlay />
                    </TableCell>
                  </TableRow>
                )}
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


      </Container>
    </Page>
  );
}

function applySortFilter({ listHistory, comparator, filterName }) {
  const stabilizedThis = listHistory.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  listHistory = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    listHistory = listHistory.filter((item) => item.job_post.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return listHistory;
}