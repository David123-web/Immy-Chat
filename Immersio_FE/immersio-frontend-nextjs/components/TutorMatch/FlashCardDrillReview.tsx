import { BulbOutlined, CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import FlashCardDemo from '../Instructor/tools/drills/FlashCard/FlashCardDemo';
import FlashCardHint from '../Instructor/tools/drills/FlashCard/FlashCardHint';
import { IAddDrillForm, IDrillData } from '@/src/interfaces/tutorMatch/tutorMatch.interface';

interface IFlashCardDrillReview {
	drill: IAddDrillForm;
	isOpenDrillReviewModal: boolean;
	setIsOpenDrillReviewModal: (isOpenDrillReviewModal: boolean) => void;
}

const FlashCardDrillReview = (props: IFlashCardDrillReview) => {
	const { drill, isOpenDrillReviewModal, setIsOpenDrillReviewModal } = props;

	const [isOpenHintModel, setIsOpenHintModel] = useState<boolean>(false);
	const [sectionIndex, setSectionIndex] = useState(0);
	const demoRef = useRef(null);
  const indexRef = useRef(0);
	const onChange = (index) => {
		setSectionIndex(index);
		indexRef.current = index;
	};

  const nextSection = () => {
    if (sectionIndex < drill.data.length - 1) {
      let newIndex = sectionIndex + 1;
      setSectionIndex(newIndex);
      indexRef.current = newIndex;
      if (demoRef && demoRef.current) {
        demoRef.current.next();
      }
    }
  };

  const prevSection = () => {
    if (sectionIndex > 0) {
      let newIndex = sectionIndex - 1;
      setSectionIndex(newIndex);
      indexRef.current = newIndex;
      if (demoRef && demoRef.current) {
        demoRef.current.prev();
      }
    }
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
						<div className='tw-flex tw-justify-between'>
							<LeftOutlined style={{ fontSize: '150%' }} onClick={prevSection} />
							<span>
								{drill.data[sectionIndex].question}
								<BulbOutlined style={{ fontSize: '150%' }} onClick={() => setIsOpenHintModel(true)} />{' '}
							</span>
							<RightOutlined style={{ fontSize: '150%' }} onClick={nextSection} />
						</div>
					</>,
				]}
			>
				<Carousel ref={demoRef} draggable afterChange={onChange}>
					{[...Array(drill.data.length)].map((_, i) => {
						return (
							<FlashCardDemo currentIndex={indexRef.current} answer={drill.data[i].content[0]} key={i} index={i} image={drill.data[i].mediaUrl} />
						);
					})}
				</Carousel>
			</Modal>
			<Modal
				closable={false}
				className="drillModal"
				title={drill.instruction}
				open={isOpenHintModel}
				onCancel={() => setIsOpenHintModel(false)}
				destroyOnClose={true}
				footer={null}
			>
				<FlashCardHint images={drill.data.map(x => x.mediaUrl)} questions={drill.data.map(x => x.question)} answers={drill.data.map(x => x.content[0])} />
			</Modal>
		</>
	);
};

export default FlashCardDrillReview;
