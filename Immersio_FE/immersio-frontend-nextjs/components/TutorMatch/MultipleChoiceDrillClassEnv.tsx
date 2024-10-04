import { IPlanDrill } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import MultipleChoiceDemo from '../Instructor/tools/drills/MultipleChoice/MultipleChoiceDemo';

interface IMultipleChoiceDrillReview {
	drill: IPlanDrill;
}

const MultipleChoiceDrillClassEnv = (props: IMultipleChoiceDrillReview) => {
	const { drill } = props;

	const [sectionIndex, setSectionIndex] = useState(0);
	const indexRef = useRef(0);

	const nextSection = () => {
		if (sectionIndex < drill.data.length - 1) setSectionIndex(sectionIndex + 1);
	};

	const prevSection = () => {
		if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
	};

	return (
		<>
			<div className="tw-relative">
				<MultipleChoiceDemo
					key={sectionIndex}
					question={drill.data[sectionIndex].question}
					answers={drill.data[sectionIndex].content}
					correctAnswer={drill.data[sectionIndex].correctIndex}
				/>
				<LeftOutlined className="tw-absolute tw-bottom-1 text-3xl tw-left-[46%]" onClick={() => prevSection()} />
				<RightOutlined
					className="tw-absolute tw-bottom-1 text-3xl tw-left-[53%]"
					onClick={() => {
						nextSection();
					}}
				/>
			</div>
		</>
	);
};

export default MultipleChoiceDrillClassEnv;
