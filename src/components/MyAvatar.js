// // hooks
// import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  // const { user } = useAuth();

  return (
    <Avatar
      src={'https://i.pinimg.com/originals/2c/84/5a/2c845a66b8ad2a8aafd288bdc16cd459.jpg'}
      alt={'Hoang Kyo'}
      color={'https://i.pinimg.com/originals/2c/84/5a/2c845a66b8ad2a8aafd288bdc16cd459.jpg'}
      {...other}
    >
      {createAvatar('Floral').name}
    </Avatar>
  );
}
