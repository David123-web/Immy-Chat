import { TAILWIND_CLASS } from '@/constants';
import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { useQuery } from '@/hooks/useQuery';
import {
	CAMPUS_STATUS_OPTIONS,
	IAddCampusRequest,
	IAddRoomRequest,
	ICampusRoom,
	IGetCampusByIdResponse,
	IUpdateCampusRequest,
	IUpdateRoomRequest,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import {
	createCampus,
	createCampusRoom,
	deleteCampusRooms,
	getCampusById,
	updateCampus,
	updateCampusRoom,
} from '@/src/services/tutorMatch/apiTutorMatch';
import { globalStore } from '@/src/stores/global/global.store';
import { DeleteOutlined, EditOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardRoute from '../routes/DashboardRoute';
import AddRoomCampusModal from './AddRoomCampusModal';
import { AvailableTime, CreateAvailabilityTimeRequest } from '@/src/interfaces/people/people.interface';
import { useForm } from 'antd/lib/form/Form';

interface IFormAddUpdateCampus {
	isUpdate?: boolean;
}

const FormAddUpdateCampus = (props: IFormAddUpdateCampus) => {
	const { isUpdate } = props;
	const [formAddCampus] = useForm();
	const [formAvailability] = useForm<CreateAvailabilityTimeRequest>();
	const [isOpenAddRoomCampusModal, setIsOpenAddRoomCampusModal] = useState<boolean>(false);
	const listRooms = useRef<ICampusRoom[]>([]);
	const initValueSelectedRoom = () => {
		return { id: null, roomId: null, availableTimes: [], deleteAvailableTimeIds: [] };
	};
	const selectedRoom = useRef<ICampusRoom>(initValueSelectedRoom());
	const router = useRouter();
	const [listAvailableTimeChecked, setListAvailableTimeChecked] = useState<AvailableTime[]>([]);
	const [listAvailableTime, setListAvailableTime] = useState<AvailableTime[]>([]);

	/* ----------------------------- ADD UPDATE ROOM ---------------------------- */
	const handleAddUpdateRoom = (newRoom: ICampusRoom) => {
		if (router.query.id) {
			if (!newRoom.id) {
				createCampusRoomMutaion.mutate({
					roomId: newRoom.roomId,
					campusId: router.query.id as string,
					availableTimes: newRoom.availableTimes,
					deleteAvailableTimeIds: newRoom.deleteAvailableTimeIds,
				});
			} else {
				updateCampusRoomMutaion.mutate({
					id: newRoom.id,
					body: {
						roomId: newRoom.roomId,
						campusId: router.query.id as string,
						availableTimes: newRoom.availableTimes,
						deleteAvailableTimeIds: newRoom.deleteAvailableTimeIds,
					},
				});
			}
		}

		if (selectedRoom.current.roomId) {
			listRooms.current = [
				...listRooms.current.filter((room) => room.roomId !== selectedRoom.current.roomId),
				newRoom,
			].sort((a, b) => a.roomId.localeCompare(b.roomId));
		} else {
			listRooms.current = [...listRooms.current, newRoom].sort((a, b) => a.roomId.localeCompare(b.roomId));
		}

		setIsOpenAddRoomCampusModal(false);
		selectedRoom.current = initValueSelectedRoom();
		formAddCampus.setFieldValue(
			'rooms',
			listRooms.current.map((x) => ({
				roomId: x.roomId,
			}))
		);
	};

	const createCampusRoomMutaion = useMutation<any, IAddRoomRequest>(createCampusRoom, {
		onSuccess: () => {
			toast.success('Create Campus Room successfully!');
		},
		onError: (err) => {
			toast.error('Create Campus Room failed!');
		},
	});

	const updateCampusRoomMutaion = useMutation<any, { id: string; body: IUpdateRoomRequest }>(updateCampusRoom, {
		onSuccess: () => {
			toast.success('Update Campus Room successfully!');
		},
		onError: (err) => {
			toast.error('Update Campus Room failed!');
		},
	});

	const deleteCampusRoomMutaion = useMutation<any, string>(deleteCampusRooms, {
		onSuccess: (variable) => {
			toast.success('Delete Campus Room successfully!');
		},
		onError: (err) => {
			toast.error('Delete Campus Room failed!');
		},
	});

	/* ------------------------------- ADD CAMPUS ------------------------------- */
	const createCampusMutation = useMutation<any, IAddCampusRequest>(createCampus, {
		onSuccess: () => {
			toast.success('Create Campus successfully!');
		},
		onError: (err) => {
			toast.error(err.data?.message || 'Create Campus failed!');
		},
	});

	/* ------------------------------ UPDATE CAMPUS ----------------------------- */
	const updateCampusMutation = useMutation<any, { id: string; body: IUpdateCampusRequest }>(updateCampus, {
		onSuccess: () => {
			toast.success('Update Campus successfully!');
		},
		onError: (err) => {
			toast.error(err.data?.message || 'Update Campus failed!');
		},
	});

	const onFinish = (data) => {
		const { address, city, dialCode, countryCode, managerName, name, phoneNumber, dialogCode, state, status, zipCode } =
			data;
		if (router.query.id) {
			updateCampusMutation.mutate({
				id: router.query.id as string,
				body: {
					name,
					dialogCode,
					phoneNumber,
					managerName,
					status,
					address,
					zipCode,
					city,
					state,
					countryCode,
					dialCode,
				},
			});
		} else {
			createCampusMutation.mutate({
				name,
				dialogCode,
				phoneNumber,
				managerName,
				status,
				address,
				zipCode,
				city,
				state,
				countryCode,
				dialCode,
				rooms: listRooms.current,
			});
		}
	};

	/* ---------------------------- GET CAMPUS BY ID ---------------------------- */
	const [campusData, setCampusData] = useState<IGetCampusByIdResponse>();
	const getTutorPlanByIdQuery = useQuery<IGetCampusByIdResponse>(
		['IGetCampusByIdResponse'],

		() => getCampusById(router.query.id as string),
		{
			enabled: !!router.query.id,
			onSuccess: (res) => {
				setCampusData(res.data);
				listRooms.current = res.data.rooms
					.map((x) => ({
						id: x.id,
						roomId: x.roomId,
						availableTimes: [],
						deleteAvailableTimeIds: [],
					}))
					.sort((a, b) => a.roomId.localeCompare(b.roomId));
				formAddCampus.setFieldsValue({
					name: res.data.name,
					dialogCode: res.data.dialCode,
					phoneNumber: res.data.phoneNumber,
					managerName: res.data.managerName,
					status: res.data.status,
					address: res.data.address,
					zipCode: res.data.zipCode,
					city: res.data.city,
					state: res.data.state,
					countryCode: res.data.countryCode,
					dialCode: res.data.dialCode,
					rooms: listRooms.current.map((x) => ({
						roomId: x.roomId,
					})),
				});
			},
			onError: (err) => {
				router.push(RouterConstants.NOT_FOUND.path);
			},
		}
	);
	return (
		<>
			<Head>
				<title>{isUpdate ? 'Update' : 'Add'} Campus</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<DashboardRoute>
				<div
					onClick={() => router.push(RouterConstants.DASHBOARD_TUTOR_MATCH_CAMPUS.path)}
					className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-font-bold tw-text-xl"
				>
					<LeftOutlined className="tw-mr-4" />
					{isUpdate ? 'Update' : 'Add'} Campus
				</div>
				<Form
					id="formAddCampus"
					className="tw-w-2/3 tw-m-auto tw-mt-4"
					onFinish={onFinish}
					form={formAddCampus}
					layout="vertical"
				>
					<Row gutter={[24, 24]}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Campus name"
								rules={[
									{
										required: true,
										message: 'Please enter campus name',
									},
								]}
							>
								<Input placeholder="Enter campus name" />
							</Form.Item>
							<Form.Item
								name="managerName"
								label="Campus Manager"
								rules={[
									{
										required: true,
										message: 'Please enter campus manager',
									},
								]}
							>
								<Input placeholder="Enter full name" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Phone number">
								<Space.Compact className="tw-w-full">
									<Form.Item initialValue={globalStore.listCountries[0].dialCode} className="!tw-mb-0" name="dialCode">
										<Select
											options={globalStore.listCountries.map((item) => ({
												label: `${item.emoji} ${item.dialCode}`,
												value: item.dialCode,
											}))}
											className="!tw-w-24"
											showSearch
											filterOption={(input, option) =>
												(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
											}
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
											{
												required: true,
												message: 'Please enter phone number',
											},
										]}
										className="!tw-mb-0 tw-w-full"
										name="phoneNumber"
									>
										<Input placeholder="Enter phone number" />
									</Form.Item>
								</Space.Compact>
							</Form.Item>

							<Form.Item initialValue={CAMPUS_STATUS_OPTIONS[0].value} name="status" label="Account status">
								<Select options={CAMPUS_STATUS_OPTIONS} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter address' }]}>
						<Input placeholder="Enter an address" />
					</Form.Item>

					<Row gutter={[24, 24]}>
						<Col span={12}>
							<Form.Item name="zipCode" label="Zip code/Postcode">
								<Input placeholder="Enter a zip code/portal code" />
							</Form.Item>
							<Form.Item name="state" label="State">
								<Input placeholder="Enter a state" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="city" label="City">
								<Input placeholder="Enter a city" />
							</Form.Item>
							<Form.Item name="countryCode" label="Country">
								<Select
									showSearch
									placeholder="Select a country"
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									options={globalStore.listCountries.map((la) => ({
										value: la.code,
										label: la.name,
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.List name="rooms">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<Form.Item key={key} className="tw-w-full" {...restField} name={[name, 'roomId']}>
												<Input
													readOnly
													suffix={
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
																onClick={() => {
																	selectedRoom.current = listRooms.current.find(
																		(room) => room.roomId === formAddCampus.getFieldValue(['rooms', name, 'roomId'])
																	);
																	setListAvailableTimeChecked(selectedRoom.current.availableTimes);
																	formAvailability.setFieldValue(['roomId'], selectedRoom.current.roomId);
																	setIsOpenAddRoomCampusModal(true);
																}}
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
																	listRooms.current[name].id &&
																		deleteCampusRoomMutaion.mutate(listRooms.current[name].id);
																	listRooms.current = listRooms.current.filter(
																		(room) => room.roomId !== listRooms.current[name].roomId
																	);
																	remove(name);
																}}
															/>
														</div>
													}
												/>
											</Form.Item>
										))}
										<Form.Item className="tw-w-full">
											<Button
												className={`bg-theme-6 !tw-rounded-md `}
												size="large"
												disabled={false}
												loading={false}
												block
												onClick={() => {
													selectedRoom.current = initValueSelectedRoom();
													setListAvailableTimeChecked([]);
													setIsOpenAddRoomCampusModal(true);
												}}
												icon={<PlusOutlined className="tw-text-2xl tw-rounded-2xl" />}
											>
												Add room
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>
						</Col>
					</Row>

					<Button
						className={`${TAILWIND_CLASS.BUTTON_ANTD} !tw-px-6 !tw-rounded-md`}
						size="large"
						htmlType="submit"
						disabled={false}
						loading={false}
					>
						Save
					</Button>
				</Form>
				<AddRoomCampusModal
					isOpenAddRoomCampusModal={isOpenAddRoomCampusModal}
					setIsOpenAddRoomCampusModal={setIsOpenAddRoomCampusModal}
					handleAddUpdateRoom={handleAddUpdateRoom}
					initData={selectedRoom.current}
					listAvailableTimeChecked={listAvailableTimeChecked}
					setListAvailableTimeChecked={setListAvailableTimeChecked}
					listAvailableTime={listAvailableTime}
					setListAvailableTime={setListAvailableTime}
					formAvailability={formAvailability}
				/>
			</DashboardRoute>
		</>
	);
};

export default FormAddUpdateCampus;
