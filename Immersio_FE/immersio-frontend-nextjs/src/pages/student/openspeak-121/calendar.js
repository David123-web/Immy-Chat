import { TimeZones, days, hours } from '../../../../constants/timeZones'
import { CoursesAvailable, Empty } from '../../../../constants/DUMMY_DATA'
import { useEffect, useState } from 'react'
import { DateTime } from "luxon"
import { Select } from 'antd'

const { Option } = Select

const CalendarComponent = () => {
	const [calendarHeader, setCalendarHeader] = useState([])
	const [timeZone, setTimeZone] = useState()
	const [today, setToday] = useState()
	const [currentCourses, setCurrentCourses] = useState()

	const [courseList, setCourseList] = useState()

	useEffect(() => {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setTimeZone(timezone);
		let todayDay = DateTime.now().setZone(timezone);
		changeCoursesTimeZone(CoursesAvailable, timezone)
		setCurrentWeek(todayDay)
	}, [])

	const changeTimeZone = (timezone) => {
		setTimeZone(timezone)
		setCurrentWeek(DateTime.now().setZone(timezone))
		changeCoursesTimeZone(currentCourses,timezone)
	}

	const setCurrentWeek = (todayDay) => {
		setToday(todayDay)
		let newWeek = []
		for(let i=0;i<6;i++) {
			newWeek.push(todayDay.plus({ days: i+1 }))
		}
		setCalendarHeader(newWeek)
	}

	const changeCoursesTimeZone = (courses, timezone) => {
		let l = []
		courses.forEach((course) => {
			let date = DateTime.fromObject({},{
		  		zone: course.timeZone
			}).set({
		  		day: course.day,
		  		month: course.month,
		  		year: course.year,
		  		hour: course.hour,
		  		minute: course.minutes
			});
			date = date.setZone(timezone);
			l.push({
				_id: course.id,
				instructor: course.instructor,
				timeZone: date.zone,
				type: course.type,
				day: date.day,
				month: date.month,
				year: date.year,
				hour: date.hour,
				minutes: date.minute,
				availableSeats: course.availableSeats,
				duration: course.duration
			})
		})
		setCurrentCourses(l)
		sortCourseList(l)
	}

	const sortCourseList = (coursesAvailable) => {
		let sortedList = []
		//Sort by hour
		for (let i = 0; i < 24; i++) {
   			let currentHour = coursesAvailable.filter((course)=>course.hour==i)
   			if(currentHour.length > 0) {
   				sortedList.push({ hour: i, courses: currentHour })
   			}
		}
		//Sort by date
		let week = [...calendarHeader]
		week.splice(0,0, today)
		//let sortedWeek = []
		sortedList.forEach((course, i) => {
			const sortedDate = course.courses.sort(
  				(courseA, courseB) => Number(courseA.day) - Number(courseB.day)
			)
			let sortedWeekHour = []
			week.forEach((day) => {
				sortedWeekHour.push(dateExists(sortedDate, day))
			})
			//sortedWeek.push({ hour: sortedWeekHour})
			//console.log(sortedWeek)
			sortedList[i].courses = sortedWeekHour
		})
		//setCourseList(fixCalendar(sortedWeek))
		setCourseList(fixCalendar(sortedList))
		//setCourseList(sortedList)*/
	}

	const dateExists = (sortedDate, day) => {
		let i = 0
		while(i < sortedDate.length) {
			if (sortedDate[i].day == day?.day && sortedDate[i].month == day?.month) {
				return sortedDate[i]
			}
			i++
		}
		return null
	}

	const fixCalendar = (sortedWeek) => {
		let fixedCalendar = [...sortedWeek]
		if(fixedCalendar.length < 12) {
			let half = Math.floor((12 - sortedWeek.length)/2)
			let idx = sortedWeek[0].hour
			//let idx = 3
			let up = half; let down = half;
			if(idx - half < 0) {
				up = idx - 1
				down = half + (half - up)
			}
			else if ( idx + half > 24) {
				down = 24 - idx
				up = half + (half - down)
			}
			let upper = []
			let bottom = []
			for(let i = idx-half; i < idx; i++) {
				upper.push({ hour: i, courses: Empty })
			}
			for(let i = 1; i <= down; i++) {
				bottom.push({ hour: idx+i, courses: Empty })
			}
			fixedCalendar = upper.concat(sortedWeek, bottom)
		}
		return fixedCalendar
	}

	const scheduleString = (course) => {		
		let date = DateTime.fromObject({},{
		  		zone: course.timeZone
			}).set({
		  		hour: course.hour,
		  		minute: course.minutes
			});

		let time = DateTime.fromISO(date).toFormat('h:mma') + ' - ' + DateTime.fromISO(date.plus({ minutes: course.duration })).toFormat('h:mma')
		return time
	}

	const selectDate = (e) => {
		//If selected, show mark
		//else hide mark
		//Save selected date
	}

	return(
		<div className='calendar-container'>
			<h4>Current time zone {timeZone}</h4>
			<p>{today?.toLocaleString(DateTime.DATETIME_FULL)}</p>
			<Select placeholder="Choose a timeZone" defaultValue={timeZone} value={timeZone} tokenSeparators={[,]} 
				size='large' onChange={(e)=>changeTimeZone(e)}>
            	{ TimeZones.map((time, i) => (
            		<Option key={i} value={time}>{time}</Option>
            	))}
			</Select>
			<table className='calendar-table'>
				<thead>
    				<tr>
      					<th className='calendar-hours' />
						<th className='calendar-table-title-selected'>
					    	<p>{days[today?.weekday-1]}<br/><div>{today?.day}</div></p>
					    </th>
					    { calendarHeader.map((day,i) => (
					    	<th key={i} className='calendar-table-title'>
					    		<p>{days[day.weekday-1]}<br/><div>{day.day}</div></p>
					    	</th>
					    ))}
    				</tr>
  				</thead>
  				{ courseList && courseList.map((hour,i) => (
  					<tr key={i}>
			    		<td className='calendar-hours'>{hour.hour+':00'}</td>
			    		{ hour && hour.courses.map((course,j) => (
			    			<>
			    				{ course != null ? (
			    					<td className={"calendar-dates "+(course.availableSeats > 0 ? 'available' : 'noAvailable')} key={j}
			    						onClick={(e)=>selectDate(e)}>
			    						<p>
			    							{ scheduleString(course) }
			    						</p>
			    					</td>
			    				) : (
			    					<td className="calendar-dates-no" key={j}></td>
			    				)}
			    			</>
			    		))}
			    		{/* courseList[i].map((course) => (
			    			<>
			    			{ course != null ? (
			    					<td className="calendar-dates" key={i}><p>Available</p></td>
			    				) : (
			    					<td className="calendar-dates-noAvailable" key={i}></td>
			    				)}
			    			</>
			    		))*/}
  					</tr>
  				))}
  			</table>
			<pre>{JSON.stringify(courseList, null, 4)}</pre>
		</div>
	)
}

export default CalendarComponent 