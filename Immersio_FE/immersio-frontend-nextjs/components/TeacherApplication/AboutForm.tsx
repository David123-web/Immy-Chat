import { TAILWIND_CLASS } from '@/constants';
import { useQuery } from '@/hooks/useQuery';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { IGetListCountriesResponse, IGetProficiencyLevelsResponse } from '@/src/interfaces/common/common.interface';
import { IPostProfileTeacher } from '@/src/interfaces/user/user.interface';
import { getListCountries, getListProficiencyLevels } from '@/src/services/common/apiCommon';
import { useMobXStores } from '@/src/stores';
import { ExclamationOutlined, QuestionOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select, Space, Tooltip } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { observer } from 'mobx-react-lite';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

export interface ITeacherSubForm {
	setStorageData: Dispatch<SetStateAction<IPostProfileTeacher>>;
	formInstance: FormInstance<any>;
	stepSelected: number;
	setCurrentStep: Dispatch<SetStateAction<number>>;
	setStepSelected: Dispatch<SetStateAction<number>>;
}

const AboutForm = (props: ITeacherSubForm) => {
	const { globalStore } = useMobXStores();

	const onFinish = (data: IPostProfileTeacher) => {
		props.setCurrentStep(1);
		props.setStorageData((prev) => ({ ...prev, ...data }));
	};

	return (
		<Form layout="vertical" form={props.formInstance} onFinish={onFinish}>
			<Form.Item
				name="firstName"
				label="First name"
				rules={[
					{
						required: true,
						message: 'Please input your first name!',
					},
				]}
			>
				<Input placeholder="First name" />
			</Form.Item>
			<Form.Item
				name="lastName"
				label="Last name"
				rules={[
					{
						required: true,
						message: 'Please input your first name!',
					},
				]}
			>
				<Input placeholder="Last name" />
			</Form.Item>
			<Row gutter={24}>
				<Col
					xs={{
						span: 24,
					}}
					md={{
						span: 12,
					}}
				>
					<Form.Item label="what's the best phone number to contact you?">
						<Space.Compact className="tw-w-full">
							<Form.Item initialValue={globalStore.listCountries[0].dialCode} className="!tw-mb-0" name="dialCode">
								<Select
									options={globalStore.listCountries.map((item) => ({
										label: `${item.emoji} ${item.dialCode}`,
										value: item.dialCode,
									}))}
									className="!tw-w-24"
									showSearch
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
								/>
							</Form.Item>
							<Form.Item
								rules={[
									{
										pattern: /^[0-9]*$/,
										message: 'This is not valid phone number',
									},
									{
										max: 12,
										message: 'This is not valid phone number',
									},
								]}
								className="!tw-mb-0 tw-w-full"
								name="phoneNumber"
							>
								<Input placeholder="Enter phone number" />
							</Form.Item>
						</Space.Compact>
					</Form.Item>
				</Col>
				<Col
					xs={{
						span: 24,
					}}
					md={{
						span: 12,
					}}
				>
					<Form.Item
						name="hourRate"
						label="Hourly rate"
						rules={[
							{
								required: true,
								message: 'Please input your hourly rate!',
							},
						]}
					>
						<InputNumber<string>
							className="tw-w-full"
							formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							style={{ width: '100%' }}
							min="0"
							step="0.01"
							stringMode
							parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={24}>
				<Col
					xs={{
						span: 24,
					}}
					md={{
						span: 24,
					}}
				>
					<Form.Item
						name="languageCodes"
						label="Languages spoken"
						rules={[
							{
								required: true,
								message: 'Please select your language!',
							},
						]}
					>
						<Select
							mode="multiple"
							showSearch
							placeholder="Select your language"
							filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
							options={globalStore.courseLanguages.map((la) => ({
								value: la.code,
								label: la.name,
							}))}
						/>
					</Form.Item>
				</Col>
				{/* <Col
					xs={{
						span: 24,
					}}
					md={{
						span: 12,
					}}
				>
					<Form.Item
						name="proficiencyLevelCode"
						label="Level"
						rules={[
							{
								required: true,
								message: 'Please select your level!',
							},
						]}
					>
						<Select
							showSearch
							placeholder="Select your level of proficiency"
							filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
							options={globalStore.proficiencyLevels.map((p) => ({
								value: p.code,
								label: p.name,
							}))}
						/>
					</Form.Item>
				</Col> */}
			</Row>
			<Form.Item name="website" label="What are the best websites to represent you?">
				<Input placeholder="Examples can include LinkedIn profiles, university faculty pages, Social Media links, etc." />
			</Form.Item>
			<Form.Item
        name="role"
        initialValue={ROLE_TYPE.INSTRUCTOR}
        label="Which role are you applying for?"
      >
        <Radio.Group value={ROLE_TYPE.INSTRUCTOR}>
          <Radio value={ROLE_TYPE.INSTRUCTOR}>Instructor</Radio>
          <Radio value={ROLE_TYPE.TUTOR}>Tutor</Radio>
        </Radio.Group>
      </Form.Item>
			<Form.Item
				label="Age"
				name="age"
				valuePropName="checked"
				rules={[
					{
						validator: (_, value) =>
							value ? Promise.resolve() : Promise.reject(new Error('Please confirm you are over 18!')),
					},
				]}
			>
				<Checkbox value="over">I confirm that I am over 18</Checkbox>
			</Form.Item>
		</Form>
	);
};

export default observer(AboutForm);
