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
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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
  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
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
                  <TableRow key={item.no} hover>
                    <TableCell>{item.no}</TableCell>
                    <TableCell 
                    // onClick={() => setOpenDialogDetail(true)}
                    >
                    {item.job_post.title}
                      </TableCell>
                    <TableCell 
                    // onClick={() => setOpenDialog(true)}
                    >{item.name}</TableCell>
                    <TableCell>{dayjs(item.match_date).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
                  </TableRow>
                  
        {/* <Dialog
          open={openDialogDetail}
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

                      <Grid item xs={10}>
                        <h3>{item.job_post.title}</h3>
                        <h4 style={{ fontWeight: 'normal' }}>
                          {dayjs(item.job_post.create_date).format('DD-MM-YYYY HH:mm:ss')}
                        </h4>
                      </Grid>
                      <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Chip label=" Chờ duyệt" color="warning" />
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
                          {item.job_post.quantity}
                        </Typography>

                      </Stack>
                      <Stack direction="row">
                        <Typography variant="h7" component="div">
                          <Box display="inline" fontWeight="fontWeightBold">
                            Hình thức làm việc:{' '}
                          </Box>
                          {item.job_post.working_style_id}
                        </Typography>
                      </Stack>

                      <Stack direction="row">
                        <Typography variant="h7" component="div">
                          <Box display="inline" fontWeight="fontWeightBold">
                            Địa điểm làm việc:{' '}
                          </Box>
                          {item.job_post.working_place}
                        </Typography>
                      </Stack>

                      <Stack direction="row">
                        <Typography variant="h7" component="div">
                          <Box display="inline" fontWeight="fontWeightBold">
                            Vị trí công việc:{' '}
                          </Box>
                          {item.job_post.job_position_id}
                        </Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography variant="h7" component="div">
                          <Box display="inline" fontWeight="fontWeightBold">
                            Số tiền:{' '}
                          </Box>
                          {item.job_post.money}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                  <Typography variant="subtitle1">Hình ảnh</Typography>
                  <Stack direction="row">

                    <ImageList variant="quilted" cols={2} gap={8}>
                      {item.job_post.album_images &&
                        item.job_post.album_images.map((item) => (
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
                          <h4 style={{ fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: item.job_post.description }} />
                        </Grid>
                        <Grid item xs={6}>
                          <h4>Bắt đầu:</h4>
                          <h4 style={{ fontWeight: 'normal' }}>
                            {dayjs(item.job_post.start_time).format('DD-MM-YYYY')}
                          </h4>
                        </Grid>
                        <Grid item xs={6}>
                          <h4>Kết thúc:</h4>
                          <h4 style={{ fontWeight: 'normal' }}>{dayjs(item.job_post.end_time).format('DD-MM-YYYY')}</h4>
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
        </Dialog> */}

        {/* <Dialog
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
              <InfoProfileApplicant profileApplicant={item.profile_applicant} applicant={item.applicant} jobPosition={jobPositionDetail}  />
            </DialogContent>
          </Dialog> */}
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
    listHistory = listHistory.filter((item) => item.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return listHistory;
}