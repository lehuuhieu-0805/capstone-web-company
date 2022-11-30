import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import axios from 'axios';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Link } from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
// import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Image from '../../../components/Image';
// import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../components/SvgIconStyle';
import JobSkill from './jobSkill';
// import JobSkill from './jobSkill';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default function UserCard({ user }) {
  const [Applicantinfo, setApplicantinfo] = useState([]);
  const [JobPosition, setJobPosition] = useState([]);
  const [Skills, setSkills] = useState([]);
  const [WorkingStyle, setWorkingStyle] = useState([]);

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/applicants/${user.applicant_id}`,
      method: 'get',
    })
      .then((response) => {
        setApplicantinfo(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [user.applicant_id]);

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-positions/${user.job_position_id}`,
      method: 'get',
    })
      .then((response) => {
        setJobPosition(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [user.job_position_id]);

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/working-styles/${user.working_style_id}`,
      method: 'get',
    })
      .then((response) => {
        setWorkingStyle(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [user.working_style_id]);

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/profile-applicant-skills?page-size=50&profileApplicantId=${user.id}`,
      method: 'get',
    })
      .then((response) => {
        setSkills(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [user.id]);

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Link to="/dashboard/productsdetail/" state={{ user }} underline="none" color="inherit" component={RouterLink}>
        <Box sx={{ position: 'relative' }}>
          <SvgIconStyle
            src="https://minimal-assets-api-dev.vercel.app/assets/icons/shape-avatar.svg"
            sx={{
              width: 144,
              height: 60,
              zIndex: 10,
              left: 0,
              right: 0,
              bottom: -26,
              mx: 'auto',
              position: 'absolute',
              color: 'background.paper',
            }}
          />
          <Avatar
            alt={Applicantinfo.name}
            src={Applicantinfo.avatar}
            sx={{
              width: 100,
              height: 100,
              zIndex: 11,
              left: 0,
              right: 0,
              bottom: -32,
              mx: 'auto',
              position: 'absolute',
            }}
          />
          <OverlayStyle />
          <Image src={Applicantinfo.avatar} alt={Applicantinfo.avatar} ratio="16/9" />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 6 }}>
          {Applicantinfo.name}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {JobPosition.name}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div>
            <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
              Hình thức làm việc
            </Typography>
            <Typography variant="subtitle1">{WorkingStyle.name}</Typography>
          </div>

          <div>
            <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
              Ngôn ngữ
            </Typography>

            {Skills && Skills.map((skiller) => <JobSkill key={skiller.id} skiller={skiller} />)}
          </div>
        </Box>
      </Link>
    </Card>
  );
}
