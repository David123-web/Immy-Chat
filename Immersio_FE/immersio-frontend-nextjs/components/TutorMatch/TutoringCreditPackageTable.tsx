import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import {
	ICreateUpdateCreditPlanForm,
	IListTutoringCreditPackage,
	TUTORING_CREDIT_PACKAGE_STATUS,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Pagination, Switch } from 'antd';
import React, { useState } from 'react';
import FormSwitch from '../People/FormSwitch';
import ButtonStatus from '../common/ButtonStatus';
import CustomTable from '../common/CustomTable';
import HeaderTable from '../common/HeaderTable';

const columns: IHeaderTable<IListTutoringCreditPackage & { tools: string }>[] = [
	{
		label: 'Title',
		key: 'title',
		widthGrid: '1fr',
	},
	{
		label: 'Price',
		key: 'price',
		widthGrid: '1fr',
	},
	{
		label: 'Credit value',
		key: 'creditValue',
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

interface ITutoringCreditPackageTable {
	data: IListTutoringCreditPackage[];
	loading: boolean;
	refetch: () => void;
}

const TutoringCreditPackageTable = (props: ITutoringCreditPackageTable) => {
	const { data, loading, refetch } = props;
	const [isOpenAddUpdateCreditPlan, setIsOpenAddUpdateCreditPlan] = useState<boolean>(false);
	const [formAddUpdateCreditPlan] = Form.useForm<ICreateUpdateCreditPlanForm>();
	return (
		<>
			{/* <HeaderTable tableName="Tutoring credit package">
				<div className="tw-flex tw-items-center">
					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-text-sm`}
						icon={<PlusOutlined />}
						onClick={() => {
							setIsOpenAddUpdateCreditPlan(true);
						}}
					>
						<span className="tw-text-[12px]">Add plan</span>
					</Button>
				</div>
			</HeaderTable> */}
			<CustomTable
				className="border-theme-6 tw-border tw-border-solid tw-shadow-lg tw-rounded-b-xl"
				columns={columns}
				isLoading={loading}
				data={data.map((item) => ({
					...item,
					status: (
						<ButtonStatus
							activate={!!item.status}
							nameActivate={TUTORING_CREDIT_PACKAGE_STATUS.ACITVE}
							nameDeactivate={TUTORING_CREDIT_PACKAGE_STATUS.DEACTIVE}
						/>
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
								onClick={() => {}}
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
				total={data.length}
				pageSize={PAGE_SIZE}
				current={1}
				onChange={(page: number) => {
					// setCurrentPage(page);
				}}
			/>

			<Modal
				title={<div className="tw-text-lg tw-font-bold">Add tutoring credit plan</div>}
				width={450}
				style={{ top: 20 }}
				open={isOpenAddUpdateCreditPlan}
				footer={
					<Button
						htmlType="submit"
						form="user"
						className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-full tw-rounded-lg`}
						loading={false}
					>
						{false ? 'Update' : 'Add'}
					</Button>
				}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenAddUpdateCreditPlan(false);
				}}
				afterClose={() => formAddUpdateCreditPlan.resetFields()}
			>
				<Form id="creditPlan" onFinish={() => {}} form={formAddUpdateCreditPlan} layout="vertical">
					<Form.Item
						name="title"
						label="Title"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input placeholder="Enter the name of the credit plan" />
					</Form.Item>
					<Form.Item
						name="price"
						label="Price"
						rules={[
							{
								required: true,
							},
						]}
					>
						<InputNumber prefix="$" placeholder="Enter the price value of the plan" style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name="creditValue"
						label="Credit value"
						rules={[
							{
								required: true,
							},
						]}
					>
						<InputNumber
							prefix="$"
							placeholder="Enter the tutoring credit value of the plan"
							style={{ width: '100%' }}
						/>
					</Form.Item>
					<Form.Item
						label="Active this credit plan"
						initialValue={true}
						name="isActive"
						style={{ width: '100%' }}
					>
						<Switch />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default TutoringCreditPackageTable;
