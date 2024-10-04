import { IAddDrillForm } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { BulbOutlined, CloseCircleFilled, EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import DragTheWordDemo from '../Instructor/tools/drills/DragTheWord/DragTheWordDemo';

interface IDragTheWordsDrillReview {
	drill: IAddDrillForm;
	isOpenDrillReviewModal: boolean;
	setIsOpenDrillReviewModal: (isOpenDrillReviewModal: boolean) => void;
}

const DragTheWordsDrillReview = (props: IDragTheWordsDrillReview) => {
	const { drill, isOpenDrillReviewModal, setIsOpenDrillReviewModal } = props;
	const [fragments, setFragments] = useState([]);
	const [words, setWords] = useState([]);

	const [sectionIndex, setSectionIndex] = useState(0);
	const demoRef = useRef(null);
	const indexRef = useRef(0);
	const onChange = (index) => {
		setSectionIndex(index);
		indexRef.current = index;
	};

	useEffect(() => {
		if (drill.data.length) {
			let startingFragments = [];
			let startingWords = [];
			for (let i = 0; i < drill.data.length; i++) {
				const statement =drill.data[i].question;
				let arrayOfFragments = [];
				let arrayOfWords = [];
				let splitString = statement !== undefined ? statement.split('*') : [];
				if (splitString.length % 2 === 0) {
					let lastTwo = splitString.slice(splitString.length - 2);
					let combinedString = lastTwo.join('*');
					splitString.splice(splitString.length - 2, 2, combinedString);
				}
				for (let j = 0; j < splitString.length; j++) {
					j % 2 == 1 ? arrayOfWords.push(splitString[j]) : arrayOfFragments.push(splitString[j]);
				}
				startingFragments.push(arrayOfFragments);
				startingWords.push(arrayOfWords);
			}
			setWords(startingWords);
			setFragments(startingFragments);
		}
	}, []);

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
				<div>
					<DragTheWordDemo
						demoRef={demoRef}
						key={sectionIndex}
						words={words[sectionIndex]}
						fragments={fragments[sectionIndex]}
					/>
				</div>
			</Modal>
		</>
	);
};

export default DragTheWordsDrillReview;
