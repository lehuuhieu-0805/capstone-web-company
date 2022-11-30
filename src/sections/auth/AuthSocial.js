// material
import { Button, Stack, Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
// component
import Iconify from '../../components/Iconify';
import { api } from '../../constants';

// ----------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyBaYVyy9VAdCZpa9x2u9acdUIkaVQll2hY",
  authDomain: "captone-dfc3c.firebaseapp.com",
  projectId: "captone-dfc3c",
  storageBucket: "captone-dfc3c.appspot.com",
  messagingSenderId: "202082595172",
  appId: "1:202082595172:web:f02413d2b9d8087df34a71",
  measurementId: "G-MG4829B610"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export default function AuthSocial({ onErrorLogin }) {
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const { user } = result;
        console.log(user);

        const token = user.accessToken;
        const { email } = user;

        setOpenBackdrop(true);

        axios({
          method: 'post',
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.LOGIN}`,
          data: {
            token
          }
        }).then((response) => {
          console.log(response);
          const decode = jwtDecode(response.data.token);
          localStorage.setItem('company_id', decode.Id);
          localStorage.setItem('token', response.data.token);
          setOpenBackdrop(false);
          window.location.replace('/');
        }).catch(err => {
          console.log(err);
          onErrorLogin(err, email);
        });

      }).catch((error) => {
        // Handle Errors here.
        const { errorCode } = error;
        const { errorMessage } = error;
        // The email of the user's account used.
        const { email } = error.customData;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        console.log(errorCode, errorMessage, email, credential);
      });
  };


  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={signInWithGoogle}>
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button>

        {/* <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button> */}
      </Stack>

      {/* <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider> */}

      <Backdrop open={openBackdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
