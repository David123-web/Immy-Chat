import { Badge, Calendar } from 'antd'
import React from 'react'
import moment from 'moment';

const getMonthData = (value) => {
	if (value.month() === 8) {
		return 1394;
	}
}

const ClassesCalendar = ({ itemsData }) => {
	const monthCellRender = (value) => {
		const num = getMonthData(value);
		return num ? (
			<div className="notes-month">
				<section>{num}</section>
				<span>Backlog number</span>
			</div>
		) : null;
	}

	const dateCellRender = (value) => {
		const listData = itemsData.filter(x => {
			console.log(x.booking, moment(new Date(x.booking.time)).format('YYYY-MM-DD HH:mm:ss'))
			return moment(new Date(x.booking.time)).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')
		});
		return (
			<ul className="events">
				{listData.map((item) => (
					<li key={item.content}>
						<Badge status={"success"} text={moment(new Date(item.booking.time)).format('h:mm') + ' - ' + item?.user_detail[0]?.lastName + ' ' + item?.user_detail[0]?.firstName} />
					</li>
				))}
			</ul>
		);
	};

	return (
		<>
			<Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
		</>
	)
}

export default ClassesCalendar