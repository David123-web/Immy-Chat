import CustomTable from '@/components/common/CustomTable';
import HeaderTable from '@/components/common/HeaderTable';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { useQuery } from '@/hooks/useQuery';
import { ICommonSearchRequest } from '@/src/interfaces/common/common.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import {
	ITutorMatchReviewDetail,
	ITutorMatchReviewDetailResponse,
	ITutorMatchReviewTable,
	TTutorMatchReviewDetailSearchBy,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { getReviews } from '@/src/services/tutorMatch/apiTutorMatch';
import { Button, Col, Form, Modal, Pagination, Rate, Row } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';

const columns: IHeaderTable<ITutorMatchReviewTable>[] = [
	{
		label: 'Review',
		key: 'review',
		widthGrid: '2fr',
	},
	{
		label: 'Date written',
		key: 'createdAt',
		widthGrid: '1fr',
	},
	{
		label: 'Review hours',
		key: 'hours',
		widthGrid: '1fr',
	},
	{
		label: 'Star rating',
		key: 'rate',
		widthGrid: '1fr',
	},
];

const TutorMatchReviews = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [isOpenReviewDetail, setIsOpenReviewDetail] = useState(false);
	const [selectedTutorMatchReview, setSelectedTutorMatchReview] = useState<ITutorMatchReviewDetail>(null);

	/* ------------------------- GET TUTOR MATCH REVIEW ------------------------- */
	const searchTutorReviewsOptions: { value: keyof TTutorMatchReviewDetailSearchBy; label: string }[] = [
		{
			value: 'rate',
			label: 'Rate',
		},
	];

	const [listTutorMatchReview, setListTutorMatchReview] = useState<ITutorMatchReviewDetailResponse>({
		total: 0,
		data: [],
	});

	const [searchKey, setSearchKey] = useState<string>('');

	const geReviewsQuery = useQuery<any>(
		['ITutorMatchReviewDetailResponse', currentPage],
		() =>
			getReviews({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPage - 1),
			}),
		{
			onSuccess: (res) => {
				console.log(res);
				setListTutorMatchReview(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	return (
		<DashboardRoute>
			<HeaderTable
				tableName={'Reviews'}
				form={formSearch}
				searchOptions={searchTutorReviewsOptions}
				onGetSearchKey={(searchKey) => {}}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={geReviewsQuery.isFetching}
				data={listTutorMatchReview.data.map((item) => ({
					review: (
						<div
							className="color-theme-3"
							onClick={() => {
								setSelectedTutorMatchReview(item)
								setIsOpenReviewDetail(true);
							}}
						>{`${item.tutor.profile.firstName} ${item.tutor.profile.lastName} review of ${item.student.profile.firstName} ${item.student.profile.lastName}`}</div>
					),
					createdAt: new Date(item.createdAt).toLocaleDateString(),
					hours: `${item.hours} hours`,
					rate: <Rate disabled defaultValue={item.rate} />,
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={listTutorMatchReview.total}
				pageSize={PAGE_SIZE}
				current={currentPage}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>

			<Modal
				title={'Reviews'}
				open={isOpenReviewDetail}
				footer={[
					<Button
						onClick={() => {
							setIsOpenReviewDetail(false);
						}}
					>
						Delete
					</Button>,
					<Button
						onClick={() => {
							setIsOpenReviewDetail(false);
						}}
						className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
					>
						Close
					</Button>,
				]}
				width={600}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenReviewDetail(false);
				}}
			>
				<div className="tw-flex tw-flex-col tw-gap-2">
					<Row gutter={[24, 24]}>
						<Col className="tw-text-right" span={4}>
							<div>Student:</div>
							<div>Tutor:</div>
						</Col>
						<Col className="tw-text-left color-theme-3" span={8}>
							<div>{`${selectedTutorMatchReview?.student.profile.firstName} ${selectedTutorMatchReview?.student.profile.lastName}`}</div>
							<div>{`${selectedTutorMatchReview?.tutor.profile.firstName} ${selectedTutorMatchReview?.tutor.profile.lastName}`}</div>
						</Col>
						<Col className="tw-text-right" span={6}>
							<div>Date written:</div>
							<div>Review hours:</div>
						</Col>
						<Col className="tw-text-left color-theme-3" span={6}>
							<div>{new Date(selectedTutorMatchReview?.createdAt).toLocaleDateString()}</div>
							<div>{selectedTutorMatchReview?.hours} hours</div>
						</Col>
					</Row>

					<div className="tw-flex tw-flex-col tw-gap-2 tw-items-center">
						<span>Review rating</span>
						<Rate disabled defaultValue={selectedTutorMatchReview?.rate}></Rate>
					</div>
					<div>
						<div className="tw-font-semibold">Review detail</div>
						<p>
							{selectedTutorMatchReview?.details}
						</p>
					</div>
				</div>
			</Modal>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default TutorMatchReviews;
