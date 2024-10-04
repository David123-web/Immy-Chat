import { IPlanDrill } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import MultipleChoiceDemo from '../Instructor/tools/drills/MultipleChoice/MultipleChoiceDemo';
import { SortParagraphDrill } from '../Instructor/tools/drills/SortParagraphDrill/SortParagraphDrill';

interface SortTheParagraphDrillClassEnv {
	drill: IPlanDrill;
}

const SortTheParagraphDrillClassEnv = (props: SortTheParagraphDrillClassEnv) => {
	const { drill } = props;
  const [questionPage, setQuestionPage] = useState(0);
  const [questionData, setQuestionData] = useState([]); // [ q1, q2, ]
  const questionRef = useRef(questionData);

	const [sectionIndex, setSectionIndex] = useState(0);
	const indexRef = useRef(0);

	const nextSection = () => {
		if (sectionIndex < drill.data.length - 1) setSectionIndex(sectionIndex + 1);
	};

	const prevSection = () => {
		if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
	};

  const incrementQuestionPage = () => {
    if (questionPage < questionRef.current.length - 1) setQuestionPage(questionPage + 1);
}

	return (
		<>
			<div className="tw-relative">
				{/* <SortParagraphDrill
					key="0"
					items={drill.data}
					setQuestionPage={incrementQuestionPage}
					checkAnswer={checkAnswer}
					questionPage={questionPage}
				/> */}
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

export default SortTheParagraphDrillClassEnv;
