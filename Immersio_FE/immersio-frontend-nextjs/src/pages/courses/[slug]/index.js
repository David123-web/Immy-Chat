import { FileFilled, FolderFilled, UserOutlined } from '@ant-design/icons'
import { Button, Col, Row, Skeleton, Spin } from 'antd'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import IntroductionCurriculum from '../../../../components/Student/components/introduction/IntroductionCurriculum'
import IntroductionDescription from '../../../../components/Student/components/introduction/IntroductionDescription'
import IntroductionIntructor from '../../../../components/Student/components/introduction/IntroductionIntructor'
import { RouterConstants } from '../../../../constants/router'
import { useLoadCommonCourse } from '../../../../hooks/useLoadCommonCourse'
import { withTranslationsProps } from '../../../next/with-app'
import { getCourseByIDPublic, getTrackingCourseID } from '../../../services/courses/apiCourses'
import { viewFileThumbnailByID, viewPublicFile, viewPublicVideo } from '../../../services/files/apiFiles'
import { useMobXStores } from '../../../stores'

const CourseDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();
	const { userStore } = useMobXStores();
	const user = JSON.parse(JSON.stringify(userStore.currentUser))
  const courseMatcher = (router?.query?.slug || '').match(/-c(\d+)/g);
  const getLast = courseMatcher && courseMatcher[courseMatcher.length - 1];
  
  const courseMatch = /-c(\d+)/g.exec(getLast)
  const courseID = courseMatch && courseMatch[1];
	const lessonID = ''

  const [values, setValues] = useState({});
  const [tracking, setTracking] = useState([]);
  const [firstLoadedTracking, setFirstLoaded] = useState(true)

	const {
    tags,
    languages,
    levels,
    allInstructors
  } = useLoadCommonCourse({ isPublic: true, isFree: true })

	useEffect(() => {
    if (courseID) {
      loadCourses()
    }
	}, [courseID])

  useEffect(() => {
    if (user && firstLoadedTracking) {
      setFirstLoaded(false)
      loadTracking()
    }
  }, [user])

  const loadTracking = async () => {
    try {
      const response = await getTrackingCourseID({ courseId: courseID })
      if (response?.data) {
        setTracking(response?.data)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

	const loadCourses = async () => {
    if (courseID) {
      try {
        const response = await getCourseByIDPublic(courseID)
        if (response?.data) {
          const getField = response.data
          let fieldMedia = {
            previewVideo: '',
            previewImage: ''
          }

          if (getField?.thumbnailId) {
            try {
              const responseThumb = await viewFileThumbnailByID(getField.thumbnailId)
              if (responseThumb?.data) {
                fieldMedia.previewImage = responseThumb.data
              }
            } catch (error) {
              toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
      
            }
          }
          if (getField?.instructionVideoId) {
            try {
              if (getField?.instructionVideo?.externalLink) {
                const responseVideo = await viewPublicFile(getField.instructionVideoId)
                if (responseVideo?.data) {
                  fieldMedia.previewVideo = responseVideo.data?.externalLink
                }
              } else {
                const responseVideo = await viewPublicVideo(getField.instructionVideoId);
                if (responseVideo?.data) {
                  fieldMedia.previewVideo = responseVideo.data
                }
              }
            } catch (error) {
                toast.error(error.data?.message || error.response?.data || 'An error occurred, please refresh the page');
            }
          }

          setValues({
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
            isPublished: response?.data?.isPublished,
            tutorId: response?.data?.tutorId,
            fieldMedia,
          });
        }
      } catch (error) {
        console.log(`index ${JSON.stringify(error)}`)
        if(error.data?.message?.includes('Payment')){
          toast.error(t('course.unauthorized_no_pay'))
          router.back();
        } else {
          toast.error(error.data?.message || error.response?.data || 'An error occurred, please refresh the page');
        }
      }
    }
	}

  const filterCoAuthor = allInstructors.filter((session) => session?.id === (values?.coAuthor || values?.instructorId))
  const filterLevel = levels.filter((s) => s?.id?.toString() === values?.level?.toString())
  const filterLanguage = languages.filter((s) => s?.id?.toString() === values?.language?.toString())
  let totalLessons = 0
  if (values?.sections?.length) {
    for (let i = 0; i <= values.sections.length - 1; i++) {
      const getField = values.sections[i]
      totalLessons += getField?.lessons?.length
    }
  }
  let arrTags = []
  if (values?.tags?.length) {
    for (let i = 0; i <= values.tags.length - 1; i++) {
      const getField = values.tags[i]
      const filter = tags.filter((session) => session.id === getField)
      if (filter?.length) {
        arrTags.push(filter[0].name)
      }
    }
  }

  return (
    <Spin spinning={Object.keys(values).length === 0}>
      {Object.keys(values).length ? (
        <div className="lesson-preview container-custom">
          <div className='lesson-preview-introduction'>
            <div className="lesson-preview-introduction-header ps-relative reset-padding">
              <h1 className='lesson-preview-introduction-header-title'>{values.title}</h1>
            </div>

            <div className="lesson-preview-introduction-content mt-25">
              <div className="container">
                <Row gutter={45}>
                  <Col xs={24} sm={17}>
                    <div className="course__tab-2 mb-25">
                      <ul className="nav nav-tabs" id="courseTab" role="tablist">
                        <li className="nav-item" role="presentation" style={{ width: '33.33333%' }}>
                          <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="true">
                            <div className='d-flex align-items-center justify-content-center'>
                              <FileFilled />
                              <span className='ml-10'>{t('course.description_tab')}</span>
                            </div>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation" style={{ width: '33.33333%' }}>
                          <button className="nav-link " id="curriculum-tab" data-bs-toggle="tab" data-bs-target="#curriculum" type="button" role="tab" aria-controls="curriculum" aria-selected="false">
                            <div className='d-flex align-items-center justify-content-center'>
                              <FolderFilled />
                              <span className='ml-10'>{t('course.curriculum_tab')}</span>
                            </div>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation" style={{ width: '33.33333%' }}>
                          <button className="nav-link" id="intructor-tab" data-bs-toggle="tab" data-bs-target="#intructor" type="button" role="tab" aria-controls="intructor" aria-selected="false">
                            <div className='d-flex align-items-center justify-content-center'>
                              <UserOutlined />
                              <span className='ml-10'>{t('course.tutor_tab')}</span>
                            </div>
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="course__tab-content md:tw-mb-[95px]">
                      <div className="tab-content" id="courseTabContent">
                        <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                          <IntroductionDescription values={values} />
                        </div>

                        <div className="tab-pane fade" id="curriculum" role="tabpanel" aria-labelledby="curriculum-tab">
                          <IntroductionCurriculum tracking={tracking} values={values} />
                        </div>

                        <div className="tab-pane fade" id="intructor" role="tabpanel" aria-labelledby="intructor-tab">
                          <IntroductionIntructor coAuthor={filterCoAuthor?.length ? filterCoAuthor[0] : {}} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={7} className='lesson-preview-introduction-content-preview-course'>
                    <div className='mb-25 course-btn start-now'>
                      <Link href={`/student/myCourses/lesson?course_id=${courseID}&lesson_id=${lessonID}`} as={`/student/myCourses/lesson?course_id=${courseID}&lesson_id=${lessonID}`} passHref>
                        <Button type="primary">
                          {t('course.start_now')}
                        </Button>
                      </Link>
                    </div>
                    <div className='mb-25 course-btn try-now'>
											<Link href={RouterConstants.DASHBOARD_HOME.path}>
												<Button type="default" className='ant-disabled-btn'>
                          {t('course.try_course')}
												</Button>
											</Link>
                    </div>
                    {/* <div className="d-flex align-items-center justify-content-between mb-25">
                      <div className="book-rating">
                        <div className="ratings">
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star"></i>
                        </div>
                      </div>
                      <div className="book-price">
                        <span>245 enrolled</span>
                      </div>
                    </div> */}
                    <div className='book-info'>
                      {filterCoAuthor?.length ? (
                        <div>
                          <span>{t('course.created_by')}</span>
                          <span>:</span>
                          <span>{filterCoAuthor[0].profile?.firstName + ' ' + filterCoAuthor[0].profile?.lastName}</span>
                        </div>
                      ) : null}
                      {totalLessons ? (
                        <div>
                          <span>{t('course.lessons')}</span>
                          <span>:</span>
                          <span>{totalLessons}</span>
                        </div>
                      ) : null}
                      {filterLevel?.length ? (
                        <div>
                          <span>{t('course.Level')}</span>
                          <span>:</span>
                          <span>{filterLevel.length ? filterLevel[0].name : undefined}</span>
                        </div>
                      ) : null}
                      {filterLanguage?.length ? (
                        <div>
                          <span>{t('course.language')}</span>
                          <span>:</span>
                          <span>{filterLanguage.length ? filterLanguage[0].name : undefined}</span>
                        </div>
                      ) : null}
                      {values?.updatedAt ? (
                        <div>
                          <span>{t('course.last_updated')}</span>
                          <span>:</span>
                          <span>{moment(new Date(values?.updatedAt)).format('MMMM Do YYYY, HH:mm')}</span>
                        </div>
                      ) : null}
                      <div>
                        <span>{t('course.price')}</span>
                        <span>:</span>
                        <span>{values?.isFree ? t('course.free') : t('course.premium')}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mt-50">
          <Skeleton active className='mb-20' />
          <Skeleton active className='mb-20' />
          <Skeleton active className='mb-20' />
        </div>
      )}
    </Spin>
  )
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default CourseDetail