import { PAGE_SIZE } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useQuery } from '@/hooks/useQuery';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import {
	IListTutorPlansResponse,
	ITutorPlansTable,
	PLAN_STATUS,
	TTutorPlansSearchBy,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { getPlan } from '@/src/services/tutorMatch/apiTutorMatch';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Pagination } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import TutorClassesLayout from '../../../../../../components/TutorMatch/layout/TutorClasses';
import ButtonStatus from '../../../../../../components/common/ButtonStatus';
import CustomTable from '../../../../../../components/common/CustomTable';
import HeaderTable from '../../../../../../components/common/HeaderTable';
const { Panel } = Collapse;

const columns: IHeaderTable<ITutorPlansTable & { plans: string; tools: string }>[] = [
	{
		label: 'Plan name',
		key: 'title',
		widthGrid: '1fr',
	},
	{
		label: 'Tutors',
		key: 'tutors',
		widthGrid: '1fr',
	},
	{
		label: 'Tutoring session plan',
		key: 'plans',
		widthGrid: '1fr',
	},
	{
		label: 'Status',
		key: 'status',
		widthGrid: '1fr',
	},
	{
		label: 'Actions',
		key: 'tools',
		widthGrid: '1fr',
	},
];

const TutorPlansTable = () => {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();

	/* ---------------------------- GET TUTORING PLAN --------------------------- */
	const searchTutorPlanOptions: { value: keyof TTutorPlansSearchBy; label: string }[] = [
		{
			value: 'title',
			label: 'Plan name',
		},
		{
			value: 'tutors',
			label: 'Tutor',
		},
		{
			value: 'status',
			label: 'Status',
		},
	];

	const [listTutoringPlan, setListTutoringPlan] = useState<IListTutorPlansResponse>({
		total: 0,
		plans: [],
	});
	const [searchKey, setSearchKey] = useState<string>('');

	const getTutorPlanQuery = useQuery<any>(
		['IListTutoringPlanResponse', currentPage],
		() =>
			getPlan({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
			}),
		{
			onSuccess: (res) => {
				setListTutoringPlan(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	return (
		<TutorClassesLayout>
			<HeaderTable
				tableName={'Plans'}
				form={formSearch}
				searchOptions={searchTutorPlanOptions}
				onAdd={() => router.push(RouterConstants.DASHBOARD_TUTOR_MATCH_ADD_PLAN.path)}
				onGetSearchKey={(searchKey) => {
					setSearchKey(searchKey ?? '');
					getTutorPlanQuery.refetch();
				}}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={getTutorPlanQuery.isFetching}
				data={listTutoringPlan.plans.map((item) => ({
					title: item.title,
					tutors: `${item.tutors.map((tutor) => tutor.profile.firstName + ' ' + tutor.profile.lastName).join(', ')}`,
					status: (
						<ButtonStatus
							activate={item.status == PLAN_STATUS.PRIVATE}
							nameActivate={PLAN_STATUS.PRIVATE}
							nameDeactivate={PLAN_STATUS.PUBLISH}
						/>
					),
					plans: (
						<Button
							className={`${'bg-theme-3'
							} color-theme-7 !tw-border-none tw-rounded-lg`}
							onClick={() => router.push({pathname: `classes/add`, query: {planId: item.id}})}
						>
							Add Class
						</Button>
					),
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
								onClick={() => router.push(`plans/${item.id}`)}
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
								onClick={() => {}}
							/>
						</div>
					),
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={listTutoringPlan.total}
				pageSize={PAGE_SIZE}
				current={1}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>
		</TutorClassesLayout>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default TutorPlansTable;
