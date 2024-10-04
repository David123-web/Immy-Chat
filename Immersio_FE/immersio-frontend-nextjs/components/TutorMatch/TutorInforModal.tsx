import { TAILWIND_CLASS } from '@/constants';
import { Button, Modal, Rate } from 'antd';
import React from 'react';
import MessageIcon from '@/public/assets/img/icon/Message.svg';
import { MessageFilled, MessageOutlined } from '@ant-design/icons';
import { GetTutorInfoResponse } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
interface ITutorInforModal {
	isOpenModal: boolean;
	setIsOpenModal: (value: boolean) => void;
	tutorInfor: GetTutorInfoResponse;
}

const TutorInforModal = (props: ITutorInforModal) => {
	const { isOpenModal, setIsOpenModal, tutorInfor } = props;
	return (
		<>
			<Modal
				width={600}
				open={isOpenModal}
				footer={null}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenModal(false);
				}}
			>
				<div className="tw-flex tw-flex-col tw-w-full tw-mt-4 tw-gap-3">
					<div className="tw-flex tw-gap-3">
						<img
							className="tw-object-cover tw-rounded-lg tw-w-[2/5] tw-aspect-[4/3]"
							src={tutorInfor.profile.avatarUrl}
							alt=""
						/>
						<div className="tw-flex tw-flex-col tw-justify-between">
							<div className="tw-flex tw-flex-col tw-gap-1">
								<h4>{tutorInfor.profile.firstName + ' ' + tutorInfor.profile.lastName}</h4>
								<div>Living in Ontario, Canada</div>
								<div className="tw-flex">
									<Rate className="custom-rate" style={{ fontSize: '12px' }} disabled value={5} />
									86
								</div>
								<div>${tutorInfor.hourRate}/hour</div>
							</div>
							<div className="tw-flex tw-gap-3">
								{/* <Button
									className={`${TAILWIND_CLASS.BUTTON_ANTD} tw-w-fit tw-rounded`}
									onClick={() => setIsOpenViewClassesModal(true)}
								>
									View Class
								</Button> */}
								<MessageFilled className="color-theme-3 tw-text-2xl" />
							</div>
						</div>
					</div>
					<h6>{tutorInfor.teachLanguages.map((x) => x.name).join(' | ')}</h6>
					<div dangerouslySetInnerHTML={{ __html: tutorInfor.bio }}></div>
					<div dangerouslySetInnerHTML={{ __html: tutorInfor.experienceDesc }}></div>
				</div>
			</Modal>
		</>
	);
};

export default TutorInforModal;
