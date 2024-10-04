import { AppstoreOutlined, BarsOutlined, CloseCircleFilled, DeleteOutlined, PlusCircleFilled } from '@ant-design/icons'
import { Button, Input, Select } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import NewCourseDetailsWrapper from '../../../../components/CourseDetails/NewCourseDetailsWrapper'
import ListCourseGrid from '../../../../components/Instructor/tables/ListCourseGrid'
import ListCourseTable from '../../../../components/Instructor/tables/ListCourseTable'
import DashboardRoute from '../../../../components/routes/DashboardRoute'
import { RouterConstants } from '../../../../constants/router'
import { useLoadCommonCourse } from '../../../../hooks/useLoadCommonCourse'
import { withTranslationsProps } from '../../../next/with-app'
import { deleteCourse, getAllCourses, getCourseByID, recycleCourse, softDeleteCourse, updateCourse } from '../../../services/courses/apiCourses'
import { viewFileLinkByID, viewFileStreamByID } from '../../../services/files/apiFiles'
import { useTranslation } from 'next-i18next'

const { Search } = Input;
const { Option } = Select;

const CoursesIndex = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [switchLayout, setSwitchLayout] = useState('grid'); // grid || table
  const [values, setValues] = useState({});
  const [previewCourse, setPreviewCourse] = useState('')

	const [courses, setCourses] = useState([])
  const [displayCourses, setDisplayCourses] = useState([])

  const {
    tags,
    languages,
    levels,
    allInstructors
  } = useLoadCommonCourse({ isPublic: false })

	useEffect(() => {
		loadCourses()
	}, [])

	const loadCourses = async (params = { isDeleted: false }) => {
    setCourses([])
    setDisplayCourses([])
    try {
      const response = await getAllCourses(params.isDeleted ? { isDeleted: params.isDeleted } : undefined)
      if (response?.data) {
        setCourses(response.data || [])
        setDisplayCourses(response.data || [])
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

	const handleDeleteCourse = async(id) => {
    try {
      const response = await deleteCourse(id)
      if (response) {
        toast(t('dashboard.notification.delete_row_success'), {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        loadCourses();
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

	const handleSoftDeleteCourse = async(id) => {
    try {
      const response = await softDeleteCourse(id)
      if (response) {
        toast(t('dashboard.notification.delete_row_success'), {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        loadCourses();
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

	const handleRecycleCourse = async(id) => {
    try {
      const response = await recycleCourse(id)
      if (response) {
        toast(t('dashboard.notification.recycle_course_row_success'), {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        loadCourses();
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

  const handleUpdateCourse = async ({ id, field, checked }) => {
    try {
      const response = await updateCourse({ id, [field]: checked })
      if (response) {
        toast(t('dashboard.notification.update_row_success'), {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        loadCourses();
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  }

  const getCourse = async(id) => {
    try {
      const response = await getCourseByID(id)
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
        }

        if (response?.data?.instructionVideoId) {
          try {
            if (response.data?.instructionVideo?.externalLink) {
              const responseThumb = await viewFileStreamByID(response?.data?.instructionVideoId)
              if (responseThumb?.data) {
                mergedObj.previewVideo = responseThumb.data?.externalLink
                mergedObj.fieldMedia = { previewVideo: responseThumb.data?.externalLink }
              }
            } else {
              const responseThumb = await viewFileLinkByID(response?.data?.instructionVideoId);
              if (responseThumb?.data) {
                mergedObj.previewVideo = responseThumb?.data,
                mergedObj.fieldMedia = { previewVideo: responseThumb?.data }
              }
            }
            setValues(mergedObj);
          } catch (error) {
            toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
          }
        } else {
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
          });
        }
        setPreviewCourse('desktop')
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

  const goTo = (path) => {
    router.push(path)
  }
	
	return(
		<DashboardRoute>
			<div className="animated fadeIn">
        {/* {New Layout} */}
        <Button
          type="primary"
          icon={<PlusCircleFilled />}
          size='large'
          className="d-flex align-items-center justify-content-center dark-bg tw-rounded"
          style={{ width: 240 }}
          onClick={() => router.push(RouterConstants.DASHBOARD_CREATE_COURSE.path)}
        >
          {t('dashboard.button.add_a_new_course')}
        </Button>

        <div className="section-table-form">
          <div className="tw-flex tw-items-center tw-justify-end mb-15">
            <div>
              <a onClick={() => loadCourses({ isDeleted: false })}>{t('dashboard.button.all')}</a>
            </div>
            <div className="ml-10 pl-10" style={{ borderLeft: '1px solid #ddd' }}>
              <a onClick={() => {
                setSwitchLayout('table')
                loadCourses({ isDeleted: true })
              }} className='d-flex align-items-center'>
                <DeleteOutlined className='d-flex align-items-center' />
                <span className="ml-5">{t('dashboard.button.trash')}</span>
              </a>
            </div>
          </div>

          <div className="tw-flex tw-space-x-10 tw-mb-4">
            <div className='tw-flex tw-items-center tw-space-x-4'>
              <div
                className={`${switchLayout === 'grid' ? 'tw-pointer-events-none tw-opacity-50' : 'tw-cursor-pointer'}`}
                onClick={() => setSwitchLayout('grid')}
              >
                <AppstoreOutlined className={`${switchLayout === 'grid' ? 'color-theme-2' : ''} tw-text-[24px]`} />
              </div>
              <div
                className={`tw-hidden md:tw-block ${switchLayout === 'table' ? 'tw-pointer-events-none tw-opacity-50' : 'tw-cursor-pointer'}`}
                onClick={() => setSwitchLayout('table')}
              >
                <BarsOutlined className={`${switchLayout === 'table' ? 'color-theme-2' : ''} tw-text-[24px]`} />
              </div>
            </div>
            <div className='section-form d-flex tw-space-x-4 tw-flex-1'>
              <div className="justify-content-center">
                <Select
                  showSearch
                  placeholder={t('dashboard.placeholder.select_a_language')}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  size="large"
                  className="md:tw-w-[300px]"
                  onChange={(value) => {
                    if (value !== 999999) {
                      setDisplayCourses(courses.filter(course => course.courseLanguageId === value))
                    } else {
                      setDisplayCourses(courses)
                    }
                  }}
                >
                  <Option value={999999}>{t('dashboard.button.all')}</Option>
                  {languages && languages.map((language, index) => {
                    return (
                      <Option key={index} label={language.name} value={language.id}>{language.name}</Option>
                    )}
                  )}
                </Select>
              </div>
              <div className='flex-fill'>
                <Search
                  size="large"
                  placeholder={t('dashboard.placeholder.search_course')}
                  onSearch={(value) => setDisplayCourses(courses.filter(course => course.title.includes(value)))}
                />
              </div>
            </div>
          </div>

          {switchLayout === 'grid' ? (
            <div className='section-table'>
              <ListCourseGrid
                items={displayCourses}
                dataSource={{
                  tags,
                  languages,
                  levels,
                  allInstructors
                }}
                actions={{
                  setValues,
                  setPreviewCourse,
                  handleUpdateCourse,
                  handleDeleteCourse,
                  handleRecycleCourse,
                  handleSoftDeleteCourse,
                  goTo,
                  getCourse,
                }}
              />
            </div>
          ) : null}

          {switchLayout === 'table' ? (
            <div className='section-table'>
              <ListCourseTable
                items={displayCourses}
                dataSource={{
                  tags,
                  languages,
                  levels,
                  allInstructors
                }}
                actions={{
                  setValues,
                  setPreviewCourse,
                  handleUpdateCourse,
                  handleDeleteCourse,
                  handleRecycleCourse,
                  handleSoftDeleteCourse,
                  goTo,
                  getCourse,
                }}
              />
            </div>
          ) : null}
        </div>

        {previewCourse === 'desktop' ? (
          <>
            <div style={{ position: 'fixed', top: 80,left: 0, zIndex: 10, right: 0, 'overflow-y': 'auto', height: '100vh', background: 'white' }}>
              <NewCourseDetailsWrapper
                isPreviewAdmin
                dataSource={{ allInstructors, languages, levels, tags }}
                values={values}
              />
              <span
                onClick={() => setPreviewCourse('')}
                style={{ position: 'fixed', top: 90, left: 30, zIndex: 1, color: '#A0A0A0', fontSize: 30, cursor: 'pointer' }}
              >
                <CloseCircleFilled />
              </span>
            </div>
            
          </>
        ) : null}
        {/* {End New Layout} */}
      </div>
		</DashboardRoute>
	)
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default CoursesIndex