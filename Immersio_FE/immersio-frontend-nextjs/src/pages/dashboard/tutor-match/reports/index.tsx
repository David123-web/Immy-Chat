import CustomTable from '@/components/common/CustomTable';
import HeaderTable from '@/components/common/HeaderTable';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { ICommonSearchRequest, Option } from '@/src/interfaces/common/common.interface';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { ITutorMatchReportTable } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { withTranslationsProps } from '@/src/next/with-app';
import { Button, Col, Form, Modal, Pagination, Row, Table } from 'antd';
import { useState } from 'react';

interface IStudentCredit {
	studentName: string;
	remainingCredit: number;
}

const reportDummyData: ITutorMatchReportTable[] = [
	{
		report: 'Report 1',
		class: 'Greeting & Intro....',
		tutor: 'Julia Fernadez',
		student: 'Nam Nguyen',
		classDate: '19/05/2023',
		status: 'Approved',
	},
	{
		report: 'Report 2',
		class: 'Greeting & Intro....',
		tutor: 'Julia Fernadez',
		student: 'Nam Nguyen',
		classDate: '19/05/2023',
		status: 'Not Approved',
	},
	{
		report: 'Report 3',
		class: 'Greeting & Intro....',
		tutor: 'Julia Fernadez',
		student: 'Nam Nguyen',
		classDate: '19/05/2023',
		status: 'Pending',
	},
	{
		report: 'Report 4',
		class: 'Greeting & Intro....',
		tutor: 'Julia Fernadez',
		student: 'Nam Nguyen',
		classDate: '19/05/2023',
		status: 'Pending',
	},
	{
		report: 'Report 5',
		class: 'Greeting & Intro....',
		tutor: 'Julia Fernadez',
		student: 'Nam Nguyen',
		classDate: '19/05/2023',
		status: 'Pending',
	},
];

const reportColumns: IHeaderTable<ITutorMatchReportTable>[] = [
	{
		label: 'Report',
		key: 'report',
		widthGrid: '1fr',
	},
	{
		label: 'Class',
		key: 'class',
		widthGrid: '1fr',
	},
	{
		label: 'Tutor',
		key: 'tutor',
		widthGrid: '1fr',
	},
	{
		label: 'Student',
		key: 'student',
		widthGrid: '1fr',
	},
	{
		label: 'Class date',
		key: 'classDate',
		widthGrid: '1fr',
	},
	{
		label: 'Status',
		key: 'status',
		widthGrid: '1fr',
	},
];

const studentCreditDummyData: IStudentCredit[] = [
	{
		studentName: 'Nam Nguyen',
		remainingCredit: 100,
	},
	{
		studentName: 'Nam Nguyen',
		remainingCredit: 100,
	},
];

const studentCreditColumns = [
	{
		title: 'Student',
		dataIndex: 'studentName',
		key: 'studentName',
	},
	{
		title: 'Remaining credit',
		dataIndex: 'remainingCredit',
		key: 'remainingCredit',
	},
];

const TutorMatchReports = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [formSearch] = Form.useForm<ICommonSearchRequest>();
	const [isOpenReviewDetail, setIsOpenReviewDetail] = useState(false);

	/* ---------------------------- GET TUTORING PLAN --------------------------- */
	const searchTutorReportsOptions: Option<keyof any>[] = [
		{
			value: 'tutor',
			label: 'Tutor',
		},
		{
			value: 'student',
			label: 'Student',
		},
	];

	return (
		<DashboardRoute>
			<HeaderTable
				tableName={'Reports'}
				form={formSearch}
				searchOptions={searchTutorReportsOptions}
				onGetSearchKey={(searchKey) => {}}
			/>
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={reportColumns}
				isLoading={false}
				data={reportDummyData.map((item) => ({
					...item,
					report: (
						<a
							onClick={() => {
								setIsOpenReviewDetail(true);
							}}
						>
							{item.report}
						</a>
					),
				}))}
			/>
			<Pagination
				className="!tw-mt-6 tw-flex tw-justify-end"
				total={reportDummyData.length}
				pageSize={PAGE_SIZE}
				current={1}
				onChange={(page: number) => {
					setCurrentPage(page);
				}}
			/>

			<Modal
				title={<div>Class report - 19-05-2023</div>}
				open={isOpenReviewDetail}
				footer={[
					<Button
						onClick={() => {
							setIsOpenReviewDetail(false);
						}}
					>
						Reject
					</Button>,
					<Button
						onClick={() => {
							setIsOpenReviewDetail(false);
						}}
						className={`${TAILWIND_CLASS.BUTTON_ANTD}`}
					>
						Approve
					</Button>,
				]}
				width={780}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenReviewDetail(false);
				}}
			>
				<div className="tw-flex tw-flex-col tw-gap-2">
					<Row gutter={[24, 24]}>
						<Col>
							<div>
								<div className="tw-font-semibold">Class topic</div>
								<p>Sample class 1 extension</p>
							</div>
						</Col>
					</Row>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<div>
								<div className="tw-font-semibold">Tutor</div>
								<p>Julia Fernandez</p>
							</div>
						</Col>
						<Col span={8}>
							<div>
								<div className="tw-font-semibold">Class duration</div>
								<p>2 hours</p>
							</div>
						</Col>
						<Col span={8}>
							<div>
								<div className="tw-font-semibold">Applied Credit for each student</div>
								<p>10</p>
							</div>
						</Col>
					</Row>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<div className="tw-font-semibold">Student</div>
						</Col>
						<Col span={8}>
							<div className="tw-font-semibold">Remaining credit</div>
						</Col>
					</Row>
					{studentCreditDummyData.map((item) => {
						return (
							<>
								<div className='tw-w-full tw-border-[0.5px] tw-border-solid tw-border-t-0 tw-border-gray tw-border-opacity-20'> </div>
								<Row gutter={[24, 24]}>
									<Col span={8}>
										<div>
											{item.studentName}
										</div>
									</Col>
									<Col span={8}>
										<div>
											{item.remainingCredit}
										</div>
									</Col>
								</Row>
							</>
						);
					})}
				</div>
			</Modal>
		</DashboardRoute>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx);
}

export default TutorMatchReports;
