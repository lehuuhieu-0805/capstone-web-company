import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
// material
import { alpha, styled } from '@mui/material/styles';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// components
import Iconify from '../../components/Iconify';
import { updateMoney } from '../../slices/moneySlice';
import { api } from '../../constants';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar, company }) {
  // const [balance, setBalance] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const money = useSelector(state => state.moneys);

  useEffect(() => {
    if (localStorage.getItem('company_id')) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WALLET}?companyId=${localStorage.getItem('company_id')}`,
        method: 'get',
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((response) => {
        const action = updateMoney(response.data.data[0].balance);
        dispatch(action);
      }).catch(error => console.log(error));
    }
  }, []);

  return (
    <>
      <RootStyle>
        <ToolbarStyle>
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>

          {/* <Searchbar /> */}
          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            {localStorage.getItem('role') === 'COMPANY' && (
              <>
                <Iconify icon='dashicons:money-alt' color='#2065D1' sx={{ width: 30, height: 30 }} />
                <Typography color='#2065D1' variant='h5' gutterBottom>{money}</Typography>
                <Button color='secondary' variant='contained' onClick={() => navigate('/company/deposit')}>Nạp tiền</Button>
                {/* <LanguagePopover /> */}
              </>
            )}
            <NotificationsPopover />
            <AccountPopover company={company} />
          </Stack>
        </ToolbarStyle >
      </RootStyle >
    </>
  );
}
