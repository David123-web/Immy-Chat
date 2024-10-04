import { getAllInstructors } from '@/src/services/user/apiUser';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { BrowserView, MobileView } from 'react-device-detect';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const YellowStarIcon = ({ size = 12, color = '#FAC917' }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		id="Layer_1"
		x="0px"
		y="0px"
		width={size}
		height={size}
		viewBox="0 0 426.667 426.667"
	>
		<polygon
			fill={color}
			points="213.333,10.441 279.249,144.017 426.667,165.436 320,269.41 345.173,416.226 213.333,346.91   81.485,416.226 106.667,269.41 0,165.436 147.409,144.017 "
		/>
	</svg>
);
SwiperCore.use([Pagination]);

const TeamArea = () => {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [allInstructors, setAllInstructors] = useState([]);
	useEffect(() => {
		loadAllInstructors();
	}, []);

	const loadAllInstructors = async () => {
		try {
			const response = await getAllInstructors();
			if (response?.data) {
				setAllInstructors(response.data);
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Container className="mb-60 text-center">
				<LoadingOutlined style={{ fontSize: 30 }} />
			</Container>
		);
	}

	return (
		<div className="md:tw-pb-[70px] tw-min-h-screen">
			<section className="team__area">
				<div className="container tw-px-5 md:tw-px-[12px]">
					<div className="row align-items-center">
						<div className="col-xxl-12 col-xl-12 col-lg-12">
							<div className="section__title-wrapper-2 text-center mb-40">
								<h5 className="section__title-2">
									{t('teach.title')}
								</h5>
							</div>
						</div>
					</div>
					<BrowserView>
						{allInstructors?.length ? (
							<Swiper
								navigation
								slidesPerView={4}
								className="swiper-wrapper swiper-wrapper-mobile"
								pagination={{ clickable: true }}
								autoplay={{ delay: 6000 }}
								modules={[Pagination, Navigation]}
							>
								{allInstructors.map((team) => {
									return (
										<SwiperSlide key={team.id} className="postbox__slider-item swiper-slide pl-15 pr-15 mb-40">
											<div className="team__item text-center">
												<div className="team__thumb" style={{ backgroundImage: `url(${team?.profile?.avatarUrl})` }}>
													<div className="team__social transition-3">
														<a href="#">
															<i className="fa-brands fa-facebook-f"></i>
														</a>
														<a href="#">
															<i className="fa-brands fa-twitter"></i>
														</a>
														<a href="#">
															<i className="fa-brands fa-linkedin-in"></i>
														</a>
														<a href="#">
															<i className="fa-brands fa-pinterest-p"></i>
														</a>
													</div>
												</div>
												<div className="team__content">
													<h3 className="team__title">
														<Link href="/">
															<a>{team?.profile?.firstName + ' ' + team?.profile?.lastName}</a>
														</Link>
													</h3>
													<span className="team__designation" dangerouslySetInnerHTML={{ __html: team.bio }} />
												</div>
											</div>
										</SwiperSlide>
									);
								})}
							</Swiper>
						) : (
							<div className="row">
								<h4 className="text-center">{t('teach.empty')}</h4>
							</div>
						)}
					</BrowserView>
					<MobileView>
						{allInstructors?.length ? (
							<Swiper
								slidesPerView={1}
								className="swiper-wrapper swiper-wrapper-mobile"
								pagination={{ clickable: true }}
								autoplay={{ delay: 6000 }}
								modules={[Pagination]}
							>
								{allInstructors.map((team) => {
									const address = [team.profile.address || '', team.profile.city || ''].filter((item) => !!item);
									return (
										<SwiperSlide key={team.id} className="postbox__slider-item swiper-slide swiper-slide-mobile">
											<div className="team__item tw-w-[242px] mx-auto text-center mb-60">
												<div className="tw-text-left mb-5">
													<div className="tw-flex tw-items-center tw-justify-between">
														<h3 className="team__title">
															<Link href="/">
																<a>{team?.profile?.firstName + ' ' + team?.profile?.lastName}</a>
															</Link>
														</h3>
														<div className="tw-grid tw-grid-cols-5 tw-gap-x-1 tw-ml-4">
															<YellowStarIcon />
															<YellowStarIcon />
															<YellowStarIcon />
															<YellowStarIcon />
															<YellowStarIcon />
														</div>
													</div>
													{address.length > 0 && <div>Living in {address.join(', ')}</div>}
												</div>

												<div className="team__thumb" style={{ backgroundImage: `url(${team?.profile?.avatarUrl})` }}>
													<div className="team__social transition-3">
														<a href="#">
															<i className="fa-brands fa-facebook-f"></i>
														</a>
														<a href="#">
															<i className="fa-brands fa-twitter"></i>
														</a>
														<a href="#">
															<i className="fa-brands fa-linkedin-in"></i>
														</a>
														<a href="#">
															<i className="fa-brands fa-pinterest-p"></i>
														</a>
													</div>
												</div>
												<div className="team__content">
													<div className="team__designation" dangerouslySetInnerHTML={{ __html: team.bio }} />
												</div>
											</div>
										</SwiperSlide>
									);
								})}
							</Swiper>
						) : (
							<div className="row">
								<h4 className="text-center">{t('teach.empty')}</h4>
							</div>
						)}
					</MobileView>
				</div>
			</section>

			{allInstructors?.length ? (
				<div className="tw-hidden md:tw-flex pb-50 pt-10 align-items-center justify-content-center">
					<Button
						className="open-speak-default-btn btn"
						onClick={() => {
							const element = document.getElementById('breadcrumb-teacher-register-section');
							element.scrollIntoView({ behavior: 'smooth' });
						}}
					>
						{t('teach.register')}
					</Button>
				</div>
			) : (
				<div className="pb-50 pt-30 d-flex align-items-center justify-content-center" />
			)}
		</div>
	);
};

export default TeamArea;
