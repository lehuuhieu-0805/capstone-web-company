import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
// @mui
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
// components
import axios from 'axios';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
// form
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AlertMessage from '../../../components/AlertMessage';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { api, common } from '../../../constants';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openDialogConfirmMail, setOpenDialogConfirmMail] = useState(false);
  const [confirmMail, setConfirmMail] = useState({
    code: '',
    error: false,
    message: ''
  });
  const [loadingButtonDone, setLoadingButtonDone] = useState(false);
  const [disableButtonDone, setDisableButtonDone] = useState(true);
  const [loadingButtonLogin, setLoadingButtonLogin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [valueTab, setValueTab] = useState(0);
  const [company, setCompany] = useState('');
  const [listCompany, setListCompany] = useState([]);
  const [loadingButtonConfirm, setLoadingButtonConfirm] = useState(false);
  const [emailUser, setEmailUser] = useState('');
  const [openDialogForgetPassword, setOpenDialogForgetPassword] = useState(false);

  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit, getValues, reset
  } = methods;

  const onSubmit = async (data) => {
    setEmailUser(data.email);
    setLoadingButtonLogin(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.LOGIN}`,
      method: 'post',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      data: {
        email: data.email,
        password: data.password
      }
    }).then((response) => {
      // console.log(response);


      // if (response.data.detail === 'User or password not correct!!! ') {
      //   setSeverity('error');
      //   setMessageAlert('Sai tài khoản hoặc mật khẩu');
      //   setOpenAlert(true);
      //   localStorage.clear();
      //   // eslint-disable-next-line consistent-return
      //   return;
      // }
      localStorage.setItem('token', response.data.token);
      const company = jwtDecode(response.data.token);

      // console.log(company)
      if (company.role === 'COMPANY') {

        localStorage.setItem('user_id', company.Id);
        localStorage.setItem('company_id', company.Id);
        localStorage.setItem('role', company.role);
        setLoadingButtonLogin(false);
        navigate('/company/dashboard?status=logged', { replace: true });
      }
      if (company.role === 'EMPLOYEE') {
        axios({
          url: `https://stg-api-itjob.unicode.edu.vn/api/v1/employees/${company.Id}`,
          method: 'get',
          // headers: {
          //   Authorization: `Bearer ${token}`
          // }
        }).then((response) => {
          console.log(response);
          if (response.data.data.status === 0) {
            setSeverity('error');
            setMessageAlert('Tài khoản của bạn đã bị xoá khỏi công ty');
            setOpenAlert(true);
            localStorage.clear();
            setLoadingButtonLogin(false);
          } else {
            // console.log(response.data.data)
            localStorage.setItem('user_id', company.Id);
            localStorage.setItem('role', company.role);
            localStorage.setItem('company_id', response.data.data.company_id);
            setLoadingButtonLogin(false);
            navigate('/employee/dashboard?status=logged', { replace: true });
          }


        }).catch(error => console.log(error));
      }



      // axios({
      //   url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_JOBPOST}/${IdUser}`,
      //   method: 'get',
      //   // headers: {
      //   //   Authorization: `Bearer ${token}`
      //   // }
      // }).then((response) => {
      //   setRefreshData(!refreshData);
      //   setLoadingButtonHidden(false);
      //   setOpenDialogHidden(false);
      //   setOpenAlert(true);
      //   setSeverity('success');
      //   setMessageAlert('Ẩn bài viết tuyển dụng thành công');
      //   const action = addMoney(response.data.data.money);
      //   dispatch(action);
      // }).catch(error => console.log(error));


      //         localStorage.setItem('company_id', IdUser);
      //         setLoadingButtonLogin(false);
      //         navigate('/dashboard/app?status=logged', { replace: true });
      // if (response.data.token.result.msg.trim() === 'Your account not have any company, please create your company!!!') {
      //   setLoadingButtonLogin(false);
      //   navigate('/dashboard/create-company', { replace: true });
      // } else if (response.data.token.result.msg.trim() === 'Your account not approved yet, please wait for admin approved!!!') {
      //   navigate('/dashboard/show-information-join');
      // } else if (response.data.token.result.msg.trim() === 'Your company not approved yet, please wait for admin approved!!!') {
      //   navigate('/dashboard/show-information-create');
      // } else if (response.data.token.result.msg.trim() === 'Login success!!!') {
      //   axios({
      //     url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_USER}?email=${getValues('email')}`,
      //     method: 'get',
      //     // headers: {
      //     //   Authorization: `Bearer ${token}`,
      //     // }
      //   }).then((response) => {
      //     for (let i = 0; i < response.data.data.length; i += 1) {
      //       const element = response.data.data[i];
      //       if (element.email === getValues('email')) {
      //         localStorage.setItem('user_id', element.id);
      //         localStorage.setItem('company_id', element.company_id);
      //         setLoadingButtonLogin(false);
      //         navigate('/dashboard/app?status=logged', { replace: true });
      //       }
      //     }
      //   });
      // }
    }).catch((error) => {
      // console.log(error.response);
      setLoadingButtonLogin(false);

      if (error.response.data.detail === 'Your account not verify, please verify your account and login again!!!') {
        setSeverity('error');
        setMessageAlert('Tài khoản của bạn chưa xác thực otp.Vui lòng xác thực');
        setOpenAlert(true);
        axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_CODE_CONFIRM_MAIL}?email=${getValues('email')}`,
          method: 'POST',
          // headers: {
          //   Authorization: `Bearer ${token}`
          // },
        }).then(() => setOpenDialogConfirmMail(true))
          .catch(error => {
            console.log(error);
            setSeverity('error');
            setMessageAlert('Gửi email xác thực không thành công');
            setOpenAlert(true);
          });
      } else if (error.response.data.detail.trim() === 'you have not been approved, please wait for the admin to approve and log in again!!!') {
        setSeverity('error');
        setMessageAlert('Công ty của bạn chưa được admin phê duyệt, vui lòng đợi Admin phê duyệt');
        setOpenAlert(true);

      } else if (error.response.data.detail.trim() === 'Email or password not correct!!!') {
        setSeverity('error');
        setMessageAlert('Sai tài khoản hoặc mật khẩu');
        setOpenAlert(true);

      } else {

        setSeverity('error');
        setMessageAlert('Có lỗi xảy ra.Vui lòng thử lại sau');
        setOpenAlert(true);
      }
    });
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFTextField name="email" label="Email" />

          <RHFTextField
            name="password"
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
          <Link variant="subtitle2" underline="hover" sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
            onClick={() => {
              setEmailUser('');
              setOpenDialogForgetPassword(true);
            }}
          >
            Quên mật khẩu?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loadingButtonLogin}>
          Đăng nhập
        </LoadingButton>
      </FormProvider>

      <Dialog
        open={openDialogConfirmMail}
      >
        <DialogTitle>Xác thực email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nhập mã chúng tôi đã gửi đến <b>{getValues('email')}</b>. Nếu bạn không nhận được email, hãy kiểm tra thư mục rác của bạn.
          </DialogContentText>
          <TextField value={confirmMail.code} style={{ marginTop: 10 }} label='Nhập mã xác thực' variant='standard' fullWidth onChange={(event) => {
            const { value } = event.target;
            if (!value.match(/^[0-9]+$/)) {
              setDisableButtonDone(true);
              return setConfirmMail({
                code: value,
                error: true,
                message: 'Mã xác thực chỉ chứa các chữ số'
              });
            }
            if (value.length > 4) {
              setDisableButtonDone(true);
              return setConfirmMail({
                code: value,
                error: true,
                message: 'Mã xác thực gồm 4 chữ số'
              });
            }
            setDisableButtonDone(false);
            return setConfirmMail({ code: value, error: false, message: '' });
          }} />
          {confirmMail.error && <p style={{ color: 'red' }}>{confirmMail.message}</p>}
          <DialogActions>
            <LoadingButton disabled={disableButtonDone} loading={loadingButtonDone} style={{ marginTop: 20 }} variant='contained' onClick={() => {
              setLoadingButtonDone(true);
              axios({
                url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_CHECK_CODE_CONFIRM_MAIL}?code=${confirmMail.code}&email=${getValues('email')}`,
                method: 'POST',
                // headers: {
                //   Authorization: `Bearer ${token}`
                // },
              }).then(() => {
                setLoadingButtonDone(false);
                window.location.assign('/login?status=verified');
              }).catch(error => {
                console.log(error);
                setLoadingButtonDone(false);
                setSeverity('error');
                setMessageAlert('Xác thực không thành công');
                setOpenAlert(true);
              });
            }}>Hoàn thành</LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={openDialog} fullWidth maxWidth='sm'>
        <DialogContent>
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
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_USER}?email=${getValues('email')}`,
                  method: 'get',
                  // headers: {
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then((response) => {
                  for (let i = 0; i < response.data.data.length; i += 1) {
                    const element = response.data.data[i];
                    if (element.email === getValues('email')) {
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
                      }).then(() => {
                        axios({
                          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_MAIL_TO_ADMIN_TO_JOIN_COMPANY}?email=${getValues('email')}`,
                          method: 'post',
                          // headers: {
                          //   Authorization: `Bearer ${token}`
                          // }
                        }).then(() => {
                          setLoadingButtonConfirm(false);
                          setSeverity('success');
                          setMessageAlert('Chọn công ty thành công, vui lòng đợi admin duyệt');
                          setOpenAlert(true);
                          setTimeout(() => {
                            navigate(0);
                          }, 3000);
                        }).catch(error => console.log(error));
                      }).catch(error => {
                        console.log(error);
                        setLoadingButtonConfirm(false);
                        setSeverity('error');
                        setMessageAlert('Chọn công ty thất bại, vui lòng thử lại sau');
                        setOpenAlert(true);
                        setTimeout(() => {
                          navigate(0);
                        }, 3000);
                      });
                    }
                  }
                }).catch(error => {
                  console.log(error);
                  setLoadingButtonConfirm(false);
                  setSeverity('error');
                  setMessageAlert('Tài khoản không tồn tại');
                  setOpenAlert(true);
                  setTimeout(() => {
                    navigate(0);
                  }, 3000);
                });
              }}>Xác nhận</LoadingButton>
            </div>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <RegisterCompanyForm setSeverity={setSeverity} setMessageAlert={setMessageAlert} setOpenAlert={setOpenAlert} setOpenDialog={setOpenDialog} emailUser={emailUser} />
          </TabPanel>
        </DialogContent>
      </Dialog> */}

      <DialogForgetPassword setOpenDialogForgetPassword={setOpenDialogForgetPassword} openDialogForgetPassword={openDialogForgetPassword} setSeverity={setSeverity} setMessageAlert={setMessageAlert} setOpenAlert={setOpenAlert} />

      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={messageAlert} severity={severity} />
    </>
  );
};


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'} variant={'body2'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function RegisterCompanyForm({ setSeverity, setMessageAlert, setOpenAlert, setOpenDialog, emailUser }) {
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

function DialogForgetPassword({ openDialogForgetPassword, setOpenDialogForgetPassword, setSeverity, setMessageAlert, setOpenAlert }) {
  const [countDown, setCountDown] = useState(1);
  const [sentEmail, setSentEmail] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCountDown(prev => prev - 1);
    }, 1000);
    if (countDown === 0) {
      clearInterval(timerId);
      setSentEmail(false);
    }

    return () => clearInterval(timerId);
  }, [countDown]);

  const schema = Yup.object().shape({
    email: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
    code: Yup.string().required('Vui lòng nhập mã xác nhận').length(4, 'Mã xác nhận phải là 4 ký tự'),
    password: Yup.string().required('Vui lòng nhập mật khẩu')
  });

  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    setLoadingSubmit(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_RESET_PASSWORD_USER}?email=${data.email}&otp=${data.code}&newPassword=${data.password}`,
      method: 'put',
      // headers:{
      //   Authorization: `Bearer ${token}`
      // }
    }).then(() => {
      setMessageAlert('Thay đổi mật khẩu thành công');
      setSeverity('success');
      setOpenAlert(true);
      setLoadingSubmit(false);
      setOpenDialogForgetPassword(false);
      reset();
    }).catch(error => {
      console.log(error);
      if (error.response.data.message.trim() === 'Invalid code!!!') {
        setMessageAlert('Mã xác nhận không chính xác');
        setSeverity('error');
        setOpenAlert(true);
      } else {
        setMessageAlert('Thay đổi mật khẩu không thành công, vui lòng thử lại');
        setSeverity('error');
        setOpenAlert(true);
      }
      setLoadingSubmit(false);
    });
  };

  return (
    <Dialog open={openDialogForgetPassword} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12}>
              <TextField sx={{ mt: 2 }} {...register('email')} label='Email' variant='outlined' fullWidth />
              <p style={{ color: 'red' }}>{errors.email?.message}</p>
            </Grid>
            <Grid item xs={8}>
              <TextField type='number' {...register('code')} label='Mã xác thực' variant='outlined' fullWidth />
              <p style={{ color: 'red' }}>{errors.code?.message}</p>
            </Grid>
            <Grid item xs={4}>
              <LoadingButton variant='contained' disabled={sentEmail} loading={loadingSendCode} onClick={() => {
                setLoadingSendCode(true);
                axios({
                  url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_CODE_CONFIRM_MAIL}?email=${getValues('email')}`,
                  method: 'post',
                  // headers:{
                  //   Authorization: `Bearer ${token}`
                  // }
                }).then(() => {
                  setSentEmail(true);
                  setCountDown(60);
                  setMessageAlert('Gửi mã xác thực thành công');
                  setSeverity('success');
                  setOpenAlert(true);
                  setLoadingSendCode(false);
                }).catch(error => {
                  console.log(error);
                  setMessageAlert('Gửi mã xác thực không thành công');
                  setSeverity('error');
                  setOpenAlert(true);
                  setLoadingSendCode(false);
                });
              }}>{sentEmail ? countDown : 'Gửi mã'}</LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <TextField type='password' {...register('password')} label='Mật khẩu mới' variant='outlined' fullWidth />
              <p style={{ color: 'red' }}>{errors.password?.message}</p>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => {
            setOpenDialogForgetPassword(false);
            reset();
          }}>Huỷ</Button>
          <LoadingButton loading={loadingSubmit} type='submit' variant='contained'>Xác nhận</LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}