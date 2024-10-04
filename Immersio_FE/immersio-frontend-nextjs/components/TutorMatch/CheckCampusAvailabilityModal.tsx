import { TAILWIND_CLASS } from '@/constants';
import { IClassCampusRoom } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface ICheckCampusAvailabilityModal {
	isOpenModal: boolean;
	setIsOpenModal: (value: boolean) => void;
	roomData: IClassCampusRoom;
	startDate: Date;
	finishDate: Date;
	isAvailable: boolean;
}

const CheckCampusAvailabilityModal = (props: ICheckCampusAvailabilityModal) => {
	const { isOpenModal, setIsOpenModal, roomData, isAvailable, startDate, finishDate } = props;
	return (
		<Modal
			width={500}
			open={isOpenModal}
			footer={null}
			destroyOnClose
			maskClosable={false}
			keyboard
			onCancel={() => {
				setIsOpenModal(false);
			}}
      centered
		>
			<div className="tw-mt-6 tw-flex tw-flex-col tw-items-center tw-gap-4">
				<div className=" tw-text-center tw-font-semibold">
					<div>{`The ${roomData.roomId} on ${roomData.campus.name} `}</div>
					<div>
						{`${isAvailable ? '' : ' is not'} available on ${dayjs(startDate).format('DD/MM/YYYY')} from ${dayjs(
							startDate
						).format('hh:mm A')} to ${dayjs(finishDate).format('hh:mm A')},`}
					</div>
					<div>
						{`${isAvailable ? 'Click CONFIRM to book the location' : 'please SELECT another location'}`}
					</div>
				</div>

				<Button className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-fit tw-rounded`} onClick={() => setIsOpenModal(false)}>
					{isAvailable ? 'CONFIRM' : 'CLOSE'}
				</Button>
			</div>
		</Modal>
	);
};

export default CheckCampusAvailabilityModal;
