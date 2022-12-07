/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
// material
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert, Button, Container, Dialog, DialogActions, DialogTitle, Snackbar, Stack, Tab, Tabs, Typography
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useFieldArray, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';
import { addMoney } from '../slices/moneySlice';
import TabPanel from '../components/TabPanel';
import { api } from '../constants';
import TableListJobPost from '../sections/@dashboard/jobpost/TableListJobPost';
import { getQueryParams } from '../utils/getQueryParams';
import Label from '../components/Label';


const schema = yup.object().shape({
  title: yup.string().nullable().required('*Vui lòng nhập tiêu đề bài viết tuyển dụng'),
  description: yup.string().nullable().required('*Vui lòng nhập mô tả công việc'),
  quantity: yup.number().typeError('*Vui lòng nhập số lượng ứng viên').positive('*Số lượng ứng viên không hợp lệ').nullable().required('*Vui lòng nhập số lượng ứng viên'),
});

let fileUrlImage = [];
let oldFileUrlImage = [];
let listSkillFilter = [];

export default function JobPost() {
  const [openDialog, setOpenDialog] = useState(false);
  const [defaultStartDay, setDefaultStartDay] = useState(dayjs().add(1, 'day'));
  const [defaultEndDay, setDefaultEndDay] = useState(defaultStartDay.add(1, 'day'));
  const [startDay, setStartDay] = useState(defaultStartDay);
  const [endDay, setEndDay] = useState(defaultEndDay);
  const [jobPosition, setJobPosition] = useState('');
  const [listJobPosition, setListJobPosition] = useState([]);
  const [workingStyle, setWorkingStyle] = useState('');
  const [listWorkingStyle, setListWorkingStyle] = useState([]);
  const [workingPlace, setWorkingPlace] = useState();
  const [listWorkingPlace, setListWorkingPlace] = useState([]);
  const [skill, setSkill] = useState([]);
  const [listSkill, setListSkill] = useState([]);
  const [disabledField, setDisabledField] = useState(true);
  const [skillLevel, setSkillLevel] = useState([]);
  const [listSkillLevel, setListSkillLevel] = useState([]);
  const [status, setStatus] = useState();

  const [mapSkillAndSkillLevel, setMapSkillAndSkillLevel] = useState(new Map());
  const [oldMapSkillAndSkillLevel, setOldMapSkillAndSkillLevel] = useState(new Map());

  const [activeStep, setActiveStep] = useState(0);

  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');

  const [openDialogHidden, setOpenDialogHidden] = useState(false);

  const [listJobPost, setListJobPost] = useState([]);

  const [idJobPost, setIdJobPost] = useState();
  const [refreshData, setRefreshData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [titleDialog, setTitleDialog] = useState({
    key: 0,
    value: 'Tạo bài viết tuyển dụng'
  });
  const [disabledStartDay, setDisabledStartDay] = useState(false);
  const [disabledEndDay, setDisabledEndDay] = useState(false);

  const [sortCreateDate, setSortCreateDate] = useState('desc');
  const [statusJobPost, setStatusJobPost] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRow, setTotalRow] = useState();
  const [valueTab, setValueTab] = useState(0);

  const [loadingButtonHidden, setLoadingButtonHidden] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [lengthJobPostActive, setLengthJobPostActive] = useState(0);
  const [lengthJobPostHidden, setLengthJobPostHidden] = useState(0);
  const [lengthJobPostPending, setLengthJobPostPending] = useState(0);
  const [lengthJobPostCancel, setLengthJobPostCancel] = useState(0);
  const [lengthJobPostPosting, setLengthJobPostPosting] = useState(0);

  const dispatch = useDispatch();
  const getQueryParam = getQueryParams();

  dayjs.extend(isSameOrBefore);

  const { setValue, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      title: '',
      create_date: '',
      description: '',
      quantity: '',
      test: []
    }
  });

  const { append } = useFieldArray({
    control,
    name: 'test'
  });

  useEffect(() => {
    if (getQueryParam?.status === 'created') {
      setSeverity('success');
      setMessageAlert('Tạo bài viết thành công');
      setOpenAlert(true);
    } else if (getQueryParam?.status === 'create-failed') {
      setSeverity('error');
      setMessageAlert('Tạo bài viết thất bại');
      setOpenAlert(true);
    } else if (getQueryParam?.status === 'updated') {
      setOpenAlert(true);
      setSeverity('success');
      setMessageAlert('Chỉnh sửa bài viết tuyển dụng thành công');
    } else if (getQueryParam?.status === 'update-failed') {
      setOpenAlert(true);
      setSeverity('error');
      setMessageAlert('Chỉnh sửa bài viết tuyển dụng thất bại');
    }
  }, []);

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setListJobPosition(response.data.data);
    }).catch(error => console.log(error));
  }, []);

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WORKINGSTYLE}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setListWorkingStyle(response.data.data);
    }).catch(error => console.log(error));
  }, []);

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      append({ skill: response.data.data });
      setListSkill(response.data.data);
      listSkillFilter = response.data.data;
    }).catch(error => console.log(error));
  }, [append, setValue]);

  useEffect(() => {
    axios({
      url: 'https://api-province-vn-v2.azurewebsites.net/api/v1/address',
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setListWorkingPlace(response.data);
    }).catch(error => console.log(error));
  }, []);

  useEffect(() => {
    setLoadingData(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&page=${page + 1}&page-size=${rowsPerPage}${statusJobPost !== 1 ? `&sort-key=CreateDate&sort-order=${sortCreateDate}` : '&sort-key=EndTime&sort-order=DESC'}&status=${statusJobPost}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setListJobPost(response.data?.data);

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&sort-key=CreateDate&sort-order=${sortCreateDate}&status=${statusJobPost}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setTotalRow(response.data.data?.length);
        setLoadingData(false);
      }).catch(error => console.log(error));

    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=5`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setLengthJobPostPosting(response.data.data?.length || 0);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=0`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setLengthJobPostActive(response.data.data?.length || 0);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=1`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setLengthJobPostHidden(response.data.data?.length || 0);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=2`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setLengthJobPostPending(response.data.data?.length || 0);
    }).catch(error => console.log(error));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&status=3`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    }).then((response) => {
      setLengthJobPostCancel(response.data.data?.length || 0);
    }).catch(error => console.log(error));

  }, [page, refreshData, rowsPerPage, sortCreateDate, statusJobPost]);

  const debounceJobPost = useCallback(debounce((nextValue) => {
    setLoadingData(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&page=${page + 1}&page-size=${rowsPerPage}&sort-key=CreateDate&sort-order=${sortCreateDate}&status=${statusJobPost}${nextValue ? `&title=${nextValue}` : ''}&status=${statusJobPost}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setListJobPost(response.data?.data);

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}?employeeId=${localStorage.getItem('user_id')}&sort-key=CreateDate&sort-order=${sortCreateDate}&status=${statusJobPost}${nextValue ? `&title=${nextValue}` : ''}&status=${statusJobPost}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setTotalRow(response.data.data?.length);
        setLoadingData(false);
      }).catch(error => console.log(error));

    }).catch(error => console.log(error));
  }, 1000), []);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleEditJobPost = (id) => {
    setListSkillLevel([]);
    setSkillLevel([]);
    fileUrlImage = [];
    setTitleDialog({
      key: 1,
      value: 'Chỉnh sửa bài viết tuyển dụng'
    });

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${id}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // }
    }).then((response) => {
      setValue('id', response.data.data.id);
      setValue('title', response.data.data.title);
      setValue('create_date', response.data.data.create_date);
      setValue('quantity', response.data.data.quantity);
      setValue('description', response.data.data.description);
      setStatus(response.data.data.status === 3 ? 2 : response.data.data.status);
      setJobPosition(response.data.data.job_position_id);
      setWorkingStyle(response.data.data.working_style_id);
      setWorkingPlace(response.data.data.working_place);
      setStartDay(dayjs(response.data.data.start_time));
      setEndDay(dayjs(response.data.data.end_time));
      setDisabledStartDay(!dayjs().isSameOrBefore(dayjs(response.data.data.start_time), 'day', 'month', 'year'));
      setDisabledEndDay(!dayjs().isSameOrBefore(dayjs(response.data.data.end_time), 'day', 'month', 'year'));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSTSKILL}?jobPostId=${id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      }).then((response) => {
        response.data.data.forEach((element, index) => {
          setSkill((prev) => ([
            ...prev, {
              index,
              id: element.skill_id,
            }
          ]));
          setMapSkillAndSkillLevel(new Map(mapSkillAndSkillLevel.set(index, {
            job_post_skill_id: element.id,
            skill_id: element.skill_id,
            skill_level: element.skill_level
          })));
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}/${element.skill_id}`,
            method: 'get',
            // headers: {
            //   Authorization: `Bearer ${token}`
            // }
          }).then((response) => {
            axios({
              url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILLLEVEL}?skillGroupId=${response.data.data.skill_group_id}`,
              method: 'get',
              // headers: {
              //   'Authorization': `Bearer ${token}`
              // }
            }).then((response) => {
              setListSkillLevel((prev) => ([
                ...prev,
                {
                  index,
                  skillId: element.skill_id,
                  skillLevel: response.data.data,
                }
              ]));
            }).catch(error => console.log(error));

            axios({
              url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILLLEVEL}?skillGroupId=${response.data.data.skill_group_id}&name=${element.skill_level}`,
              method: 'get',
              // headers: {
              //   'Authorization': `Bearer ${token}`
              // }
            }).then((response) => {
              setSkillLevel((prev) => ([
                ...prev, {
                  index,
                  id: response.data.data[0].id,
                  name: response.data.data[0].name
                }
              ]));

            }).catch(error => console.log(error));
          }).catch(error => console.log(error));
        });

        setOldMapSkillAndSkillLevel(mapSkillAndSkillLevel);

        for (let index = 0; index < response.data.data.length - 1; index += 1) {
          append({ skill: listSkill });
          setDisabledField(false);
        }
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_ALBUMIMAGE}?jobPostId=${id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      }).then((response) => {
        // eslint-disable-next-line array-callback-return
        response.data.data.map((element) => {
          fileUrlImage = [...fileUrlImage, { id: element.id, url_image: element.url_image }];
        });

        oldFileUrlImage = fileUrlImage;
      }).catch(error => console.log(error));
      setActiveStep(0);
      setOpenDialog(true);
    }).catch(error => console.log(error));

  };

  const handleChangeSortCreateDate = (event) => {
    // eslint-disable-next-line no-unused-expressions
    sortCreateDate === 'asc' ? setSortCreateDate('desc') : setSortCreateDate('asc');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialogHidden = (id) => {
    setIdJobPost(id);
    setOpenDialogHidden(true);
  };

  const handleFilterName = (newFilterName) => {
    setFilterName(newFilterName);
    // if (newFilterName) {
    debounceJobPost(newFilterName);
    // }
  };

  const TABS = [
    { value: 0, label: 'Đang hoạt động', color: 'success', count: lengthJobPostActive },
    { value: 2, label: 'Đang đợi duyệt', color: 'success', count: lengthJobPostPosting },
    { value: 4, label: 'Chờ hoạt động', color: 'success', count: lengthJobPostPending },
    { value: 3, label: 'Từ chối', color: 'error', count: lengthJobPostCancel },
    { value: 1, label: 'Đã ẩn', color: 'warning', count: lengthJobPostHidden },
  ];

  return (
    <Page title="Bài tuyển dụng">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <HeaderBreadcrumbs
            heading="Bài viết tuyển dụng"
            links={[
              { name: 'Trang chủ', href: '/employee/dashboard' },
              { name: 'Danh sách bài viết tuyển dụng', href: '/employee/job-post' },
            ]}
          />
          <Button variant="contained" component={RouterLink} to="/employee/job-post/create" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo bài viết tuyển dụng
          </Button>
        </Stack>

        <Dialog
          open={openDialogHidden}
          onClose={() => setOpenDialogHidden(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="alert-dialog-title">
            Bạn có chắc chắn muốn ẩn bài viết tuyển dụng này không?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenDialogHidden(false)} variant='outlined'>Đóng</Button>
            <LoadingButton loading={loadingButtonHidden} onClick={() => {
              setLoadingButtonHidden(true);
              if (statusJobPost === 2) {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${idJobPost}`,
                  method: 'get',
                  // headers: {
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then((response) => {
                  const jobPost = response.data.data;
                  jobPost.status = 1;
                  axios({
                    url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_JOBPOST}/${idJobPost}`,
                    method: 'put',
                    // headers: {
                    //   Authorization: `Bearer ${token}`
                    // },
                    data: jobPost
                  }).then(() => {
                    setRefreshData(!refreshData);
                    setLoadingButtonHidden(false);
                    setOpenDialogHidden(false);
                    setOpenAlert(true);
                    setSeverity('success');
                    setMessageAlert('Ẩn bài viết tuyển dụng thành công');
                    const action = addMoney(jobPost.money);
                    dispatch(action);
                  }).catch((error) => {
                    console.log(error);
                    setOpenDialogHidden(false);
                    setOpenAlert(true);
                    setSeverity('error');
                    setMessageAlert('Ẩn bài viết tuyển dụng không thành công');
                  });
                });
              } else {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_EXPRIRE_JOBPOST}/${idJobPost}`,
                  method: 'put',
                  // headers: {
                  //   Authorization: `Bearer ${token}`
                  // },
                  data: {
                    id: idJobPost,
                    end_time: dayjs().format('YYYY-MM-DD')
                  }
                }).then(() => {
                  axios({
                    url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_JOBPOST}/${idJobPost}`,
                    method: 'get',
                    // headers: {
                    //   Authorization: `Bearer ${token}`
                    // }
                  }).then((response) => {
                    setRefreshData(!refreshData);
                    setLoadingButtonHidden(false);
                    setOpenDialogHidden(false);
                    setOpenAlert(true);
                    setSeverity('success');
                    setMessageAlert('Ẩn bài viết tuyển dụng thành công');
                    const action = addMoney(response.data.data.money);
                    dispatch(action);
                  }).catch(error => console.log(error));
                }).catch((error) => {
                  console.log(error);
                  setOpenDialogHidden(false);
                  setOpenAlert(true);
                  setSeverity('error');
                  setMessageAlert('Ẩn bài viết tuyển dụng không thành công');
                });

              }
            }} variant='contained'>Ẩn</LoadingButton>
          </DialogActions>
        </Dialog>

        <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
          <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant='filled'>
            {messageAlert}
          </Alert>
        </Snackbar>

        {/* <Tabs value={valueTab} onChange={(event, newValue) => setValueTab(newValue)} aria-label="basic tabs example">
          <Tab label='Đang hoạt động' id='simple-tab-0' aria-controls='simple-tabpanel-0' onClick={() => {
            setFilterName('');
            setStatusJobPost(0);
          }} />
          <Tab label='Đang đợi duyệt' id='simple-tab-1' aria-controls='simple-tabpanel-1' onClick={() => {
            setFilterName('');
            setStatusJobPost(2);
          }} />
          <Tab label='Chờ hoạt động' id='simple-tab-1' aria-controls='simple-tabpanel-1' onClick={() => {
            setFilterName('');
            setStatusJobPost(4);
          }} />
          <Tab label='Từ chối' id='simple-tab-1' aria-controls='simple-tabpanel-1' onClick={() => {
            setFilterName('');
            setStatusJobPost(3);
          }} />
          <Tab label='Đã hết hạn' id='simple-tab-2' aria-controls='simple-tabpanel-2' onClick={() => {
            setFilterName('');
            setStatusJobPost(1);
          }} />
        </Tabs> */}

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={valueTab}
          onChange={(event, newValue) => setValueTab(newValue)}
          sx={{ bgcolor: 'background.neutral' }}
        >
          {TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              value={tab.value}
              // icon={<Label color={tab.color}> {tab.count} </Label>}
              label={<Typography variant="h7" component="div">
                <Label color={tab.color}> {tab.count}  </Label>
                {tab.label}
              </Typography>}
              onClick={() => {
                setFilterName('');
                setStatusJobPost(tab.value);
              }}
            />
          ))}
        </Tabs>

        <TabPanel value={valueTab} index={0}>
          <TableListJobPost loadingData={loadingData} sortCreateDate={sortCreateDate} handleChangeSortCreateDate={handleChangeSortCreateDate}
            listJobPost={listJobPost} totalRow={totalRow} rowsPerPage={rowsPerPage} page={page}
            handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} statusJobPost={statusJobPost}
            handleOpenDialogHidden={handleOpenDialogHidden} filterName={filterName} handleFilterName={handleFilterName}
            setOpenAlert={setOpenAlert} setSeverity={setSeverity} setAlertMessage={setMessageAlert} setRefreshData={setRefreshData} refreshData={refreshData} />
        </TabPanel>
        <TabPanel value={valueTab} index={1}>
          <TableListJobPost loadingData={loadingData} sortCreateDate={sortCreateDate} handleChangeSortCreateDate={handleChangeSortCreateDate}
            listJobPost={listJobPost} totalRow={totalRow} rowsPerPage={rowsPerPage} page={page}
            handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} statusJobPost={statusJobPost}
            handleEditJobPost={handleEditJobPost} handleOpenDialogHidden={handleOpenDialogHidden} filterName={filterName} handleFilterName={handleFilterName}
            setOpenAlert={setOpenAlert} setSeverity={setSeverity} setAlertMessage={setMessageAlert} setRefreshData={setRefreshData} refreshData={refreshData} />
        </TabPanel>
        <TabPanel value={valueTab} index={2}>
          <TableListJobPost loadingData={loadingData} sortCreateDate={sortCreateDate} handleChangeSortCreateDate={handleChangeSortCreateDate}
            listJobPost={listJobPost} totalRow={totalRow} rowsPerPage={rowsPerPage} page={page}
            handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} statusJobPost={statusJobPost}
            handleOpenDialogHidden={handleOpenDialogHidden} filterName={filterName} handleFilterName={handleFilterName}
            setOpenAlert={setOpenAlert} setSeverity={setSeverity} setAlertMessage={setMessageAlert} setRefreshData={setRefreshData} refreshData={refreshData} />
        </TabPanel>
        <TabPanel value={valueTab} index={3}>
          <TableListJobPost loadingData={loadingData} sortCreateDate={sortCreateDate} handleChangeSortCreateDate={handleChangeSortCreateDate}
            listJobPost={listJobPost} totalRow={totalRow} rowsPerPage={rowsPerPage} page={page}
            handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} statusJobPost={statusJobPost}
            handleEditJobPost={handleEditJobPost} handleOpenDialogHidden={handleOpenDialogHidden} filterName={filterName} handleFilterName={handleFilterName}
            setOpenAlert={setOpenAlert} setSeverity={setSeverity} setAlertMessage={setMessageAlert} setRefreshData={setRefreshData} refreshData={refreshData} />
        </TabPanel>
        <TabPanel value={valueTab} index={4}>
          <TableListJobPost loadingData={loadingData} sortCreateDate={sortCreateDate} handleChangeSortCreateDate={handleChangeSortCreateDate}
            listJobPost={listJobPost} totalRow={totalRow} rowsPerPage={rowsPerPage} page={page}
            handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} statusJobPost={statusJobPost}
            handleOpenDialogHidden={handleOpenDialogHidden} setOpenAlert={setOpenAlert} setSeverity={setSeverity} setAlertMessage={setMessageAlert} setRefreshData={setRefreshData} refreshData={refreshData} />
        </TabPanel>
      </Container>

    </Page >
  );
};