import { Divider, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { allCourseOfStudent } from '../../redux/features/coursesSlice';
import Navigator from '../Navigation/Navigator';
import StudentNav from '../Navigation/studentNav';

const UserRoute = ({ children }) => {
	const [ok, setOk] = useState(true);

	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		// const fetchUser = async () => {
		// 	try {
		// 		const { data } = await axios.get('/api/current-user')
		// 		if (data.ok) setOk(true)
		// 	} catch (err) {
		// 		console.log(err)
		// 		setOk(false)
		// 		router.push('/')
		// 	}
		// }
		// fetchUser()
		dispatch(allCourseOfStudent()); // load cac khoa hoc thuoc student
	}, []);

	return (
		<>
			<Navigator />
			<div className="d-flex student-dashboard">
				<div className="navSideContainer">
					<StudentNav />
				</div>

				<div className="navLayout">
					<div className="layoutContent">{children}</div>
					<div className="pl-20 pr-20 pb-20 layoutFooter">
						<Divider />
						<div className="d-flex justify-content-between align-items-center">
							<div>
								Copyright {new Date().getFullYear()} - Immersio Learning Inc. All rights reserved
							</div>
							<Space size={20}>
								<Link href="/license">License</Link>
								<Link href="/privacy-and-policy">Privacy & Policy</Link>
								<Link href="/terms-of-service">Terms of Service</Link>
							</Space>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserRoute;
