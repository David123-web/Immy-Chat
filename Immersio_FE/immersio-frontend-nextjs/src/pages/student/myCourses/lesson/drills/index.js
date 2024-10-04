import React from 'react';
import DragAndDropDemo from './DragAndDropDemo';
import DragTheWordDemo from './DragTheWordDemo';
import FillInTheBlankDemo from './FillInTheBlankDemo';
import FlashCardDemo from './FlashCardDemo';
import MultipleChoiceDemo from './MultipleChoiceDemo';
import { SortParagraphDrill } from '../../../../../../components/Instructor/tools/drills/SortParagraphDrill/SortParagraphDrill';

const DrillPreview = ({ drillProgress, setDrillProgress, value, demoRef, sectionIndex }) => {
	if (!value) return null;
	const resetDrillProgress = () => {
		setDrillProgress({
			id: drillProgress.id,
			step: 1,
		});
	};

	return (
		<>
			{value.drillType === 'dragWords' ? ( // //
				<DragTheWordDemo
					key={sectionIndex}
					demoRef={demoRef}
					words={value.words[sectionIndex]}
					fragments={value.fragments[sectionIndex]}
					resetDrillProgress={resetDrillProgress}
					drill_id={value.drill_id[sectionIndex]}
					index={sectionIndex}
				/>
			) : value.drillType === 'multipleChoice' ? ( // //
				<MultipleChoiceDemo
					drillProgress={drillProgress}
					setDrillProgress={setDrillProgress}
					key={sectionIndex}
					demoRef={demoRef}
					question={value.questions[sectionIndex]}
					answers={value.array_of_answers[sectionIndex]}
					correctAnswer={value.correct_answers[sectionIndex]}
					index={sectionIndex}
					resetDrillProgress={resetDrillProgress}
					drill_id={value.drill_id[sectionIndex]}
				/>
			) : value.drillType === 'flashcards' ? ( // //
				<FlashCardDemo
					key={sectionIndex}
					index={sectionIndex}
					image={value.images[sectionIndex]}
					answer={value.answers[sectionIndex]}
					demoRef={demoRef}
					resetDrillProgress={resetDrillProgress}
					drill_id={value.drill_id[sectionIndex]}
				/>
			) : value.drillType === 'dragNdrop' ? ( // //
				<DragAndDropDemo
					key={sectionIndex}
					images={value.images[sectionIndex]}
					words={value.words[sectionIndex]}
					demoRef={demoRef}
					resetDrillProgress={resetDrillProgress}
					index={sectionIndex}
					drill_id={value.drill_id[sectionIndex]}
				/>
			) : value.drillType === 'fillBlank' ? ( // //
				<FillInTheBlankDemo
					key={sectionIndex}
					demoRef={demoRef}
					words={value.words[sectionIndex]}
					fragments={value.fragments[sectionIndex]}
					audio={value.audios[sectionIndex]}
					resetDrillProgress={resetDrillProgress}
					drill_id={value.drill_id[sectionIndex]}
				/>
			) : value.drillType === 'sort' ? ( //
				<SortParagraphDrill
					key={sectionIndex}
					questionPage={sectionIndex}
					checkAnswer={demoRef}
					items={value.array_of_answers}
					resetDrillProgress={resetDrillProgress}
					index={sectionIndex}
					drill_id={value.drill_id[sectionIndex]}
				/>
			) : null}
		</>
	);
};

export default DrillPreview;
