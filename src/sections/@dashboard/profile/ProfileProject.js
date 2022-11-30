import PropTypes from 'prop-types';
// @mui
// import { styled } from '@mui/material/styles';
import { Card, Typography, CardHeader, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileProjects from './cardProject';
// components
// import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProfileProject.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileProject({ profile }) {
  const [listProject, setlistProject] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/projects?page-size=50&profileApplicantId=${profile.id}`,
      method: 'get',
    })
      .then((response) => {
        console.log(response);
        setlistProject(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [profile.id]);
  return (
    <Card>
      <CardHeader title="Dự án" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {listProject && listProject.map((projects) => <ProfileProjects key={projects.id} projects={projects} />)}
      </Stack>
    </Card>
  );
}
