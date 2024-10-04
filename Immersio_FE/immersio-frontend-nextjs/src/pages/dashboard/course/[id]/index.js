import { VideoCameraFilled } from '@ant-design/icons';
import { Col, Spin, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { toast } from 'react-toastify';
import CourseCreateForm from '../../../../../components/Instructor/forms/CourseCreateForm';
import MobileCourseCreateForm from '../../../../../components/Instructor/forms/mobile/MobileCourseCreateForm';
import DashboardRoute from '../../../../../components/routes/DashboardRoute';
import { RouterConstants } from '../../../../../constants/router';
import { useLoadCommonCourse } from '../../../../../hooks/useLoadCommonCourse';
import { useMutation } from '../../../../../hooks/useMutation';
import { withTranslationsProps } from '../../../../next/with-app';
import { getCreditValue } from '../../../../services/settings/apiSettings';
import {
	getCourseByID,
	postInviteCoInstructor,
	removeCoInstructor,
	updateCourse,
	getAllCourses,
	getCourseTypes
} from '../../../../services/courses/apiCourses';
import { deleteFiles, uploadFile, uploadFileExternal, viewFileLinkByID, viewFileStreamByID, viewFileThumbnailByID } from '../../../../services/files/apiFiles';
import { deleteLesson, postLesson, updateLesson } from '../../../../services/lessons/apiLessons';
import { deleteSections, postSections, updateSections } from '../../../../services/sections/apiSections';
import { useMobXStores } from '../../../../stores';
import { beforeUpload, convertToSlug, getBase64, uuidv4 } from '../../../../utilities/helper';
import { useTranslation } from 'next-i18next';
import ModalViewPlayer from '../../../../../components/common/ModalViewPlayer';

const CourseEdit = () => {
	const { t } = useTranslation()
	const [loadingSpinning, setLoadingSpinning] = useState(false);
	const [values, setValues] = useState({
		title: '',
		coAuthor: undefined,
		type: undefined,
		description: '',
		learningOutcome: '',
		requirement: '',
		isFree: undefined,

		tags: [],
		language: undefined,
		level: undefined,
		image: undefined,
		video: undefined,

		uri: '',
		videoFile: {},
	});

	async function creditData()  {
		const creditData = await getCreditValue();
		console.log(`creditData ${JSON.stringify(creditData).data}`)
		setCreditValue(creditData.data.creditValue);
		setCurrency(globalStore.currencySubdomain);
	}
	
	const [valuesErr, setValuesErr] = useState({});
	const [previewCourse, setPreviewCourse] = useState('');

	const [preview, setPreview] = useState('');
	const [previewID, setPreviewID] = useState('');
	const [previewVideo, setPreviewVideo] = useState('');
	const [previewVideoID, setPreviewVideoID] = useState('');
	const [uploading, setUploading] = useState(false);
	const [lessons, setLessons] = useState([{ section: 'section', lessons: [] }]);
	const [tutorIds, setTutorIds] = useState([]);
	const [previousCoInstructor, setPreviousCoInstructor] = useState([]);
	const [submitNext, setSubmitNext] = useState(false)
	const [courseList, setCourseList] = useState([])
	const [courseTypes, setCourseTypes] = useState([])
	const [creditValue, setCreditValue] = useState(-1)
	const [currency, setCurrency] = useState('')

	const tutorList = useRef([]);

	const router = useRouter();
	const { id } = router.query;
	// Get data store
	const { userStore, globalStore } = useMobXStores();
	const user = JSON.parse(JSON.stringify(userStore.currentUser));

	const { tags, languages, levels, allInstructors } = useLoadCommonCourse({ isPublic: false });

	useEffect(() => {
		if (id) {
			getCourse(id);
		}
	}, [id]);

	useEffect(() => {
		loadCourses()
	}, []);

	creditData();




	const loadCourses =  async () => {
		try {
          if(courseList.length == 0 ){
		  const response = await getAllCourses();
		  
		  if (response?.data) {
			console.log(`setting courses ${response.data.length}`);
			await setCourseList(response.data);
			return response.data
		  }
		} 
		} catch (error) {
		  toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		}
	}

	const getCourse = async (id) => {
		console.log(`Retrieving course ${id}`)
		setLoadingSpinning(true);
		try {
			const response = await getCourseByID(id);
			console.log(`getCourseByID ${JSON.stringify(response.data, null, 4)}`)
			if (response?.data) {
				setValues({
					...response?.data,
					slug: response?.data?.slug,
					title: response?.data?.title,
					language: response?.data?.courseLanguageId,
					coAuthor: response?.data?.coInstructors.map((co) => co.profile?.instructorId),
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
					lessons: values.lessons,
					courseType: response?.data?.courseType,
					price: response?.data?.price
				});
				const ctypes = await getCourseTypes();
				setCourseTypes(ctypes.data);
				setPreviousCoInstructor(response?.data?.coInstructors.map((co) => co.profile?.instructorId));
				// Need discuss
				if (response.data?.sections?.length) {
					const orderedSections = response.data.sections.sort((a, b) => a.index - b.index);
					setLessons(
						orderedSections.map((session) => {
							const orderedLessons = (session?.lessons || []).sort((a, b) => a.index - b.index);
							return {
								...session,
								id: session.id,
								section: session.title,
								lessons: orderedLessons.map((item) => {
									return {
										...item,
										id: item.id,
										title: item.title,
									};
								}),
							};
						})
					);
				}
				if (response.data.thumbnailId) {
					setPreviewID(response.data.thumbnailId);
					try {
						const responseThumb = await viewFileThumbnailByID(response.data.thumbnailId);
						if (responseThumb?.data) {
							setPreview(responseThumb.data);
						}
					} catch (error) {
						toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
					}
				}
				if (response.data.instructionVideoId) {
					// stream video phải mở thêm service cloudfront nữa
					setPreviewVideoID(response.data.instructionVideoId);
					try {
						if (response.data?.instructionVideo?.externalLink) {
							const responseVideo = await viewFileStreamByID(response.data.instructionVideoId)
							if (responseVideo?.data) {
								setPreviewVideo(responseVideo.data?.externalLink);
							}
						} else {
							const responseVideo = await viewFileLinkByID(response.data.instructionVideoId);
							if (responseVideo?.data) {
								setPreviewVideo(responseVideo.data);
							}
						}
					} catch (error) {
						toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
					}
				}
				tutorList.current = response.data.tutors;
				setTutorIds(response.data.tutors.map((item) => item.id));
			}
		} catch (error) {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		} finally {
			setLoadingSpinning(false);
		}
	};

	const renderInput = () => {
		const cloneData = JSON.parse(JSON.stringify([...lessons]));
		cloneData.push({ section: '', lessons: [] });
		setLessons(cloneData);
	};

	const addSectionTitle = ({ index, value }) => {
		const cloneData = JSON.parse(JSON.stringify([...lessons]));
		cloneData[index].section = value;
		setLessons(cloneData);
	};

	const deleteSectionTitle = async (item, index) => {
		const cloneData = JSON.parse(JSON.stringify([...lessons]));
		if (item.updatedAt && (item.lessons || [])?.length === 0) {
			try {
				const response = await deleteSections(item.id);
				if (response) {
					cloneData.splice(index, 1);
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		} else if (!item.updatedAt) {
			cloneData.splice(index, 1);
		}

		setLessons(cloneData);
	};

	function existLesson(name) {
		let exists = false;
		lessons.forEach((lesson) => {
			lesson.lessons.forEach((l) => {
				if (l.title == name) exists = true;
			});
		});
		return exists;
	}

	const addLessonTitle = (e, index) => {
		e.preventDefault();
		e.stopPropagation();

		if (!existLesson(e.target.value)) {
			const cloneData = JSON.parse(JSON.stringify([...lessons]));
			cloneData[index].lessons.push({
				title: e.target.value,
				id: '',
			});
			setLessons(cloneData);
		} else {
			toast(t('dashboard.notification.lesson_title_already_exists'));
		}
	};

	const updateLessonTitle = (e, index, subIndex) => {
		e.preventDefault();
		e.stopPropagation();

		if (!existLesson(e.target.value)) {
			const cloneData = JSON.parse(JSON.stringify([...lessons]));
			cloneData[index].lessons[subIndex].title = e.target.value;
			setLessons(cloneData);
		} else {
			toast(t('dashboard.notification.lesson_title_already_exists'));
		}
	};

	const deleteLessonTitle = async ({ index, subIndex, id }) => {
		const cloneData = JSON.parse(JSON.stringify([...lessons]));
		if (id) {
			try {
				const response = await deleteLesson(id);
				if (response) {
					cloneData[index].lessons.splice(subIndex, 1);
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		} else {
			cloneData[index].lessons.splice(subIndex, 1);
		}

		setLessons(cloneData);
		setValues({ ...values, lessons: lessons });
	};

	const postCourseMutation = useMutation(updateCourse, {
		onSuccess: async (res) => {
			// tạo course -> sau đó tạo section -> rồi mới tạo lesson
			const sectionsFormat = JSON.parse(JSON.stringify(lessons));
			if (sectionsFormat.length) {
				try {
					for (let i = 0; i <= sectionsFormat.length - 1; i++) {
						if (sectionsFormat[i].id) {
							await updateSections({
								id: sectionsFormat[i].id,
								courseId: Number(id),
								title: sectionsFormat[i].section || '',
								index: i,
							});

							if (sectionsFormat[i].lessons?.length) {
								for (let ii = 0; ii <= sectionsFormat[i].lessons.length - 1; ii++) {
									if (!sectionsFormat[i].lessons[ii].id) {
										await postLesson({
											courseSectionId: sectionsFormat[i].id,
											title: sectionsFormat[i].lessons[ii]?.title,
											index: ii,
										});
									} else {
										await updateLesson({
											id: sectionsFormat[i].lessons[ii].id,
											courseSectionId: sectionsFormat[i].id,
											title: sectionsFormat[i].lessons[ii]?.title,
											index: ii,
										});
									}
								}
							}
						} else {
							const responseSection = await postSections({
								courseId: Number(id),
								title: sectionsFormat[i].section,
								index: i,
							});
							if (responseSection?.data && sectionsFormat[i].lessons?.length) {
								for (let ii = 0; ii <= sectionsFormat[i].lessons.length - 1; ii++) {
									await postLesson({
										courseSectionId: responseSection?.data?.id,
										title: sectionsFormat[i].lessons[ii]?.title,
										index: ii,
									});
								}
							}
						}
					}

					// Load lai list o day (load xong moi tat modal)
					if (submitNext) {
						router.push(`${RouterConstants.DASHBOARD_COURSE_LESSON_DIALOGUE.path}?courseId=${id}`)
					} else {
						await getCourse(id);
					}
					toast(t('dashboard.notification.create_your_course_is_saved'), {
						position: 'top-right',
						autoClose: 2500,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
					setLoadingSpinning(false);
				} catch (error) {
					setLoadingSpinning(false);
					toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
				}
			} else {
				// Load lai list o day (load xong moi tat modal)
				await getCourse(id);
				toast(t('dashboard.notification.create_your_course_is_saved'), {
					position: 'top-right',
					autoClose: 2500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				setLoadingSpinning(false);
			}
			//remove co-instructor mutation
			previousCoInstructor.forEach((idPrev) => {
				if (!values.coAuthor.includes(idPrev)) {
					removeInviteCoInstructorMutation.mutate({
						courseId: id,
						instructorId: idPrev,
					});
				}
			});
			// update co-instructor mutation
			values.coAuthor.forEach((insId) => {
				postInviteCoInstructorMutation.mutate({
					courseId: id,
					instructorId: insId,
				});
			});
		},
		onError: (error) => {
			if (error.data.statusCode === 403) {
				toast.error(t('dashboard.notification.you_do_not_have_permission'));
			}
			setLoadingSpinning(false);
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	/* -------------------------- INVITE CO-INSTRUCTOR -------------------------- */
	const postInviteCoInstructorMutation = useMutation(postInviteCoInstructor, {
		onError: (error) => {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	/* -------------------------- REMOVE CO-INSTRUCTOR -------------------------- */
	const removeInviteCoInstructorMutation = useMutation(removeCoInstructor, {
		onError: (error) => {
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!previewID || (!previewVideoID && !values.fileExternal)) {
			setValuesErr({
				...valuesErr,
				previewID: !previewID,
				previewVideoID: !previewVideoID,
			});
			setLoadingSpinning(false);
			return toast.warning(
				t('dashboard.notification.at_least_one_required_filed_was_empty')
			);
		}

		let formatData = {
			id,
			slug: convertToSlug(values.title || ''),
			title: values.title,
			courseLanguageId: values.language,
			tagIds: values.tags,
			learningOutcome: values.learningOutcome,
			description: values.description,
			requirement: values.requirement,
			thumbnailId: previewID || values.thumbnailId,
			levelId: values.level,
			isFree: values.isFree,
			isPublished: true,
			tutorIds: tutorIds,
			courseType: values.courseType,
			price: values.price
		};

		if (values.fileExternal) {
			try {
				const responseUpload = await uploadFileExternal({
					link: values.fileExternal,
					name: `link-external-${uuidv4()}`,
				})
				if (responseUpload) {
					formatData = {
						...formatData,
						instructionVideoId: responseUpload?.data?.id,
					}
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		} else {
			formatData = {
				...formatData,
				instructionVideoId: previewVideoID || values.instructionVideoId,
			}
		}

		setLoadingSpinning(true);
		postCourseMutation.mutate(formatData);
	};

	// Handle Video/Image

	const handleChangeMedia = (e) => {
		setValues({ ...values, fileExternal: e.target.value })
	};

	const uploadImageMutation = useMutation(uploadFile, {
		onSuccess: (res) => {
			setPreviewID(res?.data?.thumbnail?.id);
			setUploading(false);
		},
		onError: (err) => {
			setPreviewID(undefined);
			setUploading(false);
		},
	});

	const handleImage = async (info) => {
		if (beforeUpload(info?.file)) {
			setUploading(true);

			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setPreview(reader.result);
			});
			reader.readAsDataURL(info.file);
			getBase64(info.file, (url) => {
				setPreview(url);
			});

			const formData = new FormData();
			formData.append('file', info.file);
			formData.append('public', 'false');

			uploadImageMutation.mutate(formData);

			//---------------^^^^^----------------
			// fileList is equivalent to your "const img = event.target.files[0]"
			// here, antd is giving you an array of files, just like event.target.files
			// but the structure is a bit different that the original file
			// the original file is located at the `originFileObj` key of each of this files
			// so `event.target.files[0]` is actually fileList[0].originFileObj

			// Resize
			// Resizer.imageFileResizer(fileList[0].originFileObj, 720, 500, 'JPEG', 100, 0, async (uri) => {
			//
			// })
		} else {
			message.error(t('dashboard.notification.image_must_smaller_20MB'));
		}
	};

	const deleteImageMutation = useMutation(deleteFiles, {
		onSuccess: (res) => {
			setPreviewID(undefined);
			setPreview(undefined);
			setUploading(false);
		},
		onError: (error) => {
			setUploading(false);
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	const handleImageRemove = async () => {
		setUploading(true);
		deleteImageMutation.mutate({
			ids: [previewID],
		});
	};

	const uploadVideoMutation = useMutation(uploadFile, {
		onSuccess: (res) => {
			setPreviewVideoID(res?.data?.id);
			setUploading(false);
		},
		onError: (err) => {
			setPreviewVideoID(undefined);
			setUploading(false);
		},
	});

	const handleVideo = async (info) => {
		if (beforeUpload(info?.file)) {
			setUploading(true);

			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setPreviewVideo(reader.result);
			});
			reader.readAsDataURL(info.file);
			getBase64(info.file, (url) => {
				setPreviewVideo(url);
			});

			const formData = new FormData();
			formData.append('file', info.file);
			formData.append('public', 'false');

			uploadVideoMutation.mutate(formData);
		} else {
			message.error(t('dashboard.notification.video_must_smaller_20MB'));
		}
	};

	const deleteVideoMutation = useMutation(deleteFiles, {
		onSuccess: (res) => {
			setPreviewVideoID(undefined);
			setPreviewVideo(undefined);
			setUploading(false);
		},
		onError: (error) => {
			setUploading(false);
			toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		},
	});

	const handleVideoRemove = async () => {
		setUploading(true);
		deleteVideoMutation.mutate({
			ids: [previewVideoID],
		});
	};

	// End Handle Video/Image

	//Handle Ids
	const setValueTutorIds = (ids) => {
		setTutorIds(ids);
	};

	const mergedConfig = {
		loadingSpinning: loadingSpinning,
		handleSubmit: handleSubmit,
		handleImage: handleImage,
		values: values,
		setValues: setValues,
		valuesErr: valuesErr,
		setValuesErr: setValuesErr,
		preview: preview,
		previewVideo: previewVideo,
		handleImageRemove: handleImageRemove,
		handleVideo: handleVideo,
		uploading: uploading,
		handleVideoRemove: handleVideoRemove,
		handleChangeMedia: handleChangeMedia,
		lessons: lessons,
		setLessons: setLessons,
		addSectionTitle: addSectionTitle,
		deleteSectionTitle: deleteSectionTitle,
		addLessonTitle: addLessonTitle,
		updateLessonTitle: updateLessonTitle,
		deleteLessonTitle: deleteLessonTitle,
		renderInput: renderInput,
		tags: tags,
		languages: languages,
		levels: levels,
		user: user,
		allInstructors: allInstructors,
		previewCourse: previewCourse,
		setPreviewCourse: setPreviewCourse,
		tutors: tutorList.current,
		setValueTutorIds: setValueTutorIds,
		setSubmitNext: setSubmitNext,
		courseList: courseList,
		getCourse: getCourse,
		currentCourseId: id,
		courseTypes: courseTypes,
		creditValue: creditValue,
		currency: currency

	}

	return (
		<DashboardRoute>
			<div className="animated fadeIn">
				<BrowserView>
					<div className="section-head mb-4">
						<div className="d-flex align-items-center justify-content-between">
							<Col xs={24} sm={16} className="pe-4 d-flex align-items-center">
								<h3 className="page-title float-left mb-0">
									{t('dashboard.title.create_course_syllabus')}
								</h3>
								<ModalViewPlayer
									url="https://player.vimeo.com/video/840338895?h=5668d9b881"
									label="Tutorial"
								/>
							</Col>
							<Col xs={24} sm={8} />
						</div>
					</div>

					<Col xs={24} sm={16} className="pe-4">
						<p>
							{t('dashboard.label.course_description')}
						</p>
					</Col>
				</BrowserView>

				<div className="md:tw-py-4 -tw-mx-[20px] md:tw-mx-0">
					<Spin spinning={loadingSpinning || false}>
						<BrowserView>
							<CourseCreateForm {...mergedConfig} />
						</BrowserView>
						<MobileView>
							<MobileCourseCreateForm {...mergedConfig} />
						</MobileView>
					</Spin>
				</div>
			</div>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default CourseEdit;
