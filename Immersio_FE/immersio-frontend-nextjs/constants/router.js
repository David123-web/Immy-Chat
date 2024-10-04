export const RouterConstants = {
  HOME: {
    path: '/',
    name: 'Home'
  },
  DASHBOARD: {
    path: '/dashboard',
    name: 'Dashboard'
  },
  DASHBOARD_HOME: {
    path: '/dashboard/home',
    name: 'Home'
  },
  /* -------------------------------- MY DRIVE -------------------------------- */
  DASHBOARD_MY_DRIVE: {
    path: '/dashboard/my-drive',
    name: 'My Drive'
  },
  DASHBOARD_GOOGLE_DRIVE: {
    path: '/dashboard/my-drive',
    name: 'Google Drive'
  },
  DASHBOARD_AMAZON_S3: {
    path: '/dashboard/my-drive',
    name: 'AMAZON S3'
  },
  /* --------------------------- COURSES MANAGEMENT --------------------------- */
  DASHBOARD_COURSE_TAGS: {
    path: '/dashboard/course-tags',
    name: 'Tags'
  },
  DASHBOARD_CREATE_COURSE_TAGS: {
    path: '/dashboard/course-tags/create',
    name: 'Courses Tags Create'
  },
  DASHBOARD_COURSE: {
    path: '/dashboard/course',
    name: 'List'
  },
  DASHBOARD_CREATE_COURSE: {
    path: '/dashboard/course/create',
    name: 'Step 1'
  },
  DASHBOARD_PREVIEW_COURSE: {
    path: '/dashboard/course/preview',
    name: 'Step 1 - Syllabus'
  },
  DASHBOARD_EDIT_COURSE: {
    path: '/dashboard/course/[id]',
    name: 'Edit Course'
  },
  DASHBOARD_COURSE_LESSON: {
    path: '/dashboard/course/lesson',
    name: 'Lesson'
  },
  DASHBOARD_COURSE_LESSON_DIALOGUE: {
    path: '/dashboard/course/lesson/lessonDialogue',
    name: 'Step 2 - Dialogue'
  },
  DASHBOARD_COURSE_LESSON_DIALOGUE_CREATE: {
    path: '/dashboard/course/lesson/lessonDialogue/create',
    name: 'Add new'
  },
  DASHBOARD_COURSE_LESSON_INPUT: {
    path: '/dashboard/course/lesson/lessonInput',
    name: 'Step 3 - Inputs'
  },
  DASHBOARD_COURSE_LESSON_INPUT_CREATE: {
    path: '/dashboard/course/lesson/lessonInput/create',
    name: 'Add new'
  },
  DASHBOARD_COURSE_IMPORT_STEP_1: {
    path: '/dashboard/course/import-step-1',
  },
  DASHBOARD_COURSE_IMPORT_STEP_2: {
    path: '/dashboard/course/import-step-2',
  },
  /* ----------------------------- PAYMENT GATEWAY ---------------------------- */
  DASHBOARD_PAYMENT_GATEWAYS_ONLINE: {
    path: '/dashboard/payment/online',
    name: 'Online Gateways'
  },
  DASHBOARD_PAYMENT_GATEWAYS_OFFLINE: {
    path: '/dashboard/payment/offline',
    name: 'Offline Gateways'
  },
  /* ------------------------------- PAYMENT LOG ------------------------------ */
  DASHBOARD_PAYMENT_LOGS: {
    path: '/dashboard/payment-logs',
    name: 'Payment logs'
  },
  /* -------------------------------- COMMUNITY ------------------------------- */
  DASHBOARD_COMMUNITY_CHAT: {
    path: '/dashboard/community-chat',
    name: 'Community chat'
  },
  /* ---------------------------------- IMMY ---------------------------------- */
  DASHBOARD_IMMY_CHAT: {
    path: '/dashboard/immy-chat',
    name: 'Immy Chat'
  },
  /* ---------------------------------- RECORDINGS ---------------------------------- */
  DASHBOARD_STUDENT_RECORDINGS: {
    path: '/dashboard/student/recordings',
    name: 'My recordings'
  },
  DASHBOARD_STUDENT_RECORDINGS_RECORDING: {
    path: '/dashboard/student/recordings/feedback',
    name: `STUDENT RECORD`
  },
  DASHBOARD_RECORDINGS: {
    path: '/dashboard/recordings',
    name: 'Student recordings'
  },
  DASHBOARD_RECORDINGS_FEEDBACK: {
    path: '/dashboard/recordings/feedback',
    name: `TUTOR'S FEEDBACK`
  },
  /* -------------------------------- TUTOR MATCH ------------------------------- */
  DASHBOARD_TUTOR_MATCH_CLASSES: {
    path: '/dashboard/tutor-match/classes/plans',
    name: 'Classes'
  },
  DASHBOARD_TUTOR_MATCH_CLASSES_PLANS: {
    path: '/dashboard/tutor-match/classes/plans',
    name: 'Plans'
  },
  DASHBOARD_TUTOR_MATCH_CLASSES_CLASSES: {
    path: '/dashboard/tutor-match/classes/classes',
    name: 'Classes'
  },
  DASHBOARD_TUTOR_MATCH_CLASSES_CALENDAR: {
    path: '/dashboard/tutor-match/classes/calendar',
    name: 'Calendar'
  },
  DASHBOARD_TUTOR_MATCH_ADD_PLAN: {
    path: '/dashboard/tutor-match/classes/plans/add',
    name: 'Add plan'
  },
  DASHBOARD_TUTOR_MATCH_ADD_CLASS: {
    path: '/dashboard/tutor-match/classes/classes/add',
    name: 'Add class'
  },
  DASHBOARD_TUTOR_MATCH_TUTORS: {
    path: '/dashboard/tutor-match/tutors',
    name: 'Tutors'
  },
  DASHBOARD_TUTOR_MATCH_REVIEWS: {
    path: '/dashboard/tutor-match/reviews',
    name: 'Reviews'
  },
  DASHBOARD_TUTOR_MATCH_REPORTS: {
    path: '/dashboard/tutor-match/reports',
    name: 'Reports'
  },
  DASHBOARD_TUTOR_MATCH_CAMPUS: {
    path: '/dashboard/tutor-match/campus',
    name: 'Campus'
  },
  DASHBOARD_TUTOR_MATCH_ADD_CAMPUS: {
    path: '/dashboard/tutor-match/campus/add',
    name: 'Campus'
  },
  DASHBOARD_TUTOR_MATCH_INVOICES: {
    path: '/dashboard/tutor-match/invoices/accounts',
    name: 'Invoices'
  },
  DASHBOARD_TUTOR_MATCH_INVOICES_ACCOUNTS: {
    path: '/dashboard/tutor-match/invoices/accounts',
    name: ''
  },
  DASHBOARD_TUTOR_MATCH_INVOICES_INVOICES: {
    path: '/dashboard/tutor-match/invoices/invoices',
    name: ''
  },
  DASHBOARD_TUTOR_MATCH_CLASS_ENVIRONMENT: {
    path: '/dashboard/tutor-match/class-environment',
    name: ''
  },
  DASHBOARD_TUTOR_MATCH_STUDENT_INVOICES: {
    path: '/dashboard/tutor-match/student-invoices',
    name: ''
  },
  
  /* --------------------------------- PEOPLE --------------------------------- */
  DASHBOARD_ROLE_SETTINGS: {
    path: '/dashboard/people/role',
    name: 'Role settings'
  },
  DASHBOARD_PEOPLE_TUTOR: {
    path: '/dashboard/people/tutor',
    name: 'Tutors'
  },
  DASHBOARD_ADD_TUTOR: {
    path: '/dashboard/people/tutor/add',
    name: 'Add tutor'
  },
  DASHBOARD_PROFILE_TUTOR: {
    path: '/dashboard/people/tutor/profile',
    name: 'profile tutor'
  },
  DASHBOARD_PEOPLE_INSTRUCTOR: {
    path: '/dashboard/people/instructor',
    name: 'Instructors'
  },
  DASHBOARD_ADD_INSTRUCTOR: {
    path: '/dashboard/people/instructor/add',
    name: 'Add instructor'
  },
  DASHBOARD_PROFILE_INSTRUCTOR: {
    path: '/dashboard/people/instructor/profile',
    name: 'profile INSTRUCTOR'
  },
  DASHBOARD_PROFILE_IMPORT_CSV: {
    path: '/dashboard/people/import-csv',
    name: 'Import CSV'
  },
  DASHBOARD_PEOPLE_STUDENT: {
    path: '/dashboard/people/student',
    name: 'Students'
  },
  DASHBOARD_ADD_STUDENT: {
    path: '/dashboard/people/student/add',
    name: 'Add student'
  },
  DASHBOARD_PROFILE_STUDENT: {
    path: '/dashboard/people/student/profile',
    name: 'profile STUDENT'
  },
  DASHBOARD_PEOPLE_EDITOR: {
    path: '/dashboard/people/editor',
    name: 'Editors'
  },
  DASHBOARD_ADD_EDITOR: {
    path: '/dashboard/people/editor/add',
    name: 'Add editor'
  },
  DASHBOARD_PROFILE_EDITOR: {
    path: '/dashboard/people/editor/profile',
    name: 'profile EDITOR'
  },
  DASHBOARD_PEOPLE_CUSTOMER_SERVICE: {
    path: '/dashboard/people/customer-service',
    name: 'CS Representatives'
  },
  DASHBOARD_ADD_CUSTOMER_SERVICE: {
    path: '/dashboard/people/customer-service/add',
    name: 'Add CS Representative'
  },
  DASHBOARD_PROFILE_CUSTOMER_SERVICE: {
    path: '/dashboard/people/customer-service/profile',
    name: 'profile CUSTOMER_SERVICE'
  },
  DASHBOARD_CLASS_TAGS: {
    path: '/dashboard/people/class-tags',
    name: 'Class tags'
  },
  /* --------------------------------- PACKAGE -------------------------------- */
  DASHBOARD_PACKAGE_SETTING: {
    path: '/dashboard/subscriptions/settings',
    name: 'Settings'
  },
  DASHBOARD_PACKAGE_COUPONS: {
    path: '/dashboard/subscriptions/coupons',
    name: 'Coupons'
  },
  // DASHBOARD_PACKAGE_FEATURES: {
  //   path: '/dashboard/package/features',
  //   name: 'Package features'
  // },
  DASHBOARD_PACKAGES_LIST: {
    path: '/dashboard/subscriptions/packages',
    name: 'Packages'
  },
  DASHBOARD_PAID_COURSES: {
    path: '/dashboard/subscriptions/paid-courses',
    name: 'Paid Courses'
  },
  /* -------------------------------- PROFILE -------------------------------- */
  DASHBOARD_EDIT_PROFILE: {
    path: '/dashboard/edit-profile',
    name: 'Edit profile'
  },
  /* ----------------------------- CHANGE PASSWORD ---------------------------- */
  DASHBOARD_CHANGE_PASSWORD: {
    path: '/dashboard/change-password',
    name: 'Change password'
  },
  //SP ->
  STUDENT: {
    path: 'dashboard/student',
    name: 'student'
  },
  STUDENT_COURSE: {
    path: 'dashboard/student/course',
    name: 'My courses'
  },

  LOGIN: {
    path: '/login',
    name: 'Login'
  },
  TEACH: {
    path: '/teach',
    name: 'Teach'
  },
  //SP <-

  TEACHER_APPLICATION: {
    path: '/teacher-application',
    name: 'Teacher application'
  },
  /* -------------------------------- NOT FOUND ------------------------------- */
  NOT_FOUND: {
    path: '/not-found',
    name: 'Teacher application'
  },
  /* ------------------------------- maintenance ------------------------------ */
  MAINTENANCE: {
    path: '/maintenance',
    name: 'Teacher application'
  },
  /* ----------------------------- BLOG MANAGEMENT ---------------------------- */
  DASHBOARD_BLOG_MANAGEMENT_CATEGORIES: {
    path: '/dashboard/blog-management/categories',
    name: 'Categories'
  },
  DASHBOARD_BLOG_MANAGEMENT_BLOG: {
    path: '/dashboard/blog-management/blog',
    name: 'Blog'
  },
  DASHBOARD_BLOG_MANAGEMENT_ADD_BLOG: {
    path: '/dashboard/blog-management/blog/add',
    name: 'Add blog'
  },
  /* ----------------------------- FAQ MANAGEMENT ----------------------------- */
  DASHBOARD_FAQ_MANAGEMENT_CATEGORIES: {
    path: '/dashboard/faq-management/categories',
    name: 'Categories'
  },
  DASHBOARD_FAQ_MANAGEMENT_FAQS: {
    path: '/dashboard/faq-management/faqs',
    name: 'FAQs'
  },
  DASHBOARD_FAQ_MANAGEMENT_FAQS_ADD_FAQ: {
    path: '/dashboard/faq-management/faqs/add',
    name: 'Add FAQ'
  },
  /* ---------------------------- BANNER MANAGEMENT --------------------------- */
  DASHBOARD_BANNER_MANAGEMENT: {
    path: '/dashboard/banner-management',
    name: 'Banner Management'
  },

  DASHBOARD_BANNER_MANAGEMENT_ADD_BANNER: {
    path: '/dashboard/banner-management/add',
    name: 'Add Banner'
  },
  /* -------------------------------- SETTINGS -------------------------------- */
  DASHBOARD_SETTING_THEME_LOGO: {
    path: '/dashboard/settings/theme-logo',
    name: 'Theme & Logo'
  },
  DASHBOARD_SETTING_INFORMATION: {
    path: '/dashboard/settings/information',
    name: 'Information'
  },
  DASHBOARD_SETTING_SOCIAL_MEDIA: {
    path: '/dashboard/settings/social-media',
    name: 'Social Media'
  },
  DASHBOARD_SETTING_EMAIL: {
    path: '/dashboard/settings/email',
    name: 'Email Settings'
  },
  DASHBOARD_SETTING_CREDIT: {
    path: '/dashboard/settings/credit',
    name: 'Credit'
  },
  /* -------------------------------- MY SPACE -------------------------------- */
  DASHBOARD_MY_SPACE: {
    path: '/dashboard/my-space',
    name: 'My space'
  },

  /* ----------------------------- PAYMENT SERVICE ---------------------------- */
  DASHBOARD_PAYMENT_SERVICES: {
    path: '/dashboard/payment-services',
    name: 'Payment services'
  }
}