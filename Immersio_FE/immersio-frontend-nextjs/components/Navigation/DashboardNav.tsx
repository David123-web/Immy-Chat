import { RouterConstants } from '@/constants/router';
import FAQIcon from '@/public/assets/img/navigation/FAQ.svg';
import ImmyChatIcon from '@/public/assets/img/navigation/ImmyChat.svg';
import {
	default as MyRecordingsIcon,
	default as RecordingsIcon,
} from '@/public/assets/img/navigation/MyRecordings.svg';
import PeopleIcon from '@/public/assets/img/navigation/People.svg';
import TutorMatchIcon from '@/public/assets/img/navigation/TutorMatch.svg';
import BannerIcon from '@/public/assets/img/navigation/banner.svg';
import MySpaceIcon from '@/public/assets/img/navigation/mySpace.svg';
import SubscriptionIcon from '@/public/assets/img/navigation/subscriptions.svg';
import { PERMISSION_TYPE, ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { useMobXStores } from '@/src/stores';
import {
	BankOutlined,
	CodeSandboxOutlined,
	CreditCardOutlined,
	FolderOpenOutlined,
	FormOutlined,
	HomeFilled,
	ReadOutlined,
	SettingOutlined,
	SignalFilled,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

type IMenuItem = {
	label: string;
	key?: string;
	icon?: JSX.Element;
	children?: IMenuItem[];
	path?: string;
	roles: ROLE_TYPE[];
	access?: PERMISSION_TYPE;
	isDisabled?: boolean;
};

const DashboardNav = ({ show }) => {
	const { userActivityStore } = useMobXStores();

	const { t } = useTranslation();
	const router = useRouter();
	const { userStore, globalStore } = useMobXStores();
	const [selectedKeys, setSelectedKeys] = useState('');

	const findActiveItem = (items: IMenuItem[]): IMenuItem => {
		return items.reduce((found, item) => {
			if (item.path === router.pathname) {
				return item;
			}
			if (found) {
				return found;
			}
			if (item.children) {
				return findActiveItem(item.children);
			}
		}, undefined);
	};

	const findParentKey = (listMenu: IMenuItem[], childrenKey: string) => {
		return listMenu.reduce((found, item) => {
			if (item.children?.find((i) => i.key === childrenKey)) {
				return item.key;
			}
			if (found) {
				return found;
			}
			if (item.children) {
				return findParentKey(item.children, childrenKey);
			}
		}, '');
	};

	const getListOpenKeys = (activeKey: string) => {
		globalStore.setOpenKeysMenu([activeKey]);
		const parentKey = findParentKey(items, activeKey);
		if (parentKey) {
			getListOpenKeys(parentKey);
		}
	};

	useEffect(() => {
		const itemActive = findActiveItem(items);
		if (itemActive) {
			setSelectedKeys(itemActive.key);
			getListOpenKeys(itemActive.key);
		}
	}, []);
	const styleIcon = { fontSize: '24px', marginRight: show ? 10 : 0, color: '#fff' };
	const svgStyleIcon = { width: '24px', marginRight: show ? 10 : 0, fill: '#fff' };
	const items: IMenuItem[] = [
		{
			label: t('sidebar_menu.home'),
			key: '1',
			icon: <HomeFilled style={styleIcon} />,
			path: RouterConstants.DASHBOARD_HOME.path,
			roles: [
				ROLE_TYPE.SUPER_ADMIN,
				ROLE_TYPE.SUBDOMAIN_ADMIN,
				ROLE_TYPE.INSTRUCTOR,
				ROLE_TYPE.TUTOR,
				ROLE_TYPE.STUDENT,
			],
		},
		{
			label: t('sidebar_menu.dashboard'),
			key: '2',
			icon: <SignalFilled style={styleIcon} />,
			path: RouterConstants.DASHBOARD.path,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
		},
		{
			label: t('sidebar_menu.people'),
			key: '7',
			icon: <PeopleIcon style={svgStyleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
			children: [
				{
					label: t('sidebar_menu.instructors'),
					key: '7.1',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					path: RouterConstants.DASHBOARD_PEOPLE_INSTRUCTOR.path,
					access: PERMISSION_TYPE.People_Instructors,
				},
				{
					label: t('sidebar_menu.tutors'),
					key: '7.2',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR], // remove instructor
					path: RouterConstants.DASHBOARD_PEOPLE_TUTOR.path,
					access: PERMISSION_TYPE.People_Tutors,
				},
				{
					label: t('sidebar_menu.students'),
					key: '7.3',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
					path: RouterConstants.DASHBOARD_PEOPLE_STUDENT.path,
					access: PERMISSION_TYPE.People_Students,
				},
				{
					label: t('sidebar_menu.editors'),
					key: '7.4',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					path: RouterConstants.DASHBOARD_PEOPLE_EDITOR.path,
					access: PERMISSION_TYPE.People_Editors,
				},
				{
					label: t('sidebar_menu.cs_representatives'),
					key: '7.5',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					path: RouterConstants.DASHBOARD_PEOPLE_CUSTOMER_SERVICE.path,
					access: PERMISSION_TYPE.People_CSRReps,
				},
				{
					label: t('sidebar_menu.role_settings'),
					key: '7.6',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					path: RouterConstants.DASHBOARD_ROLE_SETTINGS.path,
					access: PERMISSION_TYPE.People_Role_Settings,
				},
				{
					label: t('sidebar_menu.class_tags'),
					key: '7.7',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.CUSTOMER_SERVICE],
					path: RouterConstants.DASHBOARD_CLASS_TAGS.path,
					access: PERMISSION_TYPE.People_Class_Tags,
				},
			],
		},
		{
			label: t('sidebar_menu.my_space'),
			key: '8',
			icon: <MySpaceIcon style={svgStyleIcon} />,
			path: RouterConstants.DASHBOARD_MY_SPACE.path,
			roles: [ROLE_TYPE.STUDENT],
		},
		{
			label: t('sidebar_menu.my_recordings'),
			key: '6.1',
			icon: <MyRecordingsIcon style={svgStyleIcon} />,
			path: RouterConstants.DASHBOARD_STUDENT_RECORDINGS.path,
			roles: [ROLE_TYPE.STUDENT],
		},
		{
			label: t('sidebar_menu.tutor_match'),
			key: '5',
			icon: <TutorMatchIcon style={svgStyleIcon} />,
			roles: [
				ROLE_TYPE.SUPER_ADMIN,
				ROLE_TYPE.SUBDOMAIN_ADMIN,
				ROLE_TYPE.INSTRUCTOR,
				ROLE_TYPE.TUTOR,
				ROLE_TYPE.CUSTOMER_SERVICE,
				ROLE_TYPE.STUDENT,
			],
			children: [
				{
					label: t('sidebar_menu.classes'),
					key: '5.1',
					roles: [
						ROLE_TYPE.SUPER_ADMIN,
						ROLE_TYPE.SUBDOMAIN_ADMIN,
						ROLE_TYPE.INSTRUCTOR,
						ROLE_TYPE.CUSTOMER_SERVICE,
						ROLE_TYPE.TUTOR,
						ROLE_TYPE.STUDENT,
					],
					path:
						userStore.currentUser?.role !== ROLE_TYPE.STUDENT
							? RouterConstants.DASHBOARD_TUTOR_MATCH_CLASSES.path
							: RouterConstants.DASHBOARD_TUTOR_MATCH_CLASSES_CLASSES.path,
					access: PERMISSION_TYPE.Tutor_Match_Classes,
				},
				{
					label: t('sidebar_menu.tutors'),
					key: '5.6',
					roles: [ROLE_TYPE.STUDENT],
					path: RouterConstants.DASHBOARD_TUTOR_MATCH_TUTORS.path,
					// access: PERMISSION_TYPE.Tutor_Match_Tutors,
				},
				{
					label: t('sidebar_menu.reviews'),
					key: '5.2',
					roles: [
						ROLE_TYPE.SUPER_ADMIN,
						ROLE_TYPE.SUBDOMAIN_ADMIN,
						ROLE_TYPE.INSTRUCTOR,
						ROLE_TYPE.CUSTOMER_SERVICE,
						ROLE_TYPE.STUDENT,
					],
					path: RouterConstants.DASHBOARD_TUTOR_MATCH_REVIEWS.path,
					access: PERMISSION_TYPE.Tutor_Match_Reviews,
				},
				{
					label: t('sidebar_menu.reports'),
					key: '5.3',
					roles: [
						ROLE_TYPE.SUPER_ADMIN,
						ROLE_TYPE.SUBDOMAIN_ADMIN,
						ROLE_TYPE.INSTRUCTOR,
						ROLE_TYPE.CUSTOMER_SERVICE,
						ROLE_TYPE.TUTOR,
					],
					path: RouterConstants.DASHBOARD_TUTOR_MATCH_REPORTS.path,
					access: PERMISSION_TYPE.Tutor_Match_Reports,
				},
				{
					label: t('sidebar_menu.campus'),
					key: '5.4',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.CUSTOMER_SERVICE],
					path: RouterConstants.DASHBOARD_TUTOR_MATCH_CAMPUS.path,
					access: PERMISSION_TYPE.Tutor_Match_Campus,
				},
				{
					label: t('sidebar_menu.invoices'),
					key: '5.5',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.CUSTOMER_SERVICE],
					path: RouterConstants.DASHBOARD_TUTOR_MATCH_INVOICES.path,
					access: PERMISSION_TYPE.Tutor_Match_Invoices,
				},
				{
					label: t('sidebar_menu.invoices'),
					key: '5.5',
					roles: [ROLE_TYPE.STUDENT],
					path: RouterConstants.DASHBOARD_TUTOR_MATCH_STUDENT_INVOICES.path,
				},
			],
		},
		{
			label: t('sidebar_menu.course_creator'),
			key: '3',
			icon: <ReadOutlined style={styleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
			children: [
				{
					label: t('sidebar_menu.course_list'),
					key: '3.1',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
					path: RouterConstants.DASHBOARD_COURSE.path,
					access: PERMISSION_TYPE.Course_Creator_List,
				},
			],
		},
		{
			label: t('sidebar_menu.my_drive'),
			key: '4',
			icon: <FolderOpenOutlined style={styleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
			access: PERMISSION_TYPE['Course_Management__My-Drive'],
			path: RouterConstants.DASHBOARD_MY_DRIVE.path,
		},
		{
			label: t('sidebar_menu.student_recordings'),
			key: '6',
			icon: <RecordingsIcon style={svgStyleIcon} />,
			path: RouterConstants.DASHBOARD_RECORDINGS.path,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
			access: PERMISSION_TYPE.Student_Recordings,
		},
		// list access will be updated in here
		{
			label: t('sidebar_menu.subscriptions'),
			key: '9',
			icon: <SubscriptionIcon style={svgStyleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
			children: [
				{
					label: t('sidebar_menu.packages'),
					key: '9.1',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					path: RouterConstants.DASHBOARD_PACKAGES_LIST.path,
					access: PERMISSION_TYPE['Package_Management__Packages'],
				},
        {
					label: t('sidebar_menu.paid_courses'),
					key: '9.2',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					path: RouterConstants.DASHBOARD_PAID_COURSES.path,
          // TODO implement new access role base
					// access: PERMISSION_TYPE['Package_Management__Packages'],
				},
				// {
				// 	label: t('sidebar_menu.coupons'),
				// 	key: '9.2',
				// 	roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
				// 	path: RouterConstants.DASHBOARD_PACKAGE_COUPONS.path,
				// 	access: PERMISSION_TYPE['Package_Management__Coupons'],
				// },
				{
					label: t('sidebar_menu.settings'),
					key: '9.3',
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					path: RouterConstants.DASHBOARD_PACKAGE_SETTING.path,
					access: PERMISSION_TYPE['Package_Management__Settings'],
				},
				// {
				// 	label: RouterConstants.DASHBOARD_PACKAGE_FEATURES.name,
				// 	key: '9.3',
				// 	roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
				// 	path: RouterConstants.DASHBOARD_PACKAGE_FEATURES.path,
				// 	access: PERMISSION_TYPE['Package_Management__Package-Features'],
				// },
			],
		},
		//miss access
		{
			label: t('sidebar_menu.immy_chat'),
			key: '10',
			icon: <ImmyChatIcon style={svgStyleIcon} />,
			path: RouterConstants.DASHBOARD_IMMY_CHAT.path,
			roles: [
				ROLE_TYPE.SUPER_ADMIN,
				ROLE_TYPE.SUBDOMAIN_ADMIN,
				ROLE_TYPE.INSTRUCTOR,
				ROLE_TYPE.TUTOR,
				ROLE_TYPE.STUDENT,
			],
		},
		//miss access
		// {
		// 	label: RouterConstants.DASHBOARD_COMMUNITY_CHAT.name,
		// 	key: '11',
		// 	icon: <WechatFilled style={styleIcon} />,
		// 	path: RouterConstants.DASHBOARD_COMMUNITY_CHAT.path,
		// 	roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR],
		// },
		{
			label: t('sidebar_menu.payment_gateways'),
			key: '12',
			icon: <BankOutlined style={styleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
			children: [
				{
					label: t('sidebar_menu.online_gateways'),
					key: '12.1',
					path: RouterConstants.DASHBOARD_PAYMENT_GATEWAYS_ONLINE.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					access: PERMISSION_TYPE['Payment__Gateway-Online'],
				},
				{
					label: t('sidebar_menu.offline_gateways'),
					key: '12.2',
					path: RouterConstants.DASHBOARD_PAYMENT_GATEWAYS_OFFLINE.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					access: PERMISSION_TYPE['Payment__Gateway-Offline'],
				},
			],
		},
		{
			label: t('sidebar_menu.blog_management'),
			key: '13',
			icon: <FormOutlined className="!tw-text-lg" style={svgStyleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
			access: PERMISSION_TYPE.Blog_Management,
			children: [
				{
					label: t('sidebar_menu.categories'),
					key: '13.1',
					path: RouterConstants.DASHBOARD_BLOG_MANAGEMENT_CATEGORIES.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					// access: PERMISSION_TYPE['Blog_Management_Categories'],
				},
				{
					label: t('sidebar_menu.blog'),
					key: '13.2',
					path: RouterConstants.DASHBOARD_BLOG_MANAGEMENT_BLOG.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					// access: PERMISSION_TYPE['Blog_Management_Blog'],
				},
			],
		},
		{
			label: t('sidebar_menu.faq_management'),
			key: '14',
			icon: <FAQIcon style={svgStyleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
			access: PERMISSION_TYPE.FAQ_Management,
			children: [
				{
					label: t('sidebar_menu.categories'),
					key: '14.1',
					path: RouterConstants.DASHBOARD_FAQ_MANAGEMENT_CATEGORIES.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					// access: PERMISSION_TYPE['FAQ_Management_Categories'],
				},
				{
					label: t('sidebar_menu.FAQs'),
					key: '14.2',
					path: RouterConstants.DASHBOARD_FAQ_MANAGEMENT_FAQS.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					// access: PERMISSION_TYPE['FAQ_Management_FAQs'],
				},
			],
		},
		{
			label: t('sidebar_menu.banner_management'),
			key: '15',
			icon: <BannerIcon style={svgStyleIcon} />,
			path: RouterConstants.DASHBOARD_BANNER_MANAGEMENT.path,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
			access: PERMISSION_TYPE.Banner_Management,
		},
		// {
		// 	label: RouterConstants.DASHBOARD_PAYMENT_LOGS.name,
		// 	key: '13',
		// 	icon: <FileProtectOutlined style={styleIcon} />,
		// 	path: RouterConstants.DASHBOARD_PAYMENT_LOGS.path,
		// 	roles: [ROLE_TYPE.SUPER_ADMIN],
		// },
		{
			label: t('sidebar_menu.settings'),
			key: '16',
			icon: <SettingOutlined className="!tw-text-lg" style={svgStyleIcon} />,
			roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
			children: [
				{
					label: t('sidebar_menu.theme_and_Logo'),
					key: '16.1',
					path: RouterConstants.DASHBOARD_SETTING_THEME_LOGO.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					access: PERMISSION_TYPE.Settings_Theme_Logo,
				},
				{
					label: t('sidebar_menu.information'),
					key: '16.2',
					path: RouterConstants.DASHBOARD_SETTING_INFORMATION.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					access: PERMISSION_TYPE.Settings_Information,
				},
        {
					label: t('sidebar_menu.credit'),
					key: '16.5',
					path: RouterConstants.DASHBOARD_SETTING_CREDIT.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					// access: PERMISSION_TYPE.Settings_Information,
				},
				{
					label: t('sidebar_menu.social_media'),
					key: '16.3',
					path: RouterConstants.DASHBOARD_SETTING_SOCIAL_MEDIA.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					access: PERMISSION_TYPE.Settings_Social_Media,
				},
				{
					label: t('sidebar_menu.email_settings'),
					key: '16.4',
					path: RouterConstants.DASHBOARD_SETTING_EMAIL.path,
					roles: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.SUBDOMAIN_ADMIN],
					access: PERMISSION_TYPE.Settings_Email,
				},
			],
		},
		{
			label: t('sidebar_menu.payment_services'),
			key: '17',
			icon: <CreditCardOutlined style={styleIcon} />,
			path: RouterConstants.DASHBOARD_PAYMENT_SERVICES.path,
			roles: [ROLE_TYPE.STUDENT],
		},
	];

	const listItems = (items: IMenuItem[]) =>
		items.map((item) => {
			if (
				item.roles.includes(userStore.currentUser?.role) &&
				((item.access && userStore.currentUser?.accesses?.[item.access]) ||
					userStore.currentUser?.accesses === null || // null === super admin
					item.access === undefined) //undefined === can access
			) {
				return {
					key: item.key,
					icon: item.icon,
					disabled: item.isDisabled || false,
					children: item.children && listItems(item.children),
					label: item.path ? (
						<Link href={item.path} legacyBehavior passHref>
							<a>{item.label}</a>
						</Link>
					) : (
						item.label
					),
				};
			}
		});

	return (
		<div
			className={`tw-fixed tw-top-[80px] tw-z-[100000] md:tw-z-auto bg-theme-7 md:tw-bg-transparent tw-w-full tw-h-full tw-left-0 md:tw-relative md:tw-top-inherit md:tw-left-inherit ${
				show
					? 'md:tw-w-[260px] md:tw-min-w-[260px] !tw-block md:!tw-block'
					: 'md:tw-w-[80px] md:tw-min-w-[80px] !tw-hidden md:!tw-block'
			} dashboard__nav`}
		>
			<div
				className={`new-header-bg md:tw-fixed md:tw-top-0 tmd:w-left-0 md:tw-h-screen md:tw-pt-[80px] ${
					show ? 'md:tw-w-[260px] md:tw-min-w-[260px]' : 'md:tw-w-[80px] md:tw-min-w-[80px]'
				}`}
			>
				<Menu
					className="bg-theme-2 new-header-text tw-overflow-x-hidden tw-overflow-y-auto tw-h-full iod-scrollbar tw-space-y-2 tw-space-y-reverse"
					selectedKeys={[selectedKeys]}
					openKeys={globalStore.openKeysMenu}
					mode="inline"
					theme="dark"
					inlineCollapsed={!show}
					items={listItems(items)}
					onOpenChange={(openKeys: string[]) => {
						globalStore.setOpenKeysMenu([openKeys[openKeys.length - 1]]);
					}}
					triggerSubMenuAction="click"
				/>
			</div>
		</div>
	);
};

export default observer(DashboardNav);
