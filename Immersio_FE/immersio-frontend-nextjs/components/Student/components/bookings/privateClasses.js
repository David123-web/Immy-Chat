import { CalendarOutlined, ClockCircleFilled } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { DateTime } from "luxon"
import { Avatar } from 'antd'

const PrivateClasses = ({ data }) => {
	const [date, setDate] = useState()

	useEffect(() => {
		let datadate = DateTime.fromObject({}, {
			zone: data.timeZone
		}).set({
			day: data.day,
			month: data.month,
			year: data.year,
			hour: data.hour,
			minute: data.minutes
		});
		setDate(datadate.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone))
	}, [])

	return (
		<div className='private-class-container row'>
			<h5 className='col-3'>Next Private Class</h5>
			<div className='col booking-private-class-dates'>
				<p><CalendarOutlined className='opie-icon-booking' />{date?.toLocaleString(DateTime.DATE_MED)}</p>
				<p><ClockCircleFilled className='opie-icon-booking' />{DateTime.fromISO(date).toFormat('h:mma')}</p>
			</div>
			<div className='col to-the-right'>
				<Avatar src="https://joeschmoe.io/api/v1/random" />
				<p className='booking-private-class-teacher'>{data.instructor.name}</p>
			</div>
			<div className='col-2 to-the-right' style={{ float: 'left' }}>
				<div>
					<button>Enter Class</button>
				</div>
			</div>
		</div>
	)
}

export default PrivateClasses