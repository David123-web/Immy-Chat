import { Modal } from 'antd';
import React from 'react'
import ListStudentClassess from '../MySpace/ListStudentClassess';
import { ITutorClass, ITutorInfo } from '@/src/interfaces/tutorMatch/tutorMatch.interface';

interface IViewListClassesModal {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
	data: {
		tutorInfo: ITutorInfo;
		listOfClass: ITutorClass[];
	}
	refetchData: () => void;
}

const ViewListClassesModal = (props: IViewListClassesModal) => {
  const { isOpenModal, setIsOpenModal, data, refetchData } = props;
  return (
    <>
			<Modal
				title={
					data.tutorInfo.profile.firstName + ' ' + data.tutorInfo.profile.lastName
				}
				width={1000}
				open={isOpenModal}
				footer={null}
				destroyOnClose
				maskClosable={false}
				keyboard
				onCancel={() => {
					setIsOpenModal(false);
				}}
			>
				<ListStudentClassess data={data.listOfClass} refetchData={refetchData}/>
			</Modal>
		</>
  )
}

export default ViewListClassesModal