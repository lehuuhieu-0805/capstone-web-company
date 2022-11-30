// @mui
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { api, common } from '../../../constants';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';



// ----------------------------------------------------------------------

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên công ty'),
  email: yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
  phone: yup.string().required('Vui lòng nhập số điện thoại').matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").max(10, 'Số điện thoại không hợp lệ'),
  website: yup.string().required('Vui lòng nhập địa chi website'),
  description: yup.string().required('Vui lòng nhập mô tả công ty'),
});

export default function RegisterForm() {
  const [companyType, setCompanyType] = useState(1);
  const [logo, setLogo] = useState({
    file: null,
    error: false,
  });
  const [businessRegistration, setBusinessRegistration] = useState({
    file: null,
    error: false
  });
  const [loadingButtonRegister, setLoadingButtonRegister] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openDialogConfirmMail, setOpenDialogConfirmMail] = useState(false);
  const [confirmMail, setConfirmMail] = useState({
    code: '',
    error: false,
    message: ''
  });
  const [loadingButtonConfirm, setLoadingButtonConfirm] = useState(false);
  const [disableButtonConfirm, setDisableButtonConfirm] = useState(true);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerSchema = yup.object().shape({
    email: yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập địa chỉ email'),
    phone: yup.string().required('Vui lòng nhập số điện thoại').matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").max(10, 'Số điện thoại không hợp lệ'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
    confirmPassword: yup.string().required('Vui lòng nhập lại mật khẩu').oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
  });

  const defaultValues = {
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues,
  });

  const {
    handleSubmit, getValues, reset,
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    setLoadingButtonRegister(true);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_USER}`,
      method: 'POST',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      data: {
        phone: data.phone,
        email: data.email,
        password: data.password,
        role_id: '61F8FC17-55F2-46F8-BC8D-86CB4AB3B07D'
      }
    }).then(() => {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_CODE_CONFIRM_MAIL}?email=${getValues('email')}`,
        method: 'POST',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // },
      }).then(() => {
        setSeverity('success');
        setMessageAlert('Đăng kí tài khoản thành công');
        setOpenAlert(true);
        setOpenDialogConfirmMail(true);
        setLoadingButtonRegister(false);
      }).catch(error => {
        console.log(error);
        setLoadingButtonRegister(false);
        setSeverity('error');
        setMessageAlert('Gửi email xác thực không thành công!');
        setOpenAlert(true);
      });
    }).catch(error => {
      console.log(error);
      setLoadingButtonRegister(false);
      setSeverity('error');
      setMessageAlert('Đăng kí tài khoản không thành công');
      setOpenAlert(true);
    });
  };

  // useEffect(() =>
  //   () => {
  //     if (logo.file) {
  //       URL.revokeObjectURL(logo.file.preview);
  //     }
  //     if (businessRegistration.file) {
  //       URL.revokeObjectURL(businessRegistration.file.preview);
  //     }
  //   }

  //   , [logo, businessRegistration]);

  // const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
  //   resolver: yupResolver(schema),
  //   mode: 'onChange',
  //   defaultValues: {
  //     name: '',
  //     email: '',
  //     phone: '',
  //     website: '',
  //     description: '',
  //     code: ''
  //   }
  // });

  // const onSubmit = (data) => {
  //   if (!logo.file) {
  //     setLogo({ file: null, error: true });
  //     return;
  //   }
  //   if (!businessRegistration.file) {
  //     setBusinessRegistration({ file: null, error: true });
  //     return;
  //   }

  //   setLoadingButtonRegister(true);

  //   data.company_type = companyType;
  //   data.logo = logo.file;
  //   data.business_registration = businessRegistration.file;
  //   console.log(data);

  //   const formData = new FormData();
  //   formData.append('name', data.name);
  //   formData.append('email', data.email);
  //   formData.append('phone', data.phone);
  //   formData.append('website', data.website);
  //   formData.append('description', data.description);
  //   formData.append('companyType', data.company_type);
  //   formData.append('uploadFile', data.logo);
  //   formData.append('businessRegistration', data.business_registration);

  //   axios({
  //     url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_COMPANY}`,
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       // Authorization: `Bearer ${token}`,        
  //     },
  //     data: formData
  //   }).then((response) => {
  //     console.log(response);
  //     setLoadingButtonRegister(false);
  //     axios({
  //       url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_CODE_CONFIRM_MAIL}?email=${getValues('email')}`,
  //       method: 'POST',
  //       // headers: {
  //       //   Authorization: `Bearer ${token}`
  //       // },
  //     }).then(() => setOpenDialogConfirmMail(true))
  //       .catch(error => {
  //         console.log(error);
  //         setLoadingButtonRegister(false);
  //         setSeverity('error');
  //         setMessageAlert('Gửi email xác thực không thành công!');
  //         setOpenAlert(true);
  //       });
  //   }).catch(error => {
  //     console.log(error);
  //     setLoadingButtonRegister(false);
  //     setSeverity('error');
  //     setMessageAlert('Đăng ký không thành công!');
  //     setOpenAlert(true);
  //   });
  // };

  // const onError = (error) => {
  //   console.log(error);
  //   if (!logo.file) {
  //     setLogo({ file: null, error: true });
  //   }
  //   if (!businessRegistration.file) {
  //     setBusinessRegistration({ file: null, error: true });
  //   }
  // };

  return (
    <>
      {/* <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth {...register('name')} name="name" label="Tên công ty" />
            <p style={{ color: 'red' }}>{errors.name?.message}</p>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth {...register('website')} name="website" label="Địa chỉ Website" />
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
            <TextField fullWidth {...register('email')} name="email" label="Địa chỉ Email" />
            <p style={{ color: 'red' }}>{errors.email?.message}</p>
          </Grid>
          <Grid item xs={6}>
            <TextField type='number' fullWidth {...register('phone')} name="phone" label="Số điện thoại" />
            <p style={{ color: 'red' }}>{errors.phone?.message}</p>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth {...register('description')} name="description" label="Mô tả" />
            <p style={{ color: 'red' }}>{errors.description?.message}</p>
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
              <img style={{ marginTop: 10, height: 200 }} src={logo.file.preview} alt='hinhanh' />
            )}
            {logo.error && <p style={{ color: 'red' }}>Vui lòng tải lên ảnh logo công ty</p>}
          </Grid>
          <Grid item xs={6}>
            <Button variant='outlined' component='label'>
              Tải lên ảnh giấy phép kinh doanh
              <input hidden accept='image/*' type='file' onChange={(event) => {
                const file = event.target.files[0];
                file.preview = URL.createObjectURL(file);
                setBusinessRegistration({ file, error: false });
              }} />
            </Button>
            {businessRegistration.file?.preview && (
              <img style={{ marginTop: 10, height: 200 }} src={businessRegistration.file.preview} alt='hinhanh' />
            )}
            {businessRegistration.error && <p style={{ color: 'red' }}>Vui lòng tải lên ảnh giấy phép kinh doanh</p>}
          </Grid>
          <Grid item xs={12}>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loadingButtonRegister} >
              Đăng kí
            </LoadingButton>
          </Grid>
        </Grid>
      </form> */}

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <RHFTextField name="email" label="Địa chỉ email" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <RHFTextField name="phone" type='number' label="Số điện thoại" fullWidth />
            </Grid>
          </Grid>

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

          <RHFTextField
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton sx={{ mt: 3 }} fullWidth size="large" type="submit" variant="contained" loading={loadingButtonRegister}>
          Đăng kí
        </LoadingButton>
      </FormProvider>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={5000} onClose={() => setOpenAlert(false)}>
        <Alert variant='filled' severity={severity}>
          {messageAlert}
        </Alert>
      </Snackbar>

      <Dialog
        open={openDialogConfirmMail}
        onClose={() => setOpenDialogConfirmMail(false)}
      >
        <DialogTitle>Xác thực email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nhập mã chúng tôi đã gửi đến <b>{getValues('email')}</b>. Nếu bạn không nhận được email, hãy kiểm tra thư mục rác của bạn.
          </DialogContentText>
          <TextField value={confirmMail.code} style={{ marginTop: 10 }} label='Nhập mã xác thực' variant='standard' fullWidth onChange={(event) => {
            const { value } = event.target;
            if (!value.match(/^[0-9]+$/)) {
              setDisableButtonConfirm(true);
              return setConfirmMail({
                code: value,
                error: true,
                message: 'Mã xác thực chỉ chứa các chữ số'
              });
            }
            if (value.length > 4) {
              setDisableButtonConfirm(true);
              return setConfirmMail({
                code: value,
                error: true,
                message: 'Mã xác thực gồm 4 chữ số'
              });
            }
            setDisableButtonConfirm(false);
            return setConfirmMail({ code: value, error: false, message: '' });
          }} />
          {confirmMail.error && <p style={{ color: 'red' }}>{confirmMail.message}</p>}
          <DialogActions>
            <LoadingButton disabled={disableButtonConfirm} loading={loadingButtonConfirm} style={{ marginTop: 20 }} variant='contained' onClick={() => {
              setLoadingButtonConfirm(true);
              axios({
                url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_CHECK_CODE_CONFIRM_MAIL}?code=${confirmMail.code}&email=${getValues('email')}`,
                method: 'POST',
                // headers: {
                //   Authorization: `Bearer ${token}`
                // },
              }).then(() => {
                // setSeverity('success');
                // setMessageAlert('Xác thực email thành công');
                // setOpenAlert(true);
                reset();
                // setTimeout(() => {
                //   setLoadingButtonConfirm(false);
                //   navigate('/login', { replace: true });
                // }, 3000);
                navigate('/login?status=verified');
                // axios({
                //   url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SEND_MAIL_TO_ADMIN}?email=${getValues('email')}`,
                //   method: 'post',
                //   // headers:{
                //   //   Authorization: `Bearer ${token}`
                //   // }
                // }).then(() => {
                //   setTimeout(() => {
                //     navigate('/login');
                //   }, 3000);
                // }).catch(error => console.log(error));
                // reset();
                // if (logo.file) {
                //   URL.revokeObjectURL(logo.file.preview);
                //   setLogo({ file: null, error: false });
                // }
                // if (businessRegistration.file) {
                //   URL.revokeObjectURL(businessRegistration.file.preview);
                //   setBusinessRegistration({ file: null, error: false });
                // }
              }).catch(error => {
                console.log(error);
                setLoadingButtonConfirm(false);
                setSeverity('error');
                setMessageAlert('Xác thực không thành công!');
                setOpenAlert(true);
              });
            }}>Hoàn thành</LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
