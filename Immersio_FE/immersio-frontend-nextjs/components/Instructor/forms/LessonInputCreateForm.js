import {
	CheckSquareOutlined,
	CloseCircleFilled,
	CloudUploadOutlined,
	DeleteFilled,
	ExclamationCircleOutlined,
	EyeFilled,
	EyeInvisibleOutlined,
	LeftOutlined,
	LoadingOutlined,
	PlusCircleFilled,
	RightOutlined,
	SearchOutlined,
	VideoCameraFilled,
} from '@ant-design/icons';
import {
	Avatar,
	Badge,
	Button,
	Col,
	Collapse,
	Form,
	Input,
	List,
	Modal,
	Progress,
	Radio,
	Row,
	Select,
	Skeleton,
	Space,
	Spin,
	Tabs,
	Upload,
} from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import { RouterConstants } from '../../../constants/router';
import { useLoadCommonCourse } from '../../../hooks/useLoadCommonCourse';
import {
	DRAG_AND_DROP,
	DRAG_THE_WORDS,
	DataContext1,
	DataContext2,
	DataContext3,
	FLASH_CARD,
	LISTEN_AND_FILL_BLANKS,
	MULTIPLE_CHOICES,
	SORT,
} from '../../../src/pages/dashboard/course/lesson/lessonInput';
import { getCourseByID } from '../../../src/services/courses/apiCourses';
import { viewFileLinkByID, viewFileStreamByID } from '../../../src/services/files/apiFiles';
import NewCourseDetailsWrapper from '../../CourseDetails/NewCourseDetailsWrapper';
import FolderContentMydrive from '../components/folderContent/FolderContentMydrive';
import PreviewLessonInput from '../components/preview/previewLessonInput';
import { ControlUploadTabsStyle } from '../styled/ControlUploadTabs.style';
import DragAndDrop, { TooltipDragAndDrop } from '../tools/DragAndDrop';
import DrillItem from '../tools/drills/AddDrill/AddDrill';
import checkMarkStyle from '../tools/drills/Page/DrillPage.module.css';
import CustomCKEditorCourse from './CustomCKEditorCourse';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { useMobXStores } from '@/src/stores';


const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const { Item } = List;

const LessonInputCreateForm = ({
	values,
	setValues,
	user,
	courses,
	lessons,
	submitDrillData,
	parseAndSubmitData,
	handleImage,
	handleImageRemove,
	handleVideo,
	handleVideoRemove,
	uploading,
	vocabulary,
	phrases,
	grammar,
	AIdata,
	currentInput,
	setCurrentInput,
	handleInputImage,
	handleInputVideo,
	handleInputAudio,
	handleInputImageRemove,
	handleInputVideoRemove,
	handleInputAudioRemove,
	setGrammarItem,
	getLessons,
	deleteVocabulary,
	submitVocabulary,
	deletePhrases,
	deleteGrammar,
	loadLessonInput,
	setVocabulary,
	setPhrases,
	setGrammar,
	progress,
	addAIdataSubLine,
	addAISubLine,
	image,
	video,
	setVocabularyItem,
	setVocabularyExplanation,
	setPhraseItem,
	setPhraseExplanation,
	setGrammarExplanation,
	setActivePanelsVocabulary,
	activePanelsVocabulary,
	activePanelsPhrases,
	setActivePanelsPhrases,
	activePanelsGrammar,
	setActivePanelsGrammar,
	activePanelsAI,
	setActivePanelsAI,
	previewCourse,
	dataSource,
	drillData0,
	setDrillData0,
	drillData1,
	setDrillData1,
	drillData2,
	setDrillData2,
	drillDataLoaded,
	setDrillDataLoaded,
	loadingSpinning,
	handleInputImageMyDrive,
	handleInputAudioMyDrive,
	handleInputVideoMyDrive,
	voice,
	dialogs,
	configLoadingImage,
	setUpdateEditGroup,
	setResetEditGroup,
	valuesErr,
	setValuesErr,
	setPreviewCourse,
	getDrillSection
}) => {
	const { t } = useTranslation();
	const router = useRouter();
	const [activeKey, setActiveKey] = useState('vocabulary');
	const [visibleMedia, setVisibleMedia] = useState(false);
	const [visibleDrills, setVisibleDrills] = useState(false);
	const [drillCounter0, setDrillCounter0] = useState(0);
	const [drillCounter1, setDrillCounter1] = useState(0);
	const [drillCounter2, setDrillCounter2] = useState(0);
	const [drillTab, setDrillTab] = useState(0);
	const [currentCourseId, setCurrentCourseId] = useState('')
	const [currentLessonId, setCurrentLessonId] = useState('')

	const filterLevel = (dataSource?.levels || []).filter((s) => s?.id?.toString() === values?.level?.toString());
	const filterLanguage = (dataSource?.languages || []).filter(
		(s) => s?.id?.toString() === values?.language?.toString()
	);

	const { userActivityStore } = useMobXStores();

	const drillCounter0Ref = useRef(drillCounter0);
	const drillCounter1Ref = useRef(drillCounter1);
	const drillCounter2Ref = useRef(drillCounter2);
	const vocabRef = useRef([]);
    
	const prevDrillData0 = useRef(drillData0);
	const prevDrillData1 = useRef(drillData1);
	const prevDrillData2 = useRef(drillData2);


	const prevVocabulary = useRef(vocabulary);
	const prevPhrase = useRef(phrases);
	const prevGrammar = useRef(grammar);



	useEffect(() => {
        if (!listEquals(prevVocabulary.current, vocabulary)) {
			console.log(`!!! vocabulary list changed ${JSON.stringify(vocabulary, null, 2)}`)
		}
	}, [vocabulary]);

	useEffect(() => {
		if (!listEquals(prevPhrase.current, phrases)) {
			console.log(`!!! phrases list changed ${JSON.stringify(phrases, null, 2)}`)
		}
	}, [phrases]);

	useEffect(() => {
		if (!listEquals(prevGrammar.current, grammar)) {
			console.log(`!!! grammar list changed ${JSON.stringify(grammar, null, 2)}`)
		}
	}, [grammar]);
   
	
	useEffect(() => {
		if (!listEquals(prevDrillData0.current, drillData0) || isTouched(drillData0)) {
			console.log(`prevDrillData0.current ${JSON.stringify(prevDrillData0.current, null, 2)}`)
			console.log('----------------- vs --------------------')
			console.log(`drillData0 ${JSON.stringify(drillData0, null, 2)}`)
			if(isTouched(drillData0)){
				parseAndSubmitData(drillData0, 'VOCABULARY').then (() => {
					prevDrillData0.current = drillData0;
					console.log('getting drill data back from BE')
					getDrillSection(userActivityStore.currentCourseEdit.lessonId, 'VOCABULARY', true)
					
				});
			}
		}
	  }, [drillData0]);

	  
	  useEffect(() => {
		if (!listEquals(prevDrillData1.current, drillData1) || isTouched(drillData1)) {
			console.log(`prevDrillData1.current ${JSON.stringify(prevDrillData1.current, null, 2)}`)
			console.log('----------------- vs -------------------- ')
			console.log(`drillData1 ${JSON.stringify(drillData1, null, 2)}`)
			if(isTouched(drillData1)){
				parseAndSubmitData(drillData1, 'PHRASE').then (() => {
					prevDrillData1.current = drillData1;
					getDrillSection(userActivityStore.currentCourseEdit.lessonId, 'PHRASE', true)
				});
			}
		}
	  }, [drillData1]);
	
	  useEffect(() => {
		if (!listEquals(prevDrillData2.current, drillData2) || isTouched(drillData2)) {
			console.log(`prevDrillData2.current ${JSON.stringify(prevDrillData2.current, null, 2)}`)
			console.log('----------------- vs --------------------')
			console.log(`drillData2 ${JSON.stringify(drillData2, null, 2)}`)
			if(isTouched(drillData2)){
				parseAndSubmitData(drillData2, 'GRAMMAR').then (() => {
					prevDrillData2.current = drillData2;
					getDrillSection(userActivityStore.currentCourseEdit.lessonId, 'GRAMMAR', true)
				});
			}
		}
	  }, [drillData2]);
	


	useEffect(() => {
		drillCounter0Ref.current = drillCounter0;
		drillCounter1Ref.current = drillCounter1;
		drillCounter2Ref.current = drillCounter2;
	}, [drillCounter0, drillCounter1, drillCounter2]);

	useEffect(() => {
		const vocabularyArray = vocabulary.map(({ input }) => input);
		vocabRef.current = vocabularyArray;
	}, [vocabulary, phrases, grammar, AIdata]);

	useEffect(() => {
		if (!visibleMedia && vocabulary && vocabulary.length > 0) {
			submitVocabulary(vocabulary, 'vocabulary');
		}
	}, [visibleMedia]);

	useEffect(() => {
		if (router.query.courseId && courses.length > 0) {
			resetCourse(Number(router.query.courseId));
		}
	}, [router.query.courseId, courses]);

	useEffect(() => {
		if (router.query.lessonId && lessons.length > 0) {
			resetLesson(Number(router.query.lessonId));
		}
		console.log(`store val ${JSON.stringify(userActivityStore.currentCourseEdit)}`)

	}, [router.query.lessonId, lessons]);

	useEffect(() => {
		console.log("--- inputform useeffect")
		console.log(`all values ${JSON.stringify(lessons, null, 3)}`)
		if(courses.length > 0){
			let courseId = userActivityStore.currentCourseEdit.id;
			let course = courses.find(c => c.id === courseId)
			
			if(course && course.id !== currentCourseId){
				resetCourse(courseId);
				if(userActivityStore.currentCourseEdit.lessonId){
					resetLesson(userActivityStore.currentCourseEdit.lessonId)
				}
			} 
	}
		
	}, [courses]);


	const listEquals = (prev, curr) => {
		if (prev && curr && prev.length != curr.length){
			return false;
		}
		const ids1 = prev.map(obj => obj.id).sort();
		const ids2 = curr.map(obj => obj.id).sort();
	
		for (let i = 0; i < ids1.length; i++) {
			if (ids1[i] !== ids2[i]) {
				return false;
			}
		}

		return true;
	}

	const isTouched = (array) => {
		for(let e of array){
			if(e.touched){
				return true;
			} 
		}
		return false;
	}

	const reorder = (list, startIndex, endIndex) => {
		const [removed] = list.splice(startIndex, 1);
		list.splice(endIndex, 0, removed);
		list.forEach((item, index) => {
			item.index = index;
		});
	};

	const { tags, languages, levels, allInstructors } = useLoadCommonCourse({ isPublic: false });
	const [valuesPreview, setValuesPreview] = useState({});

	const getCourse = async (id) => {
		setPreviewCourse('full');
		try {
			const response = await getCourseByID(id);
			if (response?.data) {
				let mergedObj = {
					...response?.data,
					slug: response?.data?.slug,
					title: response?.data?.title,
					language: response?.data?.courseLanguageId,
					coAuthor: response?.data?.instructorId,
					tags: (response?.data?.tags || []).map((session) => session.id),
					learningOutcome: response?.data?.learningOutcome,
					description: response?.data?.description,
					requirement: response?.data?.requirement,
					thumbnailId: response?.data?.thumbnailId,
					level: response?.data?.levelId,
					isFree: response?.data?.isFree,
					isPublished: response?.data?.isPublished,
					tutorId: response?.data?.tutorId,
					instructionVideoId: response?.data?.instructionVideoId,
				};

				if (response?.data?.instructionVideoId) {
					try {
						if (response.data?.instructionVideo?.externalLink) {
							const responseThumb = await viewFileStreamByID(response?.data?.instructionVideoId);
							if (responseThumb?.data) {
								mergedObj.previewVideo = responseThumb.data?.externalLink;
								mergedObj.fieldMedia = { previewVideo: responseThumb.data?.externalLink };
							}
						} else {
							const responseThumb = await viewFileLinkByID(response?.data?.instructionVideoId);
							if (responseThumb?.data) {
								(mergedObj.previewVideo = responseThumb?.data),
									(mergedObj.fieldMedia = { previewVideo: responseThumb?.data });
							}
						}
						setValues(mergedObj);
					} catch (error) {
						toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
					}
				} else {
					setValuesPreview({
						...response?.data,
						slug: response?.data?.slug,
						title: response?.data?.title,
						language: response?.data?.courseLanguageId,
						coAuthor: response?.data?.instructorId,
						tags: (response?.data?.tags || []).map((session) => session.id),
						learningOutcome: response?.data?.learningOutcome,
						description: response?.data?.description,
						requirement: response?.data?.requirement,
						thumbnailId: response?.data?.thumbnailId,
						instructionVideoId: response?.data?.instructionVideoId,
						level: response?.data?.levelId,
						isFree: response?.data?.isFree,
						isPublished: response?.data?.isPublished,
						tutorId: response?.data?.tutorId,
					});
				}
			}
		} catch (error) {
			setPreviewCourse('');
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const genExtra = () => (
		<div className="d-flex align-items-center">
			<TooltipDragAndDrop title="" />
		</div>
	);

	const onDragEndVocabulary = (result, data) => {
		return reorder(data, result.source.index, result.destination.index);
	};

	const addNewDrillRow = (drillTab, drillValue) => {
		switch (drillTab) {
			case 0:
				setDrillData0([...drillData0, { drillId: drillCounter0Ref.current + 1, drillType: drillValue }]);
				break;
			case 1:
				setDrillData1([...drillData1, { drillId: drillCounter1Ref.current + 1, drillType: drillValue }]);
				break;
			case 2:
				setDrillData2([...drillData2, { drillId: drillCounter2Ref.current + 1, drillType: drillValue }]);
				break;
		}

		setDrillDataLoaded(true);
		setUpdateEditGroup({ type: 'drills', value: true });
	};

	const addVocabulary = (e) => {
		e.preventDefault();
		let inputList = [...vocabulary];
		inputList.push({ input: '', explanation: '', image: '', audio: '', video: '' });
		setVocabulary(inputList);
		setActivePanelsVocabulary([inputList.length]);
		setUpdateEditGroup({ type: 'vocabulary', value: true });
	};

	const addPhrase = (e) => {
		e.preventDefault();
		let inputList = [...phrases];
		inputList.push({ input: '', explanation: '', image: '', audio: '', video: '' });
		setPhrases(inputList);
		setActivePanelsPhrases([inputList.length]);
		setUpdateEditGroup({ type: 'phrases', value: true });
	};

	const addGrammar = (e) => {
		e.preventDefault();
		let inputList = [...grammar];
		inputList.push({ input: '', explanation: '', image: '', audio: '', video: '' });
		setGrammar(inputList);
		setActivePanelsGrammar([inputList.length]);
		setUpdateEditGroup({ type: 'grammar', value: true });
	};

	const drillFormOnFinish = (e) => {
		if (e.drills) {
			const drillValue = e.drills.target.value;
			addNewDrillRow(drillTab, drillValue);
		} else {
			Modal.error({ title: 'Select a drill to add' });
		}
	};

	const resetCourse = (v) => {
		setDrillData0([]);
		setDrillData1([]);
		setDrillData2([]);
		setCurrentCourseId(v)
		setValues({ course: v });
		getLessons(v, courses);
		setResetEditGroup();
	};

	const resetLesson = (v) => {
		setDrillData0([]);
		setDrillData1([]);
		setDrillData2([]);
		setCurrentLessonId(v)
		loadLessonInput(v, userActivityStore.currentCourseEdit.id);
		setDrillDataLoaded(false);
		setResetEditGroup();
	};

	const resetOnUpdate = (v, drillFunction) => {
		drillFunction([]);
		setCurrentLessonId(v)
		loadLessonInput(v, userActivityStore.currentCourseEdit.id);
		setDrillDataLoaded(false);
		setResetEditGroup();
	};



	const loadingImage =
		configLoadingImage.loadingVocabularyImage === false &&
		configLoadingImage.loadingPhraseImage === false &&
		configLoadingImage.loadingGrammarImage === false &&
		configLoadingImage.loadingDrillsImage === false;

	const flashCardModalTextStyling = {
		fontWeight: '650',
		fontSize: '16px',
	};

	return (
		<>
			<style jsx global>{`
				.ant-modal-content {
					margin-bottom: 80px;
				}
			`}</style>
			<style jsx global>
				{ControlUploadTabsStyle}
			</style>
			<form>




				<Row className="tw-mb-[60px]">
					<Col xs={60} sm={20} className="pe-">
						<div className="control-hooks-input position-relative mb-4">
							<Select
								showSearch
								disabled={true} 
								filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
								size="large"
								value={values.course}
								placeholder="Select a course"
								className="w-100"
								onChange={(v) => resetCourse(v)}
							>
								{courses.map((course, index) => (
									<Option key={index} value={course.id} label={course.title}>
										{course.title}
									</Option>
								))}
							</Select>
						</div>







						<div className="control-hooks-group position-relative mb-4">
							<Row justify="center">
								<Col xs={7} className="section-user d-flex align-items-center">
									<Avatar src={user?.profile?.avatarUrl} style={{ width: 40, height: 40 }} className="userImage" />
									<span className="ms-2">{user?.profile?.firstName + ' ' + user?.profile?.lastName}</span>
								</Col>

								<Col xs={17}>
									<Select
										showSearch
										disabled={true} 
										filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
										size="large"
										value={values.lesson}
										placeholder="Select a lesson"
										className="w-100 custom-select"
										onChange={(v) => resetLesson(v)}
									>
										{lessons.map((lesson, index) => (
											<Option key={index} value={lesson.id} label={lesson.title}>
												{lesson.title}
											</Option>
										))}
									</Select>
								</Col>
							</Row>
						</div>

						<Tabs
							activeKey={activeKey}
							onChange={(key) => setActiveKey(key)}
							className="control-hooks-tabs"
							type="card"
						>
							<TabPane tab="Input 1" key="vocabulary">
								<DragAndDrop sourceState={vocabulary} onDragEnd={(result) => onDragEndVocabulary(result, vocabulary)}>
									{({ index, item }) => (
										<>
											<Collapse
												accordion
												expandIconPosition={'left'}
												className="bg-theme-7 mb-3"
												defaultActiveKey={[vocabulary.length]}
												activeKey={activePanelsVocabulary}
												onChange={(key) => setActivePanelsVocabulary([key])}
											>
												<Panel
													header={item.input}
													key={index + 1}
													x
													extra={
														<div className="d-flex align-items-center">
															<div
																className="me-3 d-flex align-items-center"
																onClick={(event) => event.stopPropagation()}
															>
																{configLoadingImage.loadingVocabularyImage === false ? (
																	<VideoCameraFilled className="icon-custom-style" />
																) : (
																	<LoadingOutlined className="icon-custom-style" />
																)}
															</div>
															<div
																className="me-2 d-flex align-items-center"
																onClick={(event) => {
																	Modal.confirm({
																		icon: <ExclamationCircleOutlined />,
																		content: t('dashboard.modal.please_ensure_data'),
																		onOKText: t('dashboard.button.save'),
																		onCancelText: t('dashboard.button.cancel'),
																		onOk() {
																			event.stopPropagation();
																			deleteVocabulary({ index, id: item.id });
																		},
																	});
																}}
															>
																<DeleteFilled className="icon-custom-style" />
															</div>
															<TooltipDragAndDrop title="" />
														</div>
													}
												>
													<div
														className="col-sm focus-visible"
														style={{ marginTop: -15 }}
														spellCheck={false}
														suppressContentEditableWarning={true}
													>
														<Row>
															<Col xs={24}>
																<div className="dialog-line d-flex align-items-center justify-content-between">
																	<Input
																		placeholder="Enter a new input"
																		value={item.input}
																		onChange={({ target: { value } }) => setVocabularyItem({ index, value })}
																		onBlur={() => submitVocabulary(vocabulary, 'vocabulary')}
																	/>
																	{configLoadingImage.loadingVocabularyImage === false ? (
																		<div
																			className="me-3 d-flex align-items-center text-nowrap"
																			onClick={() => {
																				setVisibleMedia(true);
																				setCurrentInput({ ...currentInput, ...item, index: index, type: 'vocabulary' });
																			}}
																		>
																			<PlusCircleFilled className="dialog-line-add" />
																			<span className="ms-2">Add media</span>
																		</div>
																	) : (
																		<div className="me-3 d-flex align-items-center text-nowrap">
																			<LoadingOutlined className="dialog-line-add" />
																		</div>
																	)}
																</div>
															</Col>
														</Row>
														<Row className="mt-2">
															<Col xs={24}>
																<CustomCKEditorCourse
																	placeholder="Enter an explanation for this new input"
																	value={item.explanation}
																	onChange={(value) => setVocabularyExplanation({ index, value })}
																	onBlur={() => submitVocabulary(vocabulary, 'vocabulary')}
																/>
															</Col>
														</Row>
													</div>
												</Panel>
											</Collapse>
										</>
									)}
								</DragAndDrop>

								{configLoadingImage.loadingVocabularyImage === false ? (
									<div
										className="d-flex align-items-center mt-3 new-section"
										style={{ cursor: 'pointer' }}
										onClick={addVocabulary}
									>
										<PlusCircleFilled className="icon-circle-add" style={{ color: '#25A5AA' }} />
										<span className="ms-2">Add new</span>
									</div>
								) : (
									<div className="d-flex align-items-center mt-3 new-section" style={{ cursor: 'pointer' }}>
										<LoadingOutlined className="icon-circle-add" />
										<span className="ms-2">Add new</span>
									</div>
								)}

								<div>
									<DataContext1.Provider value={{ drillData: drillData0, setDrillData: setDrillData0 }}>
										{drillDataLoaded && <DrillItem vocabulary={vocabRef.current} groupNumber={0} />}
									</DataContext1.Provider>
								</div>

								{configLoadingImage.loadingDrillsImage === false ? (
									<div
										onClick={() => {
											setVisibleDrills(true);
											setDrillTab(0);
										}}
										className="d-flex align-items-center mt-3 new-section"
										style={{ cursor: 'pointer' }}
									>
										<SearchOutlined className="icon-circle-add" style={{ color: '#ff9502' }} />
										<span className="ms-2">Add drill</span>
									</div>
								) : (
									<div className="d-flex align-items-center mt-3 new-section" style={{ cursor: 'pointer' }}>
										<LoadingOutlined className="icon-circle-add" />
										<span className="ms-2">Add drill</span>
									</div>
								)}
							</TabPane>

							<TabPane tab="Input 2" key="phrases">
								<DragAndDrop sourceState={phrases} onDragEnd={(result) => onDragEndVocabulary(result, phrases)}>
									{({ index, item }) => (
										<>
											<Collapse
												accordion
												expandIconPosition={'left'}
												className="bg-theme-7 mb-3"
												defaultActiveKey={[phrases.length]}
												activeKey={activePanelsPhrases}
												onChange={(key) => setActivePanelsPhrases([key])}
											>
												<Panel
													header={item.input}
													key={index + 1}
													extra={
														<div className="d-flex align-items-center">
															<div
																className="me-3 d-flex align-items-center"
																onClick={(event) => event.stopPropagation()}
															>
																{configLoadingImage.loadingPhraseImage === false ? (
																	<VideoCameraFilled className="icon-custom-style" />
																) : (
																	<LoadingOutlined className="icon-custom-style" />
																)}
															</div>
															<div
																className="me-2 d-flex align-items-center"
																onClick={(event) => {
																	Modal.confirm({
																		icon: <ExclamationCircleOutlined />,
																		content: t('dashboard.modal.please_ensure_data'),
																		onOKText: t('dashboard.button.save'),
																		onCancelText: t('dashboard.button.cancel'),
																		onOk() {
																			event.stopPropagation();
																			deletePhrases({ index, id: item.id });
																		},
																	});
																}}
															>
																<DeleteFilled className="icon-custom-style" />
															</div>
															<TooltipDragAndDrop title="" />
														</div>
													}
												>
													<div
														className="col-sm focus-visible"
														style={{ marginTop: -15 }}
														spellCheck={false}
														suppressContentEditableWarning={true}
													>
														<Row>
															<Col xs={24}>
																<div className="dialog-line d-flex align-items-center justify-content-between">
																	<Input
																		placeholder="Enter a new input"
																		value={item.input}
																		onChange={({ target: { value } }) => setPhraseItem({ index, value })}
																		onBlur={() => submitVocabulary(phrases, 'phrases')}
																	/>
																	{configLoadingImage.loadingPhraseImage === false ? (
																		<div
																			className="me-3 d-flex align-items-center text-nowrap"
																			onClick={() => {
																				setVisibleMedia(true);
																				setCurrentInput({ ...currentInput, ...item, index: index, type: 'phrases' });
																			}}
																		>
																			<PlusCircleFilled className="dialog-line-add" />
																			<span className="ms-2">Add media</span>
																		</div>
																	) : (
																		<div className="me-3 d-flex align-items-center text-nowrap">
																			<LoadingOutlined className="dialog-line-add" />
																		</div>
																	)}
																</div>
															</Col>
														</Row>
														<Row className="mt-2">
															<Col xs={24}>
																<CustomCKEditorCourse
																	placeholder="Enter an explanation for this new input"
																	value={item.explanation}
																	onChange={(value) => setPhraseExplanation({ index, value })}
																	onBlur={() => submitVocabulary(phrases, 'phrases')}
																/>
															</Col>
														</Row>
													</div>
												</Panel>
											</Collapse>
										</>
									)}
								</DragAndDrop>

								{configLoadingImage.loadingPhraseImage === false ? (
									<div
										className="d-flex align-items-center mt-3 new-section"
										style={{ cursor: 'pointer' }}
										onClick={addPhrase}
									>
										<PlusCircleFilled className="icon-circle-add" style={{ color: '#25A5AA' }} />
										<span className="ms-2">Add new</span>
									</div>
								) : (
									<div className="d-flex align-items-center mt-3 new-section" style={{ cursor: 'pointer' }}>
										<LoadingOutlined className="icon-circle-add" />
										<span className="ms-2">Add new</span>
									</div>
								)}

								<div>
									<DataContext2.Provider value={{ drillData: drillData1, setDrillData: setDrillData1 }}>
										{drillDataLoaded && <DrillItem vocabulary={vocabRef.current} groupNumber={1} />}
									</DataContext2.Provider>
								</div>

								{configLoadingImage.loadingDrillsImage === false ? (
									<div
										onClick={() => {
											setVisibleDrills(true);
											setDrillTab(1);
										}}
										className="d-flex align-items-center mt-3 new-section"
										style={{ cursor: 'pointer' }}
									>
										<SearchOutlined className="icon-circle-add" style={{ color: '#ff9502' }} />
										<span className="ms-2">Add drill</span>
									</div>
								) : (
									<div className="d-flex align-items-center mt-3 new-section" style={{ cursor: 'pointer' }}>
										<LoadingOutlined className="icon-circle-add" />
										<span className="ms-2">Add drill</span>
									</div>
								)}
							</TabPane>

							<TabPane tab="Input 3" key="grammar">
								<DragAndDrop sourceState={grammar} onDragEnd={(result) => onDragEndVocabulary(result, vocabulary)}>
									{({ index, item }) => (
										<>
											<Collapse
												accordion
												expandIconPosition={'left'}
												className="bg-theme-7 mb-3"
												defaultActiveKey={[grammar.length]}
												activeKey={activePanelsGrammar}
												onChange={(key) => setActivePanelsGrammar([key])}
											>
												<Panel
													header={item.input}
													key={index + 1}
													extra={
														<div className="d-flex align-items-center">
															<div
																className="me-3 d-flex align-items-center"
																onClick={(event) => event.stopPropagation()}
															>
																{configLoadingImage.loadingGrammarImage === false ? (
																	<VideoCameraFilled className="icon-custom-style" />
																) : (
																	<LoadingOutlined className="icon-custom-style" />
																)}
															</div>
															<div
																className="me-2 d-flex align-items-center"
																onClick={(event) => {
																	Modal.confirm({
																		icon: <ExclamationCircleOutlined />,
																		content: t('dashboard.modal.please_ensure_data'),
																		onOKText: t('dashboard.button.save'),
																		onCancelText: t('dashboard.button.cancel'),
																		onOk() {
																			event.stopPropagation();
																			deleteGrammar({ index, id: item.id });
																		},
																	});
																}}
															>
																<DeleteFilled className="icon-custom-style" />
															</div>
															<TooltipDragAndDrop title="" />
														</div>
													}
												>
													<div
														className="col-sm focus-visible"
														style={{ marginTop: -15 }}
														spellCheck={false}
														suppressContentEditableWarning={true}
													>
														<Row>
															<Col xs={24}>
																<div className="dialog-line d-flex align-items-center justify-content-between">
																	<Input
																		placeholder="Enter a new input"
																		value={item.input}
																		onChange={({ target: { value } }) => setGrammarItem({ index, value })}
																		onBlur={() => submitVocabulary(grammar, 'grammar')}
																	/>
																	{configLoadingImage.loadingGrammarImage === false ? (
																		<div
																			className="me-3 d-flex align-items-center text-nowrap"
																			onClick={() => {
																				setVisibleMedia(true);
																				setCurrentInput({ ...currentInput, ...item, index: index, type: 'grammar' });
																			}}
																		>
																			<PlusCircleFilled className="dialog-line-add" />
																			<span className="ms-2">Add media</span>
																		</div>
																	) : (
																		<div className="me-3 d-flex align-items-center text-nowrap">
																			<LoadingOutlined className="dialog-line-add" />
																		</div>
																	)}
																</div>
															</Col>
														</Row>
														<Row className="mt-2">
															<Col xs={24}>
																<CustomCKEditorCourse
																	placeholder="Enter an explanation for this new input"
																	value={item.explanation}
																	onChange={(value) => setGrammarExplanation({ index, value })}
																	onBlur={() => submitVocabulary(grammar, 'grammar')}
																/>
															</Col>
														</Row>
													</div>
												</Panel>
											</Collapse>
										</>
									)}
								</DragAndDrop>

								{configLoadingImage.loadingGrammarImage === false ? (
									<div
										className="d-flex align-items-center mt-3 new-section"
										style={{ cursor: 'pointer' }}
										onClick={addGrammar}
									>
										<PlusCircleFilled className="icon-circle-add" style={{ color: '#25A5AA' }} />
										<span className="ms-2">Add new</span>
									</div>
								) : (
									<div className="d-flex align-items-center mt-3 new-section" style={{ cursor: 'pointer' }}>
										<LoadingOutlined className="icon-circle-add" />
										<span className="ms-2">Add new</span>
									</div>
								)}

								<div>
									<DataContext3.Provider value={{ drillData: drillData2, setDrillData: setDrillData2 }}>
										{drillDataLoaded && <DrillItem vocabulary={vocabRef.current} groupNumber={2} />}
									</DataContext3.Provider>
								</div>

								{configLoadingImage.loadingDrillsImage === false ? (
									<div
										onClick={() => {
											setVisibleDrills(true);
											setDrillTab(2);
										}}
										className="d-flex align-items-center mt-3 new-section"
										style={{ cursor: 'pointer' }}
									>
										<SearchOutlined className="icon-circle-add" style={{ color: '#ff9502' }} />
										<span className="ms-2">Add drill</span>
									</div>
								) : (
									<div className="d-flex align-items-center mt-3 new-section" style={{ cursor: 'pointer' }}>
										<LoadingOutlined className="icon-circle-add" />
										<span className="ms-2">Add drill</span>
									</div>
								)}
							</TabPane>

							{/* <TabPane tab="AI data" key="ai">
								{(AIdata || []).map((item, index) => (
									<Collapse
										key={index}
										accordion
										expandIconPosition={'left'}
										className="bg-theme-7 mb-3"
										defaultActiveKey={[AIdata.length]}
										activeKey={activePanelsAI}
										onChange={(key) => setActivePanelsAI([key])}
									>
										<Panel
											header={(dataSource?.characters || []).filter((s) => s.id === item.characterId)?.length ? dataSource?.characters.filter((s) => s.id === item.characterId)[0].name : `Dialogue line ${index + 1}`}
											key={index + 1}
										>
											<div className="col-sm focus-visible">
												<div className='mb-1'>
													<Input
														disabled
														value={item.line}
														placeholder="Enter a line of the lesson dialogue"
													/>
												</div>
												{(item.alternativeAnswers || []).map((subItem, subIndex) => (
													<div key={subIndex} className='section-input-not-required' style={{ marginTop: 15 }}>
														<Input
															onChange={({ target: { value } }) => addAIdataSubLine({ index, subIndex, value })}
															placeholder="Enter a line of the lesson dialogue"
															value={subItem||''}
															suffix={<EnterOutlined />}
															onKeyDown={(e) => (e.keyCode == 13 ? addAISubLine(e, index) :'')}
														/>
													</div>
												))}
											</div> 
											<div className='d-flex align-items-center mt-3 new-section' style={{ cursor: 'pointer' }} onClick={() => addAISubLine({index})}>
												<PlusCircleFilled className="icon-circle-add" style={{ color:'#25A5AA' }} />
												<span className="ms-2">New alternative answer</span>
											</div>
										</Panel>
									</Collapse>
								))}
							</TabPane> */}
						</Tabs>
					</Col>

					{previewCourse === 'desktop' ? (
						<Col xs={24} sm={8}>
							<PreviewLessonInput
								activeKey={activeKey}
								values={{ ...values, drillData0, drillData1, drillData2, vocabulary, phrases, grammar, dialogs }}
							/>
						</Col>
					) : null}

					{previewCourse === 'full' ? (
						<>
							<div
								style={{
									position: 'fixed',
									top: 80,
									left: 0,
									zIndex: 10,
									right: 0,
									'overflow-y': 'auto',
									height: '100vh',
									background: 'white',
								}}
							>
								{Object.keys(valuesPreview).length === 0 ? (
									<div className="tw-max-w-[1024px] tw-mx-auto tw-mt-10 tw-space-y-4">
										<Skeleton active />
										<Skeleton />
										<Skeleton />
									</div>
								) : (
									<NewCourseDetailsWrapper
										isPreviewAdmin
										dataSource={{ allInstructors, languages, levels, tags }}
										values={valuesPreview}
									/>
								)}
								<span
									onClick={() => {
										setPreviewCourse('');
										setValuesPreview({});
									}}
									style={{
										position: 'fixed',
										top: 90,
										left: 30,
										zIndex: 1,
										color: '#A0A0A0',
										fontSize: 30,
										cursor: 'pointer',
									}}
								>
									<CloseCircleFilled />
								</span>
							</div>
						</>
					) : null}
				</Row>

				{previewCourse !== 'full' ? (
					<div
						className="tw-fixed tw-h-[60px] tw-z-[123456789] tw-py-2 tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-items-center tw-justify-center bg-theme-7 tw-space-x-6"
						style={{ boxShadow: '0px -5px 6px #00000029' }}
					>
						<Button
							type="default"
							size="large"
							className="d-flex align-items-center justify-content-center tw-w-[200px]"
							onClick={() => {
								if (activeKey === 'vocabulary') {
									Modal.confirm({
										icon: <ExclamationCircleOutlined />,
										content: 'Are you sure save current data and back to previous step?',
										onOk() {
											router.push(RouterConstants.DASHBOARD_COURSE_LESSON_DIALOGUE.path);
										},
									});
								} else if (activeKey === 'phrases') {
									setActiveKey('vocabulary');
								} else if (activeKey === 'grammar') {
									setActiveKey('phrases');
								}
							}}
						>
							<LeftOutlined />
							<span>Previous</span>
						</Button>

						<Button
							type="default"
							icon={previewCourse ? <EyeInvisibleOutlined /> : <EyeFilled />}
							size="large"
							className="d-flex align-items-center justify-content-center tw-w-[200px]"
							onClick={() => {
								setPreviewCourse(previewCourse ? '' : 'desktop');
							}}
						>
							Preview
						</Button>

						<Button
							onClick={(e) => {
								e.preventDefault();
								submitDrillData(drillData0, drillData1, drillData2);
							}}
							type="primary"
							size="large"
							htmlType="submit"
							loading={uploading || loadingImage === false}
							disabled={loadingSpinning || uploading}
							className="tw-w-[200px]"
						>
							{loadingSpinning ? 'Saving...' : 'Save'}
						</Button>
					</div>
				) : null}
			</form>

			<Modal
				title="Add drills to this input"
				centered
				visible={visibleDrills}
				onCancel={() => setVisibleDrills(false)}
				footer={null}
			>
				<div className="custom-choose">
					<Form onFinish={drillFormOnFinish}>
						<Form.Item name="drills" valuePropName="radio">
							<Radio.Group className="w-100">
								<Space direction="vertical" className="custom-choose-space w-100">
									<Radio value={FLASH_CARD}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn + ' ' + 'me-2'} />
											<span style={flashCardModalTextStyling}>Flashcards</span>
										</div>
									</Radio>
									<Radio value={DRAG_AND_DROP}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn + ' ' + 'me-2'} />
											<span style={flashCardModalTextStyling}>Drag and Drop</span>
										</div>
									</Radio>
									<Radio value={DRAG_THE_WORDS}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn + ' ' + 'me-2'} />
											<span style={flashCardModalTextStyling}>Drag the Words</span>
										</div>
									</Radio>
									<Radio value={MULTIPLE_CHOICES}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn + ' ' + 'me-2'} />
											<span style={flashCardModalTextStyling}>Multiple Choices</span>
										</div>
									</Radio>
									<Radio value={SORT}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn + ' ' + 'me-2'} />
											<span style={flashCardModalTextStyling}>Sort the Paragraph</span>
										</div>
									</Radio>
									<Radio value={LISTEN_AND_FILL_BLANKS}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn + ' ' + 'me-2'} />
											<span style={flashCardModalTextStyling}>Listen and fill in the blanks</span>
										</div>
									</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>
						<Form.Item>
							<Button
								size="large"
								onClick={() => setVisibleDrills(false)}
								htmlType="submit"
								className="button-secondary mt-4 w-100"
								type="primary"
								shape="round"
							>
								Add selected drills
							</Button>
						</Form.Item>
					</Form>
				</div>
			</Modal>

			<Modal
				centered
				visible={visibleMedia}
				onCancel={() => {
					setVisibleMedia(false);
					setCurrentInput({ input: '', explanation: '', image: '', audio: '', video: '', type: '' });
				}}
				footer={null}
			>
				<Tabs className="control-upload-tabs-wrapper" type="card">
					<TabPane tab="Image" key="image-tab">
						<Tabs className="control-upload-tabs" type="card">
							<TabPane tab="From my computer" key="image-tab-1">
								<div className="d-flex flex-column align-items-center justify-content-center">
									{currentInput.image && (currentInput.uploadingImage === false || !currentInput.uploadingImage) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge
												count="X"
												onClick={() => handleInputImageRemove(drillData0, drillData1, drillData2)}
												className="pointer"
											>
												<img src={currentInput.image} style={{ width: '240px' }} />
											</Badge>
										</div>
									) : null}

									<Upload
										className="control-upload-tabs-upload"
										showUploadList={false}
										accept="image/*"
										beforeUpload={() => false}
										onChange={(info) => handleInputImage({ info, drillData0, drillData1, drillData2 })}
									>
										<div className="mt-20">
											{currentInput.uploadingImage ? (
												<Spin />
											) : (
												<div className="control-upload-tabs-placeholder">
													<div className="input-placeholder">
														{currentInput.image &&
														(currentInput.uploadingImage === false || !currentInput.uploadingImage) ? (
															<span className="name">
																<span>{currentInput.image_name}</span>
																<DeleteFilled
																	onClick={() => {
																		Modal.confirm({
																			icon: <ExclamationCircleOutlined />,
																			content: t('dashboard.modal.please_ensure_data'),
																			onOKText: t('dashboard.button.save'),
																			onCancelText: t('dashboard.button.cancel'),
																			onOk() {
																				handleInputImageRemove(drillData0, drillData1, drillData2);
																			},
																		});
																	}}
																	className="icon-custom-style cur-pointer pointer"
																/>
															</span>
														) : (
															<>
																<div>Choose file</div>
																<span>No file chosen</span>
															</>
														)}
													</div>
													<p>Upload an image for this input (max file size 20MB)</p>
												</div>
											)}
										</div>
									</Upload>
								</div>
							</TabPane>
							<TabPane tab="From Mydrive" key="image-tab-2">
								<div className="d-flex flex-column align-items-center justify-content-center mb-20">
									{currentInput.image && (currentInput.uploadingImage === false || !currentInput.uploadingImage) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge
												count="X"
												onClick={() => handleInputImageRemove(drillData0, drillData1, drillData2)}
												className="pointer"
											>
												<img src={currentInput.image} style={{ width: '240px' }} />
											</Badge>
										</div>
									) : null}
								</div>
								<FolderContentMydrive
									fileType="Image"
									onSave={(image, imageConfig) => handleInputImageMyDrive({ image, imageConfig })}
								/>
							</TabPane>
						</Tabs>
					</TabPane>

					<TabPane tab="Audio" key="audio-tab">
						<Tabs className="control-upload-tabs" type="card">
							<TabPane tab="From my computer" key="audio-tab-1">
								<div className="d-flex flex-column align-items-center justify-content-center">
									{currentInput.audio && (currentInput.uploadingAudio === false || !currentInput.uploadingAudio) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge
												count="X"
												onClick={() => handleInputAudioRemove(drillData0, drillData1, drillData2)}
												className="pointer"
											>
												<audio src={currentInput.audio} controls width="100%" height="240px"></audio>
											</Badge>
										</div>
									) : null}

									<Upload
										className="control-upload-tabs-upload"
										showUploadList={false}
										accept="audio/*"
										beforeUpload={() => false}
										onChange={(info) => handleInputAudio({ info, drillData0, drillData1, drillData2 })}
									>
										<div className="mt-20">
											{currentInput.uploadingAudio ? (
												<Spin />
											) : (
												<div className="control-upload-tabs-placeholder">
													<div className="input-placeholder">
														{currentInput.audio &&
														(currentInput.uploadingAudio === false || !currentInput.uploadingAudio) ? (
															<span className="name">
																<span>{currentInput.audio_name}</span>
																<DeleteFilled
																	onClick={() => {
																		Modal.confirm({
																			icon: <ExclamationCircleOutlined />,
																			content: t('dashboard.modal.please_ensure_data'),
																			onOKText: t('dashboard.button.save'),
																			onCancelText: t('dashboard.button.cancel'),
																			onOk() {
																				handleInputAudioRemove(drillData0, drillData1, drillData2);
																			},
																		});
																	}}
																	className="icon-custom-style cur-pointer pointer"
																/>
															</span>
														) : (
															<>
																<div>Choose file</div>
																<span>No file chosen</span>
															</>
														)}
													</div>
													<p>Upload an audio for this input (max file size 20MB)</p>
												</div>
											)}
										</div>
									</Upload>
								</div>
							</TabPane>
							<TabPane tab="From Mydrive" key="audio-tab-2">
								<div className="d-flex flex-column align-items-center justify-content-center mb-20">
									{currentInput.audio && (currentInput.uploadingAudio === false || !currentInput.uploadingAudio) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge
												count="X"
												onClick={() => handleInputAudioRemove(drillData0, drillData1, drillData2)}
												className="pointer"
											>
												<audio src={currentInput.audio} controls width="100%" height="240px"></audio>
											</Badge>
										</div>
									) : null}
								</div>

								<FolderContentMydrive
									fileType="Audio"
									onSave={(audio, audioConfig) => handleInputAudioMyDrive({ audio, audioConfig })}
								/>
							</TabPane>
							<TabPane tab="From AI Library" key="audio-tab-3">
								<div className="d-flex flex-column align-items-center justify-content-center mb-20">
									{currentInput.audio && (currentInput.uploadingAudio === false || !currentInput.uploadingAudio) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge
												count="X"
												onClick={() => handleInputAudioRemove(drillData0, drillData1, drillData2)}
												className="pointer"
											>
												<audio src={currentInput.audio} controls width="100%" height="240px"></audio>
											</Badge>
										</div>
									) : null}
								</div>

								<div className="d-flex flex-column align-items-center justify-content-center">
									<Select
										showSearch
										filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
										placeholder="Language"
										onChange={(v) => voice.loadVoiceList(v)}
										className="w-100 mb-15"
									>
										{voice.voiceLanList.map((language) => (
											<Option key={language.code} value={language.code} label={language.language}>
												{language.language}
											</Option>
										))}
									</Select>
									<Select
										showSearch
										filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
										placeholder="Voice"
										value={voice.currentVoice.voice}
										onChange={(v) => {
											voice.setCurrentVoice({
												...voice.currentVoice,
												voice: voice.voiceList[v].Id,
												languageCode: voice.voiceList[v].LanguageCode,
												engine: voice.voiceList[v].SupportedEngines[0],
											});
										}}
										className="w-100 mb-15"
									>
										{voice.voiceList.map((voice, idx) => (
											<Option key={idx} value={idx} label={voice.Name + ' (' + voice.Gender + ')'}>
												{voice.Name + ' (' + voice.Gender + ')'}
											</Option>
										))}
									</Select>

									{voice.currentVoice.voice !== '' && (
										<Button
											className="generate-audio"
											onClick={() => voice.generateAIAudio(voice.currentVoice, currentInput.index)}
										>
											Generate Audio
										</Button>
									)}
								</div>
							</TabPane>
						</Tabs>
					</TabPane>

					<TabPane tab="Video" key="video-tab">
						<Tabs className="control-upload-tabs" type="card">
							<TabPane tab="From my computer" key="video-tab-1">
								<div className="d-flex flex-column align-items-center justify-content-center">
									{currentInput.video && (currentInput.uploadingVideo === false || !currentInput.uploadingVideo) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge
												count="X"
												onClick={() => handleInputVideoRemove(drillData0, drillData1, drillData2)}
												className="pointer"
											>
												<ReactPlayer
													url={currentInput.video}
													width="100%"
													height="250px"
													controls
													config={{
														file: {
															attributes: {
																controlsList: 'nodownload',
															},
														},
													}}
												/>
											</Badge>
										</div>
									) : null}

									<Upload
										className="control-upload-tabs-upload"
										showUploadList={false}
										accept="video/*"
										beforeUpload={() => false}
										onChange={(info) => handleInputVideo({ info, drillData0, drillData1, drillData2 })}
									>
										<div className="mt-20">
											{currentInput.uploadingVideo ? (
												<Spin />
											) : (
												<div className="control-upload-tabs-placeholder">
													<div className="input-placeholder">
														{currentInput.video &&
														(currentInput.uploadingVideo === false || !currentInput.uploadingVideo) ? (
															<span className="name">
																<span>{currentInput.video_name}</span>
																<DeleteFilled
																	onClick={() => {
																		Modal.confirm({
																			icon: <ExclamationCircleOutlined />,
																			content: t('dashboard.modal.please_ensure_data'),
																			onOKText: t('dashboard.button.save'),
																			onCancelText: t('dashboard.button.cancel'),
																			onOk() {
																				handleInputVideoRemove(drillData0, drillData1, drillData2);
																			},
																		});
																	}}
																	className="icon-custom-style cur-pointer pointer"
																/>
															</span>
														) : (
															<>
																<div>Choose file</div>
																<span>No file chosen</span>
															</>
														)}
													</div>
													<p>Upload a lip-speak video for this input (max file size 20MB)</p>
												</div>
											)}
										</div>
									</Upload>
								</div>
							</TabPane>
							<TabPane tab="From Mydrive" key="video-tab-2">
								<div className="d-flex flex-column align-items-center justify-content-center mb-20">
									{currentInput.video && (currentInput.uploadingVideo === false || !currentInput.uploadingVideo) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge
												count="X"
												onClick={() => handleInputVideoRemove(drillData0, drillData1, drillData2)}
												className="pointer"
											>
												<ReactPlayer
													url={currentInput.video}
													width="100%"
													height="250px"
													controls
													config={{
														file: {
															attributes: {
																controlsList: 'nodownload',
															},
														},
													}}
												/>
											</Badge>
										</div>
									) : null}
								</div>

								<FolderContentMydrive
									fileType="Video"
									onSave={(video, videoConfig) => handleInputVideoMyDrive({ video, videoConfig })}
								/>
							</TabPane>
						</Tabs>
					</TabPane>
				</Tabs>

				<Button
					className="control-upload-tabs-btn"
					type="primary"
					shape="round"
					onClick={() => {
						setVisibleMedia(false);
						setCurrentInput({
							input: '',
							explanation: '',
							image: '',
							image_id: '',
							audio: '',
							audio_id: '',
							video: '',
							video_id: '',
							type: '',
						});
					}}
				>
					Save
				</Button>
			</Modal>
		</>
	);
};

export default LessonInputCreateForm;
