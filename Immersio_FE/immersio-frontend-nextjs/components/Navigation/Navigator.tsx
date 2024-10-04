import { logout } from '@/src/helpers/auth';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { useMobXStores } from '@/src/stores';
import { BellOutlined, CaretDownOutlined, CloseOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Empty, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { RouterConstants } from '../../constants/router';
import { Dropdown as DropdownBootstrap } from 'react-bootstrap';

import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import {
	IGetListNotificationsRequest,
	IGetListNotificationsResponse,
	ISeenNotificationRequest,
} from '@/src/interfaces/notifications/notification.interface';
import {
	deleteNotification,
	getListNotifications,
	seenNotifications,
} from '@/src/services/notifications/apiNotifications';
import Link from 'next/link';
import { toast } from 'react-toastify';
import NotificationItem from './NotificationItem';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Navigator = ({ show, setShow }) => {
	const { t } = useTranslation();
	const route = useRouter();
	const { userStore, globalStore, subdomainStore } = useMobXStores();

	const [menu, setMenu] = useState({
		usermenu: false,
	});

	const showSubMenu = (e) => {
		let submenu = e.currentTarget.lastChild;
		submenu.lastChild.style.display = 'block';
	};

	const hideSubMenu = (e) => {
		let submenu = e.currentTarget.lastChild;
		submenu.lastChild.style.display = 'none';
	};

	const toggleSubMenu = (e, currentMenu) => {
		let submenu = e.currentTarget.lastChild;
		if (menu.usermenu) {
			submenu.lastChild.style.display = 'none';
			setMenu({ ...menu, [currentMenu]: false });
		} else {
			submenu.lastChild.style.display = 'block';
			setMenu({ ...menu, [currentMenu]: true });
		}
	};

	/* ---------------------------------- SEEN ---------------------------------- */
	const seenNotificationsMutation = useMutation<any, ISeenNotificationRequest>(seenNotifications, {
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ------------------------- GET LIST NOTIFICATIONS ------------------------- */
	const [numberUnreadNotifications, setNumberUnreadNotifications] = useState(0);
	const [isMarkAllRead, setIsMarkAllRead] = useState(false);
	const [listNotifications, setListNotifications] = useState<IGetListNotificationsResponse[]>([]);
	const getListNotificationsQuery = useQuery<IGetListNotificationsResponse[], IGetListNotificationsRequest>(
		['IGetListNotificationsRequest', globalStore.triggerGetNotifications],
		() => getListNotifications(),
		{
			onSuccess: (res) => {
				setListNotifications(res.data);
				setNumberUnreadNotifications(res.data.filter((item) => !item.seen).length);
			},
		}
	);
	/* --------------------------- DELETE NOTIFICATION -------------------------- */
	const deleteNotificationMutation = useMutation<any, string>(deleteNotification, {
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ---------------------------- RENDER USER NAME ---------------------------- */
	const renderUserName = () => {
		switch (userStore.currentUser?.role) {
			case ROLE_TYPE.SUPER_ADMIN:
				return 'Admin';
			case ROLE_TYPE.SUBDOMAIN_ADMIN:
				return 'Root Admin';
			default:
				return (
					<div>
						{userStore.currentUser?.profile && userStore.currentUser.profile?.firstName}&nbsp;
						{userStore.currentUser?.profile && userStore.currentUser.profile?.lastName}
					</div>
				);
		}
	};

	// @ts-ignore
	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
			href="javascript:void(0)"
			className="d-flex align-items-center"
			// @ts-ignore
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
		</a>
	));

	return (
		<nav className="mainBar">
			<div className="md:tw-min-h-[80px] tw-w-full tw-flex tw-items-center tw-justify-between tw-px-5 md:tw-px-6">
				<div className="tw-flex tw-items-center">
					<button type="button" className="hidden md:tw-inline-block" onClick={() => setShow(!show)}>
						{show ? (
							<MenuFoldOutlined className="tw-text-[20px] md:tw-text-[30px]" />
						) : (
							<MenuUnfoldOutlined className="tw-text-[20px] md:tw-text-[30px]" />
						)}
					</button>
					<button type="button" className="md:tw-hidden" onClick={() => setShow(!show)}>
						{show ? (
							<CloseOutlined className="tw-text-[20px] md:tw-text-[30px]" />
						) : (
							<MenuOutlined className="tw-text-[20px] md:tw-text-[30px]" />
						)}
					</button>

					<div className="logo tw-ml-4 md:tw-ml-[25px]">
						<Link href={RouterConstants.DASHBOARD_HOME.path} passHref>
							<a className="d-flex align-items-center">
								<img
									src={subdomainStore?.subdomain?.subdomainTheme?.logoUrl || '/assets/img/v2/demo-studio.png'}
									width={115}
									className="md:tw-w-[115px] tw-w-full"
								/>
							</a>
						</Link>
					</div>
				</div>
			</div>

			<div className="tw-flex tw-items-center">
				<div className="tw-w-full tw-transition-all tw-duration-300 tw-truncate tw-text-center tw-px-2.5 md:tw-px-6">
					{renderUserName()}
				</div>

				<DropdownBootstrap className="d-flex align-items-center tw-mr-4">
					<DropdownBootstrap.Toggle as={CustomToggle} id="dropdown-language">
						<span className='tw-mr-1'>{(route.locale || 'En').toUpperCase()}</span>
						<CaretDownOutlined />
					</DropdownBootstrap.Toggle>
					<DropdownBootstrap.Menu>
						<DropdownBootstrap.Item>
							<Link href={route.asPath} locale="en">
								English
							</Link>
						</DropdownBootstrap.Item>
						{/* <DropdownBootstrap.Item>
							<Link href={route.asPath} locale="fr">
								Française
							</Link>
						</DropdownBootstrap.Item> */}
						<DropdownBootstrap.Item>
							<Link href={route.asPath} locale="es">
								Español
							</Link>
						</DropdownBootstrap.Item>
						<DropdownBootstrap.Item>
							<Link href={route.asPath} locale="vn">
								Tiếng Việt
							</Link>
						</DropdownBootstrap.Item>
					</DropdownBootstrap.Menu>
				</DropdownBootstrap>

				<div className="tw-ml-auto">
					<Dropdown
						menu={{
							items: listNotifications.map((item) => ({
								key: item.id,
								label: (
									<NotificationItem
										setNumberUnreadNotifications={setNumberUnreadNotifications}
										data={item}
										isMarkAllRead={isMarkAllRead}
										onDelete={(item) => {
											setListNotifications(listNotifications.filter((data) => data.id !== item.id));
											deleteNotificationMutation.mutate(item.id);
										}}
									/>
								),
							})),
						}}
						trigger={['click']}
						placement="bottom"
						onOpenChange={(isOpen) => {
							if (isOpen) {
								globalStore.setTriggerGetNotifications();
							} else {
								setTimeout(() => {
									setIsMarkAllRead(false);
								}, 1000);
							}
						}}
						dropdownRender={(menu) => (
							<div className="tw-w-[450px] tw-pt-4 bg-theme-7 tw-shadow-xl tw-border-solid border-theme-6 tw-border tw-border-r-0">
								<div className="tw-flex tw-justify-between tw-items-center tw-px-3 tw-mb-2">
									<div className="tw-font-bold">
										{t('dashboard.button.notifications')}
									</div>
									<div className="tw-flex tw-gap-x-4 tw-items-center color-theme-3">
										<div
											className="tw-cursor-pointer"
											onClick={() => {
												if (numberUnreadNotifications > 0) {
													setIsMarkAllRead(true);
													setNumberUnreadNotifications(0);
													seenNotificationsMutation.mutate({
														listId: listNotifications.map((item) => item.id),
													});
												}
											}}
										>
											{t('dashboard.label.mark_all_as_read')}
										</div>
										<div
											className="tw-cursor-pointer"
											onClick={() => {
												setListNotifications(listNotifications.filter((item) => !item.seen));
												listNotifications.forEach((item) => {
													if (item.seen) {
														deleteNotificationMutation.mutate(item.id);
													}
												});
											}}
										>
											{t('dashboard.button.clear_all')}
										</div>
									</div>
								</div>
								{getListNotificationsQuery.isLoading ? (
									<div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
										<Spin />
									</div>
								) : listNotifications.length > 0 ? (
									<div className="tw-overflow-y-auto david-scrollbar tw-h-[300px]">
										{React.cloneElement(menu as React.ReactElement, {
											style: {
												boxShadow: 'none',
												border: '1px solid #ccc',
												borderLeft: '0px',
												borderRight: '0px',
											},
										})}
									</div>
								) : (
									<Empty className="tw-h-[300px] tw-flex tw-justify-center tw-items-center tw-flex-col" />
								)}
							</div>
						)}
					>
						<Badge color="#4AD991" count={numberUnreadNotifications} size="small" className="tw-my-4 tw-cursor-pointer">
							<BellOutlined
								style={{
									fontSize: '1.5rem',
								}}
							/>
						</Badge>
					</Dropdown>
				</div>

				<ul
					className="iBar"
					onMouseEnter={(e) => showSubMenu(e)}
					onMouseLeave={(e) => hideSubMenu(e)}
					onClick={(e) => toggleSubMenu(e, 'usermenu')}
				>
					<li className="userMenu">
						{userStore.currentUser?.profile?.avatarUrl ? (
							<img
								src={userStore.currentUser.profile.avatarUrl}
								style={{ borderRadius: '50px' }}
								className="md:tw-w-[44px] md:tw-h-[44px] tw-w-[32px] tw-h-[32px]"
							/>
						) : (
							<div className="md:tw-w-[44px] md:tw-h-[44px] tw-w-[32px] tw-h-[32px] tw-rounded-full bg-theme-3 tw-text-white tw-text-lg tw-flex tw-items-center tw-justify-center">
								{userStore.currentUser && userStore.currentUser.role === ROLE_TYPE.SUPER_ADMIN ||
								userStore.currentUser && userStore.currentUser.role === ROLE_TYPE.SUBDOMAIN_ADMIN
									? 'AD'
									: `${userStore.currentUser && userStore.currentUser.profile?.firstName[0]}${userStore.currentUser && userStore.currentUser.profile?.lastName[0]}`}
							</div>
						)}
						<ul className="subItem">
							{[ROLE_TYPE.STUDENT, ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR].includes(userStore.currentUser && userStore.currentUser?.role) ? (
								<>
									<li>
										<Link href={RouterConstants.DASHBOARD_EDIT_PROFILE.path} passHref>
											<a>{t('dashboard.button.edit_profile')}</a>
										</Link>
									</li>
									<li>
										<Link href={RouterConstants.DASHBOARD_CHANGE_PASSWORD.path} passHref>
											<a>{t('dashboard.button.change_password')}</a>
										</Link>
									</li>
									<li style={{ pointerEvents: 'none', backgroundColor: 'white' }}>
										<Link href={RouterConstants.DASHBOARD.path} passHref>
											<a style={{ color: '#5b7478', opacity: 0.5 }}>
												{t('dashboard.button.settings')}
											</a>
										</Link>
									</li>
								</>
							) : null}
							<li>
								<a onClick={logout}>{t('dashboard.button.logout')}</a>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default observer(Navigator);
