import { SoundFilled } from '@ant-design/icons';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

type CourseSlideProps = {
	src: string;
	imageUrl: any;
	audioId: string | number;
	triggerReplay: boolean;
	content: string;
	isLastSlide?: boolean;
	setIsRevert?: (value: boolean)=> void;
	nextSlide?: number;
	setNextSlide?: (value: number)=> void;
};

const CourseSlide = (props: CourseSlideProps) => {
	const { src, imageUrl, audioId, triggerReplay, content, setIsRevert, isLastSlide, nextSlide, setNextSlide } = props;
	const srcRef = useRef<any>(src);
	const audioRef = useRef<any>();
	const playRef = useRef<any>();

	const [isPlaying, setIsPlaying] = useState(false);
	useEffect(() => {
		srcRef.current = src;
		return () => {
			srcRef.current = undefined;
		};
	}, [src]);

	useEffect(() => {
		if (audioRef?.current) {
			audioRef.current.addEventListener('ended', function () {
				audioRef.current.currentTime = 0;
				setIsPlaying(false);
				if(isLastSlide){
					setIsRevert(true);
				} else {
					setNextSlide(nextSlide + 1);
				}
			});
		}
	}, [isPlaying]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			audioRef.current.pause();
		}
		if (triggerReplay && playRef.current && audioRef.current) {
			setTimeout(() => {
				audioRef.current.play();
				setIsPlaying(true);
			}, 600);
		}
	}, [triggerReplay]);

	return (
		<div className="tw-relative tw-cursor-grabbing">
			<img
				src={imageUrl ? imageUrl : '/assets/img/icon/no-image-icon.png'}
				alt="slide1"
				className="!tw-border-none tw-w-[42rem] tw-h-[22rem] tw-object-contain"
			/>
			{src && (
				<>
					<span
						ref={playRef}
						onClick={() => {
							setIsPlaying((prev) => !prev);
							if (isPlaying) {
								audioRef.current.pause();
							} else {
								audioRef.current.play();
							}
						}}
						className="tw-z-20 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-rounded-full tw-w-6 tw-h-6 tw-bg-gray tw-absolute tw-bottom-5 tw-left-1/2 tw-transform -tw-translate-x-1/2"
					>
						<SoundFilled className="tw-leading-none tw-text-white" />
					</span>

					<audio id={`audio-slide-${audioId}`} ref={audioRef}>
						<source src={src} type="audio/wav" />
					</audio>
				</>
			)}
		</div>
	);
};

export default CourseSlide;
