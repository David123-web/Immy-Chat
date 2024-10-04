import { CloseCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react';
import { EventCalendar } from '.';
import dayjs from 'dayjs';
import { capitalization } from '@/src/helpers/strings';
import { globalStore } from '@/src/stores/global/global.store';

interface IEventDetailModalProps {
	isOpenDetailsModal: boolean;
	setIsOpenDetailsModal: (value: boolean) => void;
	eventDetail: EventCalendar;
}

const EventDetailModal = (props: IEventDetailModalProps) => {
	const { isOpenDetailsModal, setIsOpenDetailsModal, eventDetail } = props;
	return (
		<Modal
			className="!w-[600px]"
			open={isOpenDetailsModal}
			onCancel={() => setIsOpenDetailsModal(false)}
			closeIcon={<CloseCircleFilled />}
			okText="Save"
			centered
			footer={null}
		>
			<div className="tw-flex tw-gap-4">
				<div style={{ backgroundColor: eventDetail.color }} className={` tw-w-6 tw-h-6 tw-rounded-full`}></div>
				<div className="tw-flex tw-flex-col tw-gap-2">
					<h4>{eventDetail.title}</h4>
					<div>
						{`${dayjs(eventDetail.start).format('dddd, MMMM DD')} | ${dayjs(eventDetail.start).format(
							'h:mm A'
						)} - ${dayjs(eventDetail.end).format('h:mm A')}`}
					</div>
					{eventDetail.isRepeat && (
						<div>
							{`${capitalization(eventDetail.repeatType)}ly, until ${dayjs(eventDetail.repeatUntilDate).format(
								'MMMM DD, YYYY'
							)}`}
						</div>
					)}
					<div>
						{`${globalStore.courseLanguages.find((x) => x.id === eventDetail.teachingLanguageId).name} | $${
							eventDetail.price
						} | ${dayjs(eventDetail.end).diff(dayjs(eventDetail.start), 'hour')} hours`}
					</div>
					<div>{eventDetail.topic}</div>
					<div>{eventDetail.spaceAvailable} spaces available</div>
					<div className="tw-text-base">{eventDetail.teacherName}</div>
				</div>
			</div>
		</Modal>
	);
};

export default EventDetailModal;
