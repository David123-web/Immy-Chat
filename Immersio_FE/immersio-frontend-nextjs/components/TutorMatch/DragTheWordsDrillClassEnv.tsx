import { IPlanDrill } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import DragTheWordDemo from '../Instructor/tools/drills/DragTheWord/DragTheWordDemo';

interface IDragTheWordsDrillReview {
	drill: IPlanDrill;
}

const DragTheWordsDrillClassEnv = (props: IDragTheWordsDrillReview) => {
	const { drill } = props;
	const [fragments, setFragments] = useState([]);
	const [words, setWords] = useState([]);

	const [sectionIndex, setSectionIndex] = useState(0);
	const demoRef = useRef(null);
	const indexRef = useRef(0);

	useEffect(() => {
		if (drill.data.length) {
			let startingFragments = [];
			let startingWords = [];
			for (let i = 0; i < drill.data.length; i++) {
				const statement = drill.data[i].question;
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
		<div className="tw-relative">
			<DragTheWordDemo
				demoRef={demoRef}
				key={sectionIndex}
				words={words[sectionIndex]}
				fragments={fragments[sectionIndex]}
			/>
			<div className="tw-flex tw-absolute -tw-bottom-8 tw-justify-between tw-gap-4 tw-left-1/2 tw-translate-x-[-50%]">
				<LeftOutlined className="text-2xl" onClick={() => prevSection()} />
				<EyeOutlined className="text-2xl" onClick={() => demoRef.current()} />
				<RightOutlined
					className="text-2xl"
					onClick={() => {
						nextSection();
					}}
				/>
			</div>
		</div>
	);
};

export default DragTheWordsDrillClassEnv;
