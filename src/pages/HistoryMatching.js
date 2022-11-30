import { CircularProgress, Container, Paper, Stack, Table, TableCell, TableContainer, TablePagination, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
import Page from "../components/Page";
import TableToolbar from "../components/TableToolbar";
import { api } from "../constants";
import useTable, { getComparator } from '../hooks/useTable';
import TableHeadCustom from "../TableHeadCustom";


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
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${item.job_post_id}`,
                  method: 'get',
                  // headers: {
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then((response) => {
                  const jobPost = response.data.data;
                  axios({
                    url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_PROFILE_APPLICANT}/${item.profile_applicant_id}`,
                    method: 'get',
                    // headers: {
                    //   Authorization: `Bearer ${token}`
                    // }
                  }).then((response) => {
                    const profileApplicant = response.data.data;
                    axios({
                      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}/${profileApplicant.applicant_id}`,
                      method: "get",
                      // headers: {
                      //   Authorization: `Bearer ${token}`
                      // }
                    }).then((response) => {
                      const applicant = response.data.data;
                      item.title = jobPost.title;
                      item.name = applicant.name;
                      console.log(item);
                      setListHistory(prev => [...prev, item]);
                    });
                  }).catch(error => console.log(error));
                }).catch(error => console.log(error));
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
  return (
    <Page title='Lịch sử kết nối'>
      <Container maxWidth='xl'>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <HeaderBreadcrumbs
            heading="Lịch sử kết nối"
            links={[
              { name: 'Trang chủ', href: '/dashboard/app' },
              { name: 'Lịch sử kết nối', href: '/dashboard/history-matching' },
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
                  <TableRow key={item.no} hover>
                    <TableCell>{item.no}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{dayjs(item.match_date).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
                  </TableRow>
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