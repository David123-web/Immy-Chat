import { TAILWIND_CLASS } from '@/constants';
import { Button, Form, Input, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AvailabilityPicker from '../People/AvailabilityPicker';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import {
	AvailableTime,
	CreateAvailabilityTimeRequest,
	IGetAvailableTimesResponse,
} from '@/src/interfaces/people/people.interface';
import dayjs from 'dayjs';
import { ICampusRoom, IGetRoomByIdResponse } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { getCampusRoomByIy } from '@/src/services/tutorMatch/apiTutorMatch';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useQuery } from '@/hooks/useQuery';

interface IAddRoomCampusModal {
	isOpenAddRoomCampusModal: boolean;
	setIsOpenAddRoomCampusModal: (isOpenAddRoomCampusModal: boolean) => void;
	initData: ICampusRoom;
	handleAddUpdateRoom: (newRoom: ICampusRoom) => void;
	formAvailability: FormInstance<CreateAvailabilityTimeRequest>;
	listAvailableTimeChecked: AvailableTime[];
	setListAvailableTimeChecked: Dispatch<SetStateAction<AvailableTime[]>>;
	listAvailableTime: AvailableTime[];
	setListAvailableTime: Dispatch<SetStateAction<AvailableTime[]>>;
}

const AddRoomCampusModal = (props: IAddRoomCampusModal) => {
	const {
		isOpenAddRoomCampusModal,
		setIsOpenAddRoomCampusModal,
		initData,
		handleAddUpdateRoom,
		formAvailability,
		listAvailableTimeChecked,
		setListAvailableTimeChecked,
		listAvailableTime,
		setListAvailableTime,
	} = props;

	const [deleteIds, setDeleteIds] = useState<number[]>([]);
	const onFinish = (data: any) => {
		handleAddUpdateRoom({
			id: initData.id,
			roomId: data.roomId,
			availableTimes: listAvailableTimeChecked,
			deleteAvailableTimeIds: deleteIds,
		});
	};
	/* -------------------------- GET AVAILABILITY TIME ------------------------- */
	const [currentDay, setCurrentDay] = useState(dayjs());
	const getRoomQuery = useQuery<IGetRoomByIdResponse, any>(
		['IGetRoomByIdResponse', currentDay],
		() =>
			getCampusRoomByIy({
				id: initData.id as string,
				start: currentDay.startOf('week').utc(true).toISOString(),
				end: currentDay.endOf('week').utc(true).toISOString(),
			}),
		{
			enabled: isOpenAddRoomCampusModal && !!initData.id,
			onSuccess: (res) => {
				setListAvailableTime(
					res.data.availableTimes.map((item) => ({
						repeat: item.repeat,
						start: item.start,
					}))
				);
			},
			onError: (err) => {
				toast.error('Get room failed');
			},
		}
	);

	return (
		<>
			<Modal
				centered
				title={`${(initData.roomId as string) ? 'Update' : 'Add'} room`}
				width={1200}
				open={isOpenAddRoomCampusModal}
				footer={[
					<Button
						onClick={() => {
							setListAvailableTimeChecked([]);
							setListAvailableTime([]);
							setDeleteIds([]);
							formAvailability.resetFields();
							setCurrentDay(dayjs());
							setIsOpenAddRoomCampusModal(false);
						}}
					>
						Cancel
					</Button>,
					<Button className={`${TAILWIND_CLASS.BUTTON_ANTD}`} form="formAddRoomCampus" htmlType="submit">
						{`${(initData.id as string) ? 'Update' : 'Add'}`}
					</Button>,
				]}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setListAvailableTimeChecked([]);
					setDeleteIds([]);
					formAvailability.resetFields();
					setCurrentDay(dayjs());
					setIsOpenAddRoomCampusModal(false);
				}}
				afterClose={() => {
					formAvailability.resetFields();
					setListAvailableTimeChecked([]);
					setListAvailableTime([]);
					setDeleteIds([]);
				}}
			>
				<Form
					form={formAvailability}
					id="formAddRoomCampus"
					className="tw-w-full tw-m-auto"
					onFinish={onFinish}
					layout="vertical"
				>
					<Form.Item
						name="roomId"
						label="Room ID"
						className="tw-w-1/2"
						initialValue={initData.roomId}
						rules={[
							{
								required: true,
								message: 'Please enter room ID',
							},
							{
								max: 50,
								message: 'Room ID must be less than 50 characters',
							},
						]}
					>
						<Input placeholder="Enter a room ID" />
					</Form.Item>
					<AvailabilityPicker
						form={formAvailability}
						listAvailableTime={listAvailableTime}
						setListAvailableTime={setListAvailableTime}
						deleteIds={deleteIds}
						listAvailableTimeChecked={listAvailableTimeChecked}
						setDeleteIds={setDeleteIds}
						setListAvailableTimeChecked={setListAvailableTimeChecked}
						currentDay={currentDay}
						setCurrentDay={setCurrentDay}
						getAvailabilityTimesQuery={getRoomQuery}
					/>
				</Form>
			</Modal>
		</>
	);
};

export default AddRoomCampusModal;
