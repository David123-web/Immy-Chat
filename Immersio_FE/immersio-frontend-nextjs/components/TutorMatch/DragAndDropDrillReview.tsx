import { IAddDrillForm } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { CloseCircleFilled, LeftOutlined, BulbOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, Carousel } from 'antd';
import React, { useRef, useState } from 'react';
import DragAndDropDemo from '../Instructor/tools/drills/DragAndDrop/DragAndDropDemo';

interface IDragAndDropDrillReview {
	drill: IAddDrillForm;
	isOpenDrillReviewModal: boolean;
	setIsOpenDrillReviewModal: (isOpenDrillReviewModal: boolean) => void;
}

const DragAndDropDrillReview = (props: IDragAndDropDrillReview) => {
	const { drill, isOpenDrillReviewModal, setIsOpenDrillReviewModal } = props;

	const [sectionIndex, setSectionIndex] = useState(0);
	const demoRef = useRef(null);
	const indexRef = useRef(0);
	const onChange = (index) => {
		setSectionIndex(index);
		indexRef.current = index;
	};

	const nextSection = () => {
		if (sectionIndex < drill.data.length - 1) setSectionIndex(sectionIndex + 1);
	};

	const prevSection = () => {
		if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
	};
  
	return (
		<>
			<Modal
				closeIcon={<CloseCircleFilled />}
				className="drillModal"
				title={drill.instruction}
				open={isOpenDrillReviewModal}
				onCancel={() => setIsOpenDrillReviewModal(false)}
				destroyOnClose={true}
				footer={[
					<>
						<div className="tw-flex tw-justify-between">
							<LeftOutlined style={{ fontSize: '150%' }} onClick={prevSection} />
							<EyeOutlined style={{ fontSize: '150%' }} onClick={() => demoRef.current()} />
							<RightOutlined style={{ fontSize: '150%' }} onClick={nextSection} />
						</div>
					</>,
				]}
			>
				<DragAndDropDemo
					demoRef={demoRef}
					key={sectionIndex}
					words={drill.data.map(x => x.question)}
					images={drill.data.map(x => x.mediaUrl)}
				/>
			</Modal>
		</>
	);
};

export default DragAndDropDrillReview;
