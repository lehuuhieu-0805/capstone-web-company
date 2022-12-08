import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Card, Container, Typography, Button, Dialog, DialogTitle, DialogActions, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import axios from 'axios';
import { useState } from 'react';
import AlertMessage from '../../../components/AlertMessage';
import { api } from '../../../constants';
import cssStyles from '../../../utils/cssStyles';
import { Profile } from '../profile';
import ProfileAbout from '../profile/ProfileAbout';
import ProfileFollowInfo from '../profile/ProfileImage';
import ProfileSocialInfo from '../profile/ProfileSocialInfo';
import ProfileInfomation from '../profile/ProfileInfomation';
import ProfileWorkingExperience from '../profile/ProfileWorkingExperience';
import ProfileProject from '../profile/ProfileProject';
import ProfileCertification from '../profile/ProfileCertification';

export default function InfoProfileApplicant({ profileApplicant, applicant, jobPosition, jobPostId, handleCloseDialog, setOpenAlert, setAlertMessage, setSeverity }) {
  const [loadingButton, setLoadingButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Container maxWidth={'100%'}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Stack spacing={3} sx={{ mb: 2 }}>
            <Card sx={{ p: 1 }}>
              <Box
                sx={{
                  ml: { md: 3 },
                  mt: { xs: 1, md: 0 },
                  color: 'common.white',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Avatar
                  alt={applicant?.name}
                  src={applicant?.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    // zIndex: 11,
                    // left: 0,
                    // right: 0,
                    // bottom: 65,
                    // mx: 'auto',
                    // position: 'absolute',
                  }}
                />
                <Typography color='black' variant="h4">{applicant?.name}</Typography>
                <Typography color='black' sx={{ opacity: 0.72 }}>{jobPosition?.name}</Typography>
                {/* <Typography color='black' sx={{ opacity: 0.72 }}>{jobPosition?.name}</Typography> */}
                {/* <Button variant='outlined' style={{ position: 'absolute', right: 10, bottom: 10 }} onClick={() => setOpenDialog(true)}>Chặn</Button> */}
              </Box>
            </Card>
          </Stack>
          <Stack spacing={3}>
            <ProfileAbout profile={profileApplicant} />
            <ProfileFollowInfo profile={profileApplicant} />
            <ProfileSocialInfo profile={profileApplicant} />
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <Stack spacing={3}>
            <ProfileInfomation profile={profileApplicant} />
            <ProfileWorkingExperience profile={profileApplicant} />
            <ProfileProject profile={profileApplicant} />
            <ProfileCertification profile={profileApplicant} />
          </Stack>
        </Grid>
      </Grid>
     
    </Container >
  );
}



const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
    top: 0,
    zIndex: 5,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));