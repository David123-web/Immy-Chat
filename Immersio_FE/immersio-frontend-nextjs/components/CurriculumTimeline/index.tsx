import { getPermissionCoursesPublic } from "@/src/services/courses/apiCourses"
import { useMobXStores } from "@/src/stores"
import { CheckCircleFilled } from "@ant-design/icons"
import { Button, Modal, Tabs, Timeline } from "antd"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"

const CurriculumTimeline = ({ isPreviewAdmin, data, setIsShowPreviewLesson,tracking = [] }) => {
  const { t } = useTranslation();
  const router = useRouter()
  const { userStore } = useMobXStores();
  const [openLogin, setOpenLogin] = useState(false)
  const [openUpgrade, setOpenUpgrade] = useState(false)
  const orderedSections = (data?.sections || []).sort((a, b) => a.index - b.index)

  const onPreviewLesson = (section, lesson) => { 
    router.push(`${location.pathname}?course_id=${section?.courseId}&lesson_id=${ lesson.id}`, undefined, { shallow: true, scroll: false })
    setIsShowPreviewLesson && setIsShowPreviewLesson(true)
  }

  const handleCheckPermissionForView = async ({ section, item }) => {
    if (userStore?.currentUser?.id) {
      if (section?.course?.isFree) {
        router.push(`/student/myCourses/lesson?course_id=${section?.courseId}&lesson_id=${item?.id}`)
      } else {
        try {
          const response = await getPermissionCoursesPublic(section?.courseId)
          // @ts-ignore
          if (response?.data?.result) {
            router.push(`/student/myCourses/lesson?course_id=${section?.courseId}&lesson_id=${item?.id}`)
          } else {
            setOpenUpgrade(true)
          }
        } catch (error) {
          toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
        }
      }
    } else {
      setOpenLogin(true);
    }
  }

  return (
    <>
      <div className="student-dashboard">
        <div className='student-dashboard-courses-left-section' style={{ paddingRight: 0 }}>
          {data?.sections?.length ? (
            <Tabs className="control-hooks-tabs" type="card">
              {orderedSections.map((section, index) => {
                const orderedLessons = (section?.lessons || []).sort((a, b) => a.index - b.index)
                return (
                  <Tabs.TabPane tab={section.section || section.title} key={index}>
                    <Timeline>
                        {
                          section?.lessons?.length && orderedLessons.map((item, i) => {
                            const filter = (tracking || []).filter((s) => s.lessonId?.toString() === item.id?.toString() && s.isCompleted)

                            return (
                              <Timeline.Item key={i} dot={<div className='dot-circle'><span /></div>}>
                                <div>
                                    <span className='title-lesson'>{item.title}</span>
                                    <div style={{ maxHeight: 90, overflow: 'hidden' }}>
                                      <b className='title-course' dangerouslySetInnerHTML={{ __html: item.introduction }} />
                                    </div>
                                    <div className='d-flex justify-content-between align-items-center mt-15'>
                                      {filter?.length ? (
                                        <div className="d-flex align-items-center">
                                          <CheckCircleFilled style={{ fontSize: 20, color: 'green' }} />
                                          <span className="ml-10" style={{ color: 'green' }}>{t('course.completed')}</span>
                                        </div>
                                      ) : <div />}
                                      {isPreviewAdmin ? (
                                        <Button type="primary" onClick={() => onPreviewLesson(section, item)} shape="round" className='btn-course'>
                                          {t('course.start')}
                                        </Button>
                                      ) : (
                                        <div className="tw-cursor-pointer" onClick={() => handleCheckPermissionForView({ section, item })}>
                                          <Button type="primary" shape="round" className='btn-course'>{t('course.start')}</Button>
                                        </div>
                                      )}
                                    </div>
                                </div>
                              </Timeline.Item>
                            )
                          })
                        }
                    </Timeline>
                  </Tabs.TabPane>
                )
              })}
            </Tabs>
          ) : null}
        </div>
      </div>

      <Modal
        centered
        title=""
        width={600}
        onCancel={() => setOpenLogin(false)}
        open={openLogin}
        footer={null}
      >
        <div className="tw-flex tw-flex-col tw-items-center tw-mt-3">
          <h3>{t('course.access_restricted')}</h3>
          <p className="tw-py-4 tw-text-center">
            {t('course.access_restricted_content')}
          </p>
          <Link href="/register">
            <Button size="large" type="primary" shape="round" className='tw-min-w-[200px]'>
              {t('course.access_restricted_btn')}
            </Button>
          </Link>
          <p className="tw-mt-1 tw-text-center">
            {t('course.access_restricted_already')}{` `}
            <Link href="/login"><a className="tw-font-bold color-theme-3">{t('course.access_restricted_login')}</a></Link>
            {` `}{t('course.access_restricted_now')}.
          </p>
        </div>
      </Modal>

      <Modal
        centered
        title=""
        width={400}
        onCancel={() => setOpenUpgrade(false)}
        open={openUpgrade}
        footer={null}
      >
        <div className="tw-flex tw-flex-col tw-items-center">
          <p className="tw-py-2 tw-text-center">
            {t('course.upgrade_account')}
          </p>
          <Link href="/pricing">
            <Button size="large" type="primary" shape="round" className='tw-min-w-[200px]'>
              {t('course.upgrade_account_btn')}
            </Button>
          </Link>
        </div>
      </Modal>
    </>
  )
}

export default CurriculumTimeline