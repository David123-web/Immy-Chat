import { SoundFilled } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';

type ContextSlideProps = {
	audioUrl: string;
	content: string;
};

const ContextSlide = (props: ContextSlideProps) => {
	const { audioUrl, content } = props;
	const [isPlaying, setIsPlaying] = useState(false);

	const audioRef = useRef<any>(null);

	useEffect(() => {
		if (audioRef?.current) {
			audioRef.current.addEventListener('ended', function () {
				audioRef.current.currentTime = 0;
				setIsPlaying(false);
			});
		}
	}, [isPlaying]);

	return (
		<div className="tw-mt-4 tw-flex tw-flex-col tw-gap-4">
			<div
				className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
				onClick={() => {
					setIsPlaying((isPlaying) => {
						if (isPlaying) {
							audioRef.current.pause();
						} else {
							audioRef.current.play();
						}
						return !isPlaying;
					});
				}}
			>
				<span className="tw-h-10 tw-px-6 tw-py-2 tw-rounded-full tw-text-lg bg-theme-5 tw-text-white">Context</span>
				<span className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-w-14 tw-h-14 bg-theme-5 -tw-ml-6">
					<span className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-w-11 tw-h-11 tw-bg-[#8e6332]">
						<SoundFilled className="tw-text-2xl tw-leading-none tw-text-white" />
					</span>
				</span>
			</div>
			<div className="tw-text-center" dangerouslySetInnerHTML={{ __html: content }} />
			<audio id="audio-context" ref={audioRef}>
				<source src={audioUrl} type="audio/wav" />
			</audio>
		</div>
	);
};

export default ContextSlide;
