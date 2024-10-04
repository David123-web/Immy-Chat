import { TimeZones, days, hours } from '../../../../constants/timeZones'
import { CoursesAvailable, Empty } from '../../../../constants/DUMMY_DATA'
import { useEffect, useState } from 'react'
import { DateTime } from "luxon"
import { Select } from 'antd'
import moment from 'moment'
const { Option } = Select

const CourseTiming = ({ setScheduleVisible, data }) => {
	const [calendarHeader, setCalendarHeader] = useState([])
	const [timeZone, setTimeZone] = useState()
	const [today, setToday] = useState()
	const [timeTable, setTimeTable] = useState([])
	const [currentHour, setCurrentHour] = useState({})

	const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	useEffect(() => {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setTimeZone(timezone);
		let day = DateTime.now().setZone(timezone)
		setCurrentWeek(day)
		setCurrentHour(data?.timeAvailable)
		let t = []
		for (let i = 0; i < 24; i++) t.push(i)
		setTimeTable(t)
	}, [data])

	const changeTimeZone = (timezone) => {
		setTimeZone(timezone)
		setCurrentWeek(DateTime.now().setZone(timezone))

	}

	const setCurrentWeek = (todayDay) => {
		setToday(todayDay)
		let newWeek = []
		for (let i = 0; i < 7; i++) {
			const firstDateWeek = moment().startOf('isoWeek').toDate()
			var result = new Date(firstDateWeek);
			result.setDate(result.getDate() + i);
			newWeek.push({ name: weekday[result.getDay()], day: result.getDate(), date: result })
		}
		setCalendarHeader(newWeek)
	}

	return (
		<>
			<h2>Schedule</h2>
			<p>Choose all the time slot for your course. The timings are displayed in your local timezone.</p>
			<div style={{ width: '85%', margin: 'auto' }}>
				<div className='calendar-container' id='scheduleTimeZone'>
					<p className='' style={{ margin: 0, alignSelf: 'center' }}>{today?.toLocaleString(DateTime.DATETIME_FULL)}</p>
					<Select className='select-calendar' placeholder="Choose a timeZone" defaultValue={timeZone} value={timeZone} tokenSeparators={[,]}
						size='large' onChange={(e) => changeTimeZone(e)}>
						{TimeZones.map((time, i) => (
							<Option key={i} value={time}>{time}</Option>
						))}
					</Select>
				</div>

				<table className='calendar-table-hours mt-4'>
					<thead>
						<tr>
							{calendarHeader.map((day, i) => (
								<th key={i} className='calendar-hours-table-title'>
									<p>{day.name}<br /><span className='font-weight-bold'>{day.day}</span></p>
								</th>
							))}
						</tr>
					</thead>

					{timeTable && timeTable.map((hour, i) => (
						<tr key={i}>
							{calendarHeader.map((h, j) => (
								<td key={j}>
									{
										(parseInt(currentHour && currentHour[`dayOfWeek_${j}`].timeStart) <= hour && (parseInt(currentHour && currentHour[`dayOfWeek_${j}`].timeEnd) >= hour)) ? (
											<p className='available-hour' date={h.date} onClick={(e) => { console.log(e.currentTarget.classList); e.currentTarget.classList.toggle('selected-calendar-hour') }}>{hour + ':00'}</p>
										) : (
											<p>{hour + ':00'}</p>
										)
									}
								</td>
							))}
						</tr>
					))}
				</table>
				{/* <button className='round-booking-yellow-button mt-3' style={{ display: 'block', margin: 'auto' }} onClick={() => setScheduleVisible(false)}>CONFIRM SCHEDULE</button> */}

			</div>
		</>
	)
}

export default CourseTiming