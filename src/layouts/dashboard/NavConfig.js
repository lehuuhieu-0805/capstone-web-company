// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Bài viết tuyển dụng',
    path: '/dashboard/job-post',
    icon: getIcon('bi:file-earmark-post-fill'),
  },
  {
    title: 'Nạp tiền',
    path: '/dashboard/deposit',
    icon: getIcon('uil:money-insert'),
  },
  {
    title: 'Ứng viên bị chặn',
    path: '/dashboard/block',
    icon: getIcon('fluent-mdl2:block-contact'),
  },
  {
    title: 'Lịch sử giao dịch',
    path: '/dashboard/history-transaction',
    icon: getIcon('icon-park-outline:transaction'),
  },
  {
    title: 'Lịch sử kết nối',
    path: '/dashboard/history-matching',
    icon: getIcon('mdi:user-check'),
  },
  // {
  //   title: 'Danh sách ứng viên',
  //   path: '/dashboard/profile-applicant',
  //   icon: getIcon('bi:file-earmark-post-fill'),
  // },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill'),
  // },
  // {
  //   title: 'Tuyển dụng',
  //   path: '/dashboard/applyjob',
  //   icon: getIcon('eva:file-text-outline'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
