import { TimeZones, days, hours } from '../../../../constants/timeZones'
import { CoursesAvailable, Empty } from '../../../../constants/DUMMY_DATA'
import { CheckCircleFilled } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { DateTime } from "luxon"
import { Select } from 'antd'

const { Option } = Select

const CourseCalendar = () => {
	const [calendarHeader, setCalendarHeader] = useState([])
	const [timeZone, setTimeZone] = useState()
	const [instructor, setIntructor] = useState('Abraham Josiah Chappell')
	const [today, setToday] = useState()
	const [currentCourses, setCurrentCourses] = useState()

	const [courseList, setCourseList] = useState()

	useEffect(() => {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		setTimeZone(timezone);
		let todayDay = DateTime.now().setZone(timezone);
		changeCoursesTimeZone(CoursesAvailable, timezone)
	}, [])

	const changeTimeZone = (timezone) => {
		setTimeZone(timezone)
		changeCoursesTimeZone(currentCourses,timezone)
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
				duration: course.duration,
				selected: false
			})
		})
		setCurrentCourses(l)
		sortCourseList(l)
	}

	const sortCourseList = (coursesAvailable) => {
		let sortedList = sortByDate(sortByHour(coursesAvailable))
		setCourseList(fixCalendar(sortedList))
	}

	const sortByHour = (coursesAvailable) => {
		let sortedList = []
		//Sort by hour
		for (let i = 0; i < 24; i++) {
   			let currentHour = coursesAvailable.filter((course)=>course.hour==i)
   			if(currentHour.length > 0) {
   				sortedList.push({courses: currentHour, hour: i})
   			}
		}
		return(sortedList)
	}

	const sortByDate = (sortedByHour) => {
		//Sort by date
		let todayDay = DateTime.now().setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
		setToday(todayDay)
		let week = []
		for(let i=0;i<7;i++) {
			week.push(todayDay.plus({ days: i }))
		}
		sortedByHour.forEach((course, i) => {
			const sortedDate = course.courses.sort(
  				(courseA, courseB) => Number(courseA.day) - Number(courseB.day)
			)
			//console.log(week)
			let sortedWeek = []
			week.forEach((day) => {
				let currentDate = sortedDate.filter((date)=>date.day==day.day)
				if (currentDate.length > 0) {
					sortedWeek.push(currentDate[0])
				} else sortedWeek.push(null)
			})
			sortedByHour[i].courses = sortedWeek
		})
		setCalendarHeader(week.splice(1,week.length-1))
		return sortedByHour
	}

	const dateExists = (day, sortedDate) => {
		console.log('day of week ', day.day)
		console.log('arreglo', sortedDate)
		let i = 0
		while(i < sortedDate?.length) {
			if (sortedDate[i].day == day.day && sortedDate[i].month == day.month) {
				console.log('coincide')
				return sortedDate[i]
			}
			else console.log('no coincide')
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

		let time = DateTime.fromISO(date).toFormat('h:mma') + ' -\n ' + DateTime.fromISO(date.plus({ minutes: course.duration })).toFormat('h:mma')
		return time
	}

	const selectDate = (i,j) => {
		let c = [...courseList]
		c[i].courses[j].selected = !c[i].courses[j].selected
		console.log(c[i].courses[j].selected)
		setCourseList(c)
	}

	return(
		<div>
			<div className='calendar-container'>
				<p className='' style={{margin:0, alignSelf:'center'}}>{today?.toLocaleString(DateTime.DATETIME_FULL)}</p>
				<div>
				<Select className='select-calendar' placeholder="Choose a teacher" defaultValue={instructor} value={instructor} tokenSeparators={[,]} 
					size='large'>
	           		<Option key={1} value='Abraham Josiah Chappell'>Abraham Josiah Chappell</Option>
				</Select>
				<Select className='select-calendar' placeholder="Choose a timeZone" defaultValue={timeZone} value={timeZone} tokenSeparators={[,]} 
					size='large' onChange={(e)=>changeTimeZone(e)}>
	            	{ TimeZones.map((time, i) => (
	            		<Option key={i} value={time}>{time}</Option>
	            	))}
				</Select>
				</div>
			</div>
			<table className='calendar-table mt-4'>
				<thead>
    				<tr>
      					<th className='calendar-hours' />
						<th className='calendar-table-title-selected'>
					    	<p>{days[today?.weekday-1]}<br/><div>{today?.day}</div></p>
					    </th>
					    { calendarHeader.map((day,i) => (
					    	<th key={i} className='calendar-table-title'>
					    		<p>{days[day.weekday-1]}<br/><span className='font-weight-bold'>{day.day}</span></p>
					    	</th>
					    ))}
    				</tr>
  				</thead>
  				<tbody>
  				{ courseList && courseList.map((hour,i) => (
  					<tr key={i}>
			    		<td className='calendar-hours'>{hour.hour+':00'}</td>
			    		{ hour && hour.courses.map((course,j) => (
			    			<>
			    				{ course != null ? (
			    					<td className={"calendar-dates "+(course.availableSeats > 0 ? 'available' : 'noAvailable')} key={j}
			    						onClick={()=>{selectDate(i,j)}}>
			    						<p>
			    							{ scheduleString(course) }
			    							<span className={course.selected ? 'selected-calendar-date' : 'd-none'}><CheckCircleFilled /></span>
			    						</p>
			    					</td>
			    				) : (
			    					<td className="calendar-dates-no" key={j}></td>
			    				)}
			    			</>
			    		))}
  					</tr>
  				))}
  				</tbody>
  			</table>			
			{/*<pre>{JSON.stringify(courseList, null, 4)}</pre>*/}
		</div>
	)
}

export default CourseCalendar