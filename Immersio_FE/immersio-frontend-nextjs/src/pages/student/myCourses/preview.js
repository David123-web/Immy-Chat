import { Avatar, Col, Collapse, List, Row, Select, Tabs } from 'antd';
import { useState } from 'react';
import PreviewTab from '../../../../src/pages/student/myCourses/lesson/previewTab';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const { Item } = List;

const Preview = ({ values, setValues, user, courses, lessons, uploading, vocabulary, phrases, grammar, getLessons, loadLessonInput,
	image, setImage, video, setVideo }) => {

	const resetCourse = (v) => {
		setValues({ course: v })
		getLessons(v, courses)
	}

	const resetLesson = (v) => {
		loadLessonInput(v)
		if (v.image) setImage(v.image)
		else setImage({})
		if (v.video) setVideo(v.video)
		else setVideo({})
	}

	const [type, setType] = useState("vocabulary");


	return (
		<>
			<form className={'lesson-preview'}>
				<Row>
					<Col xs={24} sm={30} className="pe-4">
						<div className="control-hooks-input position-relative mb-4">
							<Select size='large' value={values ? values.course : ""} defaultValue={values ? values.course : 'Select a course'} className="w-100"
								onChange={(v) => resetCourse(v)}>
								{
									courses ? courses.map((course) => (
										<Option value={course.id}>{course.title}</Option>
									)) : null
								}
							</Select>
						</div>

						<div className="control-hooks-group position-relative mb-4">
							<Row justify="center">
								<Col xs={7} className="section-user d-flex align-items-center">
									<Avatar src={user?.image ? user?.image?.Location : 'https://joeschmoe.io/api/v1/random'} style={{ width: 40, height: 40 }} className='userImage' />
									<span className='ms-2'>{user?.firstName + ' ' + user?.lastName}</span>
								</Col>

								<Col xs={17}>
									<Select size='large' value={values ? values.lesson : ""} defaultValue={values ? values.lesson : 'Select a lesson'} className="w-100 custom-select"
										onChange={(v) => { resetLesson(v) }}>
										{
											lessons ? lessons.map((lesson) => (
												<Option value={lesson.id}>{lesson.title}</Option>
											)) : null
										}
									</Select>
								</Col>
							</Row>
						</div>

						<PreviewTab values={values} type={type} setType={setType} />
					</Col>

				</Row>
			</form>
		</>
	)
}

export default Preview