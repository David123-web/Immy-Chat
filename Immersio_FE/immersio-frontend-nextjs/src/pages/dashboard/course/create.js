import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface'
import { Button, Col, Spin, message } from 'antd'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { toast } from 'react-toastify'
import CourseCreateForm from '../../../../components/Instructor/forms/CourseCreateForm'
import MobileCourseCreateForm from '../../../../components/Instructor/forms/mobile/MobileCourseCreateForm'
import ModalViewPlayer from '../../../../components/common/ModalViewPlayer'
import DashboardRoute from '../../../../components/routes/DashboardRoute'
import { RouterConstants } from '../../../../constants/router'
import { useLoadCommonCourse } from '../../../../hooks/useLoadCommonCourse'
import { useMutation } from '../../../../hooks/useMutation'
import { withTranslationsProps } from '../../../next/with-app'
import { postCourses, postInviteCoInstructor, getCourseTypes } from '../../../services/courses/apiCourses'
import { deleteFiles, uploadFile, uploadFileExternal } from "../../../services/files/apiFiles"
import { postLesson } from '../../../services/lessons/apiLessons'
import { postSections } from '../../../services/sections/apiSections'
import { useMobXStores } from '../../../stores'
import { beforeUpload, convertToSlug, getBase64, uuidv4 } from "../../../utilities/helper"
import { getCreditValue } from '../../../services/settings/apiSettings';


const CourseCreate = () => {
	
	const { t } = useTranslation()
	const router = useRouter()
	const [loadingSpinning, setLoadingSpinning] = useState(false);
	
	const [values, setValues] = useState({
		title:'',
		coAuthor: undefined,
		type: undefined,
		description:'',
		learningOutcome: '',
		requirement: '',
		isFree: true,
		courseType: 'FREE',

		tags: [],
		language: undefined,
		level: undefined,
		image: undefined,
		video: undefined,
		price: 0,

		uri: "",
		videoFile: {},
	})
	const [valuesErr, setValuesErr] = useState({})
	const [previewCourse, setPreviewCourse] = useState('')

	const [preview, setPreview] = useState('')
	const [previewID, setPreviewID] = useState('')
	const [previewVideo, setPreviewVideo] = useState('')
	const [previewVideoID, setPreviewVideoID] = useState('')
	const [uploading, setUploading] = useState(false)	
	const [lessons, setLessons] = useState([{section: 'section', lessons: []}])
	const [tutorIds, setTutorIds] = useState([]);
	const [submitNext, setSubmitNext] = useState(false)
	const [courseTypes, setCourseTypes] = useState([])
	const [creditValue, setCreditValue] = useState(-1)
	const [currency, setCurrency] = useState('')

	// Get data store
	const { userStore, globalStore } = useMobXStores();
	const user = JSON.parse(JSON.stringify(userStore.currentUser))

	async function creditData()  {
		const creditData = await getCreditValue();
		console.log(`creditData ${JSON.stringify(creditData).data}`)
		setCreditValue(creditData.data.creditValue);
		setCurrency(globalStore.currencySubdomain);
	}

	creditData();

	const {
    tags,
    languages,
    levels,
    allInstructors
  } = useLoadCommonCourse({ isPublic: false })

	const renderInput = () => {
		const cloneData = JSON.parse(JSON.stringify([...lessons]));
		cloneData.push({ section: '', lessons: [] })
	  setLessons(cloneData)
	}

	const addSectionTitle = ({ index, value }) => {
		const cloneData = JSON.parse(JSON.stringify([...lessons]));
		cloneData[index].section = value
		setLessons(cloneData)
	}

	

	function existLesson(name) {
		let exists = false
		lessons.forEach((lesson) => {
			lesson.lessons.forEach((l) => {
				if(l.title == name) exists = true
			})
		})
		return exists
	}

	const addLessonTitle = (e, index) => {
		e.preventDefault()
		e.stopPropagation()

		if (!existLesson(e.target.value)) {
			const cloneData = JSON.parse(JSON.stringify([...lessons]));
			cloneData[index].lessons.push({
				title: e.target.value,
				id: ''
			})
			setLessons(cloneData)
		} else {
			toast(t('dashboard.notification.lesson_title_already_exists'))
			console.log(`ERROR addLessonTitle ${JSON.stringify(error)} ${error?.message}`)

		}
	}

	const updateLessonTitle = (e, index, subIndex) => {
		e.preventDefault()
		e.stopPropagation()

		if (!existLesson(e.target.value)) {
			const cloneData = JSON.parse(JSON.stringify([...lessons]));
			cloneData[index].lessons[subIndex].title = e.target.value
			setLessons(cloneData)
		} else {
			toast(t('dashboard.notification.lesson_title_already_exists'))
			console.log(`ERROR updateLessonTitle ${JSON.stringify(error)} ${error?.message}`)

		}
	}

	const deleteLessonTitle = ({ index, subIndex }) => {
		const cloneData = JSON.parse(JSON.stringify([...lessons]));
		cloneData[index].lessons.splice(subIndex, 1)

		setLessons(cloneData)
		setValues({ ...values, lessons: lessons })
	}

	const postCourseMutation = useMutation(
    postCourses,
    {
      onSuccess: async (res) => {
				// tạo course -> sau đó tạo section -> rồi mới tạo lesson
				console.log('postCourseMutation')
				const sectionsFormat = JSON.parse(JSON.stringify(lessons))
				if (sectionsFormat.length) {
					try {
						for (let i = 0; i <= sectionsFormat.length - 1; i++) {
							const responseSection = await postSections({
								courseId: res?.data?.id,
								title: sectionsFormat[i].section || '',
								index: i
							});
							if (responseSection?.data && sectionsFormat[i].lessons) {
								for (let ii = 0; ii <= sectionsFormat[i].lessons.length - 1; ii++) {
									await postLesson({
										courseSectionId: responseSection?.data?.id,
										title: sectionsFormat[i].lessons[ii]?.title,
										index: ii
									});
								}
							}
						}
					} catch (error) {
						setLoadingSpinning(false);
						console.log(`ERROR xxxxxxxx ${JSON.stringify(error)} ${error?.message}`)
					}
				}
				
				
				console.log('saved')
				toast(t('dashboard.notification.create_your_course_is_saved'), {
					position: "top-right",
					autoClose: 2500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				setLoadingSpinning(false);
				router.push(`${RouterConstants.DASHBOARD_COURSE.path}`)

				// invite co-instructor mutation
				if(values.coAuthor){
				values.coAuthor.forEach((insId) => {
					postInviteCoInstructorMutation.mutate({
						courseId: res?.data?.id,
						instructorId: insId
					})
				})
			}
      },
      onError: (error) => {
				setLoadingSpinning(false);
				console.log(`ERROR postCourseMutation ${JSON.stringify(error, null, 1)} `)
      },
    }
  );

	/* -------------------------- INVITE CO-INSTRUCTOR -------------------------- */
	const postInviteCoInstructorMutation = useMutation(
    postInviteCoInstructor,
    {
			onSuccess: () => {
				if (submitNext) {
					router.push(RouterConstants.DASHBOARD_COURSE_LESSON_DIALOGUE.path)
				}
			},
      onError: (error) => {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
      },
    }
  );

	const handleSubmit = async (e) => {
		console.log('create.js handleSubmit')


		console.log(`create.js handleSubmit ${JSON.stringify(values, null, 4)}`)
		console.log(`previewID ${previewID}`)
		e.preventDefault();
		if (!previewID || (!previewVideoID && !values.fileExternal)) {
			setValuesErr({
				...valuesErr,
				previewID: !previewID,
				previewVideoID: !previewVideoID,
			})
			setLoadingSpinning(false);
			return toast.warning(
				t('Please upload a video or a link to a video')
			);
		}

		if (!values.level|| !values.language) {
			setValuesErr({
				...valuesErr,
				level: !values.level,
				isFree: !values.isFree,
				language: !values.language,
			})
			setLoadingSpinning(false);
			return toast.warning(
				t('You are missing the course level, language, or whether course is premium')
			);
		}

		console.log('create.js handleSubmit formatData')
		console.log(`values to format ${JSON.stringify(values, null, 2)}`)

		let formatData = {
			slug: convertToSlug(values.title || ''),
			title: values.title,
			courseLanguageId: values.language,
			// coInstructorIds: [user?.profile?.instructorId],
			tagIds: values.tags,
			learningOutcome: values.learningOutcome,
			description: values.description,
			requirement: values.requirement,
			thumbnailId: previewID,
			levelId: values.level,
			isFree: values.isFree,
			isPublished: true,
			tutorIds: tutorIds,
			courseType: values.courseType,
			price: values.price
		}
		console.log('create.js handleSubmit upload file')
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
				console.log(`ERROR handleSubmit ${JSON.stringify(error)} ${error?.message}`)
				return
			}
		} else {
			formatData = {
				...formatData,
				instructionVideoId: previewVideoID,
			}
		}

		setLoadingSpinning(true);
		console.log('create.js handleSubmit go to mutation')
		postCourseMutation.mutate(formatData);
	}

	// Handle Video/Image

	const handleChangeMedia = e => {
		setValues({ ...values, fileExternal: e.target.value })
	}

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
			reader.addEventListener("load", () => {
				setPreview(reader.result);
			});
			reader.readAsDataURL(info.file);
			getBase64(info.file, (url) => {
				setPreview(url);
			});
	
			const formData = new FormData();
			formData.append("file", info.file);
			formData.append("public", "false");
	
			uploadImageMutation.mutate(formData);
		} else {
			message.error(t('dashboard.notification.image_must_smaller_20MB'));
		}
	}

	const deleteImageMutation = useMutation(deleteFiles, {
    onSuccess: (res) => {
      setPreviewID(undefined);
      setPreview(undefined);
			setUploading(false);
    },
    onError: (error) => {
			setUploading(false);
			console.log(`ERROR deleteImageMutation ${JSON.stringify(error)} ${error?.message}`)

		},
  });

	const handleImageRemove = async () => {
		setUploading(true);
		deleteImageMutation.mutate({
			ids: [previewID],
		});
	}

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
			reader.addEventListener("load", () => {
				setPreviewVideo(reader.result);
			});
			reader.readAsDataURL(info.file);
			getBase64(info.file, (url) => {
				setPreviewVideo(url);
			});
	
			const formData = new FormData();
			formData.append("file", info.file);
			formData.append("public", "false");
	
			uploadVideoMutation.mutate(formData);
		} else {
			message.error(t('dashboard.notification.video_must_smaller_20MB'));
		}
	}

	const deleteVideoMutation = useMutation(deleteFiles, {
    onSuccess: (res) => {
      setPreviewVideoID(undefined);
      setPreviewVideo(undefined);
			setUploading(false);
    },
    onError: (error) => {
			setUploading(false);
			console.log(`ERROR deleteVideoMutation ${JSON.stringify(error)} ${error?.message}`)

		},
    });

	const handleVideoRemove = async () => {
		setUploading(true);
		deleteVideoMutation.mutate({
			ids: [previewVideoID],
		});
	}

	const setValueTutorIds = (ids) => {
		setTutorIds(ids);
	}

	async function definedCourseTypes() {
		console.log('-----------definedCourseTypes')
		console.log(`${JSON.stringify(courseTypes)}`)
		if(courseTypes.length === 0){
			console.log('----------2222 -definedCourseTypes')
			
			const ctypes = await getCourseTypes();
			setCourseTypes(ctypes.data);
		}
	}

	definedCourseTypes()

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
		tutors: [],
		setValueTutorIds: setValueTutorIds,
		setSubmitNext: setSubmitNext, 
		isNewCreate: true,
		courseTypes: courseTypes,
		creditValue: creditValue,
		currency: currency
	}

	return(
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
							<Col xs={24} sm={8} >
							{userStore.currentUser &&
									(userStore.currentUser.role === ROLE_TYPE.SUBDOMAIN_ADMIN ||
										userStore.currentUser.role === ROLE_TYPE.INSTRUCTOR) && (
										<Button
											size='large'
											onClick={() => {
												router.push(`${RouterConstants.DASHBOARD_COURSE_IMPORT_STEP_1.path}`);
											}}
											className={`tw-w-full tw-rounded-md tw-px-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-bg-lightGray tw-mt-4`}
										>
											Import CSV
										</Button>
									)}
							</Col>
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
	)
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default CourseCreate
