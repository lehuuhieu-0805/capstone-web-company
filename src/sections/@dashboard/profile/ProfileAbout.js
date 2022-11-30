import PropTypes from 'prop-types';
// @mui
import axios from 'axios';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Card, Typography, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileAbout({ profile }) {
  // const { quote, country, email, role,  school } = profile;
  const [WorkingStyle, setWorkingStyle] = useState([]);
  const [Applicantinfo, setApplicantinfo] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/working-styles/${profile.working_style_id}`,
      method: 'get'
    }).then((response) => {
      // console.log(response)
      setWorkingStyle(response.data.data);
    })
      .catch(err => console.log(err));
  }, [profile.working_style_id]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/applicants/${profile.applicant_id}`,
      method: 'get'
    }).then((response) => {
      // console.log(response)
      setApplicantinfo(response.data.data);
    })
      .catch(err => console.log(err));
  }, [profile.applicant_id]);


  // console.log(profile)
  return (
    <Card>
      <CardHeader title="Giới thiệu" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{profile.description}</Typography>
        <Stack direction="row">
          <IconStyle icon={'ic:school'} />
          <Typography variant="body2">
            Học tại {profile.education}

          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2">
            Sống tại {Applicantinfo.address}

          </Typography>
        </Stack>



        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            {WorkingStyle.name}

          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{Applicantinfo.email}</Typography>
        </Stack>


      </Stack>
    </Card>
  );
}
