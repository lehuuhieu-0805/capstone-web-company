import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';

import ProfileFollowInfo from './ProfileImage';
import ProfileSocialInfo from './ProfileSocialInfo';
import ProfileInfomation from './ProfileInfomation';
import ProfileWorkingExperience from './ProfileWorkingExperience';
import ProfileProject from './ProfileProject';
import ProfileCertification from './ProfileCertification';

// ----------------------------------------------------------------------

Profile.propTypes = {
  myProfile: PropTypes.object,
};

export default function Profile({ myProfile }) {
  // console.log(myProfile)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
        <ProfileAbout profile={myProfile} />
          <ProfileFollowInfo profile={myProfile} />
          
          <ProfileSocialInfo profile={myProfile} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
        <ProfileInfomation profile={myProfile} />
          <ProfileWorkingExperience profile={myProfile} />
          <ProfileProject profile={myProfile} />
          <ProfileCertification profile={myProfile} />
        </Stack>
      </Grid>
    </Grid>
  );
}
