import {
	CloseCircleFilled,
	CloudUploadOutlined,
	DeleteFilled,
	EnterOutlined,
	ExclamationCircleOutlined,
	EyeFilled,
	EyeInvisibleOutlined,
	LeftOutlined,
	PlusCircleFilled,
	RightOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Col, Collapse, Dropdown, Input, Menu, Modal, Row, Select, Tabs, Upload } from 'antd';
import { useTranslation } from 'next-i18next';
import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useMobXStores } from '../../../src/stores';
import NewCourseDetailsWrapper from '../../CourseDetails/NewCourseDetailsWrapper';
import AssignTutors from '../components/assignTutors/AssignTutors';
import PreviewCourseMobile from '../components/preview/previewCourseMobile';
import DragAndDrop, { TooltipDragAndDrop } from '../tools/DragAndDrop';
import CustomCKEditorCourse from './CustomCKEditorCourse';
import {
	KanbanContext,
	KanbanDraggable,
	KanbanDraggableContent,
	KanbanDroppable,
	KanbanDroppableContent,
} from '../../Kanban/Kanban';

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const CourseCreateForm = ({
	handleSubmit,
	handleImage,
	values,
	setValues,
	preview,
	previewVideo,
	handleImageRemove,
	handleVideo,
	handleVideoRemove,
	uploading,
	renderInput,
	addLessonTitle,
	updateLessonTitle,
	deleteLessonTitle,
	addSectionTitle,
	deleteSectionTitle,
	lessons,
	setLessons,
	languages,
	handleChangeMedia,
	levels,
	user,
	tags,
	allInstructors,
	previewCourse,
	setPreviewCourse,
	loadingSpinning,
	valuesErr,
	setValuesErr,
	tutors,
	setValueTutorIds,
	courses,
	isEdit,
	setSubmitNext,
	courseList,
	getCourse,
	currentCourseId,
	isNewCreate,
	courseTypes,
	creditValue,
	currency
}) => {
	const { t } = useTranslation();
	const [isShowTitle, setShowTitle] = useState(false);
	const { userStore, userActivityStore } = useMobXStores();
	const [activeKey, setActiveKey] = useState('1');
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [selectedCourseTitle, setSelectedCourseTitle] = useState(null);
	const [courseCreditValue, setCourseCreditValue] = useState(-1);
	const [selectedCourseType, setSelectedCourseType] = useState(values.courseType);

	console.log(`price ${values.price}`)
	console.log(`selectedCourseType ${selectedCourseType}`)
	console.log(`courseTypes ${courseTypes}`)
	console.log(`creditValue ${creditValue}`)
	console.log(`currency ${currency}`)
	console.log(`courseCreditValue ${courseCreditValue}`)

	const buttonRef = useRef(null);

	const reorder = (list, startIndex, endIndex) => {
		const result = JSON.parse(JSON.stringify(list));
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const move = (
		source = [],
		destination = [],
		droppableSource = { index: 0, droppableId: '0' },
		droppableDestination = { index: 0, droppableId: '0' }
	) => {
		const sourceClone = Array.from(source);
		const destClone = Array.from(destination);
		const [removed] = sourceClone.splice(droppableSource.index, 1);

		destClone.splice(droppableDestination.index, 0, removed);

		const result = {};
		result[droppableSource.droppableId] = sourceClone;
		result[droppableDestination.droppableId] = destClone;

		return result;
	};

	const onDragEnd = (result) => {
		const { source, destination } = result;
		const cloneData = JSON.parse(JSON.stringify(lessons));

		if (!destination) {
			return;
		}

		const sInd = +source.droppableId;
		const dInd = +destination.droppableId;

		if (sInd === dInd) {
			const items = reorder(cloneData[sInd].lessons, source.index, destination.index);
			cloneData[sInd].lessons = items;
			setLessons(cloneData);
		} else {
			const resultMove = move(cloneData[sInd].lessons, cloneData[dInd].lessons, source, destination);

			cloneData[sInd].lessons = resultMove[sInd];
			cloneData[dInd].lessons = resultMove[dInd];

			setLessons(cloneData);
		}
	};

	const handleCourseTypeSelection = async (v) => {
		console.log(`handleCourseTypeSelection ${v}`)
		setValues({ ...values, courseType: v });
	}

	const handlePriceChange = async (v) => {
		console.log(`handlePriceChange ${v}`)
		setCourseCreditValue(v)
		setValues({ ...values, price: parseFloat(v)});
	}

	const handleCourseSelection = async (id) => {
		let course = courseList.find((c) => c.id === id);
		console.log(`course title is ${course?.title}`);
		await setSelectedCourseTitle(course?.title);
		if (id && course?.title) {
			userActivityStore.setCurrentCourseEdit({
				id: id,
				title: course.title,
				lessonId: null,
				lessonTitle: null,
			});
		}
	};

	// Function to fetch course list
	const onCourseUpdate = async () => {
		try {
			let course = courseList.find((c) => c.id == currentCourseId);
			await setSelectedCourseTitle(course?.title);
			console.log(`onCourseUpdate  selectedCourse ${selectedCourse}`);
			console.log(`onCourseUpdate  selectedCourseTitle ${selectedCourseTitle}`);
			console.log(`onCourseUpdate  set ${courseList?.length} courses`);
		} catch (error) {
			console.error('Failed to fetch course list:', error);
		}
	};

	// useEffect to fetch data on component mount
	useEffect(() => {
		onCourseUpdate();
	}, [courseList]);

	useEffect(() => {
		setSelectedCourseType(values.courseType);
	}, [values.courseType]);

	useEffect(() => {
		if(!courseCreditValue || courseCreditValue < 0){
			console.log(`price is ${values.price}`)
			setCourseCreditValue(values.price);
		}
		
	}, [values.price]);

	console.log(`courseList in form ${courseList?.length}`);

	const genExtra = (item, index) => (
		<div className="d-flex align-items-center">
			<div
				className="d-flex align-items-center"
				onClick={(event) => {
					Modal.confirm({
						icon: <ExclamationCircleOutlined />,
						content: t('dashboard.modal.please_ensure_data'),
						onOKText: t('dashboard.button.save'),
						onCancelText: t('dashboard.button.cancel'),
						onOk() {
							event.stopPropagation();
							deleteSectionTitle(item, index);
						},
					});
				}}
			>
				<DeleteFilled className="icon-custom-style" />
			</div>
			{/* <TooltipDragAndDrop title="" /> */}
		</div>
	);

	return (
		<>
			<form onSubmit={handleSubmit}>
				<Row className="tw-mb-[60px]">
					<Col xs={24} sm={16} className="md:tw-pr-6">
						<div className="control-hooks-input position-relative mb-4">
							{isNewCreate ? (
								// Render an input box when isNewCreate is true
								<input
									type="text"
									placeholder="Enter course title"
									className="w-100 form-control"
									value={selectedCourseTitle}
									onBlur={(e) => {
										const inputValue = e.target.value;
										console.log(`changing title: ${inputValue}`);
										setSelectedCourseTitle(inputValue);
										setValues({ ...values, title: inputValue });
									}}
								/>
							) : (
								(!isNewCreate || isNewCreate === undefined) &&
								courseList?.length > 0 && (
									// Render the Select component when isNewCreate is false or undefined
									<Select
										showSearch
										disabled={true}
										filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
										size="large"
										placeholder={t('dashboard.placeholder.select_a_course')}
										value={selectedCourseTitle}
										title={''}
										className="w-100"
										onChange={(v) => {
											console.log(`select changing ${v}`);
											setSelectedCourse(v);
											handleCourseSelection(v);
											getCourse(v);
										}}
									>
										{courseList.map((course, index) => (
											<Option key={index} value={course.id} label={course.title}>
												{course.title}
											</Option>
										))}
									</Select>
								)
							)}
						</div>

						<div className="control-hooks-group position-relative mb-4">
							<Row justify="center">
								<Col xs={7} className="section-user d-flex align-items-center">
									<Avatar src={user?.profile?.avatarUrl} style={{ width: 40, height: 40 }} className="userImage" />
									<span className="ms-2">{user?.profile?.firstName + ' ' + user?.profile?.lastName}</span>
								</Col>
								<Col xs={7} className="pe-4">
									<Select
										showSearch
										filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
										mode="multiple"
										required
										size="large"
										value={
											!!values.coInstructors?.find(
												(item) => item.profile.instructorId === userStore.currentUser?.profile?.instructorId
											)
												? []
												: values.coAuthor
										}
										status={valuesErr.coAuthor ? 'error' : ''}
										defaultValue={values.coAuthor || []}
										className="w-100"
										onChange={(v) => {
											setValues({ ...values, coAuthor: v });
											setValuesErr({ ...valuesErr, coAuthor: '' });
										}}
										disabled={
											!!values.coInstructors?.find(
												(item) => item.profile.instructorId === userStore.currentUser?.profile?.instructorId
											)
										}
										placeholder={
											values.coInstructors?.find(
												(item) => item.profile.instructorId === userStore.currentUser?.profile?.instructorId
											)
												? t('dashboard.placeholder.your_are_co_instructor')
												: t('dashboard.placeholder.invite_co_instructor')
										}
									>
										{allInstructors
											.filter((data) => data.profile?.instructorId !== userStore.currentUser?.profile?.instructorId)
											.map((item, index) => (
												<Option
													key={index}
													value={item.id}
													label={item?.profile?.firstName + ' ' + item?.profile?.lastName}
												>
													{item?.profile?.firstName + ' ' + item?.profile?.lastName}
												</Option>
											))}
									</Select>
									{valuesErr.coAuthor ? <span style={{ color: 'red' }}>{valuesErr.coAuthor}</span> : null}
								</Col>
								<Col xs={10} />
							</Row>
						</div>

						<Tabs
							defaultActiveKey={activeKey}
							activeKey={activeKey}
							onChange={(key) => setActiveKey(key)}
							className="control-hooks-tabs"
							type="card"
						>
							<TabPane tab={t('dashboard.title.course_info')} key={'1'}>
								<Collapse defaultActiveKey={['1', '2', '3']}>
									<Panel header={t('dashboard.label.description_with_required')} key="1">
										<CustomCKEditorCourse
											placeholder={t('dashboard.placeholder.description_placeholder')}
											value={values.description}
											onChange={(value) => setValues({ ...values, description: value })}
										/>
									</Panel>
									<Panel header={t('dashboard.label.learning_outcome_with_required')} key="2">
										<CustomCKEditorCourse
											placeholder={t('dashboard.placeholder.learning_outcome_placeholder')}
											value={values.learningOutcome}
											onChange={(value) => setValues({ ...values, learningOutcome: value })}
										/>
									</Panel>
									<Panel header={t('dashboard.label.requirement_with_required')} key="3">
										<CustomCKEditorCourse
											placeholder={t('dashboard.placeholder.requirement_outcome_placeholder')}
											value={values.requirement}
											onChange={(value) => setValues({ ...values, requirement: value })}
										/>
									</Panel>
								</Collapse>
							</TabPane>
							<TabPane tab={t('dashboard.title.lesson_builder')} key={'2'}>
								<KanbanContext onDragEnd={onDragEnd}>
									{lessons.map((item, ind) => (
										<div key={ind}>
											<KanbanDroppable key={ind} droppableId={`${ind}`}>
												{(provided, snapshot) => (
													<KanbanDroppableContent provided={provided} className="tw-bg-white tw-mb-3">
														<Collapse expandIconPosition={'left'} className="bg-theme-7 mb-3" defaultActiveKey={['1']}>
															<Panel header={item.section || `Section ${ind + 1}`} key="1" extra={genExtra(item, ind)}>
																<div
																	className="col-sm focus-visible"
																	contentEditable="true"
																	spellCheck={false}
																	suppressContentEditableWarning={true}
																>
																	<div className="section-input-not-required">
																		<Input
																			defaultValue={item.section}
																			onChange={({ target: { value } }) => addSectionTitle({ index: ind, value })}
																			placeholder={t('dashboard.placeholder.section_title_not_required')}
																		/>
																	</div>
																</div>

																{(item?.lessons || [])?.length ? (
																	<>
																		{item.lessons.map((s, i) => (
																			<KanbanDraggable key={`${i}${ind}`} draggableId={String(`${i}${ind}`)} index={i}>
																				{(providedd, snapshot) => (
																					<KanbanDraggableContent provided={providedd}>
																						<div
																							className="d-flex align-items-center mb-2"
																							style={{
																								backgroundColor: '#ebebeb',
																								padding: '6px 12px',
																								borderRadius: '2px',
																							}}
																						>
																							<TooltipDragAndDrop title="" />
																							<div
																								contentEditable="true"
																								spellCheck={false}
																								suppressContentEditableWarning={true}
																								className="focus-visible flex-fill ms-3"
																							>
																								<div className="d-flex align-items-center">
																									<div className="circle-lesson" />
																									<div className="flex-fill">
																										<Input
																											placeholder="Lesson title"
																											value={s.title}
																											onChange={(e) => updateLessonTitle(e, ind, i)}
																											style={{ border: '0 none', backgroundColor: 'transparent' }}
																										/>
																									</div>
																									<div className="d-flex">
																										<div className="me-3 d-flex align-items-center"></div>
																										<div
																											className="d-flex align-items-center"
																											onClick={() => {
																												Modal.confirm({
																													icon: <ExclamationCircleOutlined />,
																													content: t('dashboard.modal.please_ensure_data'),
																													onOKText: t('dashboard.button.save'),
																													onCancelText: t('dashboard.button.cancel'),
																													onOk() {
																														deleteLessonTitle({ index: ind, subIndex: i, id: s.id });
																													},
																												});
																											}}
																										>
																											<DeleteFilled className="icon-custom-style" />
																										</div>
																									</div>
																								</div>
																							</div>
																						</div>
																					</KanbanDraggableContent>
																				)}
																			</KanbanDraggable>
																		))}
																	</>
																) : (
																	<div className="tw-mt-[10px] bg-theme-7 !tw-px-[10px] !tw-py-[15px] tw-flex !tw-items-center tw-w-full">
																		<div className="tw-min-h-[32px] tw-border tw-border-dashed tw-border-[#ddd] tw-w-full tw-text-center">
																			<p className="tw-mb-0 tw-text-[18px] tw-leading-[32px] tw-color-[#707070]">
																				Drag lesson into here
																			</p>
																		</div>
																	</div>
																)}

																<div className="form-group add-lesson">
																	<div className="add-lesson-top d-flex align-items-center">
																		<div className="active">
																			<span>{t('dashboard.option.lesson')}</span>
																		</div>
																	</div>
																	<div className="add-lesson-group">
																		<Input
																			placeholder={t('dashboard.placeholder.enter_lesson_title')}
																			suffix={<EnterOutlined />}
																			onKeyDown={(e) => (e.keyCode == 13 ? addLessonTitle(e, ind) : '')}
																		/>
																	</div>
																</div>
															</Panel>
														</Collapse>
													</KanbanDroppableContent>
												)}
											</KanbanDroppable>
										</div>
									))}
								</KanbanContext>

								<div
									className="d-flex align-items-center mt-3 ant-input ant-input-lg"
									onClick={renderInput}
									style={{ cursor: 'pointer' }}
								>
									<PlusCircleFilled className="icon-circle-add icon-custom-style" />
									<span className="ms-2">{t('dashboard.button.new_section')}</span>
								</div>
							</TabPane>
							<TabPane tab="Tutors" key={'3'}>
								<AssignTutors initialList={tutors} setValueTutorIds={setValueTutorIds} />
							</TabPane>
						</Tabs>
					</Col>

					{previewCourse === 'mobile' ? (
						<Col xs={24} sm={8}>
							<PreviewCourseMobile
								values={{ ...values, previewVideo, sections: lessons }}
								onSwitchToDesktopView={setPreviewCourse}
							/>
						</Col>
					) : null}
					{previewCourse === 'desktop' ? (
						<Col xs={24} sm={8}>
							{/* <PreviewCourseDesktop values={values} /> */}
							<div
								style={{
									position: 'fixed',
									top: 60,
									left: 0,
									zIndex: 100,
									right: 0,
									'overflow-y': 'auto',
									height: '100vh',
									background: 'white',
								}}
							>
								<NewCourseDetailsWrapper
									isPreviewAdmin
									dataSource={{ allInstructors, languages, levels, tags }}
									values={{ ...values, fieldMedia: { previewVideo: previewVideo }, sections: lessons }}
								/>
							</div>
							<span
								onClick={() => setPreviewCourse('mobile')}
								style={{
									position: 'fixed',
									top: 90,
									left: 30,
									zIndex: 2223,
									color: '#A0A0A0',
									fontSize: 30,
									cursor: 'pointer',
								}}
							>
								<CloseCircleFilled />
							</span>
						</Col>
					) : null}
					{previewCourse === '' ? (
						<Col xs={24} sm={8}>
							<div className="control-hooks-select position-relative mb-4">
								{/* Course tags */}
								<Select
									showSearch
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									mode="multiple"
									placeholder={t('dashboard.option.course_tags')}
									defaultValue={values.tags}
									value={values.tags}
									onChange={(v) => setValues({ ...values, tags: v })}
									tokenSeparators={[,]}
									size="large"
									className="w-100"
								>
									{tags &&
										tags.map((tag, index) => {
											return (
												<Option key={index} value={tag.id} label={tag.name}>
													{tag.name}
												</Option>
											);
										})}
								</Select>
							</div>

							<div className="control-hooks-select position-relative mb-4">
							{selectedCourseType && (
								<Select
									placeholder={t('dashboard.placeholder.course_premium_status')}
									required
									value={selectedCourseType}
									onChange={(v) => {
										handleCourseTypeSelection(v);
									}}
									size="large"
									className="w-100"
									status={ valuesErr.isFree ? 'error' : '' }
								>
									{courseTypes.map((ctype) => (
									<Option key={ctype.value} value={ctype}>
										{t(`dashboard.option.${ctype.toLowerCase()}`)}
									</Option>
									))}
								</Select> )}
							</div>

							<div className="control-hooks-select position-relative mb-4">
								{selectedCourseType === 'PAID' && (
									<div style={{ display: 'flex', alignItems: 'center' }}> {/* Common parent element */}
                    <Input
											size="large"
											type="number"
											value={courseCreditValue}
											onChange={(e) => handlePriceChange(e.target.value)}
											placeholder="Enter price"
                      suffix={<span style={{ marginLeft: '10px' }}>{currency}</span>}
										/>
										
									</div>
								)}
							</div>

							<div className="control-hooks-select position-relative mb-4">
								<Select
									showSearch
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									placeholder={t('dashboard.placeholder.choose_language')}
									required
									defaultValue={values.language}
									value={values.language}
									onChange={(v) => {
										setValues({ ...values, language: v });
										setValuesErr({ ...valuesErr, language: false });
									}}
									tokenSeparators={[,]}
									size="large"
									className="w-100"
									status={valuesErr.language ? 'error' : ''}
								>
									{languages &&
										languages.map((language, index) => {
											return (
												<Option key={index} value={language.id} label={language.name}>
													{language.name}
												</Option>
											);
										})}
								</Select>
							</div>

							<div className="control-hooks-select position-relative mb-4">
								<Select
									showSearch
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									placeholder={t('dashboard.placeholder.choose_level')}
									required
									defaultValue={values.level}
									value={values.level}
									onChange={(v) => {
										setValues({ ...values, level: v });
										setValuesErr({ ...valuesErr, level: false });
									}}
									tokenSeparators={[,]}
									size="large"
									className="w-100"
									status={valuesErr.level ? 'error' : ''}
								>
									{levels &&
										levels.map((level, index) => {
											return (
												<Option key={index} value={level.id} label={level.name}>
													{level.name}
												</Option>
											);
										})}
								</Select>
							</div>

							<div className="control-hooks-upload position-relative mb-4">
								<div className="form-group">
									<span>
										{t('dashboard.label.course_image')} <span className="error-text">*</span>
									</span>
									<div className="form-row mt-2">
										<div className="mt-2">
											{preview ? (
												<Badge count="X" onClick={handleImageRemove} className="pointer tw-w-full">
													<img src={preview} style={{ width: '100%', height: '100%' }} />
												</Badge>
											) : (
												<Upload
													status="error"
													name="avatar"
													listType="picture-card"
													className={`section-uploader [&>.ant-upload]:!tw-mr-0 ${
														valuesErr.previewID ? 'section-uploader-error' : ''
													}`}
													showUploadList={false}
													accept="image/*"
													beforeUpload={() => false}
													onChange={(info) => {
														handleImage(info);
														setValuesErr({ ...valuesErr, previewID: false });
													}}
												>
													<div className="d-flex flex-column w-100">
														<CloudUploadOutlined style={{ fontSize: 30 }} />
														<span className="mt-2 d-bl">{t('dashboard.label.click_here_to_upload_your_file')}</span>
													</div>
												</Upload>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="control-hooks-upload position-relative mb-4">
								<div className="form-group">
									<span>
										{t('dashboard.label.course_video')} <span className="error-text">*</span>
									</span>
									<div className="form-row mt-2">
										<Input
											status={valuesErr.previewVideoID ? 'error' : ''}
											size="medium"
											placeholder={t('dashboard.placeholder.video_url_or_embed_code')}
											name="video"
											onChange={(e) => {
												handleChangeMedia(e);
											}}
										/>
										<div className="mt-3">
											{previewVideo ? (
												<Badge count="X" onClick={handleVideoRemove} className="pointer w-100">
													<div className="d-flex flex-column w-100">
														<ReactPlayer
															url={previewVideo}
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
													</div>
												</Badge>
											) : (
												<Upload
													name="avatar"
													listType="picture-card"
													className={`section-uploader [&>.ant-upload]:!tw-mr-0 ${
														valuesErr.previewVideoID ? 'section-uploader-error' : ''
													}`}
													showUploadList={false}
													beforeUpload={() => false}
													accept="video/*"
													onChange={(info) => {
														handleVideo(info);
														setValuesErr({ ...valuesErr, previewVideoID: false });
													}}
												>
													<div className="d-flex flex-column w-100">
														<CloudUploadOutlined style={{ fontSize: 30 }} />
														<span className="mt-2">{t('dashboard.label.click_here_to_upload_your_file')}</span>
													</div>
												</Upload>
											)}
										</div>
									</div>
								</div>
							</div>
						</Col>
					) : null}
				</Row>

				<div
					className="tw-fixed tw-h-[60px] tw-z-[123456789] tw-py-2 tw-bottom-0 tw-left-0 tw-right-0 tw-flex tw-items-center tw-justify-center bg-theme-7 tw-space-x-6"
					style={{ boxShadow: '0px -5px 6px #00000029' }}
				>
					<Button
						type="default"
						size="large"
						className="d-flex align-items-center justify-content-center tw-w-[200px]"
						onClick={() => {
							if (Number(activeKey) > 1) {
								setActiveKey(String(Number(activeKey) - 1));
							} else {
								// do not anything
							}
						}}
					>
						<LeftOutlined />
						<span>{t('dashboard.button.previous')}</span>
					</Button>

					{!isNewCreate && (
						<Button
							type="default"
							icon={previewCourse ? <EyeInvisibleOutlined /> : <EyeFilled />}
							size="large"
							className="d-flex align-items-center justify-content-center tw-w-[200px]"
							onClick={() => {
								setPreviewCourse(previewCourse ? '' : 'mobile');
							}}
						>
							{t('dashboard.button.preview')}
						</Button>
					)}

					<Button
						ref={buttonRef}
						type="primary"
						size="large"
						htmlType="submit"
						loading={uploading}
						disabled={loadingSpinning || uploading}
						className="tw-w-[200px]"
					>
						{loadingSpinning ? t('dashboard.button.saving') : t('dashboard.button.save')}
					</Button>

					{!isNewCreate && (
						<Button
							type="default"
							size="large"
							className="d-flex align-items-center justify-content-center tw-w-[200px]"
							onClick={() => {
								if (Number(activeKey) < 3) {
									setActiveKey(String(Number(activeKey) + 1));
								} else {
									if (buttonRef?.current) {
										Modal.confirm({
											icon: <ExclamationCircleOutlined />,
											content: t('dashboard.modal.confirm_save_and_continue'),
											onOKText: t('dashboard.button.save'),
											onCancelText: t('dashboard.button.cancel'),
											onOk() {
												setSubmitNext(true);
												setTimeout(() => {
													buttonRef?.current?.click();
												}, 0);
											},
										});
									}
								}
							}}
						>
							<span>{t('dashboard.button.next')}</span>
							<RightOutlined />
						</Button>
					)}
				</div>
			</form>
		</>
	);
};

export default CourseCreateForm;
