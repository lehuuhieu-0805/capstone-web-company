import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack } from "@mui/material";
import { Container } from "@mui/system";
import axios from 'axios';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import AlertMessage from '../components/AlertMessage';
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
import { FormProvider, RHFTextField } from '../components/hook-form';
import Iconify from '../components/Iconify';
import Page from "../components/Page";
import { api } from '../constants';

const schema = Yup.object().shape({
  passwordOld: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
  passwordNew: Yup.string().required('Vui lòng nhập mật khẩu mới').min(8, 'Tối thiểu 8 kí tự'),
  passwordConfirm: Yup.string().required('Vui lòng nhập lại mật khẩu mới').oneOf([Yup.ref('passwordNew'), null], 'Mật khẩu không khớp'),
});

export default function ChangePassword() {
  const token = localStorage.getItem('token');

  const [loadingButton, setLoadingButton] = useState(false);
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');

  const defaultValues = {
    passwordOld: '',
    passwordNew: '',
    passwordConfirm: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit, reset
  } = methods;

  const onSubmit = (data) => {
    setLoadingButton(true);
    if (localStorage.getItem('role') === 'EMPLOYEE') {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_UPDATE_PASSWORD_EMPLOYEE}?id=${localStorage.getItem('user_id')}&currentPassword=${data.passwordOld}&newPassword=${data.passwordNew}`,
        method: 'put',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        setLoadingButton(false);
        setSeverity('success');
        setMessageAlert('Đổi mật khẩu thành công');
        setOpenAlert(true);
        reset();
      }).catch((error) => {
        console.log(error);
        if (error.response.data.message.trim() === 'Current password not correct!!!') {
          setSeverity('error');
          setMessageAlert('Mật khẩu cũ không đúng');
          setOpenAlert(true);
        } else if (error.response.data.message.trim() === 'Current password equal new password!!!') {
          setSeverity('error');
          setMessageAlert('Mật khẩu mới không được trùng với mật khẩu cũ');
          setOpenAlert(true);
        } else {
          setSeverity('error');
          setMessageAlert('Đổi mật khẩu không thành công');
          setOpenAlert(true);
        }
        setLoadingButton(false);
      });
    }
    if (localStorage.getItem('role') === 'COMPANY') {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.PUT_UPDATE_PASSWORD_USER}?id=${localStorage.getItem('user_id')}&currentPassword=${data.passwordOld}&newPassword=${data.passwordNew}`,
        method: 'put',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        setLoadingButton(false);
        setSeverity('success');
        setMessageAlert('Đổi mật khẩu thành công');
        setOpenAlert(true);
        reset();
      }).catch((error) => {
        if (error.response.data.message.trim() === 'Current password not correct!!!') {
          setSeverity('error');
          setMessageAlert('Mật khẩu cũ không đúng');
          setOpenAlert(true);
        } else if (error.response.data.message.trim() === 'Current password equal new password!!!') {
          setSeverity('error');
          setMessageAlert('Mật khẩu mới không được trùng với mật khẩu cũ');
          setOpenAlert(true);
        } else {
          setSeverity('error');
          setMessageAlert('Đổi mật khẩu không thành công');
          setOpenAlert(true);
        }
        setLoadingButton(false);
      });
    }
  };

  return (
    <>
      <Page title='Đổi mật khẩu'>
        <Container maxWidth='sm'>
          <Stack direction="row" alignItems="center" justifyContent="flex-start">
            {localStorage.getItem('role') === 'EMPLOYEE' ? (
              <HeaderBreadcrumbs
                heading="Đổi mật khẩu"
                links={[
                  { name: 'Trang chủ', href: '/employee/dashboard' },
                  { name: 'Đổi mật khẩu', href: '/change-password' },
                ]}
              />
            ) : (
              <HeaderBreadcrumbs
                heading="Đổi mật khẩu"
                links={[
                  { name: 'Trang chủ', href: '/company/dashboard' },
                  { name: 'Đổi mật khẩu', href: '/change-password' },
                ]}
              />
            )}
          </Stack>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <RHFTextField
                name="passwordOld"
                label="Mật khẩu cũ"
                type={showPasswordOld ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPasswordOld(!showPasswordOld)} edge="end">
                        <Iconify icon={showPasswordOld ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="passwordNew"
                label="Mật khẩu mới"
                type={showPasswordNew ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPasswordNew(!showPasswordNew)} edge="end">
                        <Iconify icon={showPasswordNew ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="passwordConfirm"
                label="Nhập lại mật khẩu mới"
                type={showPasswordConfirm ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} edge="end">
                        <Iconify icon={showPasswordConfirm ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loadingButton} sx={{ mt: 2 }}>
              Xác nhận
            </LoadingButton>
          </FormProvider>
        </Container>
      </Page>

      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} severity={severity} alertMessage={messageAlert} />
    </>
  );
}