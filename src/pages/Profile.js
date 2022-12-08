// component
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Card, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, Stack, TextareaAutosize, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Page from '../components/Page';
import { api, common } from '../constants';
import { updateCompany } from '../slices/companySlice';

const formData = new FormData();


const schema = yup.object({
  name: yup.string().nullable().required('*Vui lòng nhập tên công ty'),
  website: yup.string().nullable().required('*Vui lòng nhập địa chỉ website'),
  email: yup.string().nullable().email('*Email không đúng định dạng').required('*Vui lòng nhập địa chỉ email'),
  phone: yup.string().required('Vui lòng nhập số điện thoại').matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").min(10, 'Số điện thoại không hợp lệ').max(10, 'Số điện thoại không hợp lệ'),
  description: yup.string().nullable().required('*Vui lòng nhập mô tả')
});

export default function Profile() {
  const token = localStorage.getItem('token');
  const [disabled, setDisabled] = useState(true);
  const [showButtonEdit, setShowButtonEdit] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [companyType, setCompanyType] = useState('');
  const [statusCompany, setStatusCompany] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [logo, setLogo] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('');
  const [loadingButton, setLoadingButton] = useState(false);

  const dispatch = useDispatch();

  const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      website: '',
      email: '',
      phone: '',
      company_type: '',
      status: '',
      description: '',
      premium: '',
      id: '',
    }
  });

  const companyId = localStorage.getItem('company_id');

  useEffect(() => {

    axios.get(`${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_COMPANY}/${companyId}`)
      .then((response) => {
        console.log(response);
        setValue('name', response.data.data.name);
        setValue('website', response.data.data.website);
        setValue('email', response.data.data.email);
        setValue('phone', response.data.data.phone);
        setValue('description', response.data.data.description);
        setValue('is_premium', response.data.data.premium);
        setValue('id', response.data.data.id);
        setCompanyType(response.data.data.company_type);
        setStatusCompany(response.data.data.status);
        setImageUrl(response.data.data.logo);
        setLoadingData(true);
      })
      .catch(err => console.log(err));
  }, [setValue, loadingData, companyId]);

  useEffect(() =>
    // () => {
    //   logo && URL.revokeObjectURL(logo.preview)
    // }
    () => {
      if (logo) {
        URL.revokeObjectURL(logo.preview);
      }
    }

    , [logo]);

  const onSubmit = (data) => {
    setLoadingButton(true);
    formData.append('id', companyId);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('website', data.website);
    formData.append('status', 1);
    formData.append('is_premium', data.premium);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('companyType', companyType);
    if (logo) {
      formData.append('uploadFile', logo);
    }
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_COMPANY}/${companyId}`,
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData
    }).then(() => {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_COMPANY}/${companyId}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        setDisabled(true);
        setLoadingButton(false);
        setShowButtonEdit(false);
        setOpenAlert(true);
        setSeverity('success');
        setMessageAlert('Cập nhật tài khoản thành công');
        const action = updateCompany(response.data.data);
        dispatch(action);
      }).catch(error => console.log(error));
    }).catch(err => {
      console.log(err);
      setLoadingButton(false);
      setOpenAlert(true);
      setSeverity('error');
      setMessageAlert('Cập nhật tài khoản không thành công');
    });
  };

  const onError = (data, event) => {
    console.log(data, event);
  };

  const handleChangeCompanyType = (event) => {
    setCompanyType(event.target.value);
  };



  const handleChangeImage = (e) => {
    const file = e.target.files[0];

    file.preview = URL.createObjectURL(file);

    setLogo(file);
    console.log(file);
  };

  const closeAlert = () => {
    setOpenAlert(false);
  };

  return (
    <div>
      <Page title='Thông tin công ty'>
        <Container maxWidth='xl'>
          <Stack direction="row" alignItems="center" justifyContent="flex-start">
            {localStorage.getItem('role') === 'EMPLOYEE' ? (
              <HeaderBreadcrumbs
                heading="Thông tin công ty"
                links={[
                  { name: 'Trang chủ', href: '/employee/dashboard' },
                  { name: 'Thông tin công ty', href: '/dashboard/profile' },
                ]}
              />
            ) : (
              <HeaderBreadcrumbs
                heading="Thông tin công ty"
                links={[
                  { name: 'Trang chủ', href: '/company/dashboard' },
                  { name: 'Thông tin công ty', href: '/dashboard/profile' },
                ]}
              />
            )}
          </Stack>

          {loadingData
            ? (
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <Card style={{ padding: 20 }}>
                  <Grid container spacing={2} style={{ paddingBottom: 20, paddingLeft: 20 }}>
                    <Grid container xs={2} justifyContent='center' alignItems='center' direction='column'>
                      <Grid item sx={{
                        ...(showButtonEdit && {
                          '&:hover': {
                            opacity: 0.5,
                            // [`$[Typography]`]: {
                            //   display: 'block',
                            //   color: 'red'
                            // }
                            '& p': {
                              display: 'block',
                            }
                          },
                        })
                      }} style={{ display: 'inline-block', position: 'relative' }}>
                        <img src={logo ? logo.preview : imageUrl} style={{ borderRadius: '50%' }} alt='hinhanh' />
                        {showButtonEdit && (<input style={{ opacity: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} id="file-input" type="file" onChange={handleChangeImage} />)}
                        {showButtonEdit && (<Typography style={{ position: 'absolute', top: 80, left: 50, display: 'none' }} >Tải ảnh lên</Typography>)}
                      </Grid>
                    </Grid>

                    <Grid item xs={10}>
                      <Grid container spacing={3} sx={{ pt: 2 }}>
                        <Grid item xs={8}>
                          <TextField fullWidth disabled={disabled} {...register('name')} label='Tên công ty' />
                          <p style={{ color: 'red' }}>{errors.name?.message}</p>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField fullWidth disabled={disabled} {...register('phone')} label='Số điện thoại' />
                          <p style={{ color: 'red' }}>{errors.phone?.message}</p>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField fullWidth disabled={disabled} {...register('website')} label='Website' />
                          <p style={{ color: 'red' }}>{errors.website?.message}</p>
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl fullWidth disabled={disabled}>
                            <InputLabel id='company_type-label'>Loại công ty</InputLabel>
                            <Select
                              value={companyType}
                              onChange={handleChangeCompanyType}
                              displayEmpty
                              labelId='company_type-label'
                              label='Loại công ty'
                            >
                              {common.STATUS_COMPANY.map((element, index) =>
                                <MenuItem key={index} value={element.value}>{element.label}</MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth disabled={disabled} {...register('email')} label='Email' />
                          <p style={{ color: 'red' }}>{errors.email?.message}</p>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField fullWidth multiline disabled={disabled} {...register('description')} label='Mô tả' />
                          <p style={{ color: 'red' }}>{errors.description?.message}</p>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {showButtonEdit ? (
                    <Grid container direction='row' justifyContent='flex-end' spacing={2}>
                      <Grid item>
                        <Button variant='outlined' onClick={() => {
                          clearErrors();
                          setLogo(null);
                          setDisabled(true);
                          setShowButtonEdit(false);
                          setLoadingData(false);
                        }}>Huỷ</Button>
                      </Grid>
                      <Grid item>
                        <LoadingButton loading={loadingButton} variant='contained' type='submit'>Lưu</LoadingButton>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container direction='row' justifyContent='flex-end' spacing={2}>
                      <Grid item>
                        <Button variant='outlined' disabled={localStorage.getItem('role') === 'EMPLOYEE' && true} onClick={() => {
                          setDisabled(false);
                          setShowButtonEdit(true);
                        }}>Chỉnh sửa</Button>
                      </Grid>
                    </Grid>
                  )}
                </Card>
              </form>
            )
            : (
              <Box sx={{ minHeight: 500, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}
        </Container>
      </Page>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openAlert} autoHideDuration={5000} onClose={closeAlert}>
        <Alert variant='filled' severity={severity}>
          {messageAlert}
        </Alert>
      </Snackbar>
    </div >
  );
}
