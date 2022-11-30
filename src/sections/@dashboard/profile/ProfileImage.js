// @mui
import { Card, Stack, ImageListItem, ImageList } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

export default function ProfileFollowInfo(profile) {
  const [listImage, setListImage] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/album-images?page-size=50&profileApplicantId=${profile.profile.id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response);
        setListImage(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [profile.profile.id]);

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 2 }}>
        <ImageList variant="standard" cols={4} gap={8}>
          {listImage && listImage.map((item) => (
            <ImageListItem key={item.id} >
              {item.url_image && (
                <img
                  src={item.url_image}
                  srcSet={item.url_image}
                  alt={item.title}
                  style={{ height: 100, width: '100%', objectFit: 'contain' }}
                  loading="lazy"
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      </Stack>

    </Card>
  );
}
