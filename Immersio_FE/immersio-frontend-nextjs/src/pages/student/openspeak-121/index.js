import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import CourseList from '../../../../components/Home/CourseList'
import StudentRoute from '../../../../components/routes/StudentRoute'
import PrivateClasses from '../../../../components/Student/components/bookings/privateClasses'
import ScheduledTable from '../../../../components/Student/components/bookings/scheduledClassesTable'
import ScheduleCalendar from '../../../../components/Student/layouts/scheduleCalendar'
import { http } from '../../../services/axiosService'


/*********************************
 * Time format
 * https://moment.github.io/luxon/demo/global.html
 * ******************************/

const { TabPane } = Tabs

const StudentIndex = () => {
	const [activeKey, setActiveKey] = useState('1')
	const [displayDataCalendar, setDisplayCalendar] = useState([])

	const PrivateClassesData = [
		{
			instructor: {
				name: 'Abraham Josiah',
				image: null
			},
			timeZone: 'America/Mexico_City',
			day: 15,
			month: 10,
			year: 2022,
			hour: 12,
			minutes: 23
		}
	]
	const scheduledData = [
		{
			instructor: {
				firstName: 'Abraham',
				lastName: 'Josiah',
				image: null
			},
			prepaid: 3,
			rate: 35
		},
		{
			instructor: {
				firstName: 'Abraham',
				lastName: 'Josiah',
				image: null
			},
			prepaid: 3,
			rate: 35
		},
		{
			instructor: {
				firstName: 'Abraham',
				lastName: 'Josiah',
				image: null
			},
			prepaid: 3,
			rate: 35
		}
	]
	const router = useRouter()

	const bookingOfStudent = useSelector(state => state.booking.bookingOfStudent)
	const dispatch = useDispatch();

	useEffect(() => {
		// dispatch(bookingByStudentId())
		loadDataCalendar();
	}, [dispatch])

	const loadDataCalendar = async () => {
		const { data } = await http.get('/api/opie121/getTimeBookingByStudentId')
		setDisplayCalendar(data)
	}

	return (
		<StudentRoute>
			<div className="card-header" style={{ justifyContent: 'center' }}>
				<h3 className="page-title float-left mb-2 mt-2">Booking private classes with Immersio 121</h3>
			</div>
			<div id='opie121'>
				<Tabs className="control-hooks-tabs oppie121 mt-4" type="card" defaultActiveKey="1" activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
					<TabPane tab="Your Bookings" className='bg-white' key="1">
						<div className='row bg-white tab-container-bookings'>
							{/* {PrivateClassesData && PrivateClassesData.map((privateClass) => (
								<PrivateClasses data={privateClass} />
							))} */}
							<div className='opie121-title-container pt-4 mt-4 mb-2'>
								<div><h3 className='align-middle'>Scheduled classes</h3></div>
								<div><button className='booking-light-blue-bg text-white'>Browse all tutors</button></div>
							</div>
							<ScheduledTable scheduledData={bookingOfStudent} setActiveKey={setActiveKey} />
						</div>
					</TabPane>
					{/*<TabPane tab="Messages" key="2">
          			Content of Tab Pane 2
        		</TabPane>*/}
					<TabPane tab="Calendar" className='bg-white' key="3">
						<ScheduleCalendar items={displayDataCalendar} />
					</TabPane>
					<TabPane tab="Learning Plans" key="4">
						<div className='row bg-white tab-container-bookings p-3'>
							<div className='opie121-title-container mt-3 mb-3'>
								<div><h4 className='align-middle'>Private Lessons</h4></div>
								<div><button className='booking-light-blue-bg text-white'
									onClick={() => router.push('/student/openspeak-121/LearningGoals')}>
									Set learning goals</button>
								</div>
							</div>
							{PrivateClassesData && PrivateClassesData.map((privateClass) => (
								<PrivateClasses data={privateClass} />
							))}
							<div className='opie121-title-container mt-4 mb-3'>
								<div><h4 className='align-middle'>Core courses</h4></div>
							</div>
							{/* <CourseList /> */}
						</div>
					</TabPane>
				</Tabs>
			</div>
		</StudentRoute>
	)
}

export default StudentIndex