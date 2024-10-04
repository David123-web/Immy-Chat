import { logout } from '@/src/helpers/auth';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { getAllCoursesPublish } from "@/src/services/courses/apiCourses";
import { useMobXStores } from '@/src/stores';
import { CaretDownOutlined, CloseOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { RouterConstants } from '../../constants/router';
import SearchMobile from './SearchMobile';
import Sidebar from './SideBar';
import SideBarMobile from './SideBarMobile';
import { useRouter } from 'next/router';

export const SearchIcon = ({ size = 18, color = "#031220" }) => (<svg
	width={size}
	height={size}
	viewBox="0 0 18 18"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M8.11117 15.2222C12.0385 15.2222 15.2223 12.0385 15.2223 8.11111C15.2223 4.18375 12.0385 1 8.11117 1C4.18381 1 1.00006 4.18375 1.00006 8.11111C1.00006 12.0385 4.18381 15.2222 8.11117 15.2222Z"
		stroke={color}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	/>
	<path
		d="M17 17L13.1334 13.1333"
		stroke={color}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	/>
</svg>)

const Header = ({ children, hideSidebar }) => {
	const { t } = useTranslation();
	const route = useRouter();

	const [show, setShow] = useState(false);
	const [showSearchForm, setShowSearchForm] = useState(false)
	const { userStore, subdomainStore } = useMobXStores();

	const [searchValue, setSearchValue] = useState('');
  const [coursesResult, setCoursesResult] = useState([])

  const handleOnSubmit = async (e) => {
    e.preventDefault();
		if (!searchValue.trim()) setCoursesResult([])
    try {
      const response = await getAllCoursesPublish({ 
        title: searchValue,
        take: 9999,
        skip: 0
      }); 
      
      setCoursesResult(response.data || [])
    } catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  };

	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
			href="javascript:void(0)"
			className="d-flex align-items-center"
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
		</a>
	));

	const onClickShowSearchFormMobile = () => setShowSearchForm(!showSearchForm)
	console.log(route)

	return (
		<>
			<header className="header__bottom header__sticky">
				<div className="header__area">
					<div id="header-sticky" className="md:tw-min-h-[80px] tw-w-full tw-flex tw-items-center tw-justify-between tw-px-5 md:tw-px-6">
						<div className='tw-flex tw-items-center'>
							{hideSidebar === false ? (
								<>
									<button type="button" className="hidden md:tw-inline-block" onClick={() => setShow(!show)}>
										{show ? <MenuFoldOutlined className='tw-text-[20px] md:tw-text-[30px]' /> : <MenuUnfoldOutlined className='tw-text-[20px] md:tw-text-[30px]' />}
									</button>
									<button type="button" className="md:tw-hidden" onClick={() => setShow(!show)}>
										{show ? <CloseOutlined className='tw-text-[20px] md:tw-text-[30px]' /> : <MenuOutlined className='tw-text-[20px] md:tw-text-[30px]' />}
									</button>
								</>
							) : null}
							<div className={`logo ${hideSidebar === false ? 'tw-ml-4 md:tw-ml-[25px]' : ''}`}>
								<Link href="/">
									<a className="tw-flex tw-items-center tw-w-[96px] md:tw-w-[115px]">
										<img src={subdomainStore?.subdomain?.subdomainTheme?.logoUrl || "/assets/img/v2/demo-studio.png"} width="100%" />
									</a>
								</Link>
							</div>
						</div>
						<div className="header__bottom-right tw-flex tw-flex-1 tw-items-center tw-justify-end tw-space-x-4 md:tw-space-x-10">
							<div className="relative md:tw-flex-1">
								<div className={`header__search tw-absolute md:tw-static tw-z-1 tw-top-[44px] md:tw-top-unset tw-right-0
								tw-flex-1 tw-hidden md:tw-block md:tw-pl-[100px]`}>
									<form onSubmit={handleOnSubmit}>
										<div className="header__search-input">
											<input
												type="text"
												value={searchValue}
												onChange={(e) => setSearchValue(e.target.value)} 
												placeholder={t('header.search_placeholder')}
											/>
											<button type="submit" className="header__search-btn">
												<SearchIcon />
											</button>
										</div>
									</form>
									{coursesResult?.length > 0 && 
										<div className='tw-absolute tw-z-10 tw-bg-white tw-p-4 tw-rounded-[20px] tw-border tw-border-solid tw-border-[#637381] 
										tw-w-[835px]'>
											{coursesResult.map((course) => 
												<Link key={`course-${course.id}`} href={`/courses/${course.slug}-c${course.id}`}>
													<a
														className="tw-block tw-border-b border-theme-6 tw-border-solid tw-border-t-0 tw-border-r-0 
														tw-border-l-0 tw-pb-2 tw-mb-2 last:tw-mb-0">
														{course.title}
													</a>
												</Link>
											)}
										</div>}
									
								</div>
								<button className="md:tw-hidden" onClick={onClickShowSearchFormMobile}>
									<SearchIcon />
								</button>
							</div>

							<Dropdown className="d-flex align-items-center">
								<Dropdown.Toggle as={CustomToggle} id="dropdown-language">
									<span className='tw-mr-1'>{(route.locale || 'En').toUpperCase()}</span>
									<CaretDownOutlined />
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item>
										<Link href={route.asPath} locale="en">
											English
										</Link>
									</Dropdown.Item>
									{/* <Dropdown.Item>
										<Link href={route.asPath} locale="fr">
											Française
										</Link>
									</Dropdown.Item> */}
									<Dropdown.Item>
										<Link href={route.asPath} locale="es">
											Español
										</Link>
									</Dropdown.Item>
									<Dropdown.Item>
										<Link href={route.asPath} locale="vn">
											Tiếng Việt
										</Link>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							
							{userStore.currentUser?.id ? (
								<div className="d-flex align-items-center">
									<Dropdown className="d-flex align-items-center">
										<Dropdown.Toggle as={CustomToggle} id="dropdown-login">
											<img
												src={
													userStore.currentUser?.profile?.avatarUrl
														? userStore.currentUser?.profile?.avatarUrl
														: '/assets/img/open-speak/md-contact.svg'
												}
												// width={44}
												// height={44}
												style={{ borderRadius: '50px' }}
												className='md:tw-w-[44px] md:tw-h-[44px] tw-w-[32px] tw-h-[32px]'
											/>
										</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item
												href={userStore.currentUser.role === ROLE_TYPE.STUDENT
													? RouterConstants.DASHBOARD_MY_SPACE.path
													: RouterConstants.DASHBOARD.path
												}
											>
												{t('header.dashboard')}
											</Dropdown.Item>
											<Dropdown.Item onClick={logout}>
												
												{t('header.logout')}
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							) : (
								<Link href="/login">
									<div className="tw-flex tw-items-center tw-cursor-pointer tw-ml-4">
											<div className='tw-inline-block tw-w-5 tw-h-5 md:tw-w-[42px] md:tw-h-[42px] tw-rounded-full'>
											<img
												src="/assets/img/open-speak/md-contact.svg"
												width={"100%"}
												height="auto"
											/>
										</div>
										
										<span className="tw-hidden md:tw-inline-block tw-mr-2 tw-ml-4 tw-text-[16px]">
											{t('header.login')}
										</span>
										<CaretDownOutlined className="tw-hidden md:tw-inline-block" />
									</div>
								</Link>
							)}
							<Link href="/teach">
								<Button
									size="large"
									type="primary"
									className="bg-theme-5 tw-hidden md:tw-inline-block border-theme-5 tw-rounded-[10px] hover-bg-theme-3 
									hover:border-theme-3"
								>
									{t('header.create_course_for_free')}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			{showSearchForm ? (
				<SearchMobile searchValue={searchValue} setSearchValue={setSearchValue} coursesResult={coursesResult} 
						handleOnSubmit={handleOnSubmit} onClickShowSearchFormMobile={onClickShowSearchFormMobile} />
			) : null}
			
			{hideSidebar === false ? (
				<>
					<div className='tw-flex'>
						<Sidebar t={t} show={show} handleClose={() => setShow(false)} />
						<SideBarMobile t={t} show={show} handleClose={() => setShow(false)} />
						<div className={`tw-w-full ${show ? 'md:tw-pl-[300px]' : 'md:tw-pl-[120px]'} md:tw-pr-10 md:tw-pt-5`}>
							{children}
						</div>
					</div>
				</>
			) : (
				<div className='tw-flex'>
					<div className="tw-w-full">
						{children}
					</div>
				</div>
			)}
		</>
	);
};

export default observer(Header);
