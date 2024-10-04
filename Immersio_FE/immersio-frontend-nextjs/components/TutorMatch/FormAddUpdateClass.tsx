import { PAGE_SIZE, TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import {
	IAddClassForm,
	IFormPriceGroup,
	IListTutorPlansResponse,
	IUploadMaterialResponse,
	IUploadMaterialRequest,
	IAddClassRequest,
	IGetClassByIdResponse,
	IUpdateClassRequest,
	IClassCampusRoom,
	IGetRoomByIdRequest,
	IGetRoomByIdResponse,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import {
	addClass,
	getCampusRoomById,
	getCampusRooms,
	getClassById,
	getPlan,
	updateClass,
	uploadMaterial,
} from '@/src/services/tutorMatch/apiTutorMatch';
import { useMobXStores } from '@/src/stores';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Select, Row, Col, DatePicker, Input, Button, InputNumber, Checkbox, Radio, Modal } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import TutorClassesLayout from './layout/TutorClasses';
import moment from 'moment';
import { set } from 'mobx';
import { RepeatType } from '@/src/interfaces/people/people.interface';
import CheckCampusAvailabilityModal from './CheckCampusAvailabilityModal';
import dayjs from 'dayjs';

type UserOption = {
	id: number;
	profile: {
		firstName: string;
		lastName: string;
	};
};

type FormAddUpdateClassProps = {
	isUpdate?: boolean;
};

const FormAddUpdateClass = (props: FormAddUpdateClassProps) => {
	const { isUpdate = false } = props;
	const router = useRouter();
	const { globalStore } = useMobXStores();
	const [formAddClass] = Form.useForm<IAddClassForm>();
	const [formPriceGroup] = Form.useForm();
	const [priceGroup, setPriceGroup] = useState<
		{
			studentNumber: number;
			hourRate: number;
		}[]
	>([
		{
			studentNumber: 0,
			hourRate: 0,
		},
	]);

	const [isOpenPriceGroupModal, setIsOpenPriceGroupModal] = useState(false);
	const [isOpenCampusAvailabilityModal, setIsOpenCampusAvailabilityModal] = useState(false);
	const [isRepeat, setIsRepeat] = useState(false);
	const [repeatType, setRepeatType] = useState<RepeatType>(RepeatType.DAY);
	const [isOnline, setIsOnline] = useState(false);

	/* ---------------------------- GET LIST OF PLANS --------------------------- */
	const [currentPlanPage, setCurrentPlanPage] = useState(1);
	const [studentOptions, setStudentOptions] = useState<UserOption[]>([]);
	const [tutorOptions, setTutorOptions] = useState<UserOption[]>([]);

	const [listTutorPlan, setListTutorPlan] = useState<IListTutorPlansResponse>({
		total: 0,
		plans: [],
	});

	const getTutorPlanQuery = useQuery<any>(
		['IListTutorPlanResponse'],
		() =>
			getPlan({
				take: PAGE_SIZE,
				skip: PAGE_SIZE * (currentPlanPage - 1),
			}),
		{
			onSuccess: (res) => {
				setListTutorPlan({
					total: res.data.total,
					plans: listTutorPlan.plans
						.concat(res.data.plans)
						.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id)),
				});
				if (res.data.plans.length === 0) {
					setCurrentPlanPage(1);
				} else {
					setCurrentPlanPage(currentPlanPage + 1);
				}
				setListTutorPlan(res.data);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	const onLoadingPlan = (event: any) => {
		const target = event.target;
		if (
			target.scrollTop + target.offsetHeight === target.scrollHeight &&
			listTutorPlan.total > listTutorPlan.plans.length
		) {
			getTutorPlanQuery.refetch();
		}
	};

	/* ------------------------------- PRICE GROUP ------------------------------ */
	const onAddUpdatePriceGroup = (data) => {
		const priceGroupData = Object.keys(data)
			.filter((key) => data[key] != null && data[key]?.price !== '')
			.map((key) => ({
				studentNumber: parseInt(key),
				hourRate: parseInt(data[key].price),
			}));
		setPriceGroup(priceGroupData);
		setIsOpenPriceGroupModal(false);
	};

	/* --------------------------- CREATE A NEW CLASS --------------------------- */
	const createClassMutation = useMutation<any, IAddClassRequest>(addClass, {
		onSuccess: (res) => {
			toast.success('Create class successfully');
			formAddClass.resetFields();
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ----------------------------- UPDATE A CLASS ----------------------------- */
	const updateClassMutation = useMutation<any, { id: number; body: IUpdateClassRequest }>(updateClass, {
		onSuccess: (res) => {
			toast.success('Update class successfully');
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ----------------------------- GET CLASS BY ID ---------------------------- */
	const [classData, setClassData] = useState<IGetClassByIdResponse>();
	const getClassByIdQuery = useQuery<any, IGetClassByIdResponse>(
		['IGetClassByIdResponse'],
		() => getClassById(parseInt(router.query.id as string)),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setClassData(res.data);
				setPriceGroup(res.data.studentChargeRateHour);
				formAddClass.setFieldsValue({
					planId: res.data.planId,
					startTime: moment(res.data.startTime),
					finishTime: moment(res.data.finishTime),
					timezoneAbbr: res.data.timezoneAbbr,
					topic: res.data.topic,
					tutorChargeRateHour: res.data.tutorChargeRateHour,
					studentPremiumAmount: res.data.studentPremiumAmount,
					studentChargeRateHour: res.data.studentChargeRateHour,
					maxStudents: res.data.maxStudents,
					campusId: res.data.campusId,
					virtualClassLink: res.data.virtualClassLink,
					isRepeat: res.data.isRepeat,
					isPublic: res.data.isPublic,
					studentIds: res.data.students.map((x) => x.id),
					tutorId: res.data.tutorId,
					repeatType: res.data.repeatType,
					repeatData: res.data.repeatData,
				});
				res.data.repeatUntilDate && formAddClass.setFieldValue('repeatUntilDate', moment(res.data.repeatUntilDate));
				// formPriceGroup.setFieldsValue(
				// 	res.data.studentChargeRateHour.reduce((acc, { hourRate, studentNumber }) => {
				// 		acc[studentNumber] = { price: hourRate.toString() };
				// 		return acc;
				// 	}, {})
				// );
				setIsRepeat(res.data.isRepeat);
				setIsOnline(res.data.virtualClassLink !== null);
				formAddClass.setFieldValue('location', res.data.virtualClassLink ?? res.data.roomId);
				res.data.roomId && setSelectedCampusRoomId(res.data.roomId)
				res.data.repeatType && setRepeatType(res.data.repeatType);
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);

	useEffect(() => {
		if (classData && listTutorPlan.total > 0) {
			setTutorOptions(listTutorPlan.plans.find((la) => la.id === classData.planId).tutors);
			setStudentOptions(listTutorPlan.plans.find((la) => la.id === classData.planId).students);
		}
	}, [classData && listTutorPlan.total > 0]);

	/* ---------------------- SUBMIT ADD/UPDATE CLASS FORM ---------------------- */
	const onFinish = (data: any) => {
		const addClassRequestModel = {
			...data,
			roomId: isOnline ? null : selectedCampusRoomId,
			virtualClassLink: isOnline ? data.location : null,
			startTime: moment(data.startTime).utc().format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z'),
			finishTime: moment(data.finishTime).utc().format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z'),
		};
		if (selectedCampusRoomId === null || isRoomAvaliable.current) {
			if (isUpdate) {
				updateClassMutation.mutate({ id: parseInt(router.query.id as string), body: addClassRequestModel });
			} else {
				createClassMutation.mutate(addClassRequestModel);
			}
		} else {
			toast.error('Room is not available');
		}
	};

	/* ---------------------------- GET LIST OF ROOMS --------------------------- */
	const [listCampusRooms, setListCampusRooms] = useState<IClassCampusRoom[]>([]);
	const [selectedCampusRoomId, setSelectedCampusRoomId] = useState<string>(null);
	const isRoomAvaliable = useRef<boolean>(true);

	const getCampusQuery = useQuery<IClassCampusRoom[]>(['IClassCampusRoom'], () => getCampusRooms(), {
		onSuccess: (res) => {
			setListCampusRooms(res.data);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	const checkCampusRoomAvailabilityMutation = useMutation<IGetRoomByIdResponse, IGetRoomByIdRequest>(
		getCampusRoomById,
		{
			onSuccess: (res) => {
				isRoomAvaliable.current = res.data.availableTimes.length > 0;
				setIsOpenCampusAvailabilityModal(true);
			},
			onError: (err) => {
				toast.error(err.data?.message);
			},
		}
	);

	const onCheckCampusRoomAvailability = () => {
		if (
			selectedCampusRoomId &&
			formAddClass.getFieldValue('startTime') &&
			formAddClass.getFieldValue('finishTime')
		) {
			checkCampusRoomAvailabilityMutation.mutate({
				id: selectedCampusRoomId,
				start: dayjs(formAddClass.getFieldValue('startTime')).format('YYYY-MM-DDTHH:mm'),
				end: dayjs(formAddClass.getFieldValue('finishTime')).format('YYYY-MM-DDTHH:mm'),
			});
		} else {
			toast.error('Please select start and finish time');
		}
	};

	useEffect(() => {
		if (router.query.planId)
			formAddClass.setFieldsValue({
				planId: router.query.planId as string,
			});
	}, [router.query]);

	return (
		<TutorClassesLayout>
			<div
				onClick={() => router.push(RouterConstants.DASHBOARD_TUTOR_MATCH_CLASSES_CLASSES.path)}
				className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-font-bold tw-text-xl"
			>
				<LeftOutlined className="tw-mr-4" />
				{isUpdate ? 'Update' : 'Add'} Class
			</div>
			<div>
				<Form className="tw-w-full tw-m-auto tw-mt-6" onFinish={onFinish} form={formAddClass} layout="vertical">
					<Form.Item
						name="planId"
						label="Plan"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Select
							showSearch
							placeholder="Select a plan"
							filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
							options={listTutorPlan.plans.map((la) => ({
								value: la.id,
								label: la.title,
							}))}
							onChange={(value) => {
								setTutorOptions(listTutorPlan.plans.find((la) => la.id === value).tutors);
								setStudentOptions(listTutorPlan.plans.find((la) => la.id === value).students);
							}}
							onPopupScroll={onLoadingPlan}
						/>
					</Form.Item>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<Form.Item
								name="startTime"
								label="Start Time"
								rules={[
									{
										required: true,
									},
								]}
							>
								<DatePicker
									format={'DD-MM-YYYY HH:mm'}
									className="tw-w-full"
									showTime={{ format: 'HH:mm' }}
									placeholder="Set start date and time"
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="finishTime"
								label="Finish Time"
								rules={[
									{
										required: true,
									},
								]}
							>
								<DatePicker
									format={'DD-MM-YYYY HH:mm'}
									className="tw-w-full"
									showTime={{ format: 'HH:mm' }}
									placeholder="Set finish date and time"
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="timezoneAbbr"
								label="Time Zone"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select a timezone"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={globalStore.timezone.map((la) => ({
										value: la.value,
										label: la.text,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name="topic"
						label="Topic"
						rules={[
							{
								required: true,
							},
						]}
					>
						<Input placeholder="Enter a topic" />
					</Form.Item>
					<Row gutter={[24, 24]}>
						<Col span={12}>
							<Form.Item
								name="studentIds"
								label="Students"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Add students"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={studentOptions.map((la) => ({
										value: la.id,
										label: la.profile.firstName + ' ' + la.profile.lastName,
									}))}
									mode="multiple"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="tutorId"
								label="Tutor"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									showSearch
									placeholder="Select tutors"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={tutorOptions.map((la) => ({
										value: la.id,
										label: la.profile.firstName + ' ' + la.profile.lastName,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							{/* <Form.Item
								label={
									<>
										<span className="tw-mr-4">Student charge rate/hour</span>
										<Button
											onClick={() => setIsOpenPriceGroupModal(true)}
											icon={<PlusOutlined />}
											className="tw-flex tw-justify-center tw-items-center bg-theme-4 color-theme-7 tw-h-6 tw-w-6 tw-rounded-full"
										/>
									</>
								}
								rules={[
									{
										required: true,
									},
								]}
							>
								{priceGroup.map((x) => (
									<Input.Group className="tw-flex">
										<InputNumber value={x.studentNumber} readOnly className="tw-w-1/6" />
										<Input value={x.hourRate} readOnly prefix="$" />
									</Input.Group>
								))}
							</Form.Item> */}
							<Form.Item
								name="studentChargeRateHour"
								label="Student charge rate/hour"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input prefix="$" type="number" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="tutorChargeRateHour"
								label="Tutor charge rate/hour"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input prefix="$" type="number" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="studentPremiumAmount"
								label="Student premium"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input prefix="$" type="number" placeholder="Enter a premium amount here" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<Form.Item
								name="maxStudents"
								label="Max Students"
								rules={[
									{
										required: true,
									},
								]}
							>
								<Input type="number" />
							</Form.Item>
						</Col>
						<Col span={8}>
								<Form.Item name="location" label={
									<>
										<span className="tw-mr-4">Location</span>
										<Radio.Group value={isOnline} onChange={(e) => {setIsOnline(e.target.value); formAddClass.resetFields(['location'])}}>
											<Radio value={true}>Online</Radio>
											<Radio value={false}>Offline</Radio>
										</Radio.Group>
									</>
								} rules={[{ required: true }]}>
									{isOnline ? (
										<Input placeholder="Enter a link URL" />
									): (
										<Input.Group className="tw-flex">
										<Select
											className="tw-w-full"
											showSearch
											placeholder="Select a physical location"
											filterOption={(input, option) =>
												(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
											}
											value={selectedCampusRoomId}
											options={listCampusRooms.map((la) => ({
												value: la.id,
												label: `${la.campus.name} - ${la.roomId}`,
											}))}
											onSelect={(e) => {
												setSelectedCampusRoomId(e);
												formAddClass.setFieldValue('location', e);
												isRoomAvaliable.current = false
											}}
											clearIcon={true}
											allowClear
										/>
										<Button
											onClick={() => {
												onCheckCampusRoomAvailability();
											}}
										>
											Check
										</Button>
									</Input.Group>
									)}
									
								</Form.Item>
						</Col>
					</Row>
					<Row gutter={[24, 24]}>
						<Col span={8}>
							<Form.Item name="isRepeat" valuePropName="checked">
								<Checkbox onChange={(e) => setIsRepeat(e.target.checked)}>This session Repeats</Checkbox>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="isPublic"
								rules={[
									{
										required: true,
									},
								]}
								initialValue={true}
							>
								<Radio.Group>
									<Radio value={true}>Public</Radio>
									<Radio value={false}>Private</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
					</Row>
					{isRepeat && (
						<Row gutter={[24, 24]}>
							<Col span={8}>
								<Form.Item name="repeatType" label="Frequency" initialValue={RepeatType.DAY}>
									<Radio.Group
										defaultValue={RepeatType.DAY}
										buttonStyle="solid"
										onChange={(e) => setRepeatType(e.target.value)}
										className="tw-flex tw-gap-2"
									>
										<Radio.Button value={RepeatType.DAY}>Day</Radio.Button>
										<Radio.Button value={RepeatType.WEEK}>Week</Radio.Button>
										<Radio.Button value={RepeatType.MONTH}>Month</Radio.Button>
									</Radio.Group>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									name="repeatData"
									label="Every"
									rules={formAddClass.getFieldValue('isRepeat') ? [{ required: true }] : []}
								>
									<div className="tw-flex">
										<Input type="number" defaultValue={formAddClass.getFieldValue('repeatData')} />
										<span className="tw-flex tw-w-1/5 tw-items-center tw-justify-center bg-theme-6 tw-capitalize">
											{repeatType.toLowerCase()}
										</span>
									</div>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="repeatUntilDate" label="Repeat until">
									<DatePicker allowClear className="tw-w-full" />
								</Form.Item>
							</Col>
						</Row>
					)}
					<Form.Item>
						<Button htmlType="submit" className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-px-12`}>
							Save and Add
						</Button>
					</Form.Item>
				</Form>

				<Modal
					title="Group price level"
					width={400}
					open={isOpenPriceGroupModal}
					footer={[
						<Button
							onClick={() => setIsOpenPriceGroupModal(false)}
							className={`${TAILWIND_CLASS.BUTTON_SECONDARY_ANTD} tw-rounded-lg`}
						>
							Cancel
						</Button>,
						<Button htmlType="submit" form="priceGroup" className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-rounded-lg`}>
							Add
						</Button>,
					]}
					destroyOnClose
					maskClosable={false}
					onCancel={() => {
						setIsOpenPriceGroupModal(false);
					}}
				>
					<Form form={formPriceGroup} id="priceGroup" onFinish={onAddUpdatePriceGroup}>
						<div className="tw-flex tw-w-full tw-justify-between">
							<span className="tw-basis-2/5">Number of Student</span>
							<span className="tw-basis-3/5">Charge rate/student</span>
						</div>
						{[...Array(5)].map((_, i) => {
							return (
								<Form.Item name={i + 1} className="!tw-mb-2">
									<Input.Group className="tw-flex">
										<InputNumber className="tw-basis-2/5" value={i + 1} readOnly />
										<Form.Item className="!tw-mb-0" name={[i + 1, 'price']}>
											<Input className="tw-basis-3/5" prefix="$" />
										</Form.Item>
									</Input.Group>
								</Form.Item>
							);
						})}
					</Form>
				</Modal>

				{selectedCampusRoomId && listCampusRooms.length > 0 && (
					<CheckCampusAvailabilityModal
						isOpenModal={isOpenCampusAvailabilityModal}
						setIsOpenModal={setIsOpenCampusAvailabilityModal}
						roomData={listCampusRooms.find((la) => la.id === selectedCampusRoomId)}
						startDate={formAddClass.getFieldValue('startTime')}
						finishDate={formAddClass.getFieldValue('finishTime')}
						isAvailable={isRoomAvaliable.current}
					/>
				)}
			</div>
		</TutorClassesLayout>
	);
};

export default FormAddUpdateClass;
