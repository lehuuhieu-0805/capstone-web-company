import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, CardContent, CardHeader, Container, FormControl, Grid, InputLabel, MenuItem, Select, Tab, Tabs, TextField } from '@mui/material';
import axios from 'axios';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import TabPanel from '../components/TabPanel';
import { api, common } from '../constants';
import AlertMessage from '../components/AlertMessage';


export default function CreateCompany() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loadingButtonDone, setLoadingButtonDone] = useState(false);
  const [disableButtonDone, setDisableButtonDone] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [valueTab, setValueTab] = useState(0);
  const [company, setCompany] = useState('');
  const [listCompany, setListCompany] = useState([]);
  const [loadingButtonConfirm, setLoadingButtonConfirm] = useState(false);
  const [emailUser, setEmailUser] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const { Email } = jwtDecode(token);
    setEmailUser(Email);
  }, []);

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_COMPANIES}?status=1`,
      method: 'get',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    }).then((response) => {
      setListCompany(response.data.data);
    }).catch(error => console.log(error));
  }, []);

  return (
    <Container maxWidth='sm'>
      <Card>
        <CardContent>
          <Tabs value={valueTab} onChange={(event, newValue) => setValueTab(newValue)} aria-label="basic tabs example">
            <Tab label='Chọn công ty' id='simple-tab-0' aria-controls='simple-tabpanel-0' />
            <Tab label='Tạo công ty' id='simple-tab-1' aria-controls='simple-tabpanel-1' />
          </Tabs>

          <TabPanel value={valueTab} index={0}>
            <Autocomplete
              value={company}
              onChange={(event, newValue) => {
                setCompany(newValue);
              }}
              options={listCompany.map((el) => ({ id: el.id, label: el.name }))}
              renderInput={(params) => <TextField {...params} label="Chọn công ty" />}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <LoadingButton variant='contained' disabled={!company} loading={loadingButtonConfirm} onClick={() => {
                // update companyId for user
                setLoadingButtonConfirm(true);
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_USER}?email=${emailUser}`,
                  method: 'get',
                  // headers: {
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then((response) => {
                  for (let i = 0; i < response.data.data.length; i += 1) {
                    const element = response.data.data[i];
                    if (element.email === emailUser) {
                      axios({
                        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_USER}?id=${response.data.data[0].id}`,
                        method: 'put',
                        // headers: {
                        //   Authorization: `Bearer ${token}`
                        // },
                        data: {
                          id: response.data.data[0].id,
                          phone: response.data.data[0].phone,
                          email: response.data.data[0].email,
                          role_id: response.data.data[0].role_id,
                          status: 4,
                          company_id: company.id,
                        }
                        // eslint-disable-next-line no-loop-func
                      }).then(() => {
                        axios({
                          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_MAIL_TO_ADMIN_TO_JOIN_COMPANY}?email=${emailUser}`,
                          method: 'post',
                          // headers: {
                          //   Authorization: `Bearer ${token}`
                          // }
                        }).then(() => {
                          setLoadingButtonConfirm(false);
                          setSeverity('success');
                          setAlertMessage('Chọn công ty thành công, vui lòng đợi admin duyệt');
                          setOpenAlert(true);
                          navigate('/dashboard/show-information-join');
                        }).catch(error => console.log(error));
                      }).catch((error) => {
                        console.log(error);
                        setLoadingButtonConfirm(false);
                        setSeverity('error');
                        setAlertMessage('Chọn công ty thất bại, vui lòng thử lại sau');
                        setOpenAlert(true);
                      });
                    }
                  }
                }).catch(error => {
                  console.log(error);
                  setLoadingButtonConfirm(false);
                  setSeverity('error');
                  setAlertMessage('Tài khoản không tồn tại');
                  setOpenAlert(true);
                  setTimeout(() => {
                    navigate('/login');
                  }, 3000);
                });
              }}>Xác nhận</LoadingButton>
            </div>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <RegisterCompanyForm setSeverity={setSeverity} setMessageAlert={setAlertMessage} setOpenAlert={setOpenAlert} setOpenDialog={setOpenDialog} emailUser={emailUser} />
          </TabPanel>
        </CardContent>
      </Card>
      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} severity={severity} />
    </Container>
  );
}

function RegisterCompanyForm({ setSeverity, setMessageAlert, setOpenAlert, setOpenDialog, emailUser }) {
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tên công ty'),
    email: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
    phone: Yup.string().required('Vui lòng nhập số điện thoại').matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").max(10, 'Số điện thoại không hợp lệ'),
    website: Yup.string().required('Vui lòng nhập địa chỉ website'),
    description: Yup.string().required('Vui lòng nhập mô tả công ty'),
    taxCode: Yup.string().required('Vui lòng nhập mã số thuế'),
  });

  const [loadingButtonRegister, setLoadingButtonRegister] = useState(false);
  const [companyType, setCompanyType] = useState(1);
  const [logo, setLogo] = useState({
    file: null,
    error: false,
  });

  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      website: '',
      description: '',
      taxCode: ''
    }
  });

  const onSubmit = (data) => {
    if (!logo.file) {
      setLogo({ file: null, error: true });
      return;
    }
    setLoadingButtonRegister(true);
    data.company_type = companyType;
    data.logo = logo.file;

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('website', data.website);
    formData.append('description', data.description);
    formData.append('companyType', data.company_type);
    formData.append('uploadFile', data.logo);
    formData.append('taxCode', data.taxCode);

    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_COMPANY}`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${token}`,        
      },
      data: formData
    }).then((response) => {
      const companyId = response.data.data.id;

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_USER}?email=${emailUser}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        for (let i = 0; i < response.data.data.length; i += 1) {
          const element = response.data.data[i];
          if (element.email === emailUser) {
            // update companyId and status = 4 for user
            axios({
              url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_USER}?id=${element.id}`,
              method: 'put',
              // headers: {
              //   Authorization: `Bearer ${token}`
              // },
              data: {
                id: element.id,
                phone: element.phone,
                email: element.email,
                role_id: element.role_id,
                status: 5,
                company_id: companyId,
              }
            }).then(() => {
              axios({
                url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_MAIL_TO_ADMIN}?email=${getValues('email')}`,
                method: 'post',
                // headers:{
                //   Authorization: `Bearer ${token}`
                // }
              }).then(() => {
                if (logo.file) {
                  URL.revokeObjectURL(logo.file.preview);
                  setLogo({ file: null, error: false });
                }
                setLoadingButtonRegister(false);
                setSeverity('success');
                setMessageAlert('Đăng ký công ty thành công, công ty của bạn đang được admin phê duyệt');
                setOpenAlert(true);
                setOpenDialog(false);
                reset();
                navigate('/dashboard/show-information-create');
              }).catch(error => console.log(error));
            }).catch(error => console.log(error));
          }
        }

      });

    }).catch(error => {
      console.log(error);
      setLoadingButtonRegister(false);
      setSeverity('error');
      setMessageAlert('Đăng ký công ty không thành công');
      setOpenAlert(true);
    });
  };

  const onError = (error) => {
    if (!logo.file) {
      setLogo({ file: null, error: true });
      return;
    }

    console.log(error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField fullWidth name="name" {...register('name')} label="Tên công ty" />
          <p style={{ color: 'red' }}>{errors.name?.message}</p>
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="website" {...register('website')} label="Website" />
          <p style={{ color: 'red' }}>{errors.website?.message}</p>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Loại công ty</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={companyType}
              label="Loại công ty"
              onChange={(event) => {
                setCompanyType(event.target.value);
              }}
            >
              {common.STATUS_COMPANY.map((element, index) =>
                <MenuItem key={index} value={element.value}>{element.label}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth name="email" {...register('email')} label="Email" />
          <p style={{ color: 'red' }}>{errors.email?.message}</p>
        </Grid>
        <Grid item xs={6}>
          <TextField type='number' fullWidth name="phone" {...register('phone')} label="Số điện thoại" />
          <p style={{ color: 'red' }}>{errors.phone?.message}</p>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline name="description" {...register('description')} label="Mô tả" />
          <p style={{ color: 'red' }}>{errors.description?.message}</p>
        </Grid>
        <Grid item xs={6}>
          <TextField type='number' fullWidth name="taxCode" {...register('taxCode')} label="Mã số thuế" />
          <p style={{ color: 'red' }}>{errors.taxCode?.message}</p>
        </Grid>
        <Grid item xs={6}>
          <Button variant='outlined' component='label'>
            Tải lên ảnh logo công ty
            <input hidden accept='image/*' type='file' onChange={(event) => {
              const file = event.target.files[0];
              file.preview = URL.createObjectURL(file);
              setLogo({ file, error: false });
            }} />
          </Button>
          {logo.file?.preview && (
            <img style={{ marginTop: 10, height: 200, objectFit: 'contain' }} src={logo.file.preview} alt='hinhanh' />
          )}
          {logo.error && <p style={{ color: 'red' }}>Vui lòng tải lên ảnh logo công ty</p>}
        </Grid>
        <Grid item xs={12}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loadingButtonRegister} >
            Đăng kí
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}