import { Col, Collapse, List, Row, Select, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import PreviewTab from '../../../../../src/pages/student/myCourses/lesson/previewTab';
import { assignToCourse } from '../../../../services/courses/apiCourses';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const { Item } = List;

const Preview = ({
	contextAudio,
	dataCourseSlide,
	isLoadingLessonDetail,
	values,
	setValues,
	user,
	courses,
	lessons,
	uploading,
	vocabulary,
	phrases,
	grammar,
	getLessons,
	loadLessonInput,
	image,
	setImage,
	video,
	setVideo,
	process,
}) => {

  console.log(`====preview`)
	const resetCourse = (v) => {
		setValues({ course: v });
		getLessons(v, courses);
	};



	const resetLesson = (v) => {
		loadLessonInput(v);
		if (v.image) setImage(v.image);
		else setImage({});
		if (v.video) setVideo(v.video);
		else setVideo({});
	};

	const [type, setType] = useState('introduction');

	return (
		<>
			<form className={'lesson-preview'}>
				<Row>
					<Col xs={24} sm={30}>
						<div className="control-hooks-input position-relative mb-4">
						</div>

						<div className="control-hooks-group position-relative mb-4">

						</div>

						<PreviewTab
							contextAudio={contextAudio}
							dataCourseSlide={dataCourseSlide}
							isLoadingLessonDetail={isLoadingLessonDetail}
							values={values}
							type={type}
							setType={setType}
							indexStep={process.indexStep}
							setIndexStep={process.setIndexStep}
							isCompletedStep={process.isCompletedStep}
							setComplete={process.setComplete}
						/>
					</Col>
				</Row>
			</form>
		</>
	);
};

export default Preview;
