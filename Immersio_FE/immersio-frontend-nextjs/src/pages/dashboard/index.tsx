import MyClassesTeacher from '@/components/Dashboard/MyClassesTeacher';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { Avatar, Button, Select } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ChartWrapper from '../../../components/Chart';
import DashboardRoute from '../../../components/routes/DashboardRoute';
import { RouterConstants } from '../../../constants/router';
import { useCheckRole } from '../../../hooks/useAuth';
import { jwtValidate } from '../../helpers/auth';
import { withTranslationsProps } from '../../next/with-app';
import { getAllCourses } from '../../services/courses/apiCourses';
import { useMobXStores } from '../../stores';

const Dashboard = () => {
	const [courses, setCourses] = useState<any>([]);
	const { userStore } = useMobXStores();
	const router = useRouter();

	useCheckRole();

	useEffect(() => {
		if (!jwtValidate()) {
			router.push(RouterConstants.LOGIN.path);
		}
		loadCourses();
	}, []);

	const loadCourses = async () => {
		try {
			const response = await getAllCourses();
			if (response?.data) {
				setCourses(response.data);
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	return (
		<>
			<Head>
				<title>Dashboard</title>
				<meta name="description" content="Generated by create next app" />
			</Head>

			<DashboardRoute>
				{/* // TODO update component to theme */}
				<div className="animated fadeIn">
					<div className="row">
						<div className="col-12">
							<div className="row" style={{ flexDirection: 'column' }}>
								<div className="col-md-12 col-12 tw-mb-9">
									<div className="row">
										<div className="col-6 col-md-3 tw-mb-6 md:tw-mb-0">
											<div className="card text-center" style={{ background: '#163e43' }}>
												<div className="card-body">
													<h2 className="text-white">{JSON.stringify(courses.length, null, 4) || 0}</h2>
													<h5 className="text-white">Courses</h5>
												</div>
											</div>
										</div>
										<div className="col-6 col-md-3 tw-mb-6 md:tw-mb-0">
											<div className="card text-center" style={{ background: '#056770' }}>
												<div className="card-body">
													<h2 className="text-white">255</h2>
													<h5 className="text-white">Students</h5>
												</div>
											</div>
										</div>
										<div className="col-6 col-md-3">
											<div className="card text-center" style={{ background: '#3eb0ac' }}>
												<div className="card-body">
													<h2 className="text-white">8</h2>
													<h5 className="text-white">Connected Tutors</h5>
												</div>
											</div>
										</div>
										<div className="col-6 col-md-3">
											<div className="card text-center" style={{ background: '#ffb055' }}>
												<div className="card-body">
													<h2 className="text-white">45</h2>
													<h5 className="text-white">Hours of tutoring</h5>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Charts */}
								<div className="col-12 tw-hidden md:tw-block">
									<div className="tw-border tw-border-solid tw-mb-5">
										<div className="bg-theme-7 tw-flex">
											<div className="tw-px-6 tw-py-2 tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-border-b-[3px] tw-border-solid border-theme-4">
												<span>Total tutoring revenue</span>
												<p className="tw-text-[24px] tw-my-2">$ 292.00</p>
												<span>$52.00 this month</span>
											</div>
											<div className="tw-px-6 tw-py-2">
												<span>Total tutoring hours</span>
												<p className="tw-text-[24px] tw-my-2">20</p>
												<span>12 hours this month</span>
											</div>
											<div className="tw-px-6 tw-py-2">
												<span>Total learner's</span>
												<p className="tw-text-[24px] tw-my-2">26</p>
												<span>4 new learners this month</span>
											</div>
										</div>
										<div className="tw-min-h-[300px] bg-theme-6 tw-pr-8 tw-pb-5 tw-pt-8">
											<div className="tw-flex tw-items-center tw-justify-end tw-pr-5 tw-pb-5 tw-space-x-3">
												<span>Date range:</span>
												<Select defaultValue="9999" options={[{ value: '9999', label: 'All time' }]} />
											</div>
											<ChartWrapper />
										</div>
									</div>
									<p className="color-theme-3 tw-text-center tw-mb-10">Revenue report</p>
								</div>
								{/* End Charts */}

								{userStore.currentUser.role === ROLE_TYPE.TUTOR && <MyClassesTeacher />}

								<div className="col-md-12 col-12 md:tw-mb-[60px]">
									<h3 className="tw-mb-[30px]">New bookings</h3>
									<div className="tw-mb-5 tw-flex tw-flex-col md:tw-flex-row tw-rounded-[10px] tw-p-3 tw-drop-shadow bg-theme-6 tw-space-y-4 md:tw-space-y-0">
										<div className="tw-flex tw-flex-col md:tw-items-center md:tw-justify-center">
											<div className="md:tw-mt-5 tw-flex-col tw-flex md:tw-text-center">
												<b className="tw-text-[20px]">08 May 2022</b>
												<p className="tw-my-2">4 spaces available</p>
												<div className="tw-rounded bg-theme-4 color-theme-7 tw-px-2">04:30 PM (UTC +00:00)</div>
											</div>
										</div>
										<div className="tw-flex-1 md:tw-border-l md:tw-border-solid md:tw-border-t-0 md:tw-border-b-0 md:tw-border-r-0 md:tw-border-[#ddd] md:tw-pl-3 md:tw-ml-3">
											<div className="tw-flex tw-flex-col md:tw-flex-row tw-space-y-4 md:tw-space-x-4">
												<div className="tw-flex-1">
													<p className="tw-mb-0">Moose Cree. | Greetings and introduction</p>
													<div className="tw-my-2">
														<b className="tw-text-[16px]">
															This tutoring session is the extension of the Greetings and Introduction course,
															emphasizing Lesson 1, 2 and 4
														</b>
													</div>
													<div className="tw-flex tw-items-center tw-space-x-3">
														<Avatar size={40} shape="square" className="tw-min-w-[40px]" />
														<div>
															<p className="tw-m-0">
																<b>Nam Nguyen</b>, book this class on April 15 from 7:00 PM to 9:00 PM
															</p>
															<div className="tw-leading-4 tw-text-[13px] tw-text-[#999999]">Apr 02 at 05:45 PM</div>
														</div>
													</div>
												</div>
												<div className="tw-flex tw-flex-col md:tw-text-right">
													<div className="tw-flex-1">
														<b className="tw-text-[20px]">$70</b>
														<p>2 hours</p>
													</div>
													<div className="tw-flex tw-items-center md:tw-justify-center tw-space-x-3">
														<Button ghost type="primary" className="tw-text-center tw-rounded color-theme-7">
															Accept
														</Button>
														<Button ghost type="primary" className="tw-text-center tw-rounded color-theme-7">
															Reject
														</Button>
														<Button ghost type="primary" className="tw-text-center tw-rounded color-theme-7">
															Message
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DashboardRoute>
		</>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default Dashboard;
