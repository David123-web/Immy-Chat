import { Avatar } from 'antd'

const ScheduledClassesTable = ({ scheduledData, setActiveKey }) => {
	return (
		<>
			<table id="ScheduleTable" className="table dataTable no-footer" role="grid" aria-describedby="myTable_info">
				<thead>
					<tr role="row">
						<th className='text-center' aria-controls="myTable" rowSpan="1" colSpan="1">Tutors</th>
						<th className='text-center' aria-controls="myTable" rowSpan="1" colSpan="1">Prepaid</th>
						<th className='text-center' aria-controls="myTable" rowSpan="1" colSpan="1">Rate</th>
						<th className='text-center' aria-controls="myTable" rowSpan="1" colSpan="1">Actions</th>
					</tr>
				</thead>
				<tbody>
					{scheduledData.length > 0 && scheduledData?.map((scheduledClass) => (
						<tr data-entry-id="idx" role="row">
							<td align='left'>
								<div className='instructor-data'>
									<Avatar src="https://joeschmoe.io/api/v1/random" />
								</div>
								<div className='instructor-data'>
									<p>
										{scheduledClass.instructorArray.firstName + '' + scheduledClass.instructorArray.lastName}
									</p>
								</div>
							</td>
							<td align="center"><p>{scheduledClass.instructorArray.hourRate} hrs</p></td>
							<td align="center"><p>${scheduledClass.instructorArray.hourRate}</p></td>
							<td align="center">
								{/* <button className='button-blue text-white'>Message</button> */}
								<button className='booking-light-blue-bg text-white' onClick={() => setActiveKey('3')}>Calendar</button>
								<button className='booking-red-bg text-white'>Learning plan</button>
								{/* <button className='booking-yellow-bg'>Enter class</button> */}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}

export default ScheduledClassesTable