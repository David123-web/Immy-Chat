import { Role } from '@prisma/client';
import { accessKeys } from 'src/common/constants';

export const accounts = [
    {
        email: 'admin@mailinator.com',
        password: 'admin123',
        role: Role.SUPER_ADMIN,
    },
    {
        email: 'subdomain_admin@mailinator.com',
        password: 'subdomain_admin123',
        role: Role.SUBDOMAIN_ADMIN,
    },
    {
        email: 'student@mailinator.com',
        password: 'student123',
        role: Role.STUDENT,
    },
    {
        email: 'instructor@mailinator.com',
        password: 'instructor123',
        role: Role.INSTRUCTOR,
    },
    {
        email: 'tutor@mailinator.com',
        password: 'tutor123',
        role: Role.TUTOR,
    },
    {
        email: 'editor@mailinator.com',
        password: 'editor123',
        role: Role.EDITOR,
    },
    {
        email: 'customer_service@mailinator.com',
        password: 'customerserivce123',
        role: Role.CUSTOMER_SERVICE,
    },
];

export const userSocialLinks = {
    facebook: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    twitter: '',
};

export const subscriptionPlans = [];

export const tags = [
    'Business',
    'General',
    'Primary',
    'Hospitality',
    'Tourism',
    'IELTS',
    'Toeic',
];

export const levels = [
    'Beginner 1',
    'Beginner 2',
    'Intermediate 1',
    'Intermediate 2',
    'Advance 1',
    'Advance 2',
];

export const courseLanguages = [
    {
        code: 'ab',
        name: 'Abkhaz',
    },
    {
        code: 'aa',
        name: 'Afar',
    },
    {
        code: 'af',
        name: 'Afrikaans',
    },
    {
        code: 'ak',
        name: 'Akan',
    },
    {
        code: 'sq',
        name: 'Albanian',
    },
    {
        code: 'am',
        name: 'Amharic',
    },
    {
        code: 'ar',
        name: 'Arabic',
    },
    {
        code: 'arc',
        name: 'Aramaic',
    },
    {
        code: 'an',
        name: 'Aragonese',
    },
    {
        code: 'hy',
        name: 'Armenian',
    },
    {
        code: 'as',
        name: 'Assamese',
    },
    {
        code: 'atj',
        name: 'Atikamekw',
    },
    {
        code: 'av',
        name: 'Avaric',
    },
    {
        code: 'ae',
        name: 'Avestan',
    },
    {
        code: 'ay',
        name: 'Aymara',
    },
    {
        code: 'az',
        name: 'Azerbaijani',
    },
    {
        code: 'bm',
        name: 'Bambara',
    },
    {
        code: 'ba',
        name: 'Bashkir',
    },
    {
        code: 'eu',
        name: 'Basque',
    },
    {
        code: 'be',
        name: 'Belarusian',
    },
    {
        code: 'bn',
        name: 'Bengali; Bangla',
    },
    {
        code: 'bh',
        name: 'Bihari',
    },
    {
        code: 'bi',
        name: 'Bislama',
    },
    {
        code: 'bs',
        name: 'Bosnian',
    },
    {
        code: 'br',
        name: 'Breton',
    },
    {
        code: 'bg',
        name: 'Bulgarian',
    },
    {
        code: 'my',
        name: 'Burmese',
    },
    {
        code: 'ca',
        name: 'Catalan; Valencian',
    },
    {
        code: 'ch',
        name: 'Chamorro',
    },
    {
        code: 'ce',
        name: 'Chechen',
    },
    {
        code: 'ny',
        name: 'Chichewa; Chewa; Nyanja',
    },
    {
        code: 'zh',
        name: 'Chinese',
    },
    {
        code: 'cv',
        name: 'Chuvash',
    },
    {
        code: 'kw',
        name: 'Cornish',
    },
    {
        code: 'co',
        name: 'Corsican',
    },
    {
        code: 'cre',
        name: 'Cree',
    },
    {
        code: 'cr',
        name: 'Cree',
    },
    {
        code: 'hr',
        name: 'Croatian',
    },
    {
        code: 'cs',
        name: 'Czech',
    },
    {
        code: 'da',
        name: 'Danish',
    },
    {
        code: 'dv',
        name: 'Divehi; Dhivehi; Maldivian;',
    },
    {
        code: 'nl',
        name: 'Dutch',
    },
    {
        code: 'dz',
        name: 'Dzongkha',
    },
    {
        code: 'en',
        name: 'English',
    },
    {
        code: 'eo',
        name: 'Esperanto',
    },
    {
        code: 'et',
        name: 'Estonian',
    },
    {
        code: 'ee',
        name: 'Ewe',
    },
    {
        code: 'fo',
        name: 'Faroese',
    },
    {
        code: 'fj',
        name: 'Fijian',
    },
    {
        code: 'fi',
        name: 'Finnish',
    },
    {
        code: 'fr',
        name: 'French',
    },
    {
        code: 'ff',
        name: 'Fula; Fulah; Pulaar; Pular',
    },
    {
        code: 'gl',
        name: 'Galician',
    },
    {
        code: 'lg',
        name: 'Ganda',
    },
    {
        code: 'ka',
        name: 'Georgian',
    },
    {
        code: 'de',
        name: 'German',
    },
    {
        code: 'el',
        name: 'Greek, Modern',
    },
    {
        code: 'gn',
        name: 'GuaranÃ­',
    },
    {
        code: 'gu',
        name: 'Gujarati',
    },
    {
        code: 'ht',
        name: 'Haitian; Haitian Creole',
    },
    {
        code: 'ha',
        name: 'Hausa',
    },
    {
        code: 'he',
        name: 'Hebrew (modern)',
    },
    {
        code: 'hz',
        name: 'Herero',
    },
    {
        code: 'hi',
        name: 'Hindi',
    },
    {
        code: 'ho',
        name: 'Hiri Motu',
    },
    {
        code: 'hu',
        name: 'Hungarian',
    },
    {
        code: 'is',
        name: 'Icelandic',
    },
    {
        code: 'io',
        name: 'Ido',
    },
    {
        code: 'ig',
        name: 'Igbo',
    },
    {
        code: 'id',
        name: 'Indonesian',
    },
    {
        code: 'ia',
        name: 'Interlingua',
    },
    {
        code: 'ie',
        name: 'Interlingue',
    },
    {
        code: 'iu',
        name: 'Inuktitut',
    },
    {
        code: 'ik',
        name: 'Inupiaq',
    },
    {
        code: 'ga',
        name: 'Irish',
    },
    {
        code: 'it',
        name: 'Italian',
    },
    {
        code: 'ja',
        name: 'Japanese',
    },
    {
        code: 'jv',
        name: 'Javanese',
    },
    {
        code: 'kl',
        name: 'Kalaallisut, Greenlandic',
    },
    {
        code: 'kn',
        name: 'Kannada',
    },
    {
        code: 'kr',
        name: 'Kanuri',
    },
    {
        code: 'ks',
        name: 'Kashmiri',
    },
    {
        code: 'kk',
        name: 'Kazakh',
    },
    {
        code: 'km',
        name: 'Khmer',
    },
    {
        code: 'ki',
        name: 'Kikuyu, Gikuyu',
    },
    {
        code: 'rw',
        name: 'Kinyarwanda',
    },
    {
        code: 'rn',
        name: 'Kirundi',
    },
    {
        code: 'kv',
        name: 'Komi',
    },
    {
        code: 'kg',
        name: 'Kongo',
    },
    {
        code: 'ko',
        name: 'Korean',
    },
    {
        code: 'ku',
        name: 'Kurdish',
    },
    {
        code: 'kj',
        name: 'Kwanyama, Kuanyama',
    },
    {
        code: 'ky',
        name: 'Kyrgyz',
    },
    {
        code: 'lo',
        name: 'Lao',
    },
    {
        code: 'la',
        name: 'Latin',
    },
    {
        code: 'lv',
        name: 'Latvian',
    },
    {
        code: 'li',
        name: 'Limburgish, Limburgan, Limburger',
    },
    {
        code: 'ln',
        name: 'Lingala',
    },
    {
        code: 'lt',
        name: 'Lithuanian',
    },
    {
        code: 'lu',
        name: 'Luba-Katanga',
    },
    {
        code: 'lb',
        name: 'Luxembourgish, Letzeburgesch',
    },
    {
        code: 'mk',
        name: 'Macedonian',
    },
    {
        code: 'mg',
        name: 'Malagasy',
    },
    {
        code: 'ms',
        name: 'Malay',
    },
    {
        code: 'ml',
        name: 'Malayalam',
    },
    {
        code: 'mt',
        name: 'Maltese',
    },
    {
        code: 'gv',
        name: 'Manx',
    },
    {
        code: 'mi',
        name: 'MÄori',
    },
    {
        code: 'mr',
        name: 'Marathi (MarÄá¹­hÄ«)',
    },
    {
        code: 'mh',
        name: 'Marshallese',
    },
    {
        code: 'mn',
        name: 'Mongolian',
    },
    {
        code: 'moe',
        name: 'Montagnais',
    },
    {
        code: 'crm',
        name: 'Moose Cree',
    },
    {
        code: 'nsk',
        name: 'Naskapi',
    },
    {
        code: 'na',
        name: 'Nauru',
    },
    {
        code: 'nv',
        name: 'Navajo, Navaho',
    },
    {
        code: 'ng',
        name: 'Ndonga',
    },
    {
        code: 'ne',
        name: 'Nepali',
    },
    {
        code: 'ncg',
        name: 'Nisga',
    },
    {
        code: 'nd',
        name: 'North Ndebele',
    },
    {
        code: 'crl',
        name: 'Northern East Cree',
    },
    {
        code: 'se',
        name: 'Northern Sami',
    },
    {
        code: 'no',
        name: 'Norwegian',
    },
    {
        code: 'nb',
        name: 'Norwegian BokmÃ¥l',
    },
    {
        code: 'nn',
        name: 'Norwegian Nynorsk',
    },
    {
        code: 'ii',
        name: 'Nuosu',
    },
    {
        code: 'oc',
        name: 'Occitan',
    },
    {
        code: 'oj',
        name: 'Ojibwe, Ojibwa',
    },
    {
        code: 'cu',
        name: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
    },
    {
        code: 'or',
        name: 'Oriya',
    },
    {
        code: 'om',
        name: 'Oromo',
    },
    {
        code: 'os',
        name: 'Ossetian, Ossetic',
    },
    {
        code: 'pi',
        name: 'PÄli',
    },
    {
        code: 'pa',
        name: 'Panjabi, Punjabi',
    },
    {
        code: 'ps',
        name: 'Pashto, Pushto',
    },
    {
        code: 'fa',
        name: 'Persian (Farsi)',
    },
    {
        code: 'crk',
        name: 'Plains Cree',
    },
    {
        code: 'pl',
        name: 'Polish',
    },
    {
        code: 'pt',
        name: 'Portuguese',
    },
    {
        code: 'qu',
        name: 'Quechua',
    },
    {
        code: 'ro',
        name: 'Romanian, [])',
    },
    {
        code: 'rm',
        name: 'Romansh',
    },
    {
        code: 'ru',
        name: 'Russian',
    },
    {
        code: 'sm',
        name: 'Samoan',
    },
    {
        code: 'sg',
        name: 'Sango',
    },
    {
        code: 'sa',
        name: 'Sanskrit (Saá¹ská¹›ta)',
    },
    {
        code: 'sc',
        name: 'Sardinian',
    },
    {
        code: 'gd',
        name: 'Scottish Gaelic; Gaelic',
    },
    {
        code: 'sr',
        name: 'Serbian',
    },
    {
        code: 'sn',
        name: 'Shona',
    },
    {
        code: 'sd',
        name: 'Sindhi',
    },
    {
        code: 'si',
        name: 'Sinhala, Sinhalese',
    },
    {
        code: 'sk',
        name: 'Slovak',
    },
    {
        code: 'sl',
        name: 'Slovene',
    },
    {
        code: 'so',
        name: 'Somali',
    },
    {
        code: 'nr',
        name: 'South Ndebele',
    },
    {
        code: 'crj',
        name: 'Southern East Cree',
    },
    {
        code: 'st',
        name: 'Southern Sotho',
    },
    {
        code: 'es',
        name: 'Spanish; Castilian',
    },
    {
        code: 'squ',
        name: 'Squamish',
    },
    {
        code: 'su',
        name: 'Sundanese',
    },
    {
        code: 'sw',
        name: 'Swahili',
    },
    {
        code: 'csw',
        name: 'Swampy Cree',
    },
    {
        code: 'ss',
        name: 'Swati',
    },
    {
        code: 'sv',
        name: 'Swedish',
    },
    {
        code: 'tl',
        name: 'Tagalog',
    },
    {
        code: 'ty',
        name: 'Tahitian',
    },
    {
        code: 'tg',
        name: 'Tajik',
    },
    {
        code: 'ta',
        name: 'Tamil',
    },
    {
        code: 'tt',
        name: 'Tatar',
    },
    {
        code: 'te',
        name: 'Telugu',
    },
    {
        code: 'th',
        name: 'Thai',
    },
    {
        code: 'bo',
        name: 'Tibetan Standard, Tibetan, Central',
    },
    {
        code: 'ti',
        name: 'Tigrinya',
    },
    {
        code: 'to',
        name: 'Tonga (Tonga Islands)',
    },
    {
        code: 'ts',
        name: 'Tsonga',
    },
    {
        code: 'tn',
        name: 'Tswana',
    },
    {
        code: 'tr',
        name: 'Turkish',
    },
    {
        code: 'tk',
        name: 'Turkmen',
    },
    {
        code: 'tw',
        name: 'Twi',
    },
    {
        code: 'uk',
        name: 'Ukrainian',
    },
    {
        code: 'ur',
        name: 'Urdu',
    },
    {
        code: 'ug',
        name: 'Uyghur, Uighur',
    },
    {
        code: 'uz',
        name: 'Uzbek',
    },
    {
        code: 've',
        name: 'Venda',
    },
    {
        code: 'vi',
        name: 'Vietnamese',
    },
    {
        code: 'vo',
        name: 'VolapÃ¼k',
    },
    {
        code: 'wa',
        name: 'Walloon',
    },
    {
        code: 'cy',
        name: 'Welsh',
    },
    {
        code: 'fy',
        name: 'Western Frisian',
    },
    {
        code: 'wo',
        name: 'Wolof',
    },
    {
        code: 'cwd',
        name: 'Woods Cree',
    },
    {
        code: 'xh',
        name: 'Xhosa',
    },
    {
        code: 'yi',
        name: 'Yiddish',
    },
    {
        code: 'yo',
        name: 'Yoruba',
    },
    {
        code: 'za',
        name: 'Zhuang, Chuang',
    },
    {
        code: 'zu',
        name: 'Zulu',
    },
];

export const roleManagementDefaultValue = {
    SUBDOMAIN_ADMIN: {
        name: 'Subdomain Admin',
        value: {
            [accessKeys.COURSE_CREATOR_LIST]: true,
            [accessKeys.COURSE_CREATOR_STEP1]: true,
            [accessKeys.COURSE_CREATOR_STEP2]: true,
            [accessKeys.COURSE_CREATOR_STEP3]: true,
            [accessKeys.COURSE_CREATOR_TAGS]: true,
            [accessKeys.PEOPLE_INSTRUCTORS]: true,
            [accessKeys.PEOPLE_TUTORS]: true,
            [accessKeys.PEOPLE_STUDENTS]: true,
            [accessKeys.PEOPLE_EDITORS]: true,
            [accessKeys.PEOPLE_CSRREPS]: true,
            [accessKeys.PEOPLE_ROLE_SETTINGS]: true,
            [accessKeys.TUTOR_MATCH_CLASSES]: true,
            [accessKeys.TUTOR_MATCH_REVIEWS]: true,
            [accessKeys.TUTOR_MATCH_REPORTS]: true,
            [accessKeys.TUTOR_MATCH_CAMPUS]: true,
            [accessKeys.TUTOR_MATCH_INVOICES]: true,
            [accessKeys.STUDENT_RECORDINGS]: true,
            [accessKeys.IMMYCHAT_CHATBOT]: true,
            [accessKeys.PAYMENT_GATEWAYS]: true,
            [accessKeys.PAYMENT_LOGS]: true,
            [accessKeys.BLOG_MANAGEMENT]: true,
            [accessKeys.FAQ_MANAGEMENT]: true,
            [accessKeys.BANNER_MANAGEMENT]: true,
            [accessKeys.BASIC_SETTINGS]: true,
            [accessKeys.EDIT_PROFILE]: true,
            [accessKeys.CHANGE_PASSWORD]: true,
            [accessKeys.SUBSCRIPTION_COUPONS]: true,
            [accessKeys.SUBSCRIPTION_COURSE]: true,
            [accessKeys.SUBSCRIPTION_TUTORS]: true,
            [accessKeys.MYDRIVE_MANAGEMENT]: true,
            [accessKeys.PEOPLE_CLASS_TAG]: true,
            [accessKeys.SETTINGS_THEME_LOGO]: true,
            [accessKeys.SETTINGS_INFORMATION]: true,
            [accessKeys.SETTINGS_SOCIAL_MEDIA]: true,
            [accessKeys.SETTINGS_EMAIL]: true,
        },
    },
    INSTRUCTOR: {
        name: 'Instructor',
        value: {
            [accessKeys.COURSE_CREATOR_LIST]: true,
            [accessKeys.COURSE_CREATOR_STEP1]: true,
            [accessKeys.COURSE_CREATOR_STEP2]: true,
            [accessKeys.COURSE_CREATOR_STEP3]: true,
            [accessKeys.COURSE_CREATOR_TAGS]: true,
            [accessKeys.PEOPLE_TUTORS]: true,
            [accessKeys.PEOPLE_STUDENTS]: true,
            [accessKeys.TUTOR_MATCH_CLASSES]: true,
            [accessKeys.TUTOR_MATCH_REVIEWS]: true,
            [accessKeys.TUTOR_MATCH_REPORTS]: true,
            [accessKeys.TUTOR_MATCH_CAMPUS]: true,
            [accessKeys.TUTOR_MATCH_INVOICES]: true,
            [accessKeys.STUDENT_RECORDINGS]: true,
            [accessKeys.IMMYCHAT_CHATBOT]: true,
            [accessKeys.PAYMENT_LOGS]: true,
            [accessKeys.EDIT_PROFILE]: true,
            [accessKeys.CHANGE_PASSWORD]: true,
            [accessKeys.MYDRIVE_MANAGEMENT]: true,
        },
    },
    TUTOR: {
        name: 'Tutor',
        value: {
            [accessKeys.COURSE_CREATOR_LIST]: true,
            [accessKeys.PEOPLE_STUDENTS]: true,
            [accessKeys.TUTOR_MATCH_CLASSES]: true,
            [accessKeys.TUTOR_MATCH_REPORTS]: true,
            [accessKeys.STUDENT_RECORDINGS]: true,
            [accessKeys.IMMYCHAT_CHATBOT]: true,
            [accessKeys.EDIT_PROFILE]: true,
            [accessKeys.CHANGE_PASSWORD]: true,
            [accessKeys.MYDRIVE_MANAGEMENT]: true,
        },
    },
    STUDENT: {
        name: 'Student',
        value: {
            [accessKeys.TUTOR_MATCH_CLASSES]: true,
            [accessKeys.TUTOR_MATCH_REVIEWS]: true,
            [accessKeys.STUDENT_RECORDINGS]: true,
            [accessKeys.IMMYCHAT_CHATBOT]: true,
            [accessKeys.EDIT_PROFILE]: true,
            [accessKeys.CHANGE_PASSWORD]: true,
        },
    },
    EDITOR: {
        name: 'Editor',
        value: {
            [accessKeys.EDIT_PROFILE]: true,
            [accessKeys.CHANGE_PASSWORD]: true,
        },
    },
    CUSTOMER_SERVICE: {
        name: 'Customer Service',
        value: {
            [accessKeys.TUTOR_MATCH_CLASSES]: true,
            [accessKeys.TUTOR_MATCH_REVIEWS]: true,
            [accessKeys.TUTOR_MATCH_REPORTS]: true,
            [accessKeys.TUTOR_MATCH_CAMPUS]: true,
            [accessKeys.TUTOR_MATCH_INVOICES]: true,
            [accessKeys.EDIT_PROFILE]: true,
            [accessKeys.CHANGE_PASSWORD]: true,
            [accessKeys.PEOPLE_CLASS_TAG]: true,
        },
    },
};

export const proficiencyLevels = [
    {
        code: 'A1',
        name: 'Beginner',
    },
    {
        code: 'A2',
        name: 'Elementary',
    },
    {
        code: 'B1',
        name: 'Intermediate',
    },
    {
        code: 'B2',
        name: 'Upper intermediate',
    },
    {
        code: 'C1',
        name: 'Advanced',
    },
    {
        code: 'C2',
        name: 'Proficiency',
    },
];

export const languages = [
    {
        code: 'ab',
        name: 'Abkhaz',
    },
    {
        code: 'aa',
        name: 'Afar',
    },
    {
        code: 'af',
        name: 'Afrikaans',
    },
    {
        code: 'ak',
        name: 'Akan',
    },
    {
        code: 'sq',
        name: 'Albanian',
    },
    {
        code: 'am',
        name: 'Amharic',
    },
    {
        code: 'ar',
        name: 'Arabic',
    },
    {
        code: 'arc',
        name: 'Aramaic',
    },
    {
        code: 'an',
        name: 'Aragonese',
    },
    {
        code: 'hy',
        name: 'Armenian',
    },
    {
        code: 'as',
        name: 'Assamese',
    },
    {
        code: 'av',
        name: 'Avaric',
    },
    {
        code: 'ae',
        name: 'Avestan',
    },
    {
        code: 'ay',
        name: 'Aymara',
    },
    {
        code: 'az',
        name: 'Azerbaijani',
    },
    {
        code: 'bm',
        name: 'Bambara',
    },
    {
        code: 'ba',
        name: 'Bashkir',
    },
    {
        code: 'eu',
        name: 'Basque',
    },
    {
        code: 'be',
        name: 'Belarusian',
    },
    {
        code: 'bn',
        name: 'Bengali; Bangla',
    },
    {
        code: 'bh',
        name: 'Bihari',
    },
    {
        code: 'bi',
        name: 'Bislama',
    },
    {
        code: 'bs',
        name: 'Bosnian',
    },
    {
        code: 'br',
        name: 'Breton',
    },
    {
        code: 'bg',
        name: 'Bulgarian',
    },
    {
        code: 'my',
        name: 'Burmese',
    },
    {
        code: 'ca',
        name: 'Catalan; Valencian',
    },
    {
        code: 'ch',
        name: 'Chamorro',
    },
    {
        code: 'ce',
        name: 'Chechen',
    },
    {
        code: 'ny',
        name: 'Chichewa; Chewa; Nyanja',
    },
    {
        code: 'zh',
        name: 'Chinese',
    },
    {
        code: 'cv',
        name: 'Chuvash',
    },
    {
        code: 'kw',
        name: 'Cornish',
    },
    {
        code: 'co',
        name: 'Corsican',
    },
    {
        code: 'cr',
        name: 'Cree',
    },
    {
        code: 'hr',
        name: 'Croatian',
    },
    {
        code: 'cs',
        name: 'Czech',
    },
    {
        code: 'da',
        name: 'Danish',
    },
    {
        code: 'dv',
        name: 'Divehi; Dhivehi; Maldivian;',
    },
    {
        code: 'nl',
        name: 'Dutch',
    },
    {
        code: 'dz',
        name: 'Dzongkha',
    },
    {
        code: 'en',
        name: 'English',
    },
    {
        code: 'eo',
        name: 'Esperanto',
    },
    {
        code: 'et',
        name: 'Estonian',
    },
    {
        code: 'ee',
        name: 'Ewe',
    },
    {
        code: 'fo',
        name: 'Faroese',
    },
    {
        code: 'fj',
        name: 'Fijian',
    },
    {
        code: 'fi',
        name: 'Finnish',
    },
    {
        code: 'fr',
        name: 'French',
    },
    {
        code: 'ff',
        name: 'Fula; Fulah; Pulaar; Pular',
    },
    {
        code: 'gl',
        name: 'Galician',
    },
    {
        code: 'ka',
        name: 'Georgian',
    },
    {
        code: 'de',
        name: 'German',
    },
    {
        code: 'el',
        name: 'Greek, Modern',
    },
    {
        code: 'gn',
        name: 'GuaranÃ­',
    },
    {
        code: 'gu',
        name: 'Gujarati',
    },
    {
        code: 'ht',
        name: 'Haitian; Haitian Creole',
    },
    {
        code: 'ha',
        name: 'Hausa',
    },
    {
        code: 'he',
        name: 'Hebrew (modern)',
    },
    {
        code: 'hz',
        name: 'Herero',
    },
    {
        code: 'hi',
        name: 'Hindi',
    },
    {
        code: 'ho',
        name: 'Hiri Motu',
    },
    {
        code: 'hu',
        name: 'Hungarian',
    },
    {
        code: 'ia',
        name: 'Interlingua',
    },
    {
        code: 'id',
        name: 'Indonesian',
    },
    {
        code: 'ie',
        name: 'Interlingue',
    },
    {
        code: 'ga',
        name: 'Irish',
    },
    {
        code: 'ig',
        name: 'Igbo',
    },
    {
        code: 'ik',
        name: 'Inupiaq',
    },
    {
        code: 'io',
        name: 'Ido',
    },
    {
        code: 'is',
        name: 'Icelandic',
    },
    {
        code: 'it',
        name: 'Italian',
    },
    {
        code: 'iu',
        name: 'Inuktitut',
    },
    {
        code: 'ja',
        name: 'Japanese',
    },
    {
        code: 'jv',
        name: 'Javanese',
    },
    {
        code: 'kl',
        name: 'Kalaallisut, Greenlandic',
    },
    {
        code: 'kn',
        name: 'Kannada',
    },
    {
        code: 'kr',
        name: 'Kanuri',
    },
    {
        code: 'ks',
        name: 'Kashmiri',
    },
    {
        code: 'kk',
        name: 'Kazakh',
    },
    {
        code: 'km',
        name: 'Khmer',
    },
    {
        code: 'ki',
        name: 'Kikuyu, Gikuyu',
    },
    {
        code: 'rw',
        name: 'Kinyarwanda',
    },
    {
        code: 'ky',
        name: 'Kyrgyz',
    },
    {
        code: 'kv',
        name: 'Komi',
    },
    {
        code: 'kg',
        name: 'Kongo',
    },
    {
        code: 'ko',
        name: 'Korean',
    },
    {
        code: 'ku',
        name: 'Kurdish',
    },
    {
        code: 'kj',
        name: 'Kwanyama, Kuanyama',
    },
    {
        code: 'la',
        name: 'Latin',
    },
    {
        code: 'lb',
        name: 'Luxembourgish, Letzeburgesch',
    },
    {
        code: 'lg',
        name: 'Ganda',
    },
    {
        code: 'li',
        name: 'Limburgish, Limburgan, Limburger',
    },
    {
        code: 'ln',
        name: 'Lingala',
    },
    {
        code: 'lo',
        name: 'Lao',
    },
    {
        code: 'lt',
        name: 'Lithuanian',
    },
    {
        code: 'lu',
        name: 'Luba-Katanga',
    },
    {
        code: 'lv',
        name: 'Latvian',
    },
    {
        code: 'gv',
        name: 'Manx',
    },
    {
        code: 'mk',
        name: 'Macedonian',
    },
    {
        code: 'mg',
        name: 'Malagasy',
    },
    {
        code: 'ms',
        name: 'Malay',
    },
    {
        code: 'ml',
        name: 'Malayalam',
    },
    {
        code: 'mt',
        name: 'Maltese',
    },
    {
        code: 'mi',
        name: 'MÄori',
    },
    {
        code: 'mr',
        name: 'Marathi (MarÄá¹­hÄ«)',
    },
    {
        code: 'mh',
        name: 'Marshallese',
    },
    {
        code: 'mn',
        name: 'Mongolian',
    },
    {
        code: 'na',
        name: 'Nauru',
    },
    {
        code: 'nv',
        name: 'Navajo, Navaho',
    },
    {
        code: 'nb',
        name: 'Norwegian BokmÃ¥l',
    },
    {
        code: 'nd',
        name: 'North Ndebele',
    },
    {
        code: 'ne',
        name: 'Nepali',
    },
    {
        code: 'ng',
        name: 'Ndonga',
    },
    {
        code: 'nn',
        name: 'Norwegian Nynorsk',
    },
    {
        code: 'no',
        name: 'Norwegian',
    },
    {
        code: 'ii',
        name: 'Nuosu',
    },
    {
        code: 'nr',
        name: 'South Ndebele',
    },
    {
        code: 'oc',
        name: 'Occitan',
    },
    {
        code: 'oj',
        name: 'Ojibwe, Ojibwa',
    },
    {
        code: 'cu',
        name: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
    },
    {
        code: 'om',
        name: 'Oromo',
    },
    {
        code: 'or',
        name: 'Oriya',
    },
    {
        code: 'os',
        name: 'Ossetian, Ossetic',
    },
    {
        code: 'pa',
        name: 'Panjabi, Punjabi',
    },
    {
        code: 'pi',
        name: 'PÄli',
    },
    {
        code: 'fa',
        name: 'Persian (Farsi)',
    },
    {
        code: 'pl',
        name: 'Polish',
    },
    {
        code: 'ps',
        name: 'Pashto, Pushto',
    },
    {
        code: 'pt',
        name: 'Portuguese',
    },
    {
        code: 'qu',
        name: 'Quechua',
    },
    {
        code: 'rm',
        name: 'Romansh',
    },
    {
        code: 'rn',
        name: 'Kirundi',
    },
    {
        code: 'ro',
        name: 'Romanian, [])',
    },
    {
        code: 'ru',
        name: 'Russian',
    },
    {
        code: 'sa',
        name: 'Sanskrit (Saá¹ská¹›ta)',
    },
    {
        code: 'sc',
        name: 'Sardinian',
    },
    {
        code: 'sd',
        name: 'Sindhi',
    },
    {
        code: 'se',
        name: 'Northern Sami',
    },
    {
        code: 'sm',
        name: 'Samoan',
    },
    {
        code: 'sg',
        name: 'Sango',
    },
    {
        code: 'sr',
        name: 'Serbian',
    },
    {
        code: 'gd',
        name: 'Scottish Gaelic; Gaelic',
    },
    {
        code: 'sn',
        name: 'Shona',
    },
    {
        code: 'si',
        name: 'Sinhala, Sinhalese',
    },
    {
        code: 'sk',
        name: 'Slovak',
    },
    {
        code: 'sl',
        name: 'Slovene',
    },
    {
        code: 'so',
        name: 'Somali',
    },
    {
        code: 'st',
        name: 'Southern Sotho',
    },
    {
        code: 'es',
        name: 'Spanish; Castilian',
    },
    {
        code: 'su',
        name: 'Sundanese',
    },
    {
        code: 'sw',
        name: 'Swahili',
    },
    {
        code: 'ss',
        name: 'Swati',
    },
    {
        code: 'sv',
        name: 'Swedish',
    },
    {
        code: 'ta',
        name: 'Tamil',
    },
    {
        code: 'te',
        name: 'Telugu',
    },
    {
        code: 'tg',
        name: 'Tajik',
    },
    {
        code: 'th',
        name: 'Thai',
    },
    {
        code: 'ti',
        name: 'Tigrinya',
    },
    {
        code: 'bo',
        name: 'Tibetan Standard, Tibetan, Central',
    },
    {
        code: 'tk',
        name: 'Turkmen',
    },
    {
        code: 'tl',
        name: 'Tagalog',
    },
    {
        code: 'tn',
        name: 'Tswana',
    },
    {
        code: 'to',
        name: 'Tonga (Tonga Islands)',
    },
    {
        code: 'tr',
        name: 'Turkish',
    },
    {
        code: 'ts',
        name: 'Tsonga',
    },
    {
        code: 'tt',
        name: 'Tatar',
    },
    {
        code: 'tw',
        name: 'Twi',
    },
    {
        code: 'ty',
        name: 'Tahitian',
    },
    {
        code: 'ug',
        name: 'Uyghur, Uighur',
    },
    {
        code: 'uk',
        name: 'Ukrainian',
    },
    {
        code: 'ur',
        name: 'Urdu',
    },
    {
        code: 'uz',
        name: 'Uzbek',
    },
    {
        code: 've',
        name: 'Venda',
    },
    {
        code: 'vi',
        name: 'Vietnamese',
    },
    {
        code: 'vo',
        name: 'VolapÃ¼k',
    },
    {
        code: 'wa',
        name: 'Walloon',
    },
    {
        code: 'cy',
        name: 'Welsh',
    },
    {
        code: 'wo',
        name: 'Wolof',
    },
    {
        code: 'fy',
        name: 'Western Frisian',
    },
    {
        code: 'xh',
        name: 'Xhosa',
    },
    {
        code: 'yi',
        name: 'Yiddish',
    },
    {
        code: 'yo',
        name: 'Yoruba',
    },
    {
        code: 'za',
        name: 'Zhuang, Chuang',
    },
    {
        code: 'zu',
        name: 'Zulu',
    },
];

export const countries = [
    {
        code: 'AD',
        emoji: '🇦🇩',
        name: 'Andorra',
        dialCode: '+376',
    },
    {
        code: 'AE',
        emoji: '🇦🇪',
        name: 'United Arab Emirates',
        dialCode: '+971',
    },
    {
        code: 'AF',
        emoji: '🇦🇫',
        name: 'Afghanistan',
        dialCode: '+93',
    },
    {
        code: 'AG',
        emoji: '🇦🇬',
        name: 'Antigua and Barbuda',
        dialCode: '+1268',
    },
    {
        code: 'AI',
        emoji: '🇦🇮',
        name: 'Anguilla',
        dialCode: '+1 264',
    },
    {
        code: 'AL',
        emoji: '🇦🇱',
        name: 'Albania',
        dialCode: '+355',
    },
    {
        code: 'AM',
        emoji: '🇦🇲',
        name: 'Armenia',
        dialCode: '+374',
    },
    {
        code: 'AO',
        emoji: '🇦🇴',
        name: 'Angola',
        dialCode: '+244',
    },
    {
        code: 'AQ',
        emoji: '🇦🇶',
        name: 'Antarctica',
        dialCode: '+672',
    },
    {
        code: 'AR',
        emoji: '🇦🇷',
        name: 'Argentina',
        dialCode: '+54',
    },
    {
        code: 'AS',
        emoji: '🇦🇸',
        name: 'American Samoa',
        dialCode: '+1 684',
    },
    {
        code: 'AT',
        emoji: '🇦🇹',
        name: 'Austria',
        dialCode: '+43',
    },
    {
        code: 'AU',
        emoji: '🇦🇺',
        name: 'Australia',
        dialCode: '+61',
    },
    {
        code: 'AW',
        emoji: '🇦🇼',
        name: 'Aruba',
        dialCode: '+297',
    },
    {
        code: 'AX',
        emoji: '🇦🇽',
        name: 'Åland Islands',
        dialCode: '+358',
    },
    {
        code: 'AZ',
        emoji: '🇦🇿',
        name: 'Azerbaijan',
        dialCode: '+994',
    },
    {
        code: 'BA',
        emoji: '🇧🇦',
        name: 'Bosnia and Herzegovina',
        dialCode: '+387',
    },
    {
        code: 'BB',
        emoji: '🇧🇧',
        name: 'Barbados',
        dialCode: '+1 246',
    },
    {
        code: 'BD',
        emoji: '🇧🇩',
        name: 'Bangladesh',
        dialCode: '+880',
    },
    {
        code: 'BE',
        emoji: '🇧🇪',
        name: 'Belgium',
        dialCode: '+32',
    },
    {
        code: 'BF',
        emoji: '🇧🇫',
        name: 'Burkina Faso',
        dialCode: '+226',
    },
    {
        code: 'BG',
        emoji: '🇧🇬',
        name: 'Bulgaria',
        dialCode: '+359',
    },
    {
        code: 'BH',
        emoji: '🇧🇭',
        name: 'Bahrain',
        dialCode: '+973',
    },
    {
        code: 'BI',
        emoji: '🇧🇮',
        name: 'Burundi',
        dialCode: '+257',
    },
    {
        code: 'BJ',
        emoji: '🇧🇯',
        name: 'Benin',
        dialCode: '+229',
    },
    {
        code: 'BL',
        emoji: '🇧🇱',
        name: 'Saint Barthélemy',
        dialCode: '+590',
    },
    {
        code: 'BM',
        emoji: '🇧🇲',
        name: 'Bermuda',
        dialCode: '+1 441',
    },
    {
        code: 'BN',
        emoji: '🇧🇳',
        name: 'Brunei Darussalam',
        dialCode: '+673',
    },
    {
        code: 'BO',
        emoji: '🇧🇴',
        name: 'Bolivia',
        dialCode: '+591',
    },
    {
        code: 'BQ',
        emoji: '🇧🇶',
        name: 'Bonaire, Sint Eustatius and Saba',
        dialCode: '+599',
    },
    {
        code: 'BR',
        emoji: '🇧🇷',
        name: 'Brazil',
        dialCode: '+55',
    },
    {
        code: 'BS',
        emoji: '🇧🇸',
        name: 'Bahamas',
        dialCode: '+1 242',
    },
    {
        code: 'BT',
        emoji: '🇧🇹',
        name: 'Bhutan',
        dialCode: '+975',
    },
    {
        code: 'BV',
        emoji: '🇧🇻',
        name: 'Bouvet Island',
        dialCode: '+47',
    },
    {
        code: 'BW',
        emoji: '🇧🇼',
        name: 'Botswana',
        dialCode: '+267',
    },
    {
        code: 'BY',
        emoji: '🇧🇾',
        name: 'Belarus',
        dialCode: '+375',
    },
    {
        code: 'BZ',
        emoji: '🇧🇿',
        name: 'Belize',
        dialCode: '+501',
    },
    {
        code: 'CA',
        emoji: '🇨🇦',
        name: 'Canada',
        dialCode: '+1',
    },
    {
        code: 'CC',
        emoji: '🇨🇨',
        name: 'Cocos (Keeling) Islands',
        dialCode: '+61',
    },
    {
        code: 'CD',
        emoji: '🇨🇩',
        name: 'Congo',
        dialCode: '+243',
    },
    {
        code: 'CF',
        emoji: '🇨🇫',
        name: 'Central African Republic',
        dialCode: '+236',
    },
    {
        code: 'CG',
        emoji: '🇨🇬',
        name: 'Congo',
        dialCode: '+242',
    },
    {
        code: 'CH',
        emoji: '🇨🇭',
        name: 'Switzerland',
        dialCode: '+41',
    },
    {
        code: 'CI',
        emoji: '🇨🇮',
        name: 'Côte D\'Ivoire',
        dialCode: '+225',
    },
    {
        code: 'CK',
        emoji: '🇨🇰',
        name: 'Cook Islands',
        dialCode: '+682',
    },
    {
        code: 'CL',
        emoji: '🇨🇱',
        name: 'Chile',
        dialCode: '+56',
    },
    {
        code: 'CM',
        emoji: '🇨🇲',
        name: 'Cameroon',
        dialCode: '+237',
    },
    {
        code: 'CN',
        emoji: '🇨🇳',
        name: 'China',
        dialCode: '+86',
    },
    {
        code: 'CO',
        emoji: '🇨🇴',
        name: 'Colombia',
        dialCode: '+57',
    },
    {
        code: 'CR',
        emoji: '🇨🇷',
        name: 'Costa Rica',
        dialCode: '+506',
    },
    {
        code: 'CU',
        emoji: '🇨🇺',
        name: 'Cuba',
        dialCode: '+53',
    },
    {
        code: 'CV',
        emoji: '🇨🇻',
        name: 'Cape Verde',
        dialCode: '+238',
    },
    {
        code: 'CW',
        emoji: '🇨🇼',
        name: 'Curaçao',
        dialCode: '+599',
    },
    {
        code: 'CX',
        emoji: '🇨🇽',
        name: 'Christmas Island',
        dialCode: '+61',
    },
    {
        code: 'CY',
        emoji: '🇨🇾',
        name: 'Cyprus',
        dialCode: '+537',
    },
    {
        code: 'CZ',
        emoji: '🇨🇿',
        name: 'Czech Republic',
        dialCode: '+420',
    },
    {
        code: 'DE',
        emoji: '🇩🇪',
        name: 'Germany',
        dialCode: '+49',
    },
    {
        code: 'DJ',
        emoji: '🇩🇯',
        name: 'Djibouti',
        dialCode: '+253',
    },
    {
        code: 'DK',
        emoji: '🇩🇰',
        name: 'Denmark',
        dialCode: '+45',
    },
    {
        code: 'DM',
        emoji: '🇩🇲',
        name: 'Dominica',
        dialCode: '+1 767',
    },
    {
        code: 'DO',
        emoji: '🇩🇴',
        name: 'Dominican Republic',
        dialCode: '+1 849',
    },
    {
        code: 'DZ',
        emoji: '🇩🇿',
        name: 'Algeria',
        dialCode: '+213',
    },
    {
        code: 'EC',
        emoji: '🇪🇨',
        name: 'Ecuador',
        dialCode: '+593',
    },
    {
        code: 'EE',
        emoji: '🇪🇪',
        name: 'Estonia',
        dialCode: '+372',
    },
    {
        code: 'EG',
        emoji: '🇪🇬',
        name: 'Egypt',
        dialCode: '+20',
    },
    {
        code: 'EH',
        emoji: '🇪🇭',
        name: 'Western Sahara',
        dialCode: '+212',
    },
    {
        code: 'ER',
        emoji: '🇪🇷',
        name: 'Eritrea',
        dialCode: '+291',
    },
    {
        code: 'ES',
        emoji: '🇪🇸',
        name: 'Spain',
        dialCode: '+34',
    },
    {
        code: 'ET',
        emoji: '🇪🇹',
        name: 'Ethiopia',
        dialCode: '+251',
    },
    {
        code: 'FI',
        emoji: '🇫🇮',
        name: 'Finland',
        dialCode: '+358',
    },
    {
        code: 'FJ',
        emoji: '🇫🇯',
        name: 'Fiji',
        dialCode: '+679',
    },
    {
        code: 'FK',
        emoji: '🇫🇰',
        name: 'Falkland Islands (Malvinas)',
        dialCode: '+500',
    },
    {
        code: 'FM',
        emoji: '🇫🇲',
        name: 'Micronesia',
        dialCode: '+691',
    },
    {
        code: 'FO',
        emoji: '🇫🇴',
        name: 'Faroe Islands',
        dialCode: '+298',
    },
    {
        code: 'FR',
        emoji: '🇫🇷',
        name: 'France',
        dialCode: '+33',
    },
    {
        code: 'GA',
        emoji: '🇬🇦',
        name: 'Gabon',
        dialCode: '+241',
    },
    {
        code: 'GB',
        emoji: '🇬🇧',
        name: 'United Kingdom',
        dialCode: '+44',
    },
    {
        code: 'GD',
        emoji: '🇬🇩',
        name: 'Grenada',
        dialCode: '+1 473',
    },
    {
        code: 'GE',
        emoji: '🇬🇪',
        name: 'Georgia',
        dialCode: '+995',
    },
    {
        code: 'GF',
        emoji: '🇬🇫',
        name: 'French Guiana',
        dialCode: '+594',
    },
    {
        code: 'GG',
        emoji: '🇬🇬',
        name: 'Guernsey',
        dialCode: '+44',
    },
    {
        code: 'GH',
        emoji: '🇬🇭',
        name: 'Ghana',
        dialCode: '+233',
    },
    {
        code: 'GI',
        emoji: '🇬🇮',
        name: 'Gibraltar',
        dialCode: '+350',
    },
    {
        code: 'GL',
        emoji: '🇬🇱',
        name: 'Greenland',
        dialCode: '+299',
    },
    {
        code: 'GM',
        emoji: '🇬🇲',
        name: 'Gambia',
        dialCode: '+220',
    },
    {
        code: 'GN',
        emoji: '🇬🇳',
        name: 'Guinea',
        dialCode: '+224',
    },
    {
        code: 'GP',
        emoji: '🇬🇵',
        name: 'Guadeloupe',
        dialCode: '+590',
    },
    {
        code: 'GQ',
        emoji: '🇬🇶',
        name: 'Equatorial Guinea',
        dialCode: '+240',
    },
    {
        code: 'GR',
        emoji: '🇬🇷',
        name: 'Greece',
        dialCode: '+30',
    },
    {
        code: 'GS',
        emoji: '🇬🇸',
        name: 'South Georgia',
        dialCode: '+500',
    },
    {
        code: 'GT',
        emoji: '🇬🇹',
        name: 'Guatemala',
        dialCode: '+502',
    },
    {
        code: 'GU',
        emoji: '🇬🇺',
        name: 'Guam',
        dialCode: '+1 671',
    },
    {
        code: 'GW',
        emoji: '🇬🇼',
        name: 'Guinea-Bissau',
        dialCode: '+245',
    },
    {
        code: 'GY',
        emoji: '🇬🇾',
        name: 'Guyana',
        dialCode: '+595',
    },
    {
        code: 'HK',
        emoji: '🇭🇰',
        name: 'Hong Kong',
        dialCode: '+852',
    },
    {
        code: 'HM',
        emoji: '🇭🇲',
        name: 'Heard Island and Mcdonald Islands',
        dialCode: '+672',
    },
    {
        code: 'HN',
        emoji: '🇭🇳',
        name: 'Honduras',
        dialCode: '+504',
    },
    {
        code: 'HR',
        emoji: '🇭🇷',
        name: 'Croatia',
        dialCode: '+385',
    },
    {
        code: 'HT',
        emoji: '🇭🇹',
        name: 'Haiti',
        dialCode: '+509',
    },
    {
        code: 'HU',
        emoji: '🇭🇺',
        name: 'Hungary',
        dialCode: '+36',
    },
    {
        code: 'ID',
        emoji: '🇮🇩',
        name: 'Indonesia',
        dialCode: '+62',
    },
    {
        code: 'IE',
        emoji: '🇮🇪',
        name: 'Ireland',
        dialCode: '+353',
    },
    {
        code: 'IL',
        emoji: '🇮🇱',
        name: 'Israel',
        dialCode: '+972',
    },
    {
        code: 'IM',
        emoji: '🇮🇲',
        name: 'Isle of Man',
        dialCode: '+44',
    },
    {
        code: 'IN',
        emoji: '🇮🇳',
        name: 'India',
        dialCode: '+91',
    },
    {
        code: 'IO',
        emoji: '🇮🇴',
        name: 'British Indian Ocean Territory',
        dialCode: '+246',
    },
    {
        code: 'IQ',
        emoji: '🇮🇶',
        name: 'Iraq',
        dialCode: '+964',
    },
    {
        code: 'IR',
        emoji: '🇮🇷',
        name: 'Iran',
        dialCode: '+98',
    },
    {
        code: 'IS',
        emoji: '🇮🇸',
        name: 'Iceland',
        dialCode: '+354',
    },
    {
        code: 'IT',
        emoji: '🇮🇹',
        name: 'Italy',
        dialCode: '+39',
    },
    {
        code: 'JE',
        emoji: '🇯🇪',
        name: 'Jersey',
        dialCode: '+44',
    },
    {
        code: 'JM',
        emoji: '🇯🇲',
        name: 'Jamaica',
        dialCode: '+1 876',
    },
    {
        code: 'JO',
        emoji: '🇯🇴',
        name: 'Jordan',
        dialCode: '+962',
    },
    {
        code: 'JP',
        emoji: '🇯🇵',
        name: 'Japan',
        dialCode: '+81',
    },
    {
        code: 'KE',
        emoji: '🇰🇪',
        name: 'Kenya',
        dialCode: '+254',
    },
    {
        code: 'KG',
        emoji: '🇰🇬',
        name: 'Kyrgyzstan',
        dialCode: '+996',
    },
    {
        code: 'KH',
        emoji: '🇰🇭',
        name: 'Cambodia',
        dialCode: '+855',
    },
    {
        code: 'KI',
        emoji: '🇰🇮',
        name: 'Kiribati',
        dialCode: '+686',
    },
    {
        code: 'KM',
        emoji: '🇰🇲',
        name: 'Comoros',
        dialCode: '+269',
    },
    {
        code: 'KN',
        emoji: '🇰🇳',
        name: 'Saint Kitts and Nevis',
        dialCode: '+1 869',
    },
    {
        code: 'KP',
        emoji: '🇰🇵',
        name: 'North Korea',
        dialCode: '+850',
    },
    {
        code: 'KR',
        emoji: '🇰🇷',
        name: 'South Korea',
        dialCode: '+82',
    },
    {
        code: 'KW',
        emoji: '🇰🇼',
        name: 'Kuwait',
        dialCode: '+965',
    },
    {
        code: 'KY',
        emoji: '🇰🇾',
        name: 'Cayman Islands',
        dialCode: '+ 345',
    },
    {
        code: 'KZ',
        emoji: '🇰🇿',
        name: 'Kazakhstan',
        dialCode: '+7 7',
    },
    {
        code: 'LA',
        emoji: '🇱🇦',
        name: 'Lao People\'s Democratic Republic',
        dialCode: '+856',
    },
    {
        code: 'LB',
        emoji: '🇱🇧',
        name: 'Lebanon',
        dialCode: '+961',
    },
    {
        code: 'LC',
        emoji: '🇱🇨',
        name: 'Saint Lucia',
        dialCode: '+1 758',
    },
    {
        code: 'LI',
        emoji: '🇱🇮',
        name: 'Liechtenstein',
        dialCode: '+423',
    },
    {
        code: 'LK',
        emoji: '🇱🇰',
        name: 'Sri Lanka',
        dialCode: '+94',
    },
    {
        code: 'LR',
        emoji: '🇱🇷',
        name: 'Liberia',
        dialCode: '+231',
    },
    {
        code: 'LS',
        emoji: '🇱🇸',
        name: 'Lesotho',
        dialCode: '+266',
    },
    {
        code: 'LT',
        emoji: '🇱🇹',
        name: 'Lithuania',
        dialCode: '+370',
    },
    {
        code: 'LU',
        emoji: '🇱🇺',
        name: 'Luxembourg',
        dialCode: '+352',
    },
    {
        code: 'LV',
        emoji: '🇱🇻',
        name: 'Latvia',
        dialCode: '+371',
    },
    {
        code: 'LY',
        emoji: '🇱🇾',
        name: 'Libya',
        dialCode: '+218',
    },
    {
        code: 'MA',
        emoji: '🇲🇦',
        name: 'Morocco',
        dialCode: '+212',
    },
    {
        code: 'MC',
        emoji: '🇲🇨',
        name: 'Monaco',
        dialCode: '+377',
    },
    {
        code: 'MD',
        emoji: '🇲🇩',
        name: 'Moldova',
        dialCode: '+373',
    },
    {
        code: 'ME',
        emoji: '🇲🇪',
        name: 'Montenegro',
        dialCode: '+382',
    },
    {
        code: 'MF',
        emoji: '🇲🇫',
        name: 'Saint Martin (French Part)',
        dialCode: '+590',
    },
    {
        code: 'MG',
        emoji: '🇲🇬',
        name: 'Madagascar',
        dialCode: '+261',
    },
    {
        code: 'MH',
        emoji: '🇲🇭',
        name: 'Marshall Islands',
        dialCode: '+692',
    },
    {
        code: 'MK',
        emoji: '🇲🇰',
        name: 'Macedonia',
        dialCode: '+389',
    },
    {
        code: 'ML',
        emoji: '🇲🇱',
        name: 'Mali',
        dialCode: '+223',
    },
    {
        code: 'MM',
        emoji: '🇲🇲',
        name: 'Myanmar',
        dialCode: '+95',
    },
    {
        code: 'MN',
        emoji: '🇲🇳',
        name: 'Mongolia',
        dialCode: '+976',
    },
    {
        code: 'MO',
        emoji: '🇲🇴',
        name: 'Macao',
        dialCode: '+853',
    },
    {
        code: 'MP',
        emoji: '🇲🇵',
        name: 'Northern Mariana Islands',
        dialCode: '+1 670',
    },
    {
        code: 'MQ',
        emoji: '🇲🇶',
        name: 'Martinique',
        dialCode: '+596',
    },
    {
        code: 'MR',
        emoji: '🇲🇷',
        name: 'Mauritania',
        dialCode: '+222',
    },
    {
        code: 'MS',
        emoji: '🇲🇸',
        name: 'Montserrat',
        dialCode: '+1664',
    },
    {
        code: 'MT',
        emoji: '🇲🇹',
        name: 'Malta',
        dialCode: '+356',
    },
    {
        code: 'MU',
        emoji: '🇲🇺',
        name: 'Mauritius',
        dialCode: '+230',
    },
    {
        code: 'MV',
        emoji: '🇲🇻',
        name: 'Maldives',
        dialCode: '+960',
    },
    {
        code: 'MW',
        emoji: '🇲🇼',
        name: 'Malawi',
        dialCode: '+265',
    },
    {
        code: 'MX',
        emoji: '🇲🇽',
        name: 'Mexico',
        dialCode: '+52',
    },
    {
        code: 'MY',
        emoji: '🇲🇾',
        name: 'Malaysia',
        dialCode: '+60',
    },
    {
        code: 'MZ',
        emoji: '🇲🇿',
        name: 'Mozambique',
        dialCode: '+258',
    },
    {
        code: 'NA',
        emoji: '🇳🇦',
        name: 'Namibia',
        dialCode: '+264',
    },
    {
        code: 'NC',
        emoji: '🇳🇨',
        name: 'New Caledonia',
        dialCode: '+687',
    },
    {
        code: 'NE',
        emoji: '🇳🇪',
        name: 'Niger',
        dialCode: '+227',
    },
    {
        code: 'NF',
        emoji: '🇳🇫',
        name: 'Norfolk Island',
        dialCode: '+672',
    },
    {
        code: 'NG',
        emoji: '🇳🇬',
        name: 'Nigeria',
        dialCode: '+234',
    },
    {
        code: 'NI',
        emoji: '🇳🇮',
        name: 'Nicaragua',
        dialCode: '+505',
    },
    {
        code: 'NL',
        emoji: '🇳🇱',
        name: 'Netherlands',
        dialCode: '+31',
    },
    {
        code: 'NO',
        emoji: '🇳🇴',
        name: 'Norway',
        dialCode: '+47',
    },
    {
        code: 'NP',
        emoji: '🇳🇵',
        name: 'Nepal',
        dialCode: '+977',
    },
    {
        code: 'NR',
        emoji: '🇳🇷',
        name: 'Nauru',
        dialCode: '+674',
    },
    {
        code: 'NU',
        emoji: '🇳🇺',
        name: 'Niue',
        dialCode: '+683',
    },
    {
        code: 'NZ',
        emoji: '🇳🇿',
        name: 'New Zealand',
        dialCode: '+64',
    },
    {
        code: 'OM',
        emoji: '🇴🇲',
        name: 'Oman',
        dialCode: '+968',
    },
    {
        code: 'PA',
        emoji: '🇵🇦',
        name: 'Panama',
        dialCode: '+507',
    },
    {
        code: 'PE',
        emoji: '🇵🇪',
        name: 'Peru',
        dialCode: '+51',
    },
    {
        code: 'PF',
        emoji: '🇵🇫',
        name: 'French Polynesia',
        dialCode: '+689',
    },
    {
        code: 'PG',
        emoji: '🇵🇬',
        name: 'Papua New Guinea',
        dialCode: '+675',
    },
    {
        code: 'PH',
        emoji: '🇵🇭',
        name: 'Philippines',
        dialCode: '+63',
    },
    {
        code: 'PK',
        emoji: '🇵🇰',
        name: 'Pakistan',
        dialCode: '+92',
    },
    {
        code: 'PL',
        emoji: '🇵🇱',
        name: 'Poland',
        dialCode: '+48',
    },
    {
        code: 'PM',
        emoji: '🇵🇲',
        name: 'Saint Pierre and Miquelon',
        dialCode: '+508',
    },
    {
        code: 'PN',
        emoji: '🇵🇳',
        name: 'Pitcairn',
        dialCode: '+872',
    },
    {
        code: 'PR',
        emoji: '🇵🇷',
        name: 'Puerto Rico',
        dialCode: '+1 939',
    },
    {
        code: 'PS',
        emoji: '🇵🇸',
        name: 'Palestinian Territory',
        dialCode: '+970',
    },
    {
        code: 'PT',
        emoji: '🇵🇹',
        name: 'Portugal',
        dialCode: '+351',
    },
    {
        code: 'PW',
        emoji: '🇵🇼',
        name: 'Palau',
        dialCode: '+680',
    },
    {
        code: 'PY',
        emoji: '🇵🇾',
        name: 'Paraguay',
        dialCode: '+595',
    },
    {
        code: 'QA',
        emoji: '🇶🇦',
        name: 'Qatar',
        dialCode: '+974',
    },
    {
        code: 'RE',
        emoji: '🇷🇪',
        name: 'Réunion',
        dialCode: '+262',
    },
    {
        code: 'RO',
        emoji: '🇷🇴',
        name: 'Romania',
        dialCode: '+40',
    },
    {
        code: 'RS',
        emoji: '🇷🇸',
        name: 'Serbia',
        dialCode: '+381',
    },
    {
        code: 'RU',
        emoji: '🇷🇺',
        name: 'Russia',
        dialCode: '+7',
    },
    {
        code: 'RW',
        emoji: '🇷🇼',
        name: 'Rwanda',
        dialCode: '+250',
    },
    {
        code: 'SA',
        emoji: '🇸🇦',
        name: 'Saudi Arabia',
        dialCode: '+966',
    },
    {
        code: 'SB',
        emoji: '🇸🇧',
        name: 'Solomon Islands',
        dialCode: '+677',
    },
    {
        code: 'SC',
        emoji: '🇸🇨',
        name: 'Seychelles',
        dialCode: '+248',
    },
    {
        code: 'SD',
        emoji: '🇸🇩',
        name: 'Sudan',
        dialCode: '+249',
    },
    {
        code: 'SE',
        emoji: '🇸🇪',
        name: 'Sweden',
        dialCode: '+46',
    },
    {
        code: 'SG',
        emoji: '🇸🇬',
        name: 'Singapore',
        dialCode: '+65',
    },
    {
        code: 'SH',
        emoji: '🇸🇭',
        name: 'Saint Helena, Ascension and Tristan Da Cunha',
        dialCode: '+290',
    },
    {
        code: 'SI',
        emoji: '🇸🇮',
        name: 'Slovenia',
        dialCode: '+386',
    },
    {
        code: 'SJ',
        emoji: '🇸🇯',
        name: 'Svalbard and Jan Mayen',
        dialCode: '+47',
    },
    {
        code: 'SK',
        emoji: '🇸🇰',
        name: 'Slovakia',
        dialCode: '+421',
    },
    {
        code: 'SL',
        emoji: '🇸🇱',
        name: 'Sierra Leone',
        dialCode: '+232',
    },
    {
        code: 'SM',
        emoji: '🇸🇲',
        name: 'San Marino',
        dialCode: '+378',
    },
    {
        code: 'SN',
        emoji: '🇸🇳',
        name: 'Senegal',
        dialCode: '+221',
    },
    {
        code: 'SO',
        emoji: '🇸🇴',
        name: 'Somalia',
        dialCode: '+252',
    },
    {
        code: 'SR',
        emoji: '🇸🇷',
        name: 'Suriname',
        dialCode: '+597',
    },
    {
        code: 'SS',
        emoji: '🇸🇸',
        name: 'South Sudan',
        dialCode: '+211',
    },
    {
        code: 'ST',
        emoji: '🇸🇹',
        name: 'Sao Tome and Principe',
        dialCode: '+239',
    },
    {
        code: 'SV',
        emoji: '🇸🇻',
        name: 'El Salvador',
        dialCode: '+503',
    },
    {
        code: 'SX',
        emoji: '🇸🇽',
        name: 'Sint Maarten (Dutch Part)',
        dialCode: '+1 721',
    },
    {
        code: 'SY',
        emoji: '🇸🇾',
        name: 'Syrian Arab Republic',
        dialCode: '+963',
    },
    {
        code: 'SZ',
        emoji: '🇸🇿',
        name: 'Swaziland',
        dialCode: '+268',
    },
    {
        code: 'TC',
        emoji: '🇹🇨',
        name: 'Turks and Caicos Islands',
        dialCode: '+1 649',
    },
    {
        code: 'TD',
        emoji: '🇹🇩',
        name: 'Chad',
        dialCode: '+235',
    },
    {
        code: 'TF',
        emoji: '🇹🇫',
        name: 'French Southern Territories',
        dialCode: '+262',
    },
    {
        code: 'TG',
        emoji: '🇹🇬',
        name: 'Togo',
        dialCode: '+228',
    },
    {
        code: 'TH',
        emoji: '🇹🇭',
        name: 'Thailand',
        dialCode: '+66',
    },
    {
        code: 'TJ',
        emoji: '🇹🇯',
        name: 'Tajikistan',
        dialCode: '+992',
    },
    {
        code: 'TK',
        emoji: '🇹🇰',
        name: 'Tokelau',
        dialCode: '+690',
    },
    {
        code: 'TL',
        emoji: '🇹🇱',
        name: 'Timor-Leste',
        dialCode: '+670',
    },
    {
        code: 'TM',
        emoji: '🇹🇲',
        name: 'Turkmenistan',
        dialCode: '+993',
    },
    {
        code: 'TN',
        emoji: '🇹🇳',
        name: 'Tunisia',
        dialCode: '+216',
    },
    {
        code: 'TO',
        emoji: '🇹🇴',
        name: 'Tonga',
        dialCode: '+676',
    },
    {
        code: 'TR',
        emoji: '🇹🇷',
        name: 'Turkey',
        dialCode: '+90',
    },
    {
        code: 'TT',
        emoji: '🇹🇹',
        name: 'Trinidad and Tobago',
        dialCode: '+1 868',
    },
    {
        code: 'TV',
        emoji: '🇹🇻',
        name: 'Tuvalu',
        dialCode: '+688',
    },
    {
        code: 'TW',
        emoji: '🇹🇼',
        name: 'Taiwan',
        dialCode: '+886',
    },
    {
        code: 'TZ',
        emoji: '🇹🇿',
        name: 'Tanzania',
        dialCode: '+255',
    },
    {
        code: 'UA',
        emoji: '🇺🇦',
        name: 'Ukraine',
        dialCode: '+380',
    },
    {
        code: 'UG',
        emoji: '🇺🇬',
        name: 'Uganda',
        dialCode: '+256',
    },
    {
        code: 'US',
        emoji: '🇺🇸',
        name: 'United States',
        dialCode: '+1',
    },
    {
        code: 'UY',
        emoji: '🇺🇾',
        name: 'Uruguay',
        dialCode: '+598',
    },
    {
        code: 'UZ',
        emoji: '🇺🇿',
        name: 'Uzbekistan',
        dialCode: '+998',
    },
    {
        code: 'VA',
        emoji: '🇻🇦',
        name: 'Vatican City',
        dialCode: '+379',
    },
    {
        code: 'VC',
        emoji: '🇻🇨',
        name: 'Saint Vincent and The Grenadines',
        dialCode: '+1 784',
    },
    {
        code: 'VE',
        emoji: '🇻🇪',
        name: 'Venezuela',
        dialCode: '+58',
    },
    {
        code: 'VG',
        emoji: '🇻🇬',
        name: 'Virgin Islands, British',
        dialCode: '+1 284',
    },
    {
        code: 'VI',
        emoji: '🇻🇮',
        name: 'Virgin Islands, U.S.',
        dialCode: '+1 340',
    },
    {
        code: 'VN',
        emoji: '🇻🇳',
        name: 'Viet Nam',
        dialCode: '+84',
    },
    {
        code: 'VU',
        emoji: '🇻🇺',
        name: 'Vanuatu',
        dialCode: '+678',
    },
    {
        code: 'WF',
        emoji: '🇼🇫',
        name: 'Wallis and Futuna',
        dialCode: '+681',
    },
    {
        code: 'WS',
        emoji: '🇼🇸',
        name: 'Samoa',
        dialCode: '+685',
    },
    {
        code: 'XK',
        emoji: '🇽🇰',
        name: 'Kosovo',
        dialCode: '+383',
    },
    {
        code: 'YE',
        emoji: '🇾🇪',
        name: 'Yemen',
        dialCode: '+967',
    },
    {
        code: 'YT',
        emoji: '🇾🇹',
        name: 'Mayotte',
        dialCode: '+262',
    },
    {
        code: 'ZA',
        emoji: '🇿🇦',
        name: 'South Africa',
        dialCode: '+27',
    },
    {
        code: 'ZM',
        emoji: '🇿🇲',
        name: 'Zambia',
        dialCode: '+260',
    },
    {
        code: 'ZW',
        emoji: '🇿🇼',
        name: 'Zimbabwe',
        dialCode: '+263',
    },
];
