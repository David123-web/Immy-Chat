import interact from 'interactjs';
import React, { useEffect, useState, useRef } from 'react';
import styles from './FillInTheBlank.module.css';
import { CheckOutlined, CloseOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMobXStores } from '../../../../../stores';
import { postLessonsProgress } from '../../../../../services/lessons/apiLessons';

const FillInTheBlankDemo = ({ words, fragments, audio, demoRef, resetDrillProgress, drill_id, index }) => {
	try {
		const [numOfCorrect, setNumOfCorrect] = useState('0/' + words.length);
		const [clicked, setClicked] = useState(false);
		const [correctArray, setCorrectArray] = useState(new Array(words.length).fill(null));
		const [shuffledWords, setShuffledWords] = useState([]);
		const shuffledRef = useRef(shuffledWords);
		class wordChoice {
			constructor(index, word) {
				this.index = index;
				this.word = word;
			}
		}
		class dropZone {
			constructor(index) {
				this.index = index;
			}
		}
		let wordArray = [];
		let dropArray = [];
		words.forEach((ele, index) => {
			wordArray.push(new wordChoice(index, ele));
			dropArray.push(new dropZone(index));
		});

		// shuffle the words to a random order
		let shuffled = wordArray
			.map((val) => ({ val, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ val }) => val);
		const { globalStore } = useMobXStores();

		// check if words were dropped to the correct spots by checking their coordinates
		const checkAnswer = async () => {
			console.log('fill the blank');
			setClicked(true);
			let counter = 0;
			let tempArray = [];
			dropArray.forEach((ele, index) => {
				let leftCoorWord = document?.querySelector('#wordPiece' + index)?.getBoundingClientRect().left + window.scrollX;
				let topCoorWord = document?.querySelector('#wordPiece' + index)?.getBoundingClientRect().top + window.scrollY;
				let leftCoorDrop = document?.querySelector('#dropArea' + index)?.getBoundingClientRect().left + window.scrollX;
				let topCoorDrop = document?.querySelector('#dropArea' + index)?.getBoundingClientRect().top + window.scrollY;
				if (Math.abs(leftCoorDrop - leftCoorWord) < 5 && Math.abs(topCoorDrop - topCoorWord) < 5) {
					counter++;
					tempArray.push(true);
				} else {
					tempArray.push(false);
				}
			});
			let processedArray = [];
			shuffledRef.current.forEach((ele, i) => {
				processedArray.push(tempArray[ele.index] === true);
			});
			setCorrectArray(processedArray);
			setNumOfCorrect(counter + '/' + words.length);
			const drill = globalStore.listDrills.find((item) => item.data.find((e) => e.id === drill_id));
			if (drill && !globalStore.disableCheckAnswerAgain) {
				try {
					globalStore.setDisableNextDrills(true);
					globalStore.setDisableCheckAnswerAgain(true);
					const res = await postLessonsProgress({
						currentDiamond: globalStore.currentRewarding.currentGems,
						currentHealth: globalStore.currentRewarding.currentDrillHealthPoint,
						drillId: drill.id,
						index: index,
						isCorrect: counter === words.length,
						isDone: globalStore.listDrillsIds.length === 1,
					});
					globalStore.setCurrentRewarding({
						currentGems: res.data.currentDiamond,
						currentDrillHealthPoint: res.data.currentHealth,
					});
					globalStore.setDisableNextDrills(false);
					if (globalStore.listDrillsIds.indexOf(drill_id) !== -1) {
						globalStore.listDrillsIds.splice(globalStore.listDrillsIds.indexOf(drill_id), 1);
						console.log('globalStore.listDrillsIds', globalStore.listDrillsIds);
						globalStore.setListDrillsIds(globalStore.listDrillsIds);
					}
				} catch {
					globalStore.setDisableCheckAnswerAgain(false);
					globalStore.setDisableNextDrills(false);
				}
			}
			if (counter === words.length) {
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
		};

		// Set up all the draggable elements (words pieces) and where they are allowed to be dropped to (blank space in the paragraph) by coordinates
		// They are snapped either to the allowed dropzones or if too far from any, snapped to their original spots
		// Draggable elements are restricted to only move in the content zone (not outside the modal)
		useEffect(() => {
			initialize();
			return () => {
				demoRef.current = null;
			};
		}, []);

		const initialize = () => {
			shuffledRef.current = shuffled;
			setShuffledWords(shuffled);
			demoRef.current = checkAnswer;
			setTimeout(() => {
				let dropZoneCoordinates = [];
				dropArray.forEach((ele, index) => {
					let leftCoordinate =
						document?.querySelector('#dropArea' + index)?.getBoundingClientRect().left + window.scrollX;
					let topCoordinate =
						document?.querySelector('#dropArea' + index)?.getBoundingClientRect().top + window.scrollY;
					let dropZoneObj = { x: leftCoordinate, y: topCoordinate };
					dropZoneCoordinates.push(dropZoneObj);
				});

				shuffledRef.current.forEach((e, index) => {
					const position = { x: 0, y: 0 };

					let selfLeftCoor =
						document?.querySelector('#wordPiece' + index)?.getBoundingClientRect().left + window.scrollX;
					let selfTopCoor = document?.querySelector('#wordPiece' + index)?.getBoundingClientRect().top + window.scrollY;

					const startingPos = { x: selfLeftCoor, y: selfTopCoor, range: Infinity };

					interact('#wordPiece' + index).draggable({
						listeners: {
							start(event) {},
							move(event) {
								position.x += event.dx;
								position.y += event.dy;

								event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
							},
						},
						modifiers: [
							interact.modifiers.snap({
								targets: [
									function (x, y, interaction) {
										let foundIndex = dropZoneCoordinates.findIndex(
											(ele) =>
												Math.abs(x - ele.x) <= 50 &&
												Math.abs(y - ele.y) <= 50 &&
												!Array.from(document?.querySelectorAll('.wordPieceObj')).some(
													(item) =>
														Math.abs(item?.getBoundingClientRect().left + window.scrollX - ele.x) <= 1 &&
														Math.abs(item?.getBoundingClientRect().top + window.scrollY - ele.y) <= 1 &&
														item !== interaction.element
												)
										);
										if (foundIndex !== -1) {
											return {
												x: dropZoneCoordinates[foundIndex].x,
												y: dropZoneCoordinates[foundIndex].y,
												range: Infinity,
											};
										} else {
											return startingPos;
										}
									},
								],
								relativePoints: [
									{ x: 0, y: 0 }, // snap relative to the element's top-left,
								],
								range: 100,
								endOnly: true,
							}),

							interact.modifiers.restrictRect({
								restriction: document?.querySelector('#outerDiv'),
								endOnly: false,
							}),
						],
					});
				});
			}, 0);
		};

		return (
			<>
				<div className={styles.audioDiv}>
					<audio src={typeof audio === 'string' ? audio : URL.createObjectURL(audio)} id="player" controls />
				</div>
				<div id="outerDiv" className={styles.outerDiv}>
					<div className={styles.parentDiv}>
						<div className={styles.fragmentsDiv}>
							<div className={styles.fragmentsContainer}>
								{fragments.map((ele, index) => {
									if (index !== fragments.length - 1) {
										return (
											<span key={index}>
												<span>{ele}</span>
												<div id={'dropArea' + index} className={styles.emptyBox}></div>
											</span>
										);
									} else {
										return <span key={index}>{ele}</span>;
									}
								})}
							</div>
						</div>
						<div className={styles.wordsDiv}>
							{shuffledWords.map((ele, index) => {
								return (
									<>
										<div
											order={ele.index}
											className={[
												styles.wordPiece,
												'wordPieceObj',
												'draggable',

												correctArray[index] === true
													? styles.correct
													: correctArray[index] === false
													? styles.wrong
													: styles.no,
											].join(' ')}
											key={index}
											id={'wordPiece' + ele.index}
										>
											{ele.word || '\u00A0'}
											{correctArray[index] === true ? (
												<CheckOutlined />
											) : correctArray[index] === false ? (
												<CloseOutlined />
											) : null}
										</div>
									</>
								);
							})}
						</div>
						<h2 className={clicked ? styles.correctCount : styles.hide}>{numOfCorrect}</h2>
						<ReloadOutlined
							className="tw-font-bold tw-text-[28px]"
							onClick={() => {
								setClicked(false);
								setShuffledWords([]);
								setCorrectArray(new Array(words.length).fill(null));
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
			</>
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

export default FillInTheBlankDemo;
