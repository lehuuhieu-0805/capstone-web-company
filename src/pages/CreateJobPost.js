import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Select, Snackbar, Stack, Step, StepLabel, Stepper, Tab, Tabs, TextField, Typography
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { debounce } from 'lodash';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import ModalImage from 'react-modal-image';
import { getQueryParams } from '../utils/getQueryParams';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';
import TabPanel from '../components/TabPanel';
import { api, common } from '../constants';
import TableListJobPost from '../sections/@dashboard/jobpost/TableListJobPost';
import { minusMoney } from '../slices/moneySlice';
import '../index.css';


const schema = yup.object().shape({
  title: yup.string().nullable().required('*Vui lòng nhập tiêu đề bài viết tuyển dụng'),
  quantity: yup.number().typeError('*Vui lòng nhập số lượng ứng viên').positive('*Số lượng ứng viên không hợp lệ').nullable().required('*Vui lòng nhập số lượng ứng viên'),
});

const steps = ['Bước 1', 'Bước 2', 'Bước 3'];

let fileObjImage = [];
let fileUrlImage = [];
// eslint-disable-next-line prefer-const
let oldFileUrlImage = [];
let listSkillFilter = [];

export default function CreateJobPost() {
  const [defaultStartDay, setDefaultStartDay] = useState(dayjs());
  const [defaultEndDay, setDefaultEndDay] = useState(defaultStartDay.add(1, 'day'));
  const [startDay, setStartDay] = useState(defaultStartDay);
  const [endDay, setEndDay] = useState(defaultEndDay);
  const [jobPosition, setJobPosition] = useState('');
  const [listJobPosition, setListJobPosition] = useState([]);
  const [workingStyle, setWorkingStyle] = useState('');
  const [listWorkingStyle, setListWorkingStyle] = useState([]);
  const [workingPlace, setWorkingPlace] = useState();
  const [listWorkingPlace, setListWorkingPlace] = useState([]);
  const [inputValueWorkingPlace, setInputValueWorkingPlace] = useState('');
  const [skill, setSkill] = useState([]);
  const [listSkill, setListSkill] = useState([]);
  const [disabledField, setDisabledField] = useState(true);
  const [skillLevel, setSkillLevel] = useState([]);
  const [listSkillLevel, setListSkillLevel] = useState([]);
  const [status, setStatus] = useState();
  const [mapSkillAndSkillLevel, setMapSkillAndSkillLevel] = useState(new Map());
  const [oldMapSkillAndSkillLevel, setOldMapSkillAndSkillLevel] = useState(new Map());
  const [disabledStartDay, setDisabledStartDay] = useState(false);
  const [disabledEndDay, setDisabledEndDay] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');
  const [listFileImage, setListFileImage] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentState, setContentState] = useState();
  const [description, setDescription] = useState('');
  const [money, setMoney] = useState('1.000');
  const [loadingData, setLoadingData] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [title, setTitle] = useState({
    key: 0,
    value: 'Tạo bài viết tuyển dụng'
  });
  const [hasError, setHasError] = useState({
    jobPosition: false,
    skill: false,
    skillLevel: false,
    workingStyle: false,
    workingPlace: false,
    image: false,
    status: false,
    description: false,
    money: false
  });

  const getQueryParam = getQueryParams();

  let { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    fileObjImage = [];
    fileUrlImage = [];
    // eslint-disable-next-line prefer-const
    oldFileUrlImage = [];
    listSkillFilter = [];
  }, []);

  useEffect(() => {
    if (getQueryParam?.jobPostId) {
      id = getQueryParam.jobPostId;
    }
  }, []);

  const dispatch = useDispatch();

  dayjs.extend(isSameOrBefore);

  const { register, handleSubmit, setValue, formState: { errors }, clearErrors, trigger, reset, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      title: '',
      create_date: '',
      quantity: '',
      test: []
    }
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'test'
  });

  const debounceAddress = useCallback(debounce((nextValue) => {
    axios({
      url: `https://api-province-vn-v2.azurewebsites.net/api/v1/address?name=${nextValue}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setListWorkingPlace(response.data);
    }).catch(error => console.log(error));
  }, 1000), []);

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
    if (!id) {
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
    }
  }, [append, setValue, id]);

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
    if (id) {
      setListSkillLevel([]);
      setSkillLevel([]);
      fileUrlImage = [];
      if (pathname.includes('/dashboard/job-post/edit')) {
        setTitle({
          key: 1,
          value: 'Chỉnh sửa bài viết tuyển dụng'
        });
      }
      setLoadingData(true);

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      }).then((response) => {
        const blocksFromHTML = convertFromHTML(response.data.data.description);
        const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        setEditorState(EditorState.createWithContent(content));
        setDescription(response.data.data.description);
        setValue('id', response.data.data.id);
        setValue('title', response.data.data.title);
        setValue('create_date', response.data.data.create_date);
        setValue('quantity', response.data.data.quantity);
        setValue('description', response.data.data.description);
        const money = new Intl.NumberFormat().format(response.data.data.money);
        setMoney(money.replaceAll(',', '.'));
        setStatus(response.data.data.status === 3 ? 2 : response.data.data.status);
        setJobPosition(response.data.data.job_position_id);
        setWorkingStyle(response.data.data.working_style_id);
        setWorkingPlace(response.data.data.working_place);
        if (pathname.includes('/dashboard/job-post/edit')) {
          setStartDay(dayjs(response.data.data.start_time));
          setEndDay(dayjs(response.data.data.end_time));
          setDisabledStartDay(!dayjs().isSameOrBefore(dayjs(response.data.data.start_time), 'day', 'month', 'year'));
          setDisabledEndDay(!dayjs().isSameOrBefore(dayjs(response.data.data.end_time), 'day', 'month', 'year'));
        } else {
          setStartDay(dayjs());
          setEndDay(dayjs().add(1, 'day'));
          setDisabledStartDay(!dayjs().isSameOrBefore(dayjs(startDay), 'day', 'month', 'year'));
          setDisabledEndDay(!dayjs().isSameOrBefore(dayjs(endDay), 'day', 'month', 'year'));
        }

        axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSTSKILL}?jobPostId=${id}`,
          method: 'get',
          // headers: {
          //   'Authorization': `Bearer ${token}`
          // }
        }).then((response) => {
          const listJobPostSkill = response.data.data;
          listJobPostSkill.forEach((element, index) => {
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

          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
            method: 'get',
            // headers: {
            //   'Authorization': `Bearer ${token}`
            // },
          }).then((response) => {
            const listSkill = response.data.data;
            for (let index = 0; index < listJobPostSkill.length; index += 1) {
              append({ skill: listSkill });
              setDisabledField(false);
            }
          }).catch(error => console.log(error));

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
        setLoadingData(false);
      }).catch(error => console.log(error));
    }
  }, [cancel]);

  const handleChangeJobPosition = (event) => {
    if (hasError.jobPosition) {
      setHasError((preState) => ({
        ...preState,
        jobPosition: false
      }));
    };
    setJobPosition(event.target.value);
  };

  const handleChangeWorkingStyle = (event) => {
    setHasError((preState) => ({
      ...preState,
      workingStyle: false
    }));
    setWorkingStyle(event.target.value);
  };

  const handleInputChangeWorkingPlace = (event, newValue) => {
    setInputValueWorkingPlace(newValue);
    if (newValue) {
      debounceAddress(newValue);
    }
  };

  const handleChangeSkill = (event, index) => {
    setDisabledField(true);

    setSkill((prev) => ([
      ...prev, {
        index,
        id: event.target.value,
      }
    ]));

    setHasError((preState) => ({
      ...preState,
      skill: false
    }));

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}/${event.target.value}`,
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
        // },
      }).then((response) => {
        if (skillLevel[index]) {
          skillLevel.splice(index, 1);
        }
        if (listSkillLevel[index]) {
          listSkillLevel[index].skillId = event.target.value;
          listSkillLevel[index].skillLevel = response.data.data;

        } else {
          setListSkillLevel((prev) => ([
            ...prev,
            {
              index,
              skillId: event.target.value,
              skillLevel: response.data.data
            }
          ]));
        }
        setDisabledField(false);

      }).catch(error => console.log(error));
    }).catch(error => console.log(error));
  };

  const handleChangeSkillLevel = (event, obj, index) => {
    setHasError((preState) => ({
      ...preState,
      skillLevel: false
    }));

    if (skillLevel[index]) {
      skillLevel[index].id = event.target.value;
      skillLevel[index].name = obj.props.children;

      setSkillLevel(skillLevel);
    } else {
      setSkillLevel((prev) => ([
        ...prev, {
          index,
          id: event.target.value,
          name: obj.props.children
        }
      ]));
    }

    for (let i = 0; i < skill.length; i += 1) {
      if (skill[i].index === index) {
        setMapSkillAndSkillLevel(new Map(mapSkillAndSkillLevel.set(index, {
          skill_id: skill[i].id,
          skill_level: obj.props.children
        })));
      }
    };

  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const onChangeStartDay = (newValue) => {
    setStartDay(newValue);
    setDefaultEndDay(newValue.add(1, 'day'));
    setEndDay(newValue.add(1, 'day'));
  };

  const onChangeEndDay = (newValue) => {
    setEndDay(newValue);
  };

  const onSubmit = (data) => {
    setLoadingButton(true);
    console.log(oldFileUrlImage);

    if (title.key === 0) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WALLET}?companyId=${localStorage.getItem('company_id')}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // }
      }).then((response) => {
        if (response.data.data[0].balance < money.replaceAll('.', '')) {
          setLoadingButton(false);
          setOpenAlert(true);
          setSeverity('error');
          setMessageAlert('Số dư trong ví không đủ để tạo bài viết');
        } else {
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_JOBPOST}`,
            method: 'post',
            // headers: {
            //   'Authorization': `Bearer ${token}`
            // },
            data: {
              title: data.title,
              description,
              quantity: data.quantity,
              money_for_job_post: money.replaceAll('.', ''),
              company_id: localStorage.getItem('company_id'),
              job_position_id: jobPosition,
              working_style_id: workingStyle,
              working_place: workingPlace,
              start_time: startDay.format('YYYY-MM-DD'),
              end_time: endDay.format('YYYY-MM-DD'),
            }
          }).then((response) => {
            const { data } = response.data;

            Promise.all(mapSkillAndSkillLevel.forEach((value) => {
              axios({
                url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_JOBPOSTSKILL}`,
                method: 'post',
                // headers: {
                //   'Authorization': `Bearer ${token}`
                // },
                data: {
                  job_post_id: data.id,
                  skill_id: value.skill_id,
                  skill_level: value.skill_level
                }
              }).catch(error => console.log(error));
            })).catch(error => console.log(error));

            if (listFileImage.length === 0) {
              // eslint-disable-next-line array-callback-return
              Promise.all(oldFileUrlImage.map((item) => {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_URL_ALBUMIMAGE}`,
                  method: 'post',
                  // headers: {
                  //   'Authorization': `Bearer ${token}`
                  // },
                  data: {
                    job_post_id: data.id,
                    url_image: item.url_image,
                  }
                }).catch(error => console.log(error));
              })).then(() => {
                setLoadingButton(false);
                setOpenAlert(true);
                setSeverity('success');
                setMessageAlert('Tạo bài viết tuyển dụng thành công');
                navigate('/dashboard/job-post');
              }).catch((error) => console.log(error));
            } else {
              const formData = new FormData();
              formData.append('jobPostId', data.id);

              // eslint-disable-next-line no-restricted-syntax, guard-for-in
              for (const key in Object.keys(listFileImage[0])) {
                formData.append('uploadFiles', listFileImage[0][key]);
              }

              axios({
                url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_ALBUMIMAGE}`,
                method: 'post',
                // headers: {
                //   'Authorization': `Bearer ${token}`
                // },
                data: formData
              }).then(() => {
                setLoadingButton(false);
                setOpenAlert(true);
                setSeverity('success');
                setMessageAlert('Tạo bài viết tuyển dụng thành công');
                const action = minusMoney(money.replaceAll('.', ''));
                dispatch(action);
                navigate('/dashboard/job-post?status=created');
              }).catch(error => console.log(error));
            }

          }).catch(error => {
            console.log(error);
            setLoadingButton(false);
            setOpenAlert(true);
            setSeverity('error');
            setMessageAlert('Tạo bài viết tuyển dụng thất bại');
            const action = minusMoney(money.replaceAll('.', ''));
            dispatch(action);
            navigate('/dashboard/job-post?status=create-failed');
          });
        }
      }).catch(error => console.log(error));

    } else {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_JOBPOST}/${data.id}`,
        method: 'put',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
        data: {
          id: data.id,
          title: data.title,
          create_date: data.create_date,
          description,
          quantity: data.quantity,
          money_for_job_post: money.replaceAll('.', ''),
          status,
          company_id: localStorage.getItem('company_id'),
          job_position_id: jobPosition,
          working_style_id: workingStyle,
          working_place: workingPlace,
          start_time: startDay.format('YYYY-MM-DD'),
          end_time: endDay.format('YYYY-MM-DD'),
        }
      }).then((response) => {
        const { data } = response.data;

        Promise.all(oldMapSkillAndSkillLevel.forEach((item) => {
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.DELETE_JOBPOSTSKILL}/${item.job_post_skill_id}`,
            method: 'delete',
            // headers: {
            //   'Authorization': `Bearer ${token}`
            // },
          }).catch(error => console.log(error));
        })).catch(error => console.log(error));

        Promise.all(mapSkillAndSkillLevel.forEach((item) => {
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_JOBPOSTSKILL}`,
            method: 'post',
            // headers: {
            //   'Authorization': `Bearer ${token}`
            // },
            data: {
              job_post_id: data.id,
              skill_id: item.skill_id,
              skill_level: item.skill_level
            }
          }).catch(error => console.log(error));
        })).catch(error => console.log(error));


        if (listFileImage.length === 0) {
          setLoadingButton(false);
          // setOpenAlert(true);
          // setSeverity('success');
          // setMessageAlert('Chỉnh sửa bài viết tuyển dụng thành công');
          navigate('/dashboard/job-post?status=updated');
        } else {
          oldFileUrlImage.forEach((item) => {
            axios({
              url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.DELETE_ALBUMIMAGE}/${item.id}`,
              method: 'delete',
              // headers: {
              //   'Authorization': `Bearer ${token}`
              // },
            }).catch(error => console.log(error));
          });

          const formData = new FormData();
          formData.append('jobPostId', data.id);
          // eslint-disable-next-line no-restricted-syntax, guard-for-in
          for (const key in Object.keys(listFileImage[0])) {
            formData.append('uploadFiles', listFileImage[0][key]);
          }

          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_ALBUMIMAGE}`,
            method: 'post',
            // headers: {
            //   'Authorization': `Bearer ${token}`
            // },
            data: formData
          }).then(() => {
            setLoadingButton(false);
            // setOpenAlert(true);
            // setSeverity('success');
            // setMessageAlert('Chỉnh sửa bài viết tuyển dụng thành công');
            navigate('/dashboard/job-post?status=updated');

          }).catch(error => console.log(error));
        }

      }).catch(error => {
        console.log(error);
        setLoadingButton(false);
        // setOpenAlert(true);
        // setSeverity('error');
        // setMessageAlert('Chỉnh sửa bài viết tuyển dụng thất bại');
        navigate('/dashboard/job-post?status=update-failed');
      });
    }

  };

  const isStepSkipped = (step) => {
    skipped.has(step);
  };

  const handleNext = async () => {
    let isValid = false;
    switch (activeStep) {
      case 0:
        isValid = await trigger(['title', 'quantity']);
        if (!jobPosition) {
          setHasError((preState) => ({
            ...preState,
            jobPosition: true
          }));
          isValid = false;
        }
        if (!editorState.getCurrentContent().hasText()) {
          setHasError((preState) => ({
            ...preState,
            description: true
          }));
          isValid = false;
        }
        if (money.replaceAll('.', '') < 1000) {
          setHasError((preState) => ({
            ...preState,
            money: true
          }));
          isValid = false;
        }
        if (hasError.money) {
          isValid = false;
        }
        break;

      case 1:
        isValid = true;
        if (!skill) {
          setHasError((preState) => ({
            ...preState,
            skill: true
          }));
          isValid = false;
        }
        if (!skillLevel) {
          setHasError((preState) => ({
            ...preState,
            skillLevel: true
          }));
          isValid = false;
        }
        break;

      case 2:
        isValid = true;
        if (!workingStyle) {
          setHasError((preState) => ({
            ...preState,
            workingStyle: true
          }));
          isValid = false;
        }
        if (!workingPlace) {
          setHasError((preState) => ({
            ...preState,
            workingPlace: true
          }));
          isValid = false;
        }
        if (title.key === 0 && listFileImage.length === 0 && oldFileUrlImage.length === 0) {
          setHasError((preState) => ({
            ...preState,
            image: true
          }));
          isValid = false;
        }
        break;

      default:
        isValid = true;
        break;
    }

    if (isValid) {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Page title="Bài tuyển dụng">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          {title.key === 0 ? (
            <HeaderBreadcrumbs
              heading={title.value}
              links={[
                { name: 'Bài viết tuyển dụng', href: '/dashboard/job-post' },
                { name: 'Tạo bài viết tuyển dụng', href: '/dashboard/job-post/create' },
              ]}
            />
          ) : <HeaderBreadcrumbs
            heading={title.value}
            links={[
              { name: 'Bài viết tuyển dụng', href: '/dashboard/job-post' },
              { name: 'Chỉnh sửa bài viết tuyển dụng', href: `/dashboard/job-post/edit` },
            ]}
          />
          }
        </Stack>
        {loadingData ? (
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={index} {...stepProps}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === 1 && (<Button variant='contained' style={{ float: 'right', marginTop: 30 }} onClick={() => {
              if (fields.length > 4) {
                setMessageAlert('Không thêm quá 5 kĩ năng');
                setOpenAlert(true);
              } else if (listSkill.length === 0) {
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
                  method: 'get',
                  // headers: {
                  //   'Authorization': `Bearer ${token}`
                  // },
                }).then((response) => {
                  setListSkill(response.data.data);
                  let tempFilter = response.data.data;
                  mapSkillAndSkillLevel.forEach((mapValue) => {
                    tempFilter = tempFilter.filter((value) => value.id !== mapValue.skill_id);
                  });
                  listSkillFilter = tempFilter;
                  append({ skill: listSkillFilter });
                  setDisabledField(true);
                }).catch(error => console.log(error));
              } else {
                let tempFilter = listSkill;
                mapSkillAndSkillLevel.forEach((mapValue) => {
                  tempFilter = tempFilter.filter((value) => value.id !== mapValue.skill_id);
                });
                listSkillFilter = tempFilter;
                append({ skill: listSkillFilter });
                setDisabledField(true);
              }
            }}>Thêm kĩ năng</Button>)}
            {(() => {
              if (activeStep === steps.length) {
                if (title.key === 0) {
                  return (
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      Đã hoàn thành tất cả các bước, vui lòng bấm <b>Lưu</b> để tạo bài viết tuyển dụng.
                    </Typography>
                  );
                } return (
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    Đã hoàn thành tất cả các bước, vui lòng bấm <b>Lưu</b> để chỉnh sửa bài viết tuyển dụng.
                  </Typography>
                );

              }
              if (activeStep === 0) {
                return (
                  <Grid container spacing={2} style={{ padding: 10, marginTop: 5 }}>
                    <Grid item xs={12}>
                      <input type='hidden' {...register('id')} />
                      <input type='hidden' {...register('create_date')} />
                      <TextField variant='outlined' label='Tiêu đề bài viết tuyển dụng' {...register('title')} fullWidth />
                      <p style={{ color: 'red' }}>{errors.title?.message}</p>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField type='number' variant='outlined' label='Số lượng tuyển' {...register('quantity')} fullWidth />
                      <p style={{ color: 'red' }}>{errors.quantity?.message}</p>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField type='text' variant='outlined' value={money} label='Số tiền cho bài viết' disabled={title.key !== 0} fullWidth onChange={(event) => {
                        const format1 = event.target.value.replaceAll('.', '');
                        const money = new Intl.NumberFormat().format(format1);
                        if (format1 < 1000) {
                          setHasError((preState) => ({
                            ...preState,
                            money: true
                          }));
                        } else {
                          setHasError((preState) => ({
                            ...preState,
                            money: false
                          }));
                        }
                        const format2 = money.replaceAll(',', '.');
                        setMoney(format2);
                      }} />
                      {hasError.money && <p style={{ color: 'red' }}>*Số tiền cho bài viết không nhỏ hơn 1.000</p>}
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Vị trí công việc</InputLabel>
                        <Select
                          name='jobPosition'
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={jobPosition}
                          label="Vị trí công việc"
                          onChange={handleChangeJobPosition}
                        >
                          {listJobPosition.map((el) => (
                            <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                          ))}
                        </Select>
                        {hasError.jobPosition && <p style={{ color: 'red' }}>*Vui lòng chọn vị trí công việc</p>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      {/* <TextField variant='outlined' multiline label='Mô tả công việc' {...register('description')} fullWidth /> */}
                      <Typography variant='h6' gutterBottom>Mô tả:</Typography>
                      <div style={{ border: '1px solid #ccc' }}>
                        <Editor
                          toolbar={{
                            fontFamily: {
                              options: ['Public Sans']
                            }
                          }}
                          defaultContentState={contentState}
                          onContentStateChange={setContentState}
                          editorState={editorState}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          onEditorStateChange={(editorState) => {
                            setEditorState(editorState);
                          }}
                          onBlur={() => {
                            if (editorState.getCurrentContent().hasText()) {
                              setDescription(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                              setHasError((preState) => ({
                                ...preState,
                                description: false
                              }));
                            } else {
                              setDescription('');
                              setHasError((preState) => ({
                                ...preState,
                                description: true
                              }));
                            }
                            console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                          }}
                          toolbarStyle={{ background: '#F9FAFB' }}
                          editorStyle={{ background: 'white' }}
                        />
                      </div>
                      {hasError.description && <p style={{ color: 'red' }}>*Vui lòng nhập mô tả</p>}
                    </Grid>
                  </Grid>
                );
              }
              if (activeStep === 1) {
                return (fields.map((item, index) => (
                  <Grid container spacing={2} columns={24} style={{ padding: 5 }} key={item.id}>
                    <Grid item xs={11} >
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Kĩ năng</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          value={listSkillLevel[index]?.skillId}
                          label="Kĩ năng"
                          onChange={(e) => handleChangeSkill(e, index)}
                        >
                          {console.log(item)}
                          {item.skill.map((el) => (
                            <MenuItem key={el.id} value={el.id} >{el.name}</MenuItem>
                          ))}
                        </Select>
                        {hasError.skill && <p style={{ color: 'red' }}>*Vui lòng chọn kĩ năng</p>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={11}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Cấp bậc</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          value={skillLevel[index]?.id}
                          label="Cấp bậc"
                          onChange={(e, obj) => handleChangeSkillLevel(e, obj, index)}
                          disabled={skillLevel[index]?.id ? false : disabledField}
                        >
                          {listSkillLevel[index]?.skillLevel.map((el) =>
                            (<MenuItem key={el.id} value={el.id} >{el.name}</MenuItem>)
                          )}
                        </Select>
                        {hasError.skillLevel && <p style={{ color: 'red' }}>*Vui lòng chọn cấp bậc</p>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      {fields.length > 1 && (
                        <Grid item xs={2} style={{ display: 'flex' }}>
                          {/* <Button onClick={removeSkill(index)}>Xoá</Button> */}
                          <Button onClick={() => {
                            listSkillLevel.splice(index, 1);
                            skillLevel.splice(index, 1);
                            remove(index);
                          }}>Xoá</Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )));
              };

              if (activeStep === 2) {
                return (
                  <Grid container spacing={2} style={{ padding: 10, marginTop: 5 }}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Hình thức làm việc</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={workingStyle}
                          label="Hình thức làm việc"
                          onChange={handleChangeWorkingStyle}
                        >
                          {listWorkingStyle.map((el) => (
                            <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                          ))}
                        </Select>
                        {hasError.workingStyle && <p style={{ color: 'red' }}>*Vui lòng chọn hình thức làm việc</p>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        value={workingPlace}
                        onChange={(event, newValue) => {
                          setHasError((preState) => ({
                            ...preState,
                            workingPlace: false
                          }));
                          setWorkingPlace(newValue);
                        }}
                        inputValue={inputValueWorkingPlace}
                        onInputChange={handleInputChangeWorkingPlace}
                        options={listWorkingPlace.map((el) => el.name)}
                        renderInput={(params) => <TextField {...params} label="Địa điểm làm việc" />}
                      />
                      {hasError.workingPlace && <p style={{ color: 'red' }}>*Vui lòng chọn địa điểm làm việc</p>}
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label="Ngày bắt đầu tuyển dụng"
                          inputFormat="DD-MM-YYYY"
                          disabled={disabledStartDay}
                          // disablePast={!disabledStartDay}
                          minDate={defaultStartDay}
                          value={startDay}
                          onChange={onChangeStartDay}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label="Ngày kết thúc tuyển dụng"
                          inputFormat="DD-MM-YYYY"
                          disabled={disabledEndDay}
                          // disablePast={!disabledEndDay}
                          minDate={defaultEndDay}
                          value={endDay}
                          onChange={onChangeEndDay}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" component="label">
                        Tải ảnh lên (Tối đa 4 ảnh)
                        <input hidden accept="image/*" multiple type="file" onChange={(file) => {
                          if (file.target.files.length > 4) {
                            setSeverity('error');
                            setMessageAlert('Không thêm quá 4 ảnh');
                            setOpenAlert(true);
                          } else {
                            fileObjImage = [];
                            fileUrlImage = [];
                            setListFileImage([]);
                            fileObjImage.push(file.target.files);
                            for (let index = 0; index < fileObjImage[0].length; index += 1) {
                              // fileUrlImage.push(URL.createObjectURL(fileObjImage[0][index]));
                              fileUrlImage = [...fileUrlImage, { url_image: URL.createObjectURL(fileObjImage[0][index]) }];
                            }
                            setHasError((preState) => ({
                              ...preState,
                              image: false
                            }));

                            setListFileImage(fileObjImage);
                          }
                        }} />
                      </Button>
                      {hasError.image && <p style={{ color: 'red' }}>*Vui lòng chọn ít nhất 1 ảnh</p>}
                    </Grid>
                    <Grid item xs={12}>
                      <ImageList variant='standard' cols={4} gap={8}>
                        {fileUrlImage.map((element, index) => (
                          <ImageListItem key={index}>
                            <ModalImage small={element.url_image} medium={element.url_image} className='modal-image' />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Grid>
                  </Grid>
                );
              }
            })()}

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {(() => {
                if (activeStep === steps.length) {
                  return (
                    <>
                      <Button
                        variant='outlined'
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Quay lại
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button variant='outlined' style={{ marginRight: 10 }} onClick={() => {
                        setCancel(!cancel);
                        clearErrors();
                        setActiveStep(0);
                        reset();
                        setHasError((preState) => ({
                          ...preState,
                          jobPosition: false,
                          skill: false,
                          skillLevel: false,
                          workingStyle: false,
                          workingPlace: false,
                          image: false,
                          status: false,
                          description: false,
                          money: false
                        }));
                        setDescription('');
                        setMoney('1.000');
                        setEditorState(EditorState.createEmpty());
                        setJobPosition('');
                        setSkill([]);
                        setSkillLevel([]);
                        setWorkingStyle('');
                        setWorkingPlace('');
                        setListSkillLevel([]);
                        setStartDay(defaultStartDay);
                        setEndDay(defaultEndDay);
                        fileObjImage = [];
                        fileUrlImage = [];
                      }}>Huỷ</Button>
                      <LoadingButton variant='contained' type='submit' style={{ float: 'right' }} loading={loadingButton}>
                        Lưu
                      </LoadingButton>
                    </>
                  );
                }
                if (activeStep !== steps.length) {
                  return (
                    <>
                      <Button
                        variant='outlined'
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Quay lại
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button variant='contained' onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
                      </Button>
                    </>
                  );
                }
              })()}
            </Box>
          </form>
        )}
      </Container>
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant='filled'>
          {messageAlert}
        </Alert>
      </Snackbar>
    </Page>
  );
};