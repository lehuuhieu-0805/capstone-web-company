import PropTypes from 'prop-types';

import dayjs from 'dayjs';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

ProfileProjects.propTypes = {
  projects: PropTypes.object,
};
export default function ProfileProjects({ projects }) {
  return (
    <Stack direction="column">
      <Stack spacing={2} direction="row">
        <Stack direction="row" alignItems="flex-start">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="h7" fontWeight='bold'>{projects.name}</Typography>
        </Stack>
        <Typography variant="h7">
          {' '}
          ({dayjs(projects.start_time).format('MM/YYYY')} - {dayjs(projects.end_time).format('MM/YYYY')})
        </Typography>
      </Stack>
      <div style={{ display: 'flex' }}>
        <Typography variant="body2">Link : {projects.link} </Typography>
      </div>
      <Typography variant="body2">Giới thiệu : {projects.description} </Typography>
      <Typography variant="body2">Vị trí làm việc : {projects.job_position} </Typography>
      <Typography variant="body2">Ngôn ngữ : {projects.skill} </Typography>
    </Stack>
  );
}
