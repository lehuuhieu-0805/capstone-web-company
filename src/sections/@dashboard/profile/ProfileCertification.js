import PropTypes from 'prop-types';
// @mui
// import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';


ProfileCertification.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileCertification({ profile }) {
  const [listCertification, setlistCertification] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/certificates?page-size=50&profileApplicantId=${profile.id}`,
      method: 'get',
    })
      .then((response) => {
        console.log(response);
        setlistCertification(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [profile.id]);
  return (
    <Card>
      <CardHeader title="Chứng chỉ" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {listCertification && listCertification.map((certificate) =>
          <Typography variant="body2" key={certificate.id} >- {certificate.name}</Typography>)}
      </Stack>
    </Card>
  );
}