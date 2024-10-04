import { PAGE_SIZE } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useQuery } from '@/hooks/useQuery';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import {
	CLASS_STATUS,
	IListTutorClassResponse,
	IListTutorPlansResponse,
	ITutorClassesTable, TTutorClassesSearchBy, TTutorPlansSearchBy, TUTOR_CONFIRMATION
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Pagination } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteClass, getClasses } from '@/src/services/tutorMatch/apiTutorMatch';
import dayjs from 'dayjs';
import { useMutation } from '@/hooks/useMutation';
import ButtonStatus from '../common/ButtonStatus';
import CustomTable from '../common/CustomTable';
import HeaderTable from '../common/HeaderTable';
import TutorClassesLayout from './layout/TutorClasses';

const columns: IHeaderTable<ITutorClassesTable & { tools: string }>[] = [
	{
		label: 'Class ID',
		key: 'id',
		widthGrid: '1fr',
	},
	{
		label: 'Date & time',
		key: 'datetime',
		widthGrid: '1fr',
	},
	{
		label: 'Students',
		key: 'students',
		widthGrid: '1fr',
	},
	{
		label: 'Tutors',
		key: 'tutors',
		widthGrid: '1fr',
	},
	{
		label: 'Tutor confirmation',
		key: 'tutorConfirmation',
		widthGrid: '1.5fr',
	},
	{
		label: 'Class status',
		key: 'status',
		widthGrid: '1fr',
	},
	{
		label: 'Actions',
		key: 'tools',
		widthGrid: '1fr',
	},
];

const TutorClassesTable = () => {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
/* ----------------------------- GET TUTOR CLASS ---------------------------- */
	const searchTutorClassOptions: { value: keyof TTutorClassesSearchBy; label: string }[] = [
		{
			value: 'id',
			label: 'Class ID',
		},
		{
			value: 'tutors',
			label: 'Tutor',
		},
	];

	const [listTutorClasses, setListTutorClasses] = useState<IListTutorClassResponse>({
		total: 0,
		data: [],
	});
	const [searchKey, setSearchKey] = useState<string>('');

	const getListClassQuery = useQuery<any>(
		['IListTutoringClassResponse', currentPage],
		() =>
			getClasses({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
			}),
		{
			onSuccess: (res) => {
				setListTutorClasses(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	/* ----------------------------- DELETE A CLASS ----------------------------- */
	const deleteClassMutation = useMutation<any,number>(deleteClass, {
		onSuccess: (res) => {
			toast.success('Delete class successfully');
			getListClassQuery.refetch();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	})
	return (
		<>
			<HeaderTable
				tableName={'Classes'}
				form={formSearch}
				searchOptions={searchTutorClassOptions}
				onAdd={() => router.push(RouterConstants.DASHBOARD_TUTOR_MATCH_ADD_CLASS.path)}
				onGetSearchKey={(searchKey) => {}}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={false}
				data={listTutorClasses.data.map((item) => ({
					id: item.bookingId,
					datetime: `${dayjs(item.startTime).format('DD/MM/YYYY HH:mm')}`,
					students: `${item.students.map(x => x.profile.firstName + ' ' + x.profile.lastName).join(', ')}`,
					tutors: `${item.tutor?.profile.firstName + ' ' + item.tutor?.profile.lastName}`,
					tutorConfirmation: `${item.confirmation}`,
					status: <ButtonStatus activate={item.status == CLASS_STATUS.COMPLETED} nameActivate={CLASS_STATUS.COMPLETED} nameDeactivate={CLASS_STATUS.PENDING} />,
					tools: (
						<div className="tw-flex tw-items-center tw-gap-1">
							<Button
								icon={
									<EditOutlined
										style={{
											fontSize: 16,
										}}
									/>
								}
								className="bg-theme-4 color-theme-7 !tw-border-none"
								onClick={() => router.push(`classes/${item.id}`)}
							/>
							<Button
								icon={
									<DeleteOutlined
										style={{
											fontSize: 16,
										}}
									/>
								}
								className="!tw-bg-deleteIconDavid color-theme-7 !tw-border-none"
								onClick={() => {
									deleteClassMutation.mutate(item.id)
								}}
							/>
						</div>
					),
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={listTutorClasses.total}
				pageSize={PAGE_SIZE}
				current={1}
				onChange={(page: number) => {
					console.log(page)
					setCurrentPage(page);
				}}
			/>
		</>
	);
};

export default TutorClassesTable;
