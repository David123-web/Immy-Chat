import { getCourseLanguages, getCourseLevels, getCourseTags, getLanguagesHasCourse } from '@/src/services/courses/apiCourses';
import { getAllInstructors } from '@/src/services/user/apiUser';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function useLoadCommonCourse({ isPublic = true }) {
	const [tags, setTags] = useState([]);
	const [languages, setLanguages] = useState([]);
	const [levels, setLevels] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);

	useEffect(() => {
		loadTags()
    loadLanguages()
    loadLevels()
    loadAllInstructors()
	}, [])

	const loadLanguages = async () => {
    try {
      const response = isPublic ? await getLanguagesHasCourse() : await getCourseLanguages()
      if (response?.data) {
        setLanguages(response?.data as any)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
	}

	const loadTags = async() => {
    try {
      const response = await getCourseTags()
      if (response?.data) {
        setTags(response.data as any)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  }

	const loadLevels = async() => {
    try {
      const response = await getCourseLevels()
      if (response?.data) {
        setLevels(response.data as any)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  }

  const loadAllInstructors = async() => {
    try {
      const response = await getAllInstructors()
      if (response?.data) {
        setAllInstructors(response.data as any)
      }
    } catch (error) {
      toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
    }
  }

  return {
    tags,
    setTags,
    languages,
    setLanguages,
    levels,
    setLevels,
    allInstructors,
    setAllInstructors
  }
}
