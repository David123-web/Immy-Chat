import React, { useState } from 'react'
import ListStudentClassess from '../MySpace/ListStudentClassess'
import { IListTutorClassResponse, TTutorClassesSearchBy } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { useQuery } from '@/hooks/useQuery';
import { getClasses } from '@/src/services/tutorMatch/apiTutorMatch';
import { toast } from 'react-toastify';
import { globalStore } from '@/src/stores/global/global.store';

const StudentClassList = () => {
  /* ----------------------------- GET TUTOR CLASS ---------------------------- */
	const [listTutorClasses, setListTutorClasses] = useState<IListTutorClassResponse>({
		total: 0,
		data: [],
	});

	const getListClassQuery = useQuery<IListTutorClassResponse>(
		['IListStudentClassResponse'],
		() =>
			getClasses(),
		{
			onSuccess: (res) => {
				setListTutorClasses(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);
  return (
    listTutorClasses.data && <ListStudentClassess refetchData={getListClassQuery.refetch} data={listTutorClasses.data} hasFilter/>
  )
}

export default StudentClassList