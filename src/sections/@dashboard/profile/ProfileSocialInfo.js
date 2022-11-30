import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, CardHeader, Stack } from '@mui/material';
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

ProfileSocialInfo.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileSocialInfo({ profile }) {

  const SOCIALS = [
    {
      name: 'Linkedin',
      icon: <IconStyle icon={'eva:linkedin-fill'} color="#006097" />,
      href: `www.linkedin.com/${profile.linked_in_link}`,
    },
    {
      name: 'githubLink',
      icon: <IconStyle icon={'eva:twitter-fill'} color="#1C9CEA" />,
      href: `www.github.com/${profile.github_link}`,
    },

    {
      name: 'Facebook',
      icon: <IconStyle icon={'eva:facebook-fill'} color="#1877F2" />,
      href: `www.fb.com/${profile.facebook_link}`,
    },
  ];

  return (
    <Card>
      <CardHeader title="Liên hệ" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {SOCIALS.map((link) => (
          <Stack key={link.name} direction="row" alignItems="center">
            {link.icon}
            <Link component="span" variant="body2" color="text.primary" noWrap>
              {link.href}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
