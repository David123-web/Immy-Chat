import Recordings from '@/components/Recordings';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { getAllCourses, getCourseByID } from '@/src/services/courses/apiCourses';
import { uploadFile } from '@/src/services/files/apiFiles';
import { getLesson } from '@/src/services/lessons/apiLessons';
import { deleteRecords, getRecords, postRecords } from '@/src/services/video-record/apiRecord';
import { useMobXStores } from '@/src/stores';
import { Spin } from 'antd';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

const StudentRecordingsPage = () => {
  const { t } = useTranslation()
  const [loadingSpinning, setLoadingSpinning] = useState(false);
  const { userStore } = useMobXStores();
  const [records, setRecords] = useState([]);
	const [courses, setCourses] = useState([]);
	const [lessons, setLessons] = useState([]);
  const [values, setValues] = useState({});

  useEffect(() => {
    loadCourses()
  }, [])

	const loadCourses = async () => {
    try {
      const response = await getAllCourses('')
      if (response?.data) {
        // @ts-ignore
        setCourses(response.data)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

  const getLessonAPI = async (lessonId) => {
    try {
      const response = await getLesson(lessonId)
			return response?.data
    } catch (err) {
      return {}
    }
	}

  const getLessons = async (courseId) => {
		setLoadingSpinning(true);

		let less0ns = []
    try {
      const { data: currentCourse } = await getCourseByID(courseId)

      if (currentCourse) {
        // @ts-ignore
        const orderedSections = (currentCourse?.sections || []).sort((a, b) => a.index - b.index)
        orderedSections.forEach((session) => {
          const orderedLessons = (session?.lessons || []).sort((a, b) => a.index - b.index)
          orderedLessons.forEach((item) => {
            less0ns.push(item)
          })
        })
        setLessons(less0ns)
  
        let currentLesson
        if (less0ns.length > 0) {
          currentLesson = less0ns[0]
        }
  
        if (currentLesson) {
          setValues({
            ...values,
            course: courseId,
            lesson: currentLesson.id,
          })
          await getIDDialog(currentLesson.id, courseId)
        }
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
		} finally {
			setLoadingSpinning(false);
		}
	}

  const getIDDialog = async (currentLessonID, courseId) => {
    setLoadingSpinning(true);

    const lessonDetail = await getLessonAPI(currentLessonID)
    setValues({
      ...values,
      course: courseId,
      lesson: currentLessonID,
      // @ts-ignore
      dialogId: lessonDetail?.dialogs[0].id,
    })
    // @ts-ignore
    await loadRecords(lessonDetail?.dialogs[0].id)
  }

  const loadRecords = async (dialogId) => {
    try {
      const response = await getRecords({
      sendToUserId: userStore?.currentUser?.id,
      dialogId
    })
      // @ts-ignore
      if (response?.data?.length) {
        // @ts-ignore
        setRecords(response?.data)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    } finally {
      setLoadingSpinning(false);
    }
  }

  const deleteRecord = async (id) => {
    setLoadingSpinning(true);
    try {
      const response = await deleteRecords(id)
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
        // @ts-ignore
        await getIDDialog(values.lesson, values.course);
      }
    } catch (err) {
      toast.error(t('dashboard.notification.delete_row_error'));
    } finally {
      setLoadingSpinning(false);
    }
  }

  const handleSubmit = async (audioBlob, feedback, query) => {
    setLoadingSpinning(true)

    try {
      const formData = new FormData();
      formData.append("file", new File([audioBlob], `audio-record-teacher.mp3`, {type: "audio/mpeg"}));
      formData.append("public", "false");

      const response = await uploadFile(formData)
      if (response?.data) {
        const responsePostRecord = await postRecords({
          sendToUserId: query.sendToUserId,
          dialogLineId: query.dialogLineId,
          type: "FEEDBACK",
          // @ts-ignore
          fileId: response?.data?.id,
          feedback,
        })

        if (responsePostRecord) {
          toast.success(t('dashboard.notification.sent_row_success'));
        }
      }
    } catch (err) {
      toast.error(t('dashboard.notification.sent_row_error'));
    } finally {
      setLoadingSpinning(false);
    }
	}

	return (
		<>
			<Head>
				<title>Student Recordings</title>
				<meta name="description" content="Generated by create next app" />
			</Head>

			<DashboardRoute>
        <div className="animated fadeIn">
          <Spin spinning={loadingSpinning}>
            <Recordings
              userStore={userStore}
              role={ROLE_TYPE.INSTRUCTOR}
              items={records}
              values={values}
              dataSource={{
                courses,
                lessons
              }}
              actions={{
                getLessons,
                setValues,
                getIDDialog,
                deleteRecord,
                handleSubmit
              }}
            />
          </Spin>
        </div>
      </DashboardRoute>
		</>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default StudentRecordingsPage;
