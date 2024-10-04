import { SearchOutlined, PlusCircleOutlined, CheckOutlined } from '@ant-design/icons';
import CourseCalendar from '../components/bookings/courseCalendar'
import { CoursesAvailable } from '../../../constants/DUMMY_DATA'
import ClassesCalendar from '../components/bookings/classCalendar'
import CourseTiming from '../components/bookings/courseTiming'
import { useContext, useEffect, useState } from 'react'
import { Input, Tooltip, Calendar, Modal } from 'antd';
import { useRouter } from 'next/router'

const calendar = ({ items }) => {
	const [bookingVisible, setBookingVisible] = useState(false)
	const [scheduleVisible, setScheduleVisible] = useState(false)
	const router = useRouter()

	const [selected, setSelected] = useState({
		firsLesson: false,
		singleLesson: false,
		weeklyLesson: false,
	})

	return(
		<>
			<div className='row bg-white'>
				<div className='col-3'>
					<button className='booking-round button-blue mt-3' onClick={()=>setBookingVisible(true)}>
						<PlusCircleOutlined style={{fontSize:16,fontWeight:'bold',marginRight:5}}/>Book a new lesson
					</button>
					<button className='booking-round button-gray mt-2' onClick={()=>setScheduleVisible(true)}>Schedule your availability</button>
					<button className='booking-round button-gray mt-2' onClick={()=>router.push('/student/openspeak-121/Teachers')}>Browse all tutors</button>
					<Input placeholder="Search tutors" className='booking-round m-2'
				      suffix={
				        	<SearchOutlined style={{ color: 'rgba(0,0,0,.45)',marginRight:10 }} />
				      }
				    />
				    <p>Tags</p>
				    <div className='row mt-1'>
				    	<div className='col-1'>
				    		{ selected.firsLesson ? (
					    		<div onClick={()=>setSelected({...selected, firsLesson: false})} className=' booking-radio-tag booking-light-blue-bg'> 
					    			<CheckOutlined className='booking-icon'/>
					    		</div>
				    			) : (
				    			<div onClick={()=>setSelected({...selected, firsLesson: true})} className=' booking-radio-tag booking-light-blue-line'/>
				    		)}
						</div>
				    	<div className='col'>
					    	<div className='booking-tag booking-light-blue-bg'>
					    		Approved
							</div>
						</div>
					</div>
					<div className='row mt-1'>
				    	<div className='col-1'>
				    		{ selected.singleLesson ? (
					    		<div onClick={()=>setSelected({...selected, singleLesson: false})} className=' booking-radio-tag booking-yellow-bg'> 
					    			<CheckOutlined className='booking-icon'/>
					    		</div>
				    			) : (
				    			<div onClick={()=>setSelected({...selected, singleLesson: true})} className=' booking-radio-tag booking-yellow-line'/>
				    		)}
						</div>
				    	<div className='col'>
				    		<div className='booking-tag booking-yellow-bg'>
				    			Cancel
							</div>
						</div>
					</div>
					{/* <div className='row mt-1'>
				    	<div className='col-1'>
				    		{ selected.weeklyLesson ? (
					    		<div onClick={()=>setSelected({...selected, weeklyLesson: false})} className=' booking-radio-tag booking-red-bg'> 
					    			<CheckOutlined className='booking-icon'/>
					    		</div>
				    			) : (
				    			<div onClick={()=>setSelected({...selected, weeklyLesson: true})} className=' booking-radio-tag booking-red-line'/>
				    		)}
						</div>
				    	<div className='col'>
					    	<div className='col booking-tag booking-red-bg'>
					    		Weekly lesson
							</div>
						</div>
					</div> */}

					<div className="calendar-card mt-4 mb-4">
				    	<Calendar fullscreen={false} /*onPanelChange={onPanelChange}*/ />
    				</div>
				</div>
				<div className='col'>
					<ClassesCalendar itemsData={items}/>
				</div>
			</div>

			<Modal title="" width={'60%'} footer={null} visible={bookingVisible} onCancel={()=>setBookingVisible(false)}> 
				<h5>Choose all the time slot for your course. The timings are displayed in your local timezone.</h5>
				<CourseCalendar items={items}/>
				<div className='row'>
				<div className='col'>
  					<div className='booking-tag booking-light-blue-bg mb-2 mt-4'>
						Available
					</div>
					<div className='booking-tag button-gray mb-2'>
						Booked
					</div>
				</div>
				<div className='col'>
					<button className='to-the-right m-4 round-booking-yellow-button' onClick={()=>setBookingVisible(false)}>REVIEW BOOKINGS</button>
				</div>
			</div>
			</Modal>

			<Modal title="" width={'60%'} footer={null} visible={scheduleVisible} onCancel={()=>setScheduleVisible(false)}>
				<CourseTiming setScheduleVisible={setScheduleVisible}/>
			</Modal>
		</>
	)
}

export default calendar