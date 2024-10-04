import React, { useEffect, useState, useRef } from 'react';
import styles from './FlashCard.module.css';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { CheckOutlined, CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { postLessonsProgress } from '../../../../../services/lessons/apiLessons';
import { useMobXStores } from '@/src/stores';
import { observer } from 'mobx-react-lite';

const FlashCardDemo = (props) => {
	const { globalStore } = useMobXStores();
	try {
		const { index, answer, image, demoRef, resetDrillProgress } = props;
		const letters = answer.toLowerCase().split('');
		const [enteredValue, setEnteredValue] = useState([]);
		const [enteredWord, setEnteredWord] = useState('');
		const keyPerRow = 6;
		const [numOfRow, setNumOfRow] = useState(2);
		const filteredLetters = letters.filter((ele, index) => ele !== ' ');

		const [keyArray, setKeyArray] = useState([]);
		//const pageRef = useRef(0);
		const [answerRight, setAnswerRight] = useState(null);

		// check if the input word is correct, show a green checkmark or red crossmark over the image for 1 second to indicate the result
		const checkAnswer = async () => {
			console.log('flash card');
			const drill = globalStore.listDrills.find((item) => item.data.find((e) => e.id === props.drill_id));
			if (drill && !globalStore.disableCheckAnswerAgain) {
				try {
					globalStore.setDisableNextDrills(true);
					globalStore.setDisableCheckAnswerAgain(true);
					const res = await postLessonsProgress({
						currentDiamond: globalStore.currentRewarding.currentGems,
						currentHealth: globalStore.currentRewarding.currentDrillHealthPoint,
						drillId: drill.id,
						index: index,
						isCorrect: enteredValue.join('').toLowerCase() === answer.toLowerCase(),
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
			setAnswerRight(enteredValue.join('').toLowerCase() === answer.toLowerCase());
			if (enteredValue.join('').toLowerCase() === answer.toLowerCase()) {
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
			setTimeout(() => {
				setAnswerRight(null);
			}, 1000);
		};

		useEffect(() => {
			//pageRef.current = props.currentIndex;
			const length = filteredLetters.length;
			if (length > 12) {
				let temp = Math.ceil(length / 6);
				setNumOfRow(temp);
			}
		}, [props]);

		useEffect(() => {
			initialize();
			return () => {
				demoRef.current = null;
			};
		}, []);

		const initialize = () => {
			demoRef.current = checkAnswer;
			// shuffle the letters for keyboard
			// keyboard contains the letters in the correct answer
			const shuffledLetters = filteredLetters
				.map((val) => ({ val, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.map(({ val }) => val);

			// listener to type in letters
			const onKeyPress = (e) => {
				e.preventDefault();
				//if (pageRef.current !== index) return;
				if (letters.indexOf(e.key) !== -1 || e.key === ' ') {
					// Only keyboard inputs from original letters allowed. Can be removed if needed.
					const currentValue = enteredValue;
					currentValue.push(e.key);
					setEnteredValue(currentValue);
					setEnteredWord(enteredValue.join(''));
				}
			};

			// listener for backspace
			const onKeyDown = (e) => {
				//if (pageRef.current !== index) return;
				if (e.key === 'Backspace') {
					const currentValue = enteredValue;
					currentValue.pop();
					setEnteredValue(currentValue);
					setEnteredWord(enteredValue.join(''));
				}
			};

			window.addEventListener('keypress', onKeyPress);
			window.addEventListener('keydown', onKeyDown);
			setKeyArray(shuffledLetters);

			// load the image for this flashcard
			if (typeof image === 'string') {
				let imgEleAll = document.querySelectorAll('.imageSection');
				let imgArr = Array.from(imgEleAll);
				imgArr.forEach((ele) => {
					if (ele.id === 'imageCard' + index) ele.src = image;
				});
			} else {
				let reader = new FileReader();
				reader.onload = function (e) {
					// finished reading file data.
					let imgEleAll = document.querySelectorAll('.imageSection');
					let imgArr = Array.from(imgEleAll);
					imgArr.forEach((ele) => {
						if (ele.id === 'imageCard' + index) ele.src = e.target.result;
					});
				};

				reader.readAsDataURL(new Blob(image));
			}

			return () => {
				window.removeEventListener('keypress', onKeyPress);
				window.removeEventListener('keydown', onKeyDown);
			};
		};

		const typeLetter = (i) => {
			if (!keyArray[i]) return;
			const currentValue = enteredValue;
			currentValue.push(keyArray[i]);
			setEnteredValue(currentValue);
			setEnteredWord(enteredValue.join(''));
		};

		const typeSpace = () => {
			const currentValue = enteredValue;
			currentValue.push(' ');
			setEnteredValue(currentValue);
			setEnteredWord(enteredValue.join(''));
		};

		const deleteLetter = () => {
			const currentValue = enteredValue;
			currentValue.pop();
			setEnteredValue(currentValue);
			setEnteredWord(enteredValue.join(''));
		};

		return (
			<div className={styles.parentCard}>
				<div className={styles.imageContainer}>
					<img className={[styles.imageCard, 'imageSection'].join(' ')} id={'imageCard' + index}></img>
					{answerRight ? (
						<CheckOutlined className={styles.checkMarkRight} />
					) : answerRight === false ? (
						<CloseOutlined className={styles.checkMarkWrong} />
					) : null}
				</div>
				<div className={styles.wrapperDiv}>
					<div className={styles.wordCard} id={'wordCard' + index}>
						{enteredWord}
					</div>
					<div className={styles.keyboard} id={'keyboard' + index}>
						{[...Array(numOfRow)].map((_, index) => {
							return [...Array(keyPerRow)].map((_, i) => {
								let prefix = index * keyPerRow + i;
								return (
									<div onClick={() => typeLetter(prefix)} className={styles.key}>
										{keyArray[prefix] ? keyArray[prefix] : '\u00A0'}
									</div>
								);
							});
						})}
						<div className={styles.fullLine}>
							<div onClick={() => typeSpace()} className={styles.space}>
								{'space'}
							</div>
							<div onClick={() => deleteLetter()} className={styles.key}>
								{'⌫'}
							</div>
						</div>
					</div>
					<ReloadOutlined
						className="tw-font-bold tw-text-[28px]"
						onClick={() => {
							setEnteredWord('');
							setEnteredValue([]);
							globalStore.setDisableNextDrills(false);
							globalStore.setDisableCheckAnswerAgain(false);
							setTimeout(() => {
								initialize();
								resetDrillProgress && resetDrillProgress();
							}, 0);
						}}
					/>
				</div>
			</div>
		);
	} catch {
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

export default observer(FlashCardDemo);
