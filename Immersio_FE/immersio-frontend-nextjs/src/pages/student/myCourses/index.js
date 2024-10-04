import { Button, Card, Col, Progress, Row, Select, Steps, Tabs } from 'antd'
import TabPane from 'antd/lib/tabs/TabPane';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import StudentRoute from '../../../../components/routes/StudentRoute'

const { Meta } = Card;
const { Option } = Select;
const { Step } = Steps;

export const LessonContext = createContext();

const PreviewPage = () => {
	const [values, setValues] = useState({
		course: undefined,
		lesson: undefined,
		input: {
			vocabulary: { input: [], drills: [] },
			phrases: { input: [], drills: [] },
			grammar: { input: [], drills: [] },
			AI: { input: [{ line: '', alt_answs: [''] }] }
		},
	})

	const [vocabulary, setVocabulary] = useState([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
	const [phrases, setPhrases] = useState([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
	const [grammar, setGrammar] = useState([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
	const [vocabularyDrills, setVocabularyDrills] = useState([]);
	const [phrasesDrills, setPhrasesDrills] = useState([]);
	const [grammarDrills, setGrammarDrills] = useState([]);
	const [AIdata, setAIdata] = useState([{ line: '', alt_answs: [''] }])
	const [currentInput, setCurrentInput] = useState({
		index: undefined,
		uploadingImage: false,
		uploadingVideo: false,
		uploadingAudio: false,
	})

	const [lessons, setLessons] = useState([])
	const [image, setImage] = useState({})
	const [video, setVideo] = useState({})
	const [visible, setVisible] = useState(false)
	const [visible2, setVisible2] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [imageProgress, setImageProgress] = useState(0)
	const [inputProgress, setInputProgress] = useState(0)
	const router = useRouter()
	const { thisLesson, thisCourse } = router.query

	const [activeKey, setActiveKey] = useState("1")
	const [courses, setCourses] = useState([])
	const [course, setCourse] = useState({})
	const [courseState, setCourseState] = useState({})

	const user = useSelector(state => state.auth.login.currentUser?.user)


	const allCoursesOfStudent = useSelector(state => state.courses.allCoursesOfStudent)

	useEffect(() => {
		getCourses()
	}, [courses])

	const getCourses = async () => {
		console.log(allCoursesOfStudent)
		setCourses(allCoursesOfStudent)
		if (allCoursesOfStudent.length > 0) {
			let currentCourse = allCoursesOfStudent[0].id
			if (thisCourse) { currentCourse = thisCourse }
			getLessons(currentCourse, allCoursesOfStudent)
			setCourse(allCoursesOfStudent[0])
		}
	}

	const getLessons = async (courseId, courseList) => {
		let currentCourse = courseList.filter(course => course.id === courseId)[0]
		//Set Lessons
		let less0ns = []
		currentCourse?.lessons?.forEach((lesson) => {
			lesson?.lessons?.forEach((item) => {
				item = { ...item, language: currentCourse.language, course: currentCourse.title }
				less0ns.push(item)
			})
		})
		setLessons(less0ns)

		let currentLesson = less0ns[0]?.id
		if (thisLesson) { currentLesson = thisLesson }
		else if (less0ns.length > 0) {
			currentLesson = less0ns[0].id
		}

		//if lesson has image or video
		let less = less0ns.filter(lesson => lesson.id === currentLesson)[0]
		if (less && less.image) setImage(less.image)
		else setImage({})
		if (less && less.video) setVideo(less.video)
		else setVideo({})

		let info = await getLessonInput(currentCourse?.id, currentLesson)
		if (info) {
			setValues({ ...info, course: currentCourse?.id, lesson: currentLesson, language: currentCourse?.language, level: currentCourse?.level })
			if (info?.input?.vocabulary?.input.length < 1) setVocabulary([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			else setVocabulary(info?.input?.vocabulary?.input)
			if (info?.input?.phrases?.input.length < 1) setPhrases([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			else setPhrases(info?.input?.phrases?.input)
			if (info?.input?.grammar?.input.length < 1) setGrammar([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			else setGrammar(info?.input?.grammar?.input)
			setAIdata(info.input?.AI.input)
			if (info?.input?.vocabulary?.drills.length < 1) setVocabularyDrills([])
			else setVocabularyDrills(info?.input?.vocabulary?.drills)
			if (info?.input?.phrases?.drills.length < 1) setPhrasesDrills([])
			else setPhrasesDrills(info?.input?.phrases?.drills)
			if (info?.input?.grammar?.drills.length < 1) setGrammarDrills([])
			else setGrammarDrills(info?.input?.grammar?.drills)
		} else {
			setValues({ course: currentCourse?.id, lesson: currentLesson, language: currentCourse?.language, level: currentCourse?.level })
			setVocabulary([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			setPhrases([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			setGrammar([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			setAIdata([{ line: '', alt_answs: [''] }])
			setVocabularyDrills([])
			setPhrasesDrills([])
			setGrammarDrills([])
		}
	}

	const getLessonInput = async (courseId, lessonId) => {

		// return data;
		return {}
	}

	const loadLessonInput = async (lessonId) => {
		let currentCourse = courses.filter(course => course.id === values.course)[0]
		let info = await getLessonInput(values.course, lessonId)
		if (info) {
			setValues({ ...info, course: currentCourse?.id, lesson: lessonId, language: currentCourse?.language, level: currentCourse?.level })
			if (info?.input?.vocabulary?.input.length < 1) setVocabulary([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			else setVocabulary(info?.input?.vocabulary?.input)
			if (info?.input?.phrases?.input.length < 1) setPhrases([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			else setPhrases(info?.input?.phrases?.input)
			if (info?.input?.grammar?.input.length < 1) setGrammar([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			else setGrammar(info?.input?.grammar?.input)
			setAIdata(info.input?.AI.input)
			if (info?.input?.vocabulary?.drills.length < 1) setVocabularyDrills([])
			else setVocabularyDrills(info?.input?.vocabulary?.drills)
			if (info?.input?.phrases?.drills.length < 1) setPhrasesDrills([])
			else setPhrasesDrills(info?.input?.phrases?.drills)
			if (info?.input?.grammar?.drills.length < 1) setGrammarDrills([])
			else setGrammarDrills(info?.input?.grammar?.drills)
		} else {
			let current = values
			setValues({
				course: currentCourse?.id,
				lesson: lessonId,
				language: currentCourse?.language,
				level: currentCourse?.level,
				video: {},
				image: {},
				input: {
					vocabulary: { input: [], drills: [] },
					phrases: { input: [], drills: [] },
					grammar: { input: [], drills: [] },
					AI: { input: [] }
				}
			})
			setVocabulary([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			setPhrases([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			setGrammar([{ input: '', explanation: '', image: {}, audio: {}, video: {} }])
			setAIdata([{ line: '', alt_answs: [''] }])
			setVocabularyDrills([])
			setPhrasesDrills([])
			setGrammarDrills([])
		}

		//if lesson has image or video
		let less = lessons.filter(lesson => lesson.id === lessonId)[0]
		if (less.image) setImage(less.image)
		if (less.video) setVideo(less.video)
	}

	const handleActiveKey = (e) => {
		setActiveKey(e)
	}

	const handleUseCourse = (index) => {
		setActiveKey("1")
		setCourse(courses[index])
	}

	return (
		<StudentRoute>
			<div className="animated fadeIn">
				<div className="mb-20 student-dashboard-title-section">
					Core courses
				</div>

				<div className='pt-3 student-dashboard-courses'>
					<Tabs className="control-hooks-tabs" type="card" activeKey={activeKey} onChange={handleActiveKey} >
						<TabPane tab="Current Course" key="1" >
							<Row>
								<Col span={16}>
									{/* <CurriculumTimeline data={course} /> */}
								</Col>

								{/* Action preview course in left column */}
								{course?.lessons?.length && Object.keys(courseState).length ? (
									<Col span={8}>
										<div className='student-dashboard-courses-right-section'>
											<div className='student-dashboard-courses-right-section-images'>
												<img alt="example" src="https://duhocglolink.com/wp-content/uploads/2019/05/luyen-thi-toeic-philippines-du-hoc-glolink-1.png" width="100%" />
											</div>
											<div className='student-dashboard-courses-right-section-box'>
												<b className=''>{courseState.title}</b>
												<span>0/10 Lessons completed</span>
												<p dangerouslySetInnerHTML={{ __html: courseState.course_description }} />
												<Button type="primary" shape="round">
													Try a different course
												</Button>
											</div>
										</div>
									</Col>
								) : null}
							</Row>
						</TabPane>

						<TabPane tab="Course List" key="2">
							<Row className='mb-20'>
								<div className="d-flex align-items-center">
									<span className='mr-10'>Category</span>
									<Select defaultValue="general-communication">
										<Select.Option value="general-communication">General Communication</Select.Option>
									</Select>
								</div>
							</Row>
							<Row gutter={22}>
								{
									courses.length > 0 && courses?.map((course, index) =>
										<Col span={6}>
											<Card
												hoverable
												cover={<img alt="example" src="https://duhocglolink.com/wp-content/uploads/2019/05/luyen-thi-toeic-philippines-du-hoc-glolink-1.png" />}
												key={index}
											>
												<Meta title={course.title} description="" />
												<div className='mb-15 mt-15'>
													<Progress percent={course.percent} />
												</div>
												<Link href={`/student/myCourses/lesson/introduction?course_id=${course?.id}`} as={`/student/myCourses/lesson/introduction?course_id=${course?.id}`} passHref>
													<Button type="primary" shape="round" className='w-100'>
														Start Now
													</Button>
												</Link>
											</Card>
										</Col>
									)
								}
							</Row>
						</TabPane>
					</Tabs>

					{/* {
						(courses.length > 1 ?
							<LessonContext.Provider value={{ vocabulary, grammar, phrases, vocabularyDrills, phrasesDrills, grammarDrills }}>
								<Preview
									values={values}
									setValues={setValues}
									uploading={uploading}
									setVisible={setVisible}
									visible={visible}
									setProgress={setProgress}
									getLessons={getLessons}
									image={image}
									video={video}
									progress={progress}
									visible2={visible2}
									setVisible2={setVisible2}
									user={user}
									getLessonInput={getLessonInput}
									courses={courses}
									lessons={lessons}
									phrases={phrases}
									grammar={grammar}
									AIdata={AIdata}
									vocabulary={vocabulary}
									currentInput={currentInput}
									setCurrentInput={setCurrentInput}
									imageProgress={imageProgress}
									inputProgress={inputProgress}
									setVocabulary={setVocabulary}
									setPhrases={setPhrases}
									setGrammar={setGrammar}
									loadLessonInput={loadLessonInput}

									setImage={setImage}
									setVideo={setVideo}
								/>
							</LessonContext.Provider>
							:
							<h2 className='text-center'>Subscribe to new courses to continue!</h2>
						)
					} */}
				</div>
			</div>
		</StudentRoute >
	)
}

export default PreviewPage