import { CheckSquareOutlined, CloseCircleFilled, DeleteFilled, ExclamationCircleOutlined, EyeOutlined, LoadingOutlined, PlusCircleFilled, PlusOutlined, VideoCameraFilled } from '@ant-design/icons';
import { Badge, Button, Col, Collapse, Form, Input, Modal, Radio, Row, Select, Space, Spin, Tabs, Upload } from 'antd';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { RouterConstants } from '../../../../constants/router';
import { DRAG_AND_DROP, DRAG_THE_WORDS, DataContext1, DataContext2, DataContext3, FLASH_CARD, LISTEN_AND_FILL_BLANKS, MULTIPLE_CHOICES, SORT } from '../../../../src/pages/dashboard/course/lesson/lessonInput';
import FolderContentMydrive from '../../components/folderContent/FolderContentMydrive';
import PreviewLessonInput from '../../components/preview/previewLessonInput';
import { ControlUploadTabsStyle } from '../../styled/ControlUploadTabs.style';
import DragAndDrop, { TooltipDragAndDrop } from '../../tools/DragAndDrop';
import DrillItem from '../../tools/drills/AddDrill/AddDrill';
import checkMarkStyle from '../../tools/drills/Page/DrillPage.module.css';
import { useTranslation } from 'next-i18next';
import CustomCKEditorCourse from '../CustomCKEditorCourse';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;

const MobileLessonInputCreateForm = ({values, setValues, user, courses, lessons, submitDrillData, handleImage, handleImageRemove,
	handleVideo, handleVideoRemove, uploading, vocabulary, phrases, grammar, AIdata, currentInput, setCurrentInput,
	handleInputImage, handleInputVideo, handleInputAudio, handleInputImageRemove, handleInputVideoRemove, handleInputAudioRemove, setGrammarItem,
	getLessons, deleteVocabulary, deletePhrases, deleteGrammar, loadLessonInput, setVocabulary, setPhrases, setGrammar, progress,
	addAIdataSubLine, addAISubLine, image, video, setVocabularyItem, setVocabularyExplanation, setPhraseItem,
	setPhraseExplanation, setGrammarExplanation, setActivePanelsVocabulary, activePanelsVocabulary, activePanelsPhrases, setActivePanelsPhrases, activePanelsGrammar,
	setActivePanelsGrammar, activePanelsAI, setActivePanelsAI, previewCourse, setPreviewCourse, dataSource,
	drillData0, setDrillData0, drillData1, setDrillData1, drillData2, setDrillData2, drillDataLoaded, setDrillDataLoaded, loadingSpinning,
	handleInputImageMyDrive, handleInputAudioMyDrive, handleInputVideoMyDrive, voice, dialogs, configLoadingImage,
	setUpdateEditGroup, setResetEditGroup, valuesErr, setValuesErr
}) => {
	const { t } = useTranslation()
	const [activeKey, setActiveKey] = useState("vocabulary")
	const [visibleMedia, setVisibleMedia] = useState(false)
	const [visibleDrills, setVisibleDrills] = useState(false)
  const [drillCounter0, setDrillCounter0] = useState(0);
  const [drillCounter1, setDrillCounter1] = useState(0);
  const [drillCounter2, setDrillCounter2] = useState(0);
	const [drillTab, setDrillTab] = useState(0);
	

  const filterLevel = (dataSource?.levels || []).filter((s) => s?.id?.toString() === values?.level?.toString())
  const filterLanguage = (dataSource?.languages || []).filter((s) => s?.id?.toString() === values?.language?.toString())

	const drillCounter0Ref = useRef(drillCounter0);
	const drillCounter1Ref = useRef(drillCounter1);
	const drillCounter2Ref = useRef(drillCounter2);
	const vocabRef = useRef([]);

	useEffect(() => {
		drillCounter0Ref.current = drillCounter0;
		drillCounter1Ref.current = drillCounter1;
		drillCounter2Ref.current = drillCounter2;
	}, [drillCounter0, drillCounter1, drillCounter2]);

	useEffect(() => {
		const vocabularyArray = vocabulary.map(({input}) => input)
		vocabRef.current = vocabularyArray;
	}, [vocabulary, phrases, grammar, AIdata])

	const reorder = (list, startIndex, endIndex) => {
		const result = JSON.parse(JSON.stringify(list))
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)
	
		return result
	}

	const genExtra = () => (
		<div className="d-flex align-items-center">
		  <TooltipDragAndDrop title="" />
		</div>
	)

	const onDragEndVocabulary = (result) => {
		if (!result.destination) {
			return
		}

		const items = reorder(vocabulary, result.source.index, result.destination.index)
		if (JSON.stringify(items) !== JSON.stringify(vocabulary)) {
			setVocabulary(items)
			setUpdateEditGroup({ type: 'vocabulary', value: true })
		}
	}

	const onDragEndPhrases = (result) => {
		if (!result.destination) {
			return
		}

		const items = reorder(phrases, result.source.index, result.destination.index)
		if (JSON.stringify(items) !== JSON.stringify(phrases)) {
			setPhrases(items)
			setUpdateEditGroup({ type: 'phrases', value: true })
		}
	}

	const onDragEndGrammar = (result) => {
		if (!result.destination) {
			return
		}

		const items = reorder(grammar, result.source.index, result.destination.index)
		if (JSON.stringify(items) !== JSON.stringify(grammar)) {
			setGrammar(items)
			setUpdateEditGroup({ type: 'grammar', value: true })
		}
	}

  const addNewDrillRow = (drillTab, drillValue) => {
    switch (drillTab) {
			case 0:
				setDrillData0([...drillData0, { drillId: drillCounter0Ref.current + 1, drillType: drillValue }])
				break;
			case 1:
				setDrillData1([...drillData1, { drillId: drillCounter1Ref.current + 1, drillType: drillValue }])
				break;
			case 2:
				setDrillData2([...drillData2, { drillId: drillCounter2Ref.current + 1, drillType: drillValue }])
				break;
		}

		setDrillDataLoaded(true)
		setUpdateEditGroup({ type: 'drills', value: true })
  }

  const addVocabulary = (e) => {
		e.preventDefault()
		let inputList = [...vocabulary]
		inputList.push({ input: '', explanation: '', image: '', audio: '', video: '' })
		setVocabulary(inputList)
		setActivePanelsVocabulary([inputList.length])
		setUpdateEditGroup({ type: 'vocabulary', value: true })
	}

	const addPhrase = (e) => {
		e.preventDefault()
		let inputList = [...phrases]
		inputList.push({ input: '', explanation: '', image: '', audio: '', video: '' })
		setPhrases(inputList)
		setActivePanelsPhrases([inputList.length])
		setUpdateEditGroup({ type: 'phrases', value: true })
	}

	const addGrammar = (e) => {
		e.preventDefault()
		let inputList = [...grammar]
		inputList.push({ input: '', explanation: '', image: '', audio: '', video: '' })
		setGrammar(inputList)
		setActivePanelsGrammar([inputList.length])
		setUpdateEditGroup({ type: 'grammar', value: true })
	}

  const drillFormOnFinish = (e) => {
		if (e.drills) {
			const drillValue = e.drills.target.value;
			addNewDrillRow(drillTab, drillValue);
		} else {
			Modal.error({title: "Select a drill to add"})
		}
  }

	const resetCourse = (v) => {
		setValues({ course: v })
		getLessons(v, courses)
		setDrillData0([])
		setDrillData1([])
		setDrillData2([])
		setResetEditGroup()
	}

	const resetLesson = (v) => {
		loadLessonInput(v)
		setDrillDataLoaded(false)
		setDrillData0([])
		setDrillData1([])
		setDrillData2([])
		setResetEditGroup()
	}

	const loadingImage =
		configLoadingImage.loadingVocabularyImage === false &&
		configLoadingImage.loadingPhraseImage === false &&
		configLoadingImage.loadingGrammarImage === false &&
		configLoadingImage.loadingDrillsImage === false

	const flashCardModalTextStyling = {
		fontWeight: '650',
		fontSize: '16px',
	};

	return (
		<>
      <div className='tw-px-5 tw-pb-2 tw-sticky tw-top-[80px] tw-left-0 tw-right-0 tw-z-50 bg-theme-7'>
        <h4>Add a course</h4>
        <div className='tw-mt-2 tw-flex tw-items-center'>
          <Link href={RouterConstants.DASHBOARD_PREVIEW_COURSE.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px]'>Syllabus</a>
          </Link>
          <Link href={RouterConstants.DASHBOARD_COURSE_LESSON_DIALOGUE.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px]'>Dialogue</a>
          </Link>
          <Link href={RouterConstants.DASHBOARD_COURSE_LESSON_INPUT.path}>
            <a className='tw-flex-1 tw-min-h-[35px] tw-text-center tw-leading-[35px] bg-theme-2 color-theme-7'>Input</a>
          </Link>
        </div>
      </div>

			<form>
				<div className='bg-theme-6 tw-rounded-t-[30px] tw-p-5 tw-mt-5 tw-min-h-[calc(100vh_-_175px)]'>
          <div className='tw-flex tw-items-center tw-justify-between tw-mb-4'>
            <div>
              <b>
								Add inputs and drills
              </b>
            </div>
          </div>

					<Row>
						<Col xs={24}>
							<div className="control-hooks-input position-relative mb-3">
								<Select
									filterOption={(input, option) =>
										(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
									}
									size='large'
									value={values.course}
									placeholder="Select a course"
									className="w-100"
									onChange={(v) => resetCourse(v)}
								>
									{courses.map((course, index) => (
										<Option key={index} value={course.id} label={course.title}>{course.title}</Option>
									))}
								</Select>
							</div>

							<div className="control-hooks-group position-relative mb-3">
								<Select
									filterOption={(input, option) =>
										(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
									}
									size='large'
									value={values.lesson}
									placeholder="Select a lesson"
									className="w-100 custom-select"
									onChange={(v) => resetLesson(v)}
								>
									{lessons.map((lesson, index) => (
										<Option key={index} value={lesson.id} label={lesson.title}>{lesson.title}</Option>
									))}
								</Select>
							</div>

							<Collapse ghost className="control-hooks-collapse mb-4" activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
								<Panel header="Input 1" key="vocabulary">
									<DragAndDrop
										sourceState={vocabulary}
										onDragEnd={onDragEndVocabulary}
									>
										{({ index, item }) => (
											<>
											<Collapse accordion expandIconPosition={'left'} className="bg-theme-7 mb-3" defaultActiveKey={[vocabulary.length]} activeKey={activePanelsVocabulary} onChange={(key) => setActivePanelsVocabulary([key])}>
												<Panel
													header={item.input} key={index+1}
													extra={(
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
																			deleteVocabulary({ index, id: item.id })
																		},
																	})
																}}
															>
																<DeleteFilled className="icon-custom-style" />
															</div>
															<TooltipDragAndDrop title="" />
														</div>
													)}
												>
													<div className="col-sm focus-visible" spellCheck={false} suppressContentEditableWarning={true}>
														<Row>
															<Col xs={24}>
																<div className="dialog-line d-flex align-items-center justify-content-between">
																	<Input
																		placeholder="Enter a new input"
																		value={item.input}
																		onChange={({ target: { value } }) => setVocabularyItem({ index, value })}
																	/>
																	{configLoadingImage.loadingVocabularyImage === false ? (
																		<div
																			className="me-3 d-flex align-items-center text-nowrap"
																			onClick={() => {
																				setVisibleMedia(true);
																				setCurrentInput({ ...currentInput, ...item, index:index, type:'vocabulary' })
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
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }} onClick={addVocabulary}>
											<PlusOutlined />
											<span className="ms-2">Add new</span>
										</div>
									) : (
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<LoadingOutlined />
											<span className="ms-2">Add new</span>
										</div>
									)}

									<div>
										<DataContext1.Provider value={{ drillData: drillData0, setDrillData: setDrillData0 }}>
											{drillDataLoaded && <DrillItem vocabulary={vocabRef.current} groupNumber={0}/>}
										</DataContext1.Provider>
									</div>

									{configLoadingImage.loadingDrillsImage === false ? (
										<div onClick={() => {setVisibleDrills(true); setDrillTab(0);}} className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<PlusOutlined />
											<span className="ms-2">Add drill</span>
										</div>
									) : (
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<LoadingOutlined />
											<span className="ms-2">Add drill</span>
										</div>
									)}
								</Panel>

								<Panel header="Input 2" key="phrases">
									<DragAndDrop
										sourceState={phrases}
										onDragEnd={onDragEndPhrases}
									>
										{({ index, item }) => (
											<>
											<Collapse accordion expandIconPosition={'left'} className="bg-theme-7 mb-3" defaultActiveKey={[phrases.length]} activeKey={activePanelsPhrases} onChange={(key) => setActivePanelsPhrases([key])}>
												<Panel header={item.input} key={index+1}
													extra={(
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
																			deletePhrases({ index, id: item.id })
																		},
																	})
																}}
															>
																<DeleteFilled className="icon-custom-style" />
															</div>
															<TooltipDragAndDrop title="" />
														</div>
													)}
												>
													<div className="col-sm focus-visible" spellCheck={false} suppressContentEditableWarning={true}>
														<Row>
															<Col xs={24}>
																<div className="dialog-line d-flex align-items-center justify-content-between">
																	<Input
																		placeholder="Enter a new input"
																		value={item.input}
																		onChange={({ target: { value } }) => setPhraseItem({ index, value })}
																	/>
																	{configLoadingImage.loadingPhraseImage === false ? (
																		<div
																			className="me-3 d-flex align-items-center text-nowrap"
																			onClick={() => {
																				setVisibleMedia(true);
																				setCurrentInput({ ...currentInput, ...item, index:index, type:'phrases' })
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
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }} onClick={addPhrase}>
											<PlusOutlined />
											<span className="ms-2">Add new</span>
										</div>
									) : (
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<LoadingOutlined />
											<span className="ms-2">Add new</span>
										</div>
									)}

									<div>
										<DataContext2.Provider value={{ drillData: drillData1, setDrillData: setDrillData1 }}>
											{drillDataLoaded && <DrillItem vocabulary={vocabRef.current} groupNumber={1} />}
										</DataContext2.Provider>
									</div>

									{configLoadingImage.loadingDrillsImage === false ? (
										<div onClick={() => {setVisibleDrills(true); setDrillTab(1)}} className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<PlusOutlined />
											<span className="ms-2">Add drill</span>
										</div>
									) : (
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<LoadingOutlined />
											<span className="ms-2">Add drill</span>
										</div>
									)}
								</Panel>

								<Panel header="Input 3" key="grammar">
									<DragAndDrop
										sourceState={grammar}
										onDragEnd={onDragEndGrammar}
									>
										{({ index, item }) => (
											<>
											<Collapse accordion expandIconPosition={'left'} className="bg-theme-7 mb-3" defaultActiveKey={[grammar.length]} activeKey={activePanelsGrammar} onChange={(key) => setActivePanelsGrammar([key])}>
												<Panel header={item.input} key={index+1}
													extra={(
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
																			deleteGrammar({ index, id: item.id })
																		},
																	})
																}}
															>
																<DeleteFilled className="icon-custom-style" />
															</div>
															<TooltipDragAndDrop title="" />
														</div>
													)}
												>
													<div className="col-sm focus-visible" spellCheck={false} suppressContentEditableWarning={true}>
														<Row>
															<Col xs={24}>
																<div className="dialog-line d-flex align-items-center justify-content-between">
																	<Input
																		placeholder="Enter a new input"
																		value={item.input}
																		onChange={({ target: { value } }) => setGrammarItem({ index, value })}
																	/>
																	{configLoadingImage.loadingGrammarImage === false ? (
																		<div
																			className="me-3 d-flex align-items-center text-nowrap"
																			onClick={() => {
																				setVisibleMedia(true);
																				setCurrentInput({ ...currentInput, ...item, index:index, type:'grammar' })
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
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }} onClick={addGrammar}>
											<PlusOutlined />
											<span className="ms-2">Add new</span>
										</div>
									) : (
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<LoadingOutlined />
											<span className="ms-2">Add new</span>
										</div>
									)}

									<div>
										<DataContext3.Provider value={{ drillData: drillData2, setDrillData: setDrillData2 }}>
											{drillDataLoaded && <DrillItem vocabulary={vocabRef.current} groupNumber={2} />}
										</DataContext3.Provider>
									</div>

									{configLoadingImage.loadingDrillsImage === false ? (
										<div onClick={() => {setVisibleDrills(true); setDrillTab(2)}} className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<PlusOutlined />
											<span className="ms-2">Add drill</span>
										</div>
									) : (
										<div className='d-flex align-items-center justify-content-center mt-2 new-section bg-theme-7 tw-py-2 tw-rounded tw-border tw-border-solid border-theme-6' style={{ cursor: 'pointer' }}>
											<LoadingOutlined />
											<span className="ms-2">Add drill</span>
										</div>
									)}
								</Panel>
							</Collapse>

							<div className='tw-flex tw-flex-col tw-space-y-6 tw-w-full'>
								<Button
									onClick={(e) => {
										e.preventDefault();
										submitDrillData(drillData0, drillData1, drillData2)
									}}
									type="primary"
									size="large"
									htmlType="submit"
									loading={uploading || loadingImage === false}
									disabled={loadingSpinning || uploading}
									className='tw-w-full bg-theme-2 border-theme-2 tw-px-10 tw-flex tw-items-center tw-justify-center'
								>
									{loadingSpinning ? "Saving..." : "Publish"}
								</Button>

								<Button
                  type="primary"
                  size="large"
                  htmlType="button"
                  className='tw-w-full bg-theme-2 border-theme-2 tw-px-10 tw-flex tw-items-center tw-justify-center'
                  onClick={() => setPreviewCourse('desktop')}
                >
                  <EyeOutlined />
                  <span>Preview</span>
                </Button>
							</div>
						</Col>

						{previewCourse === 'desktop' ? (
              <>
								<div style={{ position: 'fixed', top: 60,left: 0, zIndex: 100, right: 0, 'overflow-y': 'auto', height: '100vh', background: 'white' }}>
									<PreviewLessonInput
										activeKey={activeKey}
										values={{ ...values, drillData0, drillData1, drillData2, vocabulary, phrases, grammar, dialogs }}
									/>
								</div>
								<span
									onClick={() => setPreviewCourse('')}
									style={{ position: 'fixed', top: 90,left: 30, zIndex: 2223, color: '#A0A0A0', fontSize: 30, cursor: 'pointer' }}
								>
									<CloseCircleFilled />
								</span>
							</>
						) : null}
					</Row>
				</div>
			</form>			

			<Modal title="Add drills to this input" centered visible={visibleDrills} onCancel={()=> setVisibleDrills(false)} footer={null}>
				<div className="custom-choose">
					<Form onFinish={drillFormOnFinish}>
						<Form.Item name="drills" valuePropName='radio' >
							<Radio.Group className='w-100'>
								<Space direction="vertical" className="custom-choose-space w-100">
									<Radio value={FLASH_CARD}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn+" " + "me-2"} />
											<span style={flashCardModalTextStyling}>Flashcards</span>
										</div>
									</Radio>
									<Radio value={DRAG_AND_DROP}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn+" " + "me-2"} />
											<span style={flashCardModalTextStyling}>Drag and Drop</span>
										</div>
									</Radio>
									<Radio value={DRAG_THE_WORDS}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn+" " + "me-2"} />
											<span style={flashCardModalTextStyling}>Drag the Words</span>
										</div>
									</Radio>
									<Radio value={MULTIPLE_CHOICES}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn+" " + "me-2"} />
											<span style={flashCardModalTextStyling}>Multiple Choices</span>
										</div>
									</Radio>
									<Radio value={SORT}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn+" " + "me-2"} />
											<span style={flashCardModalTextStyling}>Sort the Paragraph</span>
										</div>
									</Radio>
									<Radio value={LISTEN_AND_FILL_BLANKS}>
										<div className="d-flex align-items-center">
											<CheckSquareOutlined className={checkMarkStyle.checkMarkBtn+" " + "me-2"} />
											<span style={flashCardModalTextStyling}>Listen and fill in the blanks</span>
										</div>
									</Radio>
								</Space>
							</Radio.Group>
						</Form.Item>
						<Form.Item>
							<Button size='large' onClick={(() => setVisibleDrills(false))} htmlType="submit" className='button-secondary mt-4 w-100' type='primary' shape='round'>Add selected drills</Button>
						</Form.Item>
					</Form>
				</div>
			</Modal>

			<Modal
				centered
				visible={visibleMedia}
				onCancel={()=>{
					setVisibleMedia(false);
					setCurrentInput({input:'',explanation:'',image: '',audio: '',video: '',type:''});
				}}
				footer={null}
			>
				<style jsx global>{ControlUploadTabsStyle}</style>
				<Tabs className="control-upload-tabs-wrapper" type="card">
					<TabPane tab="Image" key="image-tab">
						<Tabs className="control-upload-tabs" type="card">
							<TabPane tab="From my computer" key="image-tab-1">
								<div className="d-flex flex-column align-items-center justify-content-center">
									{currentInput.image && (currentInput.uploadingImage === false || !currentInput.uploadingImage) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge count='X' onClick={() => handleInputImageRemove(drillData0, drillData1, drillData2)} className='pointer'>
												<img src={currentInput.image} style={{ width: '240px' }} />
											</Badge>
										</div>
									) : null}

									<Upload
										className='control-upload-tabs-upload'
										showUploadList={false}
										accept="image/*"
										beforeUpload={() => false}
										onChange={(info) => handleInputImage({ info, drillData0, drillData1, drillData2 })}
									>
										<div className="mt-20">
											{currentInput.uploadingImage ? <Spin /> : (
												<div className="control-upload-tabs-placeholder">
													<div className="input-placeholder">
														{currentInput.image && (currentInput.uploadingImage === false || !currentInput.uploadingImage) ? (
															<span className="name">
																<span>{currentInput.image_name}</span>
																<DeleteFilled onClick={() => {
																	Modal.confirm({
																		icon: <ExclamationCircleOutlined />,
																		content: t('dashboard.modal.please_ensure_data'),
																		onOKText: t('dashboard.button.save'),
																		onCancelText: t('dashboard.button.cancel'),
																		onOk() {
																			handleInputImageRemove(drillData0, drillData1, drillData2)
																		},
																	})
																}} className="icon-custom-style cur-pointer pointer" />
															</span>
														) : (
															<>
																<div>Choose file</div>
																<span>No file chosen</span>
															</>
														)}
													</div>
													<p>
														Upload an image for this input (max file size 20MB)
													</p>
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
											<Badge count='X' onClick={() => handleInputImageRemove(drillData0, drillData1, drillData2)} className='pointer'>
												<img src={currentInput.image} style={{ width: '240px' }} />
											</Badge>
										</div>
									) : null}
								</div>
								<FolderContentMydrive fileType='Image' onSave={(image, imageConfig) => handleInputImageMyDrive({ image, imageConfig })}/>
							</TabPane>
						</Tabs>
					</TabPane>

					<TabPane tab="Audio" key="audio-tab">
						<Tabs className="control-upload-tabs" type="card">
							<TabPane tab="From my computer" key="audio-tab-1">
								<div className="d-flex flex-column align-items-center justify-content-center">
									{currentInput.audio && (currentInput.uploadingAudio === false || !currentInput.uploadingAudio) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge count='X' onClick={() => handleInputAudioRemove(drillData0, drillData1, drillData2)} className='pointer'>
												<audio src={currentInput.audio} controls width='100%' height='240px'></audio>
											</Badge>
										</div>
									) : null}

									<Upload
										className='control-upload-tabs-upload'
										showUploadList={false}
										accept="audio/*"
										beforeUpload={() => false}
										onChange={(info) => handleInputAudio({ info, drillData0, drillData1, drillData2 })}
									>
										<div className="mt-20">
											{currentInput.uploadingAudio ? <Spin /> : (
												<div className="control-upload-tabs-placeholder">
													<div className="input-placeholder">
														{currentInput.audio && (currentInput.uploadingAudio === false || !currentInput.uploadingAudio) ? (
															<span className="name">
																<span>{currentInput.audio_name}</span>
																<DeleteFilled onClick={() => {
																	Modal.confirm({
																		icon: <ExclamationCircleOutlined />,
																		content: t('dashboard.modal.please_ensure_data'),
																		onOKText: t('dashboard.button.save'),
																		onCancelText: t('dashboard.button.cancel'),
																		onOk() {
																			handleInputAudioRemove(drillData0, drillData1, drillData2)
																		},
																	})
																}} className="icon-custom-style cur-pointer pointer" />
															</span>
														) : (
															<>
																<div>Choose file</div>
																<span>No file chosen</span>
															</>
														)}
													</div>
													<p>
														Upload an audio for this input (max file size 20MB)
													</p>
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
											<Badge count='X' onClick={() => handleInputAudioRemove(drillData0, drillData1, drillData2)} className='pointer'>
												<audio src={currentInput.audio} controls width='100%' height='240px'></audio>
											</Badge>
										</div>
									) : null}
								</div>

								<FolderContentMydrive fileType='Audio' onSave={(audio, audioConfig) => handleInputAudioMyDrive({ audio, audioConfig })}/>
							</TabPane>
							<TabPane tab="From AI Library" key="audio-tab-3">
								<div className="d-flex flex-column align-items-center justify-content-center mb-20">
									{currentInput.audio && (currentInput.uploadingAudio === false || !currentInput.uploadingAudio) ? (
										<div className="d-flex align-items-center justify-content-between">
											<Badge count='X' onClick={() => handleInputAudioRemove(drillData0, drillData1, drillData2)} className='pointer'>
												<audio src={currentInput.audio} controls width='100%' height='240px'></audio>
											</Badge>
										</div>
									) : null}
								</div>

								<div className="d-flex flex-column align-items-center justify-content-center">
									<Select
										placeholder="Language"
										onChange={(v) => voice.loadVoiceList(v)}
										className="w-100 mb-15"
									>
										{voice.voiceLanList.map((language) => (
											<Option key={language.code} value={language.code}>{language.language}</Option>
										))}
									</Select>
									<Select
										placeholder="Voice"
										value={voice.currentVoice.voice}
										onChange={(v) => {
											voice.setCurrentVoice({
												...voice.currentVoice,
												voice: voice.voiceList[v].Id,
												languageCode: voice.voiceList[v].LanguageCode,
												engine: voice.voiceList[v].SupportedEngines[0]
											})
										}}
										className="w-100 mb-15"
									>
										{voice.voiceList.map((voice, idx) => (
											<Option key={idx} value={idx} >{voice.Name + ' ('+voice.Gender+')'}</Option>
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
											<Badge count='X' onClick={() => handleInputVideoRemove(drillData0, drillData1, drillData2)} className='pointer'>
												<ReactPlayer
													url={currentInput.video}
													width='100%'
													height='250px'
													controls
													config={{
														file: {
															attributes: {
																controlsList: 'nodownload',
															}
														}
													}}
												/>
											</Badge>
										</div>
									) : null}

									<Upload
										className='control-upload-tabs-upload'
										showUploadList={false}
										accept="video/*"
										beforeUpload={() => false}
										onChange={(info) => handleInputVideo({ info, drillData0, drillData1, drillData2 })}
									>
										<div className="mt-20">
											{currentInput.uploadingVideo ? <Spin /> : (
												<div className="control-upload-tabs-placeholder">
													<div className="input-placeholder">
														{currentInput.video && (currentInput.uploadingVideo === false || !currentInput.uploadingVideo) ? (
															<span className="name">
																<span>{currentInput.video_name}</span>
																<DeleteFilled onClick={() => {
																	Modal.confirm({
																		icon: <ExclamationCircleOutlined />,
																		content: t('dashboard.modal.please_ensure_data'),
																		onOKText: t('dashboard.button.save'),
																		onCancelText: t('dashboard.button.cancel'),
																		onOk() {
																			handleInputVideoRemove(drillData0, drillData1, drillData2)
																		},
																	})
																}} className="icon-custom-style cur-pointer pointer" />
															</span>
														) : (
															<>
																<div>Choose file</div>
																<span>No file chosen</span>
															</>
														)}
													</div>
													<p>
														Upload a lip-speak video for this input (max file size 20MB)
													</p>
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
											<Badge count='X' onClick={() => handleInputVideoRemove(drillData0, drillData1, drillData2)} className='pointer'>
												<ReactPlayer
													url={currentInput.video}
													width='100%'
													height='250px'
													controls
													config={{
														file: {
															attributes: {
																controlsList: 'nodownload',
															}
														}
													}}
												/>
											</Badge>
										</div>
									) : null}
								</div>

								<FolderContentMydrive fileType='Video' onSave={(video, videoConfig) => handleInputVideoMyDrive({ video, videoConfig })}/>
							</TabPane>
						</Tabs>
					</TabPane>
				</Tabs>

				<Button
					className="control-upload-tabs-btn"
					type='primary'
					shape='round'
					onClick={() => {
						setVisibleMedia(false);
						setCurrentInput({ input:'', explanation:'', image: '', image_id: '', audio: '', audio_id: '', video: '', video_id: '', type:'' });
					}}
				>
					Save
				</Button>
			</Modal>
		</>
	)
}

export default MobileLessonInputCreateForm
