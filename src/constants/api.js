export const versionType = {
  v1: 'v1'
};

export const configPathType = {
  api: 'api'
};

export const baseUrl = 'https://stg-api-itjob.unicode.edu.vn';

// Company
export const GET_COMPANY = 'companies';
export const GET_COMPANIES = 'companies';
export const POST_COMPANY = 'companies';
export const PUT_COMPANY = 'companies';
export const DELETE_COMPANY = 'companies';
export const PUT_UPGRADE_COMPANY = 'companies/upgrade';

// User
export const POST_USER = 'users';
export const LOGIN = 'users/login';
export const PUT_USER = 'users';
export const PUT_STATUS_USER = 'users';
export const GET_USER = 'users';
export const PUT_UPDATE_PASSWORD_USER = 'companies/password';
export const PUT_UPDATE_PASSWORD_EMPLOYEE = 'employees/password';
export const PUT_RESET_PASSWORD_USER = 'companies/reset';

// Job Position
export const GET_JOBPOSITION = 'job-positions';

// Working style
export const GET_WORKINGSTYLE = 'working-styles';

// Skill
export const GET_SKILL = 'skills';

// Skill Level
export const GET_SKILLLEVEL = 'skill-levels';

// Job Post
export const GET_JOBPOST = 'job-posts';
export const POST_JOBPOST = 'job-posts';
export const PUT_JOBPOST = 'job-posts';
export const DELETE_JOBPOST = 'job-posts';
export const PUT_EXPRIRE_JOBPOST = 'job-posts/expired';
export const PUT_UPDATE_MONEY = 'job-posts/money';

// Job Post Skill
export const GET_JOBPOSTSKILL = 'job-post-skills';
export const POST_JOBPOSTSKILL = 'job-post-skills';
export const PUT_JOBPOSTSKILL = 'job-post-skills';
export const DELETE_JOBPOSTSKILL = 'job-post-skills';

// Album Image
export const GET_ALBUMIMAGE = 'album-images';
export const POST_ALBUMIMAGE = 'album-images';
export const DELETE_ALBUMIMAGE = 'album-images';
export const POST_URL_ALBUMIMAGE = 'album-images/url';

// Aplicant
export const GET_APPLICANT = 'applicants';

// Confirm Mail
export const POST_SEND_CODE_CONFIRM_MAIL = 'emails/mail-confirm-company';
export const POST_CHECK_CODE_CONFIRM_MAIL = 'emails/otp';
export const POST_SEND_MAIL_TO_ADMIN = 'emails';
export const POST_SEND_MAIL_TO_ADMIN_TO_JOIN_COMPANY = 'emails/mail-join';

// Profile Applicant
export const GET_PROFILE_APPLICANT = 'profile-applicants';
export const GET_PROFILE_APPLICANT_SORT_BY_SYSTEM = 'profile-applicants/jobPostId';
export const GET_PROFILE_APPLICANT_LIKED_JOBPOST = 'profile-applicants/like';
export const GET_PROFILE_APPLICANT_JOBPOST_LIKED = 'profile-applicants/jobPost-like';

// Profile Applicant Skill
export const GET_PROFILE_APPLICANT_SKILL = 'profile-applicant-skills';

// Like
export const GET_LIKE = 'likes';
export const POST_LIKE = 'likes';
export const PUT_COMPANY_ACCEPT_LIKE = 'likes/company';

// Block
export const GET_BLOCK = 'blocks';
export const POST_BLOCK = 'blocks';
export const DELETE_BLOCK = 'blocks';

// VNPay
export const GET_VNPAY = 'VNPay';
export const GET_PAYMENT_CONFIRM = 'VNPay/PaymentConfirm';

// Wallet
export const GET_WALLET = 'wallets';

// Transaction
export const GET_TRANSACTION = 'transactions';

// Transaction Job Post
export const GET_TRANSACTION_JOB_POST = 'transactions-jobposts';

// notification
export const POST_SUBSCRIBE_TOPIC = 'notis/subscribe';
export const POST_UNSUBSCRIBE_TOPIC = 'notis/unsubscribe';

// employee
export const GET_EMPLOYEE = 'employees';
export const PUT_EMPLOYEE = 'employees';

// configuration
export const GET_CONFIGURATION = 'configurations';