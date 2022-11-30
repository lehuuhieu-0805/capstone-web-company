import { faker } from '@faker-js/faker';
import axios from 'axios';
import { sample } from 'lodash';
import _mock from './_mock';

// ----------------------------------------------------------------------



// export const _userCards = [...Array(24)].map((_, index) => ({
//   id: _mock.id(index),
//   avatarUrl: _mock.image.avatar(index),
//   cover: _mock.image.cover(index),
//   name: _mock.name.fullName(index),
//   follower: 'ReacJS  English  NodeJS',
//   following: 'Remote',
//   totalPost: 'ReacJS  English  NodeJS',
//   position: _mock.role(index),
// }));


// let list = [];
// (async () => {
//   const listProfileApplicant = async () => {

//     await axios({
//       url: 'https://stg-api-itjob.unicode.edu.vn/api/v1/profile-applicants',
//       method: 'get'
//     }).then((response) => {
//       list = response.data.data
//       console.log(response)
//     })
//       .catch(err => console.log(err))
//   }

//   await listProfileApplicant()

//   console.log(listProfileApplicant)
// })()

export async function listProfileApplicant() {
  // const listProfileApplicant = async () => {

    await axios({
      url: 'https://stg-api-itjob.unicode.edu.vn/api/v1/profile-applicants',
      method: 'get'
    }).then((response) => {
      console.log(response)
      return response
      // list = response.data.data
    })
      .catch(err => console.log(err))
  // }

  // await listProfileApplicant()

  // console.log(listProfileApplicant)
}

// export { list }



export const _userAbout = {
  id: 1,
  cover: '1',
  position: 'UI Designer',
  follower: '25',
  following: '50',
  quote: 'Tình trạng bê tông hóa khắp Đà Lạt, nhất là khu trung tâm thành phố không còn khoảng thở, hệ thống thoát nước quá tải dù đã được nhiều lần cải tạo',
  country: 'HCM',
  email: 'hoangnlh23@gmail.com',
  school: 'Trường đại học FPT',
  company: 'ReactJS',
  role: 'Remote',
  facebookLink: `https://www.facebook.com/hoangkyo23`,
  linkedinLink: `https://www.linkedin.com/in/hoangkyo23`,
  githubLink: `https://www.github.com/hoangkyo23`,
};

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.findName(),
  company: faker.company.companyName(),
  workingType: sample([
    'Remote',
    'Part-time',
    'Full-time',
    'Freelance',
  ]),
  status: sample(['active', 'banned']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));

export default users;
