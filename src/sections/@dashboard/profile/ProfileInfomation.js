import PropTypes from 'prop-types';
// @mui
// import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, CardHeader, Stack } from '@mui/material';
// components

import ProfileSkill from './profileSkill';

// ----------------------------------------------------------------------

ProfileInfomation.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileInfomation({ profile }) {
  // const {  company } = profile;

  const [Skills, setSkills] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/profile-applicant-skills?page-size=50&profileApplicantId=${profile.id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setSkills(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [profile.id]);
  // console.log(profile.user.id)
  return (
    <Card>
      <CardHeader title="Kỹ năng" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {Skills &&
          Skills.map((skilles) => (
            // <Typography key={skiller.id} variant='subtitle1'>{skiller.id}</Typography>
            <ProfileSkill key={skilles.id} skilles={skilles} />
          ))}
      </Stack>
    </Card>
  );
}
