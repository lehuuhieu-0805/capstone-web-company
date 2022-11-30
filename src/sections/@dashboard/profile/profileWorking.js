import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

ProfileWorking.propTypes = {
  workinge: PropTypes.object,
};
export default function ProfileWorking({ workinge }) {
  const [JobPosition, setJobPosition] = useState([]);

  // console.log(dayjs(workinge.start_date).format('DD/MM/YYYY'))
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-positions/${workinge.job_position_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setJobPosition(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [workinge.job_position_id]);

  return (
    <Stack direction="column">
      <Stack spacing={2} direction="row">
        <Stack direction="row" alignItems="flex-start">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="h7" fontWeight='bold'>{workinge.company_name}</Typography>
        </Stack>
        <Typography variant="h7">
       
          ({dayjs(workinge.start_date).format('MM/YYYY')} - {dayjs(workinge.end_time).format('MM/YYYY')})
        </Typography>
      </Stack>
      <div style={{ display: 'flex' }}>
        <Typography variant="body2">Vị trí làm việc : {JobPosition.name}</Typography>
      </div>
    </Stack>
  );
}
