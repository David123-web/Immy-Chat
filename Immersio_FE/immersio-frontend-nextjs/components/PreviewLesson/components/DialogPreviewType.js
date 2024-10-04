import { CommentOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Slider } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadFile } from '../../../src/services/files/apiFiles';
import { getAllInstructors } from '../../../src/services/user/apiUser';
import { postRecords } from '../../../src/services/video-record/apiRecord';
import AudioPlayRecord from './audioPlayRecord';
import RecordAudio from './recordAudio';
import Rewarding from './Rewarding';
import ResultLesson from './ResultLesson';

const DialogPreviewType = ({
	styles,
	dialogs,
	dialogProcess,
	setIsDialogType,
	setDialogProcess,
	indexStep,
	sumTotal,
	setIndexStep,
	resetPreview,
	configNextLesson,
}) => {
	const [uploading, setUploading] = useState(false);
	const [inputValue, setInputValue] = useState(100);
	const [instructorIdState, setInstructorId] = useState();
	const [allInstructors, setAllInstructors] = useState([]);

	const [showResultLesson, setShowResultLesson] = useState(false);

	useEffect(() => {
		loadAllInstructors();
		return () => {
			setShowResultLesson(false);
		};
	}, []);

	const loadAllInstructors = async () => {
		try {
			const response = await getAllInstructors();
			if (response?.data) {
				setAllInstructors(response.data);
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	};

	const onAfterChange = (value) => {
		const vid = document.getElementById('yourAudio-1');
		if (vid) {
			vid.playbackRate = value / 100;
		}
	};

	const handleSubmit = async (audioBlob, instructorId) => {
		if (!instructorIdState) setInstructorId(instructorId);
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append('file', new File([audioBlob], `audio-record-student.mp3`, { type: 'audio/mpeg' }));
			formData.append('public', 'false');

			const response = await uploadFile(formData);
			if (response?.data) {
				const responsePostRecord = await postRecords({
					sendToUserId: instructorId,
					dialogLineId: dialogs[dialogProcess - 1].id,
					type: 'SUBMIT',
					fileId: response?.data?.id,
				});

				if (responsePostRecord) {
					toast.success('Submit successful');
				}
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className={`step-custom ${styles.step}`}>
			<style jsx global>
				{`
					.stepDialogs {
						margin: 60px auto 0;
						max-width: 666px;
					}
					.dialogExplain {
						font-size: 22px;
						border-bottom: 1px solid #ddd;
						padding-bottom: 10px;
						margin-bottom: 20px;
					}
					.stepDialogRecord {
						font-size: 22px;
						margin-top: 30px;
					}
					.dialogPlaySpeed .ant-slider-track {
						background-color: var(--tp-new_theme-3);
					}
					.dialogPlaySpeed .ant-slider-handle {
						border-color: var(--tp-new_theme-3);
					}
					.dialogStepAudio .pause-icon .icon-new-theme {
						color: var(--tp-new_theme-3);
						font-size: 40px;
					}
					.dialogStepRight.disabled {
						pointer-events: none;
						opacity: 0.5;
					}

					@media (max-width: 767px) {
						.stepDialogs {
							padding: 0 15px;
							margin-top: 15px;
						}
					}
				`}
			</style>
			{showResultLesson ? (
				<ResultLesson />
			) : (
				<>
					<div className={styles.stepIntroduction}>Listen & Practice</div>

					<div className="stepDialogs">
						{dialogs.map((session, index) => {
							if (index + 1 == dialogProcess) {
								return (
									<div key={`stepDialog-${index}`} className="stepDialog">
										<p className="dialogExplain">{session.line}</p>

										<div className="dialogStep tw-flex tw-justify-center tw-items-center">
											<div
												className="dialogStepLeft tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
												style={{
													width: 32,
													height: 60,
												}}
												onClick={() => {
													if (dialogProcess === 1) {
														setIsDialogType(false);
													} else {
														setDialogProcess(dialogProcess - 1);
													}
													setIndexStep(indexStep - 1);
												}}
											>
												<LeftOutlined />
											</div>
											<div className="dialogStepAudio tw-cursor-pointer">
												<AudioPlayRecord index={1} src={session?.audio} />
											</div>
											<div
												className={`dialogStepRight tw-flex tw-justify-center tw-items-center tw-cursor-pointer ${
													dialogProcess === dialogs?.length ? 'disabled' : undefined
												}`}
												style={{
													width: 32,
													height: 60,
												}}
												onClick={() => {
													if (dialogProcess !== dialogs?.length) {
														setDialogProcess(dialogProcess + 1);
														setIndexStep(indexStep + 1);
													}
												}}
											>
												<RightOutlined />
											</div>
										</div>

										<div className="dialogPlaySpeed tw-flex tw-justify-center tw-items-center">
											<span>Playback Speed</span>
											<div style={{ minWidth: 200 }} className="ms-2 me-2">
												<Slider
													min={1}
													max={200}
													onChange={(value) => setInputValue(value)}
													onAfterChange={onAfterChange}
													value={inputValue}
												/>
											</div>
											<span>{inputValue / 100}.00x</span>
										</div>
									</div>
								);
							}

							return null;
						})}

						<div className="stepDialogRecord">
							<div className="title mb-20">AUDIO RECORDING</div>
							<RecordAudio
								instructorIdState={instructorIdState}
								allInstructors={allInstructors}
								uploading={uploading}
								onChange={handleSubmit}
							/>
						</div>
					</div>
				</>
			)}
			{}

			<div className={styles.processWrapper}>
				<div className={styles.process} style={{ width: `${(indexStep / sumTotal) * 100}%` }} />
			</div>

			<div className={`${styles.actions} ${styles.actionsDialog}`}>
				{showResultLesson ? (
					<Button type="primary" className="mr-15">
						<div className="tw-flex tw-justify-center tw-items-center">
							<a href="#" target="_blank">
								Retake Lesson
							</a>
						</div>
					</Button>
				) : (
					<Button type="primary" className="mr-15">
						<div className="tw-flex tw-justify-center tw-items-center">
							<a href="/dashboard/immy-chat" target="_blank">
								Chat with Immy
								<CommentOutlined className="ml-10" />
							</a>
						</div>
					</Button>
				)}

				<Button
					className="ml-15"
					onClick={() => {
						setShowResultLesson(true);
						if (showResultLesson) {
							if (configNextLesson.openPreviewLesson) {
							  const findIndex = configNextLesson.lessons.findIndex(
							    (lesson) => String(lesson.id) === String(configNextLesson.lesson_id)
							  );
							  if (findIndex !== configNextLesson.lessons.length) {
							    configNextLesson.openPreviewLesson(configNextLesson.lessons[findIndex + 1].id)
							  }
							}
						}
					}}
				>
					<div className="tw-flex tw-justify-center tw-items-center">
						Next Lesson
						<RightOutlined className="ml-10" />
					</div>
				</Button>
				<Rewarding />
			</div>

			<div className={`${styles.resetPreview} ${styles.resetPreviewDialog}`} onClick={resetPreview}>
				Restart
			</div>
		</div>
	);
};

export default DialogPreviewType;
