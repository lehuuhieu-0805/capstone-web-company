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
import { updateEmployee } from '../slices/employeeSlice';

const formData = new FormData();


const schema = yup.object({
  name: yup.string().nullable().required('*Vui lòng nhập tên'),
  phone: yup.string().nullable().typeError('*Số điện thoại sai định dạng').max(10, '*Số điện thoại sai định dạng').min(10, '*Số điện thoại sai định dạng').required('*Vui lòng nhập số điện thoại'),
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
      phone: '',
    }
  });

  const employeeId = localStorage.getItem('user_id');

  useEffect(() => {

    axios.get(`${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_EMPLOYEE}/${employeeId}`)
      .then((response) => {
        console.log(response);
        setValue('name', response.data.data.name);
        setValue('phone', response.data.data.phone);
        setLoadingData(true);
      })
      .catch(err => console.log(err));
  }, [setValue, loadingData]);


  const onSubmit = (data) => {
    setLoadingButton(true);
    data.id = employeeId;
    console.log(data);
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_EMPLOYEE}/${employeeId}`,
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data
    }).then(() => {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_EMPLOYEE}/${employeeId}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        setDisabled(true);
        setLoadingButton(false);
        setShowButtonEdit(false);
        setOpenAlert(true);
        setSeverity('success');
        setMessageAlert('Cập nhật tài khoản thành công');
        const action = updateEmployee(response.data.data);
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

  const closeAlert = () => {
    setOpenAlert(false);
  };

  return (
    <div>
      <Page title='Thông tin nhân viên'>
        <Container maxWidth='md'>
          <Stack direction="row" alignItems="center" justifyContent="flex-start">
            <HeaderBreadcrumbs
              heading="Thông tin nhân viên"
              links={[
                { name: 'Trang chủ', href: '/employee/dashboard' },
                { name: 'Thông tin nhân viên', href: '/employee/dashboard' },
              ]}
            />
          </Stack>

          {loadingData
            ? (
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <Card style={{ padding: 20 }}>
                  <Grid container spacing={2} style={{ paddingBottom: 20, paddingLeft: 20 }}>
                    <Grid item xs={6}>
                      <TextField fullWidth disabled={disabled} {...register('name')} label='Tên' />
                      <p style={{ color: 'red' }}>{errors.name?.message}</p>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth disabled={disabled} {...register('phone')} label='Số điện thoại' />
                      <p style={{ color: 'red' }}>{errors.phone?.message}</p>
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
                        <Button variant='outlined' onClick={() => {
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
