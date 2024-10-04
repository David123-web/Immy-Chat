import { TagsOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CourseTagsModal from '../../../../components/Instructor/modals/CourseTagsModal'
import ListCourseTagsTable from '../../../../components/Instructor/tables/ListCourseTagsTable'
import DashboardRoute from '../../../../components/routes/DashboardRoute'
import { withTranslationsProps } from '../../../next/with-app'
import { createCourseTags, deleteCourseTags, getCourseTags, updateCourseTags } from '../../../services/courses/apiCourses'

const { Search } = Input;

const CourseTagsPage = () => {
  const { t } = useTranslation()

  const [tags, setTags] = useState([])
  const [visible, setVisible] = useState(false)
  const [defaultValue, setValue] = useState({})
  const [isEdit, setEdit] = useState(false)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async() => {
    try {
      const response = await getCourseTags()
      if (response?.data) {
        setTags(response.data)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  }

  const handleDeleteCourseTag = async (id) => {
    try {
      const response = await deleteCourseTags(id)
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
        loadTags();
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  }

  const handleEditCourseTag = async (record) => {
    setVisible(true)
    setEdit(true)
    setValue(record)
  }

  const onFinish = async (data, edit) => {
    try {
      console.log('updating course tag')
      console.log(`edit ${edit}`);
      console.log(`${JSON.stringify(data, null, 2)}`)
      const response = await edit ? updateCourseTags(data.id, data) : createCourseTags(data)
      if (response) {
        toast(edit ? t('dashboard.notification.update_row_success') : t('dashboard.notification.add_row_success'), {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setVisible(false)
        setValue({})
        loadTags();
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  }

  return(
    <DashboardRoute>     
      <div className="animated fadeIn">
        <div className="section-head d-flex mb-4">
          <div className='flex-fill mr-30'>
            <h3 className='mb-5'>{t('dashboard.option.course_tags')}</h3>
            <p>
              {t('dashboard.label.use_tags_to_categorize_your_save_courses')}
            </p>
          </div>
          <Button
            type="primary"
            icon={<TagsOutlined />}
            size='large'
            shape="round"
            className="px-5"
            onClick={() => {
              setVisible(true)
              setValue({})
            }}
          >
            {t('dashboard.button.create_tag')}
          </Button>
        </div>

        <div className="section-table-form">
          <div className='section-form mb-20'>
            <Search
              placeholder="Search"
              onSearch={(value) => {
                // setDisplayLessons(lessons.filter(lesson => lesson.title.includes(value)))
              }}
              className='w-100'
            />
          </div>

          <ListCourseTagsTable
            items={tags || []}
            actions={{
              handleDeleteCourseTag,
              handleEditCourseTag,
            }}
          />
        </div>

        <div className="section-modal">
          <CourseTagsModal
            isEdit={isEdit}
            initialValues={defaultValue}
            onFinish={onFinish}
            visible={visible}
            setVisible={setVisible}
          />
        </div>
      </div>
    </DashboardRoute>     
  )
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default CourseTagsPage