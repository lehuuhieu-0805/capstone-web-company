// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

// eslint-disable-next-line import/no-mutable-exports
let navConfig = [];

const role = localStorage.getItem('role');

switch (role) {
  case 'EMPLOYEE':
    navConfig = [
      {
        title: 'Dashboard',
        path: '/employee/dashboard',
        icon: getIcon('eva:pie-chart-2-fill'),
      },
      {
        title: 'Bài viết tuyển dụng',
        path: '/employee/job-post',
        icon: getIcon('bi:file-earmark-post-fill'),
      },
    ];
    break;
  case 'COMPANY':
    navConfig = [
      {
        title: 'Dashboard',
        path: '/company/dashboard',
        icon: getIcon('eva:pie-chart-2-fill'),
      },
      {
        title: 'Bài viết tuyển dụng',
        path: '/company/job-post',
        icon: getIcon('eva:file-text-fill'),
      },
      {
        title: 'Nạp tiền',
        path: '/company/deposit',
        icon: getIcon('uil:money-insert'),
      },
      {
        title: 'Quản lý nhân viên',
        path: '/company/employee',
        icon: getIcon('eva:people-fill'),
      },
      {
        title: 'Xét duyệt',
        path: '/company/approval',
        icon: getIcon('eva:shopping-bag-fill'),
      },
      {
        title: 'Lịch sử giao dịch',
        path: '/company/history-transaction',
        icon: getIcon('icon-park-outline:transaction'),
      },
      {
        title: 'Lịch sử kết nối',
        path: '/company/history-matching',
        icon: getIcon('mdi:user-check'),
      },
    ];
    break;

  default:
    break;
}

// navConfig = [
//   {
//     title: 'dashboard',
//     path: '/dashboard/app',
//     icon: getIcon('eva:pie-chart-2-fill'),
//   },
//   {
//     title: '(EMPLOYEE)Bài viết tuyển dụng',
//     path: '/dashboard/job-post',
//     icon: getIcon('bi:file-earmark-post-fill'),
//   },
//   {
//     title: '(COMPANY)Nạp tiền',
//     path: '/dashboard/deposit',
//     icon: getIcon('uil:money-insert'),
//   },
//   {
//     title: '(COMPANY)Ứng viên bị chặn',
//     path: '/dashboard/block',
//     icon: getIcon('fluent-mdl2:block-contact'),
//   },
//   {
//     title: '(COMPANY)Lịch sử giao dịch',
//     path: '/dashboard/history-transaction',
//     icon: getIcon('icon-park-outline:transaction'),
//   },
//   {
//     title: '(COMPANY)Lịch sử kết nối',
//     path: '/dashboard/history-matching',
//     icon: getIcon('mdi:user-check'),
//   },
//   // {
//   //   title: 'Danh sách ứng viên',
//   //   path: '/dashboard/profile-applicant',
//   //   icon: getIcon('bi:file-earmark-post-fill'),
//   // },
//   {
//     title: '(COMPANY)Quản lý nhân viên',
//     path: '/dashboard/user',
//     icon: getIcon('eva:people-fill'),
//   },
//   // {
//   //   title: 'Tuyển dụng',
//   //   path: '/dashboard/applyjob',
//   //   icon: getIcon('eva:file-text-outline'),
//   // },
//   {
//     title: '(COMPANY)Xét duyệt',
//     path: '/dashboard/products',
//     icon: getIcon('eva:shopping-bag-fill'),
//   },
//   {
//     title: '(COMPANY)Danh sách Jobpost cho quản lý',
//     path: '/dashboard/blog',
//     icon: getIcon('eva:file-text-fill'),
//   },
//   // {
//   //   title: 'login',
//   //   path: '/login',
//   //   icon: getIcon('eva:lock-fill'),
//   // },
//   // {
//   //   title: 'register',
//   //   path: '/register',
//   //   icon: getIcon('eva:person-add-fill'),
//   // },
//   // {
//   //   title: 'Not found',
//   //   path: '/404',
//   //   icon: getIcon('eva:alert-triangle-fill'),
//   // },
// ];

export default navConfig;
