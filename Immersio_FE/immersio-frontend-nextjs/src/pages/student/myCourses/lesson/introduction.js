import { CloseCircleFilled, FileFilled, FolderFilled, UserOutlined } from '@ant-design/icons'
import { Button, Col, Row, Skeleton, Spin } from 'antd'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import IntroductionCurriculum from '../../../../../components/Student/components/introduction/IntroductionCurriculum'
import IntroductionDescription from '../../../../../components/Student/components/introduction/IntroductionDescription'
import IntroductionIntructor from '../../../../../components/Student/components/introduction/IntroductionIntructor'
import { RouterConstants } from '../../../../../constants/router'
import { useLoadCommonCourse } from '../../../../../hooks/useLoadCommonCourse'
import { withTranslationsProps } from '../../../../next/with-app'
import { getCourseByIDPublic, getTrackingCourseID, assignToCourse } from '../../../../services/courses/apiCourses'
import { viewFileLinkByID, viewFileStreamByID, viewFileThumbnailByID } from '../../../../services/files/apiFiles'
import { useMobXStores } from '../../../../stores'

const PreviewIntroductionPage = () => {
  console.log('== PreviewIntroductionPage')
  const { t } = useTranslation();
  const router = useRouter()
  const course_id = router.query.course_id
	const lesson_id = router.query.lesson_id

  const [values, setValues] = useState({});
  const [tracking, setTracking] = useState([]);
  const { userStore } = useMobXStores();
	const user = JSON.parse(JSON.stringify(userStore.currentUser))

	const {
    tags,
    languages,
    levels,
    allInstructors
  } = useLoadCommonCourse({ isPublic: false })

	useEffect(() => {
    if (course_id) {
      loadCourses()
    }
	}, [course_id])

  useEffect(() => {
    if (user) {
      loadTracking()
    }
  }, [user])

  const loadTracking = async () => {
    try {
      const response = await getTrackingCourseID({ courseId: course_id })
      if (response?.data) {
        setTracking(response?.data)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

	const loadCourses = async () => {
    if (course_id) {
      try {
        const response = await getCourseByIDPublic(course_id)
        if (response?.data) {
          const getField = response.data
          let fieldMedia = {
            previewVideo: '',
            previewImage: ''
          }
          const assignment = await(assignToCourse({ "courseId": course_id, "purchased": false, "active:" : true, "studentId": 0 }));
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
                const responseThumb = await viewFileStreamByID(getField.instructionVideoId)
                if (responseThumb?.data) {
                  fieldMedia.previewVideo = responseThumb.data?.externalLink
                }
              } else {
                const responseThumb = await viewFileLinkByID(getField.instructionVideoId);
                if (responseThumb?.data) {
                  fieldMedia.previewVideo = responseThumb.data
                }
              }
            } catch (error) {
              toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
              
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
            isFree: response?.data?.isFree,
            isPublished: response?.data?.isPublished,
            tutorId: response?.data?.tutorId,
            fieldMedia,
          });
        }
      } catch (error) {
        console.log(`lesson ${JSON.stringify(error)}`)
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
            <div className="lesson-preview-introduction-header ps-relative">
              <h1 className='lesson-preview-introduction-header-title'>{values.title}</h1>
              <div className='lesson-preview-introduction-header-icon'>
                <Link href={RouterConstants.DASHBOARD_HOME.path}>
                  <CloseCircleFilled style={{ fontSize: 34, color: '#a0a0a0' }} />
                </Link>
              </div>
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
                      <Link href={`/student/myCourses/lesson?course_id=${course_id}&lesson_id=${lesson_id}`} as={`/student/myCourses/lesson?course_id=${course_id}&lesson_id=${lesson_id}`} passHref>
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

export default PreviewIntroductionPage