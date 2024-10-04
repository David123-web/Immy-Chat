import {
	CloudUploadOutlined,
	DeleteFilled,
	ExclamationCircleOutlined,
	LeftOutlined,
	LoadingOutlined,
	PlusCircleFilled,
	PlusOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Col, Collapse, Input, Modal, Row, Select, Spin, Tabs, Upload } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import { RouterConstants } from '../../../constants/router';
import { uploadFile } from '../../../src/services/files/apiFiles';
import { beforeUploadAvatar } from '../../../src/utilities/helper';
import FolderContentMydrive from '../components/folderContent/FolderContentMydrive';
import { ControlUploadTabsStyle } from '../styled/ControlUploadTabs.style';
import DragAndDrop, { TooltipDragAndDrop } from '../tools/DragAndDrop';
import CustomCKEditorCourse from './CustomCKEditorCourse';
import DialogTypeSwitch from '../components/dialogTypeSwitch/DialogTypeSwitch';
import { useMobXStores } from '@/src/stores';

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const DialogLessonCreateForm = ({ dataSource, myValue, actions }) => {
	const { t } = useTranslation();
	const router = useRouter();
	const [activeKey, setActiveKey] = useState('1');
	const buttonRef = useRef(null);
	const [activePanels, setActivePanels] = useState([0]);
	const [currentCourseId, setCurrentCourseId] = useState('');
	const [currentLessonId, setCurrentLessonId] = useState('');
	const [currentIndexDialog, setCurrentIndexDialog] = useState();
	const [currentDialogLineId, setCurrentDialogLineId] = useState('');
	const [currentDialogImageUrl, setCurrentDialogImageUrl] = useState('');
	const filterLevel = (dataSource?.levels || []).filter(
		(s) => s?.id?.toString() === myValue?.values?.level?.toString()
	);

	const { userActivityStore } = useMobXStores();
	console.log(`courses count ${myValue.courses.length}`);
	console.log(`myValue.values.course ${myValue.values.course}`);
	console.log(`currentCourseId ${currentCourseId}`);
	console.log(`store val ${JSON.stringify(userActivityStore.currentCourseEdit)}`);
	console.log(`myvalue.dialog ${JSON.stringify(myValue.dialog, null, 3)}`);
	console.log(`imageUrlOriginal ${JSON.stringify(imageUrlOriginal, null, 3)}`);
	console.log(`listImageSlideDialog ${JSON.stringify(myValue?.listImageSlideDialog, null, 3)}`);

	const filterLanguage = (dataSource?.languages || []).filter(
		(s) => s?.id?.toString() === myValue?.values?.language?.toString()
	);

	useEffect(() => {
		if (currentCourseId) {
			if (!myValue.values.course) {
				actions.setValues({
					...myValue.lessonDetail,
					...myValue.values,
					course: currentCourseId,
				});
			}
		}
	}, [myValue.values.course]);

	useEffect(() => {
		console.log('--- dialogform useeffect');

		if (myValue.courses.length > 0) {
			let courseId = userActivityStore.currentCourseEdit.id;
			let course = myValue.courses.find((c) => c.id === courseId);

			if (course && course.id !== currentCourseId) {
				console.log(`--- getting Lessons for ${course.id}`);
				actions.getLessons(course.id).then((lessonId) => {
					setCurrentCourseId(courseId);
					actions.loadDialog(lessonId);
					actions.setValues({
						...myValue.lessonDetail,
						...myValue.values,
						course: courseId,
						lesson: '',
					});
					if (!userActivityStore.currentCourseEdit.lessonId) {
						userActivityStore.setCurrentCourseEdit({
							id: userActivityStore.currentCourseEdit.id,
							title: userActivityStore.currentCourseEdit.title,
							lessonId: lessonId,
							lessonTitle: '',
						});
					}
				});
			}
		}
	}, [myValue.courses]);

	useEffect(() => {
		if (router.query.courseId && myValue.courses.length > 0) {
			actions.setValues({
				course: Number(router.query.courseId),
				lesson: '',
			});

			actions.getLessons(Number(router.query.courseId));
		}
	}, [router.query.courseId, myValue.courses]);

	const reorder = (list, startIndex, endIndex) => {
		const result = JSON.parse(JSON.stringify(list));
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
		const items = reorder(myValue.dialog, result.source.index, result.destination.index);
		if (JSON.stringify(items) !== JSON.stringify(myValue.dialog)) {
			actions.setDialog(items);
		}
	};

	const genExtra = ({ index, id }) => (
		<div className="d-flex align-items-center">
			<div
				className="me-3 d-flex align-items-center"
				onClick={(event) => {
					Modal.confirm({
						icon: <ExclamationCircleOutlined />,
						content: t('dashboard.modal.please_ensure_data'),
						onOKText: t('dashboard.button.save'),
						onCancelText: t('dashboard.button.cancel'),
						onOk() {
							event.stopPropagation();
							actions.deleteDialog({ index, id });
						},
					});
				}}
			>
				<DeleteFilled className="icon-custom-style" />
			</div>
			<TooltipDragAndDrop title="" />
		</div>
	);

	const handleChara = (e) => {
		actions.setNewChara({
			...myValue.newChara,
			[e.target.name]: e.target.value,
		});
	};

	const addDialog = () => {
		let list = [...myValue.dialog];
		list.push({ name: '', line: '', audio: undefined });
		actions.setDialog(list);
		setActivePanels([list.length]);
	};

	const [imageUrlOriginal, setImageUrlOriginal] = useState('');
	const [uploadingImage, setUploadingImage] = useState(false);

	const UploadButton = (props) => {
		const { loading } = props;
		return (
			<div>
				{loading ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Upload</div>
			</div>
		);
	};

	const onCourseChange = (v) => {
		let course = myValue.courses.find((c) => c.id === v);
		if (course) {
			userActivityStore.setCurrentCourseEdit({
				id: v,
				title: course.title,
				lessonId: null,
				lessonTitle: null,
			});
		}
	};

	const getImageUrl = () => {
		console.log('getImageUrl');
		console.log(`currentDialogLineId ${currentDialogLineId}`);
		const url = myValue.listImageSlideDialog.find(
			(line) => line.dialogLineId.toString() === currentDialogLineId.toString()
		);
		console.log(`got image ${url}`);
		return url;
	};

	const onLessonChange = async (v) => {
		let saved = await actions.handleSubmit();

		if (saved) {
			let lesson = myValue.lessons.find((c) => c.id === v);
			myValue = {};

			if (lesson) {
				setCurrentLessonId(v);
				userActivityStore.setCurrentCourseEdit({
					id: userActivityStore.currentCourseEdit.id,
					title: userActivityStore.currentCourseEdit.title,
					lessonId: v,
					lessonTitle: lesson.title,
				});
			}

			actions.loadDialog(v);
		} else {
			actions.setValues({ ...myValue.values, lesson: currentLessonId });
			setCurrentLessonId(currentLessonId);
		}
	};

	const completeDialogLine = (v, index) => {
		console.log(`completeDialogLine ${v}  idx: ${index}`);
		actions.setDialogLine(index, v);
		console.log('completed');
	};

	const handleUploadImage = async (info) => {
		console.log(`handleUploadImage info ${JSON.stringify(info, null, 2)}`);
		console.log(`handleUploadImage imageUrlOriginal ${JSON.stringify(imageUrlOriginal, null, 2)}`);
		console.log(
			`handleUploadImage myValue.listImageSlideDialog ${JSON.stringify(
				myValue.listImageSlideDialog[currentIndexDialog],
				null,
				2
			)}`
		);

		setImageUrlOriginal(null);
		if (info.file.status === 'uploading') {
			setUploadingImage(true);
			return;
		}

		if (info.file.originFileObj) {
			console.log(`handleUploadImage making form `);
			const formData = new FormData();
			formData.append('file', info.file.originFileObj);
			formData.append('public', 'false');

			try {
				console.log(`handleUploadImage uploading file`);
				const response = await uploadFile(formData);
				console.log(`handleUploadImage response ${JSON.stringify(response, null, 2)}`);
				if (response) {
					setImageUrlOriginal({
						id: response.data.id,
						url: response.data.s3Location,
					});
					setCurrentDialogImageUrl(response.data.s3Location);
					console.log(`handleUploadImage setCurrentDialogImageUrl ${currentDialogImageUrl}`);
					actions.setListImageSlideDialog((prev) => {
							const indexExist = prev.findIndex((e) => e.index === currentIndexDialog);
								if (indexExist !== -1) {
									prev[indexExist].imageId = response.data.id;
									prev[indexExist].imageUrl = response.data.s3Location;
									return prev;
								} else {
								return [
									...prev,
									{
										index: currentIndexDialog,
										imageId: response.data.id,
										imageUrl: response.data.s3Location,
										dialogLineId: currentDialogLineId,
									},
								];
							}
						});
						console.log(` handleUploadImage updated ${JSON.stringify(myValue.listImageSlideDialog, null, 3)}`)
				}
			} catch (error) {
				toast.error(error.data?.message || 'Upload image failed!');
				console.log(`ERROR ${error.message} ${JSON.stringify(error, null, 2)}`)
			} finally {
				setUploadingImage(false);
			}
		}
	};

	return (
		<>
			<form onSubmit={actions.handleSubmit}>
				<Row className="tw-mb-[60px]">
					<Col xs={24} sm={16} className="pe-4">
						<div className="control-hooks-input position-relative mb-4">
							{myValue.values.course && (
								<Select
									showSearch
									disabled={true}
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									size="large"
									value={myValue.values.course}
									placeholder={t('dashboard.placeholder.select_a_course')}
									className="w-100"
									onChange={(v) => {
										actions.setValues({
											...myValue.values,
											course: v,
											lesson: '',
										});
										onCourseChange(v);
										actions.getLessons(v, myValue.courses);
									}}
								>
									{myValue.courses.map((course, index) => (
										<Option key={index} value={course.id} label={course.title}>
											{course.title}
										</Option>
									))}
								</Select>
							)}
						</div>

						<div className="control-hooks-group position-relative mb-4">
							<Row justify="center">
								<Col xs={7} className="section-user d-flex align-items-center">
									<Avatar
										src={myValue.user?.profile?.avatarUrl}
										style={{ width: 40, height: 40 }}
										className="userImage"
									/>
									<span className="ms-2">
										{myValue.user?.profile?.firstName + ' ' + myValue.user?.profile?.lastName}
									</span>
								</Col>

								<Col xs={17}>
									{myValue.values.lesson && (
										<Select
											showSearch
											filterOption={(input, option) =>
												(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
											}
											size="large"
											value={myValue.values.lesson}
											placeholder={t('dashboard.placeholder.select_a_lesson')}
											className="w-100 custom-select"
											onChange={(v) => {
												onLessonChange(v);
											}}
										>
											{myValue.lessons.map((lesson, index) => (
												<Option key={index} value={lesson.id} label={lesson.title}>
													{lesson.title}
												</Option>
											))}
										</Select>
									)}
								</Col>
							</Row>
						</div>

						<Tabs
							defaultActiveKey={activeKey}
							activeKey={activeKey}
							onChange={(key) => setActiveKey(key)}
							className="control-hooks-tabs tw-relative"
							type="card"
						>
							<TabPane tab={t('dashboard.label.dialog_info')} key="1">
								<Collapse defaultActiveKey={['1', '2']}>
									<Panel
										header={
											<span>
												<span>
													{t('dashboard.label.dialog_introduction')} <span className="error-text">*</span>
												</span>
											</span>
										}
										key="2"
									>
										<CustomCKEditorCourse
											placeholder={t('dashboard.placeholder.dialog_example_course_introduction')}
											value={myValue.values.introduction}
											onChange={(value) => {
												actions.setValues({
													...myValue.values,
													introduction: value,
												});
											}}
										/>
									</Panel>
									<Panel
										header={
											<span>
												{t('dashboard.label.dialog_content')} <span className="error-text">*</span>
											</span>
										}
										key="1"
										className="tw-relative"
									>
										<CustomCKEditorCourse
											placeholder={t('dashboard.placeholder.dialog_example_course')}
											value={myValue.values.context}
											onChange={(value) => actions.setValues({ ...myValue.values, context: value })}
										/>
										<div
											className="me-3 d-flex align-items-center text-nowrap tw-cursor-pointer tw-absolute tw-right-0 tw-top-4"
											onClick={() => {
												actions.setVisibleAddAudio(true);
												actions.setIsUploadAudioContextForSlide(true);
											}}
										>
											<PlusCircleFilled className="dialog-line-add" />
											<span className="ms-2">{t('dashboard.button.add_media')}</span>
										</div>
									</Panel>
								</Collapse>
							</TabPane>

							<TabPane tab={t('dashboard.label.dialog_builder')} key="2">
								<DragAndDrop sourceState={myValue.dialog} onDragEnd={onDragEnd}>
									{({ index, item }) => (
										<>
											<Collapse
												expandIconPosition={'left'}
												className="bg-theme-7 mb-3"
												defaultActiveKey={[myValue.dialog.length]}
												activeKey={activePanels}
												onChange={(key) => setActivePanels(key)}
											>
												<Panel
													header={
														myValue &&
														myValue.characters &&
														myValue.characters.filter((s) => s.id === item.characterId)?.length
															? myValue.characters.filter((s) => s.id === item.characterId)[0].name
															: ''
													}
													key={item.id}
													extra={genExtra({ index, id: item.id })}
												>
													<Row>
														<Col xs={24}>
															<div className="control-hooks-select position-relative">
																<Select
																	showSearch
																	filterOption={(input, option) =>
																		(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
																	}
																	placeholder={t('dashboard.placeholder.select_or_create_a_character')}
																	value={item.characterId}
																	onChange={(value) => {
																		actions.setDialogChara({ index, value });
																	}}
																	tokenSeparators={[,]}
																	size="large"
																	className="w-100"
																>
																	{myValue &&
																		myValue.characters &&
																		myValue.characters.map((chara, idx) => (
																			<Option key={idx} value={chara.id} label={chara.name}>
																				{chara.name}
																			</Option>
																		))}
																</Select>
																<a
																	className="btn"
																	onClick={() => {
																		actions.setVisibleCharacter(true);
																		actions.setNewChara({ index: index });
																	}}
																>
																	<PlusCircleFilled className="icon-custom-style icon-circle-add" />
																</a>
															</div>
														</Col>
													</Row>
													<Row className="mt-2">
														<Col xs={24}>
															<div className="dialog-line d-flex align-items-center justify-content-between">
																<Input
																	placeholder={t('dashboard.label.dialog_line')}
																	value={item.line}
																	onChange={(e) => completeDialogLine(e.target.value, index)}
																/>
																{item.audio ? (
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
																					actions.handleRemoveAudio({ index });
																				},
																			});
																		}}
																	>
																		<DeleteFilled className="icon-custom-style" />
																	</div>
																) : null}
																<div
																	className="me-3 d-flex align-items-center text-nowrap"
																	onClick={() => {
																		actions.setNewChara({ index: index });
																		actions.setVisibleAddAudio(true);
																		setCurrentIndexDialog(index);
																		setCurrentDialogLineId(item.id);
																		setCurrentDialogImageUrl(item.image);
																	}}
																>
																	<PlusCircleFilled className="dialog-line-add" />
																	<span className="ms-2">{t('dashboard.button.add_media')}</span>
																</div>
															</div>
															{item.audio && (
																<div className="dialog-line d-flex align-items-center justify-content-between">
																	<audio src={item.audio} controls></audio>
																</div>
															)}
														</Col>
													</Row>
												</Panel>
											</Collapse>
										</>
									)}
								</DragAndDrop>

								<div
									className="d-flex align-items-center mt-3 new-section"
									style={{ cursor: 'pointer', textAlign: 'center' }}
									onClick={() => addDialog()}
								>
									<PlusCircleFilled className="icon-circle-add" style={{ color: '#25A5AA' }} />
									<span className="ms-2">{t('dashboard.button.add_to_dialog')}</span>
								</div>
							</TabPane>
						</Tabs>
					</Col>

					<Col xs={24} sm={8}>
						<div className="control-hooks-select position-relative mb-4">
							<Input
								value={filterLanguage.length ? filterLanguage[0].name : undefined}
								size="large"
								disabled
								className="w-100"
							/>
						</div>

						<div className="control-hooks-select position-relative mb-4">
							<Input
								value={filterLevel.length ? filterLevel[0].name : undefined}
								size="large"
								disabled
								className="w-100"
							/>
						</div>

						<div className="control-hooks-upload position-relative mb-4">
							<div className="form-group">
								<span>
									{t('dashboard.label.lesson_video')}{' '}
									{myValue.showSlideOrVideo.isShowVideo ? <span className="error-text">*</span> : null}
								</span>
								<div className="form-row mt-2">
									<Input
										status={myValue.valuesErr.previewVideoID ? 'error' : ''}
										size="medium"
										placeholder={t('dashboard.placeholder.video_url_or_embed_code')}
										name="video"
										onChange={(e) => actions.handleChangeMedia(e)}
									/>
									<div className="mt-3">
										{myValue.video ? (
											<Badge count="X" onClick={actions.handleVideoRemove} className="pointer w-100">
												<div className="d-flex flex-column w-100">
													<ReactPlayer
														url={myValue.video}
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
													myValue.valuesErr.previewVideoID ? 'section-uploader-error' : ''
												}`}
												showUploadList={false}
												beforeUpload={() => false}
												accept="video/*"
												onChange={(info) => {
													actions.handleVideo(info);
													actions.setValuesErr({ ...myValue.valuesErr, previewVideoID: false });
												}}
											>
												<div className="d-flex flex-column w-100">
													<>
														<CloudUploadOutlined style={{ fontSize: 30 }} />
														<span className="mt-2">{t('dashboard.label.click_here_to_upload_your_file')}</span>
													</>
												</div>
											</Upload>
										)}
									</div>
								</div>
								<div>
									<DialogTypeSwitch value={myValue.showSlideOrVideo} setValue={actions.setShowSlideOrVideo} />
								</div>
							</div>
						</div>
					</Col>
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
								if (buttonRef?.current) {
									Modal.confirm({
										icon: <ExclamationCircleOutlined />,
										content: t('dashboard.modal.are_you_sure_save_current_data'),
										onOk() {
											router.push(RouterConstants.DASHBOARD_PREVIEW_COURSE.path);
										},
									});
								}
							}
						}}
					>
						<LeftOutlined />
						<span>{t('dashboard.button.previous')}</span>
					</Button>

					<Button
						ref={buttonRef}
						type="primary"
						size="large"
						htmlType="submit"
						onClick={(e) => {
							e.preventDefault();
							actions.handleSubmit(e);
						}}
						loading={myValue.uploading}
						disabled={myValue.loadingSpinning || myValue.uploading}
						className="tw-w-[200px]"
					>
						{myValue.loadingSpinning ? t('dashboard.button.saving') : t('dashboard.button.save')}
					</Button>

					<Button
						type="default"
						size="large"
						className="d-flex align-items-center justify-content-center tw-w-[200px]"
						onClick={() => {
							if (Number(activeKey) < 2) {
								setActiveKey(String(Number(activeKey) + 1));
							} else {
								if (buttonRef?.current) {
									Modal.confirm({
										icon: <ExclamationCircleOutlined />,
										content: t('This button will not save. Do you want to move on?'),
										onOKText: t('dashboard.button.save'),
										onCancelText: t('dashboard.button.cancel'),
										onOk() {
											actions.setSubmitNext(true);
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
				</div>
			</form>

			<Modal
				title={t('dashboard.modal.create_a_new_character')}
				centered
				visible={myValue.visibleCharacter}
				onCancel={() => actions.setVisibleCharacter(false)}
				footer={null}
			>
				<div
					className="col-sm focus-visible"
					style={{ marginTop: -15 }}
					contentEditable="true"
					spellCheck={false}
					suppressContentEditableWarning={true}
				>
					<Row>
						<Col xs={24}>
							<Input
								placeholder={t('dashboard.placeholder.name_of_the_character')}
								name="name"
								value={myValue.newChara.name}
								onChange={(v) => handleChara(v)}
							/>
						</Col>
					</Row>
					<Row gutter={[8, 0]} className="mt-2">
						<Col xs={8}>
							<Input
								placeholder={t('dashboard.placeholder.age')}
								name="age"
								value={myValue.newChara.age}
								onChange={(v) => handleChara(v)}
							/>
						</Col>
						<Col xs={8}>
							<Select
								placeholder={t('dashboard.placeholder.gender')}
								value={myValue.newChara.gender}
								onChange={(v) => actions.setNewChara({ ...myValue.newChara, gender: v })}
								className="w-100"
							>
								<Option value="MALE">{t('dashboard.option.male')}</Option>
								<Option value="FEMALE">{t('dashboard.option.female')}</Option>
								<Option value="OTHER">{t('dashboard.option.other')}</Option>
							</Select>
						</Col>
						<Col xs={8}>
							<Input
								placeholder={t('dashboard.placeholder.occupation')}
								name="occupation"
								value={myValue.newChara.occupation}
								onChange={(v) => handleChara(v)}
							/>
						</Col>
					</Row>
					<Button
						type="primary"
						size="large"
						style={{
							border: 'none',
							width: 200,
							marginTop: 15,
						}}
						className="w-100 bg-theme-5"
						onClick={actions.addCharacter}
					>
						{t('dashboard.button.add_character')}
					</Button>
				</div>
			</Modal>

			<Modal
				title={t('dashboard.button.add_audio')}
				centered
				visible={myValue.visibleAddAudio}
				onCancel={() => {
					actions.setVisibleAddAudio(false);
					actions.setNewChara({
						...myValue.newChara,
						index: undefined,
					});
					setImageUrlOriginal(null);
					actions.setIsUploadAudioContextForSlide(false);
				}}
				footer={null}
			>







			
				{/* image */}
				<Tabs className="tab-upload-audio" type="card">
					{!myValue.isUploadAudioContextForSlide && (
						<TabPane tab="Image" key="10">
							<style jsx global>
								{ControlUploadTabsStyle}
							</style>
							<Tabs className="control-upload-tabs" type="card">
								<TabPane tab={t('dashboard.label.from_my_computer')} key="1" className="tw-text-center">
									<Upload
										name="avatar"
										listType="picture-card"
										className="avatar-uploader"
										showUploadList={false}
										beforeUpload={(file) => beforeUploadAvatar(file)}
										onChange={handleUploadImage}
										accept="image/*"
									>
										{!uploadingImage &&
										(currentDialogImageUrl ||
											(myValue.listImageSlideDialog &&
												myValue.listImageSlideDialog.length > 0 &&
												!!myValue.listImageSlideDialog[currentIndexDialog]?.imageUrl)) ? (
											<img
												src={currentDialogImageUrl}
												alt="avatar"
												style={{ objectFit: 'contain' }}
												className="tw-w-full tw-h-full"
											/>
										) : (
											<UploadButton loading={uploadingImage} />
										)}
									</Upload>
									<p>{t('dashboard.label.upload_image_for_this_input')}</p>
								</TabPane>
								<TabPane tab={t('dashboard.label.from_my_drive')} key="2">
									<FolderContentMydrive
										fileType="Image"
										getSelectedFile={(file) => {
											setImageUrlOriginal({
												id: file.id,
												url: '',
											});
										}}
									/>
								</TabPane>
							</Tabs>
						</TabPane>
					)}

					{/* audio */}
					<TabPane tab="Audio" key="20">
						<style jsx global>
							{ControlUploadTabsStyle}
						</style>
						<Tabs className="control-upload-tabs" type="card">
							<TabPane tab={t('dashboard.label.from_my_computer')} key="1">
								<>
									<div className="d-flex flex-column align-items-center justify-content-center">
										{myValue.isUploadAudioContextForSlide ? (
											myValue.audioContext.current.id ? (
												<div className="d-flex align-items-center justify-content-between">
													<audio src={myValue.audioContext.current.audio} controls></audio>
												</div>
											) : null
										) : myValue?.newChara?.index >= 0 &&
										  myValue.dialog[myValue?.newChara?.index].audio &&
										  (myValue.uploading === false || !myValue.uploading) ? (
											<div className="d-flex align-items-center justify-content-between">
												<audio src={myValue.dialog[myValue?.newChara?.index].audio} controls></audio>
											</div>
										) : null}

										<Upload
											className="control-upload-tabs-upload"
											showUploadList={false}
											accept="audio/*"
											beforeUpload={() => false}
											onChange={({ fileList }) => actions.handleAudio({ fileList })}
										>
											<div className="mt-20">
												{myValue.uploading ? (
													<Spin />
												) : (
													<div className="control-upload-tabs-placeholder">
														<div className="input-placeholder">
															{myValue.isUploadAudioContextForSlide ? (
																myValue.audioContext.current.id ? (
																	<span className="name">{myValue.audioContext.current.name}</span>
																) : (
																	<>
																		<div>{t('dashboard.label.choose_file')}</div>
																		<span>{t('dashboard.label.no_choose_file')}</span>
																	</>
																)
															) : myValue?.newChara?.index >= 0 &&
															  myValue.dialog[myValue?.newChara?.index].audio &&
															  (myValue.uploading === false || !myValue.uploading) ? (
																<span className="name">{myValue.dialog[myValue?.newChara?.index].audio_name}</span>
															) : (
																<>
																	<div>{t('dashboard.label.choose_file')}</div>
																	<span>{t('dashboard.label.no_choose_file')}</span>
																</>
															)}
														</div>
														<p>{t('dashboard.label.upload_audio_of_this_dialog_line')}</p>
													</div>
												)}
											</div>
										</Upload>
									</div>
								</>
							</TabPane>
							<TabPane tab={t('dashboard.label.from_my_drive')} key="2">
								<div className="d-flex flex-column align-items-center justify-content-center mb-20">
									{myValue.isUploadAudioContextForSlide ? (
										myValue.audioContext.current.id ? (
											<div className="d-flex align-items-center justify-content-between">
												<audio src={myValue.audioContext.current.audio} controls></audio>
											</div>
										) : null
									) : myValue?.newChara?.index >= 0 &&
									  myValue.dialog[myValue?.newChara?.index].audio &&
									  (myValue.uploading === false || !myValue.uploading) ? (
										<div className="d-flex align-items-center justify-content-between">
											<audio src={myValue.dialog[myValue?.newChara?.index].audio} controls></audio>
										</div>
									) : null}
								</div>

								<FolderContentMydrive fileType="Audio" onSave={actions.handleAudioMydrive} />
							</TabPane>
							<TabPane tab={t('dashboard.label.from_ai_library')} key="3">
								<div className="d-flex flex-column align-items-center justify-content-center mb-20">
									{myValue.isUploadAudioContextForSlide ? (
										myValue.audioContext.current.id ? (
											<div className="d-flex align-items-center justify-content-between">
												<audio src={myValue.audioContext.current.audio} controls></audio>
											</div>
										) : null
									) : myValue?.newChara?.index >= 0 &&
									  myValue.dialog[myValue?.newChara?.index].audio &&
									  (myValue.uploading === false || !myValue.uploading) ? (
										<div className="d-flex align-items-center justify-content-between">
											<audio src={myValue.dialog[myValue?.newChara?.index].audio} controls></audio>
										</div>
									) : null}
								</div>

								<Select
									showSearch
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									placeholder={t('dashboard.placeholder.language')}
									onChange={(v) => {
										actions.loadVoiceList(v);
									}}
									className="w-100 mb-15"
								>
									{dataSource.voiceLanList.map((language) => (
										<Option key={language.code} value={language.code} label={language.language}>
											{language.language}
										</Option>
									))}
								</Select>
								<Select
									showSearch
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									placeholder={t('dashboard.placeholder.voice')}
									value={myValue.newChara.voice}
									onChange={(v) => {
										actions.setNewChara({
											...myValue.newChara,
											voice: dataSource.voiceList[v].Id,
											languageCode: dataSource.voiceList[v].LanguageCode,
											engine: dataSource.voiceList[v].SupportedEngines[0],
										});
									}}
									className="w-100 mb-15"
								>
									{dataSource.voiceList.map((voice, idx) => (
										<Option key={idx} value={idx}>
											{voice.Name + ' (' + voice.Gender + ')'}
										</Option>
									))}
								</Select>

								{myValue.newChara.voice !== '' && (
									<Button
										className="generate-audio"
										onClick={() => {
											actions.generateAIAudio(myValue.newChara, myValue.newChara.index);
										}}
									>
										{t('dashboard.button.generate_audio')}
									</Button>
								)}
							</TabPane>
						</Tabs>
					</TabPane>
				</Tabs>

				<Button
					className="control-upload-tabs-btn"
					type="primary"
					shape="round"
					disabled={uploadingImage}
					onClick={() => {
						actions.setVisibleAddAudio(false);
						actions.setNewChara({
							...myValue.newChara,
							index: undefined,
						});
						actions.setListImageSlideDialog((prev) => {
							const indexExist = prev.findIndex((e) => e.index === currentIndexDialog);
							if (imageUrlOriginal) {
								if (indexExist !== -1) {
									prev[indexExist].imageId = imageUrlOriginal?.id;
									prev[indexExist].imageUrl = imageUrlOriginal?.url;
									return prev;
								}
								return [
									...prev,
									{
										index: currentIndexDialog,
										imageId: imageUrlOriginal.id,
										imageUrl: imageUrlOriginal.url,
										dialogLineId: currentDialogLineId,
									},
								];
							}
							return prev;
						});
						setImageUrlOriginal(null);
					}}
				>
					{t('dashboard.button.save_proceed')}
				</Button>
			</Modal>
		</>
	);
};

export default DialogLessonCreateForm;
