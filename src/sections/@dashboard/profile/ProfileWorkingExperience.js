import PropTypes from 'prop-types';
// @mui
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Card, CardHeader, Stack } from '@mui/material';
import ProfileWorking from './profileWorking';

// ----------------------------------------------------------------------

ProfileWorkingExperience.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileWorkingExperience({ profile }) {
  const [WorkingExperience, setWorkingExperience] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/working-experiences?page-size=50&profileApplicantId=${profile.id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setWorkingExperience(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [profile.id]);
  return (
    <Card>
      <CardHeader title="Kinh nghiệm làm việc" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {WorkingExperience &&
          WorkingExperience.map((workinge) => <ProfileWorking key={workinge.id} workinge={workinge} />)}
      </Stack>
    </Card>
  );
}
