/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { LoadingButton } from "@mui/lab";
import { Card, Chip, CircularProgress, Divider, LinearProgress, Paper, Tab, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tabs, TextField } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Scrollbar from "../components/Scrollbar";
import { TableEmptyRows, TableNoData } from "../components/table";
import useTabs from "../hooks/useTabs";
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
import Page from "../components/Page";
import TableToolbar from "../components/TableToolbar";
import TabPanel from "../components/TabPanel";
import { api, common } from '../constants';
import useTable, { emptyRows, getComparator } from "../hooks/useTable";
import TableHeadCustom from "../TableHeadCustom";
import { TransTableRow, TransTableToolbar } from "../sections/@dashboard/transaction";

const TABLE_HEAD = [
  { id: 'no', label: 'No.', align: 'left' },
  { id: 'date', label: 'Thời gian', align: 'left' },
  // { id: 'create by', label: 'Người tạo', align: 'left' },
  { id: 'type', label: 'Loại giao dịch', align: 'left' },
  { id: 'total', label: 'Tagent coin', align: 'left' },

  { id: '' },
];


export default function HistoryTransaction() {
  const [tableData, setTableData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(3);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [refeshdata, setrefeshdata] = useState(false);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [walletId, setWalletId] = useState('');
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,

    //
    selected,

    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/wallets?companyId=${localStorage.getItem("company_id")}`,
      method: 'get',
    })
      .then((response) => {
        console.log(response.data.data[0].id);
        setWalletId(response.data.data[0].id);
        if (filterStartDate === null || filterEndDate === null) {
          axios({
            url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions?walletId=${response.data.data[0].id}`,
            method: 'get',
          })
            .then((response) => {
              console.log(response.data.data);
              setTableData(response.data.data);
              setLoadingData(false);
              setrefeshdata(false);
              // console.log(response.data.data);
            })
            .catch((error) => console.log(error));
        }
        if (filterStartDate !== null && filterEndDate !== null) {

          axios({
            url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions?fromDate=${dayjs(filterStartDate).format('YYYY-MM-DD')}&toDate=${dayjs(filterEndDate).add(1, 'day').format('YYYY-MM-DD')}&walletId=${response.data.data[0].id}`,
            method: 'get',
          })
            .then((response) => {

              console.log(response);
              if (response.status === 204) {
                setTableData([]);
                setLoadingData(false);
                setrefeshdata(false);
              }
              if (response.status === 200) {
                setTableData(response.data.data);
                setLoadingData(false);
                setrefeshdata(false);
              }

            })
            .catch((error) => console.log(error));
        }

        // console.log(response.data.data.total_of_system);
      })
      .catch((error) => console.log(error));
  }, [refeshdata]);

  // useEffect(() => {
  //   if (filterStartDate === null || filterEndDate === null){
  //   axios({
  //     url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions?walletId=${walletId}`,
  //     method: 'get',
  //   })
  //     .then((response) => {
  //       console.log(response.data.data)
  //       setTableData(response.data.data);
  //       setLoadingData(false);
  //       setrefeshdata(false)
  //       // console.log(response.data.data);
  //     })
  //     .catch((error) => console.log(error));
  //   } 
  //   if (filterStartDate !== null && filterEndDate !== null) {

  //     axios({
  //       url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions?fromDate=${dayjs(filterStartDate).format('YYYY-MM-DD')}&toDate=${dayjs(filterEndDate).add(1, 'day').format('YYYY-MM-DD')}?walletId=${walletId}`,
  //       method: 'get',
  //     })
  //       .then((response) => {

  //         console.log(response);
  //         if(response.status === 204){
  //           setTableData([]);
  //           setLoadingData(false);
  //           setrefeshdata(false)
  //         }
  //         if(response.status === 200){
  //           setTableData(response.data.data);
  //           setLoadingData(false);
  //           setrefeshdata(false)
  //         }

  //       })
  //       .catch((error) => console.log(error));
  //   }

  // }, [refeshdata]);
  // console.log(dayjs(filterStartDate).format('YYYY-MM-DD'))
  // console.log(dayjs(filterEndDate).format('YYYY-MM-DD'))


  const TABS = [
    { value: 3, label: 'Tất cả', color: 'info' },
    { value: 2, label: 'Tạo bài tuyển dụng', color: 'warning' },
    { value: 0, label: 'Nạp tiền', color: 'error' },
    { value: 5, label: 'Hoàn tiền' },
  ];




  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterStatus,
  });


  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate) || tableData === undefined || dataFiltered === [];

  return (
    <Page title="Giao dịch">
      <Container maxWidth='xl'>
        <HeaderBreadcrumbs
          heading="Giao dịch"
          links={[
            { name: 'Trang chủ', href: '/company/dashboard' },
            { name: 'Giao dịch', href: '/company/history-transaction' },
          ]}

        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}

                label={tab.label}
              />
            ))}
          </Tabs>
          <Divider />
          <TransTableToolbar
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            onReset={() => {
              setTableData([]);
              setrefeshdata(true);
              setLoadingData(true);
            }}
            onClear={() => {

              setFilterStartDate(null);
              setFilterEndDate(null);
              setLoadingData(true);
              setrefeshdata(true);
            }}
          />


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
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TransTableRow
                        key={row.id}
                        row={row}
                        index={index}
                      // onLoading={() => setLoadingData(true)}
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
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />


          </Box>
        </Card>
      </Container>

    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterStatus === 0) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Money recharge');
  }
  if (filterStatus === 5) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Return money');
  }
  if (filterStatus === 6) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Create job post');
  }

  return tableData;
}
