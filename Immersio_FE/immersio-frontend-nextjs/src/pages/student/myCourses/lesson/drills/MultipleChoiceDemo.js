import React, { useEffect, useState, useRef } from 'react';
import styles from './MultipleChoice.module.css';
import { CheckOutlined, CloseOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMobXStores } from '../../../../../stores';
import { postLessonsProgress } from '../../../../../services/lessons/apiLessons';
import { observer } from 'mobx-react-lite';

const MultipleChoiceDemo = (props) => {
	try {
		const { globalStore } = useMobXStores();

		const { index, question, answers, correctAnswer, drillProgress, setDrillProgress, resetDrillProgress } = props;
		const [answerList, setAnswerList] = useState([]);

		const [ansIcon, setAnsIcon] = useState(new Array(answers ? answers.length : 1).fill(null));
		const ansRef = useRef(ansIcon);

		useEffect(() => {
			filterAnswers(answers);
		}, [answers]);

		const filterAnswers = (answers) => {
			let list = [];
			answers.forEach((answ) => {
				list.push({ answer: answ, correct: false, answered: false });
			});
			list[correctAnswer].correct = true;
			reShuffle(list);
		};

		const checkAnswer = async (index) => {
			console.log('multiple choice');

			let list = [...answerList];
			list.forEach((answ, i) => {
				if (index == i) {
					answ.answered = true;
				} else {
					answ.answered = false;
				}
			});
			if (list[index]) {
				const drill = globalStore.listDrills.find((item) => item.data.find((e) => e.id === props.drill_id));
				if (drill && !globalStore.disableCheckAnswerAgain) {
					try {
						globalStore.setDisableNextDrills(true);
						globalStore.setDisableCheckAnswerAgain(true);
						const res = await postLessonsProgress({
							currentDiamond: globalStore.currentRewarding.currentGems,
							currentHealth: globalStore.currentRewarding.currentDrillHealthPoint,
							drillId: drill.id,
							index: props.index,
							isCorrect: list[index].correct,
							isDone: globalStore.listDrillsIds.length === 1,
						});
						globalStore.setCurrentRewarding({
							currentGems: res.data.currentDiamond,
							currentDrillHealthPoint: res.data.currentHealth,
						});
						globalStore.setDisableNextDrills(false);
						if (globalStore.listDrillsIds.indexOf(props.drill_id) !== -1) {
							globalStore.listDrillsIds.splice(globalStore.listDrillsIds.indexOf(props.drill_id), 1);
							console.log('globalStore.listDrillsIds', globalStore.listDrillsIds);
							globalStore.setListDrillsIds(globalStore.listDrillsIds);
						}
					} catch {
						globalStore.setDisableCheckAnswerAgain(false);
						globalStore.setDisableNextDrills(false);
					}
				}
				if (list[index].correct) {
					const correctAudio = document.getElementById('yourAudio-correct');
					if (correctAudio) {
						correctAudio.play();
					}
				} else {
					const wrongAudio = document.getElementById('yourAudio-wrong');

					if (wrongAudio) {
						wrongAudio.play();
					}
				}
			}

			//list[index].answered = true
			setAnswerList(list);
			setDrillProgress({
				id: drillProgress.id,
				step: 2,
			});
		};

		const reShuffle = (list) => {
			//shuffling answers
			let shf = [];
			while (list && list.length > 0) {
				let rand = Math.floor(Math.random() * list.length);
				shf.push(list.splice(rand, 1)[0]);
			}
			setAnswerList(shf);
		};

		return (
			<div className={styles.parentCard}>
				<div className={styles.question}>{question}</div>
				<div className={styles.answerDiv}>
					{answerList.map((answer, i) => (
						<div
							className={[
								styles.answer,
								answer.answered ? (answer.correct ? styles.right : styles.wrong) : styles.no,
							].join(' ')}
							onClick={() => checkAnswer(i)}
						>
							{answer.answer}
							{answer.answered ? answer.correct ? <CheckOutlined /> : <CloseOutlined /> : null}
						</div>
					))}
					<br></br>
					<ReloadOutlined
						className="tw-font-bold tw-text-[28px]"
						onClick={() => {
							checkAnswer(-1);
							reShuffle(answerList);
							resetDrillProgress && resetDrillProgress();
							globalStore.setDisableNextDrills(false);
							globalStore.setDisableCheckAnswerAgain(false);
						}}
					/>
				</div>
			</div>
		);
	} catch (err) {
		console.log('Drill error:', err);
		return (
			<>
				<h5>
					<CloseCircleOutlined style={{ color: 'red' }} /> There are some unfilled fields in this drill
				</h5>
				<h6>Check the drill and fill them out</h6>
			</>
		);
	}
};

export default observer(MultipleChoiceDemo);
