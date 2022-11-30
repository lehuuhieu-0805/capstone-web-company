import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

JobSkill.propTypes = {
  skiller: PropTypes.object.isRequired,
};
export default function JobSkill({ skiller }) {
  const [Skillerr, setSkills] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/skills/${skiller.skill_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setSkills(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [skiller.skill_id]);

  return <Typography variant="subtitle1">{Skillerr.name}</Typography>;
}
