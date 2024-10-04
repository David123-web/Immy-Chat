import { CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useRef, useState } from 'react'
import MultipleChoiceDemo from '../Instructor/tools/drills/MultipleChoice/MultipleChoiceDemo';
import { IAddDrillForm } from '@/src/interfaces/tutorMatch/tutorMatch.interface';

interface IMultipleChoiceDrillReview {
	drill: IAddDrillForm;
	isOpenDrillReviewModal: boolean;
	setIsOpenDrillReviewModal: (isOpenDrillReviewModal: boolean) => void;
}

const MultipleChoiceDrillReview = (props: IMultipleChoiceDrillReview) => {
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
							<RightOutlined style={{ fontSize: '150%' }} onClick={nextSection} />
						</div>
					</>,
				]}
			>
				<MultipleChoiceDemo
            key={sectionIndex}
            question={drill.data[sectionIndex].question}
            answers={drill.data[sectionIndex].content}
            correctAnswer={drill.data[sectionIndex].correctIndex}
          />
			</Modal>
		</>
	);
}

export default MultipleChoiceDrillReview