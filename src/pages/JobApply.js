// @mui
import { Box, Container,Stack,Select,MenuItem,Typography } from '@mui/material';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserCard } from '../sections/@dashboard/jobapply/index';

// _mock_
// components
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Page from '../components/Page';
// sections

// ----------------------------------------------------------------------

export default function UserCards() {
  const [listProfileApplicant, setListProfileApplicant] = useState([]);
  const [listProfileApplicantLiked, setListProfileApplicantLiked] = useState([]);
  const [listJobpost, setListJobpost] = useState([]);
  const [jobPost, setJobPost] = useState([]);
  const [refreshData, setRefreshData] = useState(false);

  const handleChangeJobPost = (event) => {
  
    setJobPost(event.target.value);

    
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/profile-applicants/like?page-size=50&jobPostId=${event.target.value}`,
        method: 'get',
      })
        .then((response) => {
          console.log(response.data.data)
          localStorage.setItem('id_jobpost', event.target.value);
          setListProfileApplicant(response.data.data);
         
        })
        .catch((err) => console.log(err));
      
  };

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts?page-size=50&companyId=${localStorage.getItem('company_id')}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      // console.log(response);
      
      setListJobpost(response.data.data);
    }).catch(error => console.log(error));
  }, []);

 
    
  

 
//  console.log(jobPost)
  return (
    <Page title="Danh sách tuyển dụng">
      <Container maxWidth={'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách tuyển dụng"
          links={[
            { name: 'Trang chủ', href: '/dashboard/app' },
            { name: 'Danh sách', href: '/dashboard/applyjob' },
          ]}
        
        />
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1" >
          Chọn Job Post
        </Typography>
          <Select
                          name='jobPosition'
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          defaultValue = "Chọn Job Post"
                          value={jobPost}
                          
                          onChange={handleChangeJobPost}
                        >
                          {listJobpost.map((el) => (
                            <MenuItem key={el.id} value={el.id}>{el.title}</MenuItem>
                          ))}
                        </Select>
          
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {listProfileApplicant.map((user) => (
            <UserCard key={user.id} user={user} ida={jobPost} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}