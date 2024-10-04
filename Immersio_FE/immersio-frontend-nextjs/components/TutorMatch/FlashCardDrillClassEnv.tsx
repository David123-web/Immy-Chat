import { IPlanDrill } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import FlashCardDemo from '../Instructor/tools/drills/FlashCard/FlashCardDemo';

type Props = {
	drill: IPlanDrill;
};

const FlashCardDrillClassEnv = (props: Props) => {
	const { drill: drillSelected } = props;
	const [sectionIndex, setSectionIndex] = useState(0);
	const demoRef = useRef(null);
	const indexRef = useRef(0);

	const nextSection = () => {
		if (sectionIndex < drillSelected.data.length - 1) {
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
		<div className="tw-relative">
			<FlashCardDemo
				currentIndex={indexRef.current}
				answer={drillSelected.data[sectionIndex].content[0]}
				key={sectionIndex}
				index={sectionIndex}
				image={drillSelected.data[sectionIndex].mediaUrl}
			/>
			<LeftOutlined className="tw-absolute tw-bottom-1 text-2xl tw-left-[43%]" onClick={() => prevSection()} />
			<RightOutlined
				className="tw-absolute tw-bottom-1 text-2xl tw-left-[55%]"
				onClick={() => {
					nextSection();
				}}
			/>
		</div>
	);
};

export default FlashCardDrillClassEnv;
