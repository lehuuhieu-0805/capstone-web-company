/* eslint-disable dot-notation */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
import { LoadingButton } from "@mui/lab";
import { Card, CardActions, CardContent, FormControlLabel, Radio, TextField } from "@mui/material";
import { Container, Stack } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from 'react';
import AlertMessage from "../components/AlertMessage";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";
import Page from "../components/Page";
import { api } from '../constants';
import { getQueryParams } from '../utils/getQueryParams';

export default function Deposit() {
  const [money, setMoney] = useState('');
  const [error, setError] = useState({
    message: '',
    error: false
  });
  const [severity, setSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    const queryParams = getQueryParams();
    if (queryParams?.amount && queryParams?.status) {
      if (queryParams.status === 'failed') {
        setSeverity('error');
        setAlertMessage('Nạp tiền thất bại');
        setOpenAlert(true);
      } else if (queryParams.status === 'success') {
        setSeverity('success');
        setAlertMessage(`Bạn đã nạp ${queryParams.amount} vào tài khoản thành công`);
        setOpenAlert(true);
      }
    }
  }, []);

  const onSubmit = () => {
    if (!error.error) {
      setLoadingButton(true);
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_VNPAY}?ip='::1'&companyId=${localStorage.getItem('company_id')}&amount=${money.replaceAll('.', '')}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        setLoadingButton(false);
        window.location.assign(response.data);
      }).catch(error => {
        setLoadingButton(false);
        console.log(error);
        setSeverity('error');
        setAlertMessage('Có lỗi xảy ra vui lòng thử lại sau');
        setOpenAlert(true);
      });
    }
  };

  return (
    <Page title='Nạp tiền'>
      <Container maxWidth='sm'>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <HeaderBreadcrumbs
            heading="Nạp tiền"
            links={[
              { name: 'Trang chủ', href: '/company/dashboard' },
              { name: 'Nạp tiền', href: '/company/deposit' },
            ]}
          />
        </Stack>

        <Card>
          <CardContent>
            <TextField type='text' value={money} onChange={(event) => {
              const format1 = event.target.value.replaceAll('.', '');
              const money = new Intl.NumberFormat().format(format1);
              if (format1 < 10000) {
                setError({
                  message: 'Số tiền nạp không nhỏ hơn 10.000 vnđ',
                  error: true
                });
              } else if (format1 > 100000000) {
                setError({
                  message: 'Số tiền nạp không lớn hơn 100.000.000 vnđ',
                  error: true
                });
              } else {
                setError({
                  message: '',
                  error: false
                });
              }
              const format2 = money.replaceAll(',', '.');
              setMoney(format2);
            }} label='Số tiền cần nạp' fullWidth sx={{ mb: 2 }} />
            {error.error && <p style={{ color: 'red' }}>{error.message}</p>}
            <FormControlLabel value='end' control={<Radio checked />} label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src='https://firebasestorage.googleapis.com/v0/b/captone-dfc3c.appspot.com/o/images%2FLogo-VNPay.png?alt=media&token=fd61a9dc-f27f-41db-99d9-7d45036289a0' alt="logo" width='50' />
                Thanh toán qua VNPay
              </div>
            } />
          </CardContent>
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <LoadingButton variant='contained' loading={loadingButton} type='submit' onClick={onSubmit}>Nạp tiền</LoadingButton>
          </CardActions>
        </Card>
      </Container>
      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} severity={severity} />
    </Page>
  );
}