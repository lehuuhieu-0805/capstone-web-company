import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Stack, Grid } from '@mui/material';

ProfileSkill.propTypes = {
  skilles: PropTypes.object,
};
export default function ProfileSkill({ skilles }) {
  const [Skillerr, setSkills] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/skills/${skilles.skill_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setSkills(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [skilles.skill_id]);

  return (
    <Grid container>
      <Grid item xs={6} md={4}>
        <Typography variant="body2">
          Ngôn ngữ: {Skillerr.name}
        </Typography>
      </Grid>
      <Grid item xs={6} md={8}>
        <Typography variant="body2">
          Trình độ : {skilles.skill_level}
        </Typography>
      </Grid>
    </Grid>
  );
}
