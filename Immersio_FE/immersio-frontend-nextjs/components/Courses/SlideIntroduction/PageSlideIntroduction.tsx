import slide1 from '@/public/assets/img/course/slide-introduction/slide-1.jpg';
import slide2 from '@/public/assets/img/course/slide-introduction/slide-2.jpg';
import slide3 from '@/public/assets/img/course/slide-introduction/slide-3.jpg';
import slide4 from '@/public/assets/img/course/slide-introduction/slide-4.jpg';
import slide5 from '@/public/assets/img/course/slide-introduction/slide-5.jpg';
import slide6 from '@/public/assets/img/course/slide-introduction/slide-6.jpg';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import ContextSlide from '@/components/Courses/SlideIntroduction/ContextSlide';
import CourseSlide from '@/components/Courses/SlideIntroduction/CourseSlide';
import { CaretRightOutlined, LeftOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import { Empty } from 'antd';

type PageSlideIntroductionProps = {
	context: string;
	contextAudio: string;
	dataCourseSlide: {
		image: any;
		audio: string;
		content: string;
	}[];
};

const PageSlideIntroduction = (props: PageSlideIntroductionProps) => {
	const { context, dataCourseSlide, contextAudio } = props;
	const [isFullDataForSlide, setIsFullDataForSlide] = useState(false);
	const [ref, setRef] = useState<Slider>();
	const [isRevert, setIsRevert] = useState<boolean>(false);
	const [currentSideIndex, setCurrentSideIndex] = useState(-1);
	const [nextSlide, setNextSlide] = useState<number>(-1);
	const [isCompleteAutoPlay, setIsCompleteAutoPlay] = useState<boolean>(false);
	
	useEffect(() => {
		console.log('dataCourseSlide', dataCourseSlide);
		const isFull = dataCourseSlide.every((item) => item.audio && item.content);
		setIsFullDataForSlide(isFull);
	}, []);

	useEffect(() => {
		if(nextSlide > currentSideIndex && !isCompleteAutoPlay) {
			ref?.slickNext();
			setCurrentSideIndex((prev) => {
				if (prev < dataCourseSlide.length - 1) {
					return prev + 1;
				}
				return dataCourseSlide.length - 1;
			});
		}
	}, [nextSlide])

	useEffect(() => {
		if(currentSideIndex === dataCourseSlide.length - 1) {
			setIsCompleteAutoPlay(true)
		}
	}, [currentSideIndex])

	const renderArrows = () => {
		return (
			<div className="tw-w-full tw-flex tw-justify-between tw-absolute tw-bottom-[4.5rem]">
				{currentSideIndex >= 0 && (
					<>
						{currentSideIndex <= dataCourseSlide.length - 1 && currentSideIndex > 0 ? (
							<div
								className="-tw-ml-8 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full bg-theme-4 tw-cursor-pointer"
								onClick={() => {
									setCurrentSideIndex((prev) => {
										if (prev > 0) {
											return prev - 1;
										}
										return 0;
									});
									ref.slickPrev();
								}}
							>
								<LeftOutlined className="tw-text-white tw-text-[10px]" />
							</div>
						) : <div></div>}
						{currentSideIndex < dataCourseSlide.length - 1 && (
							<div
								className={`-tw-mr-8 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full bg-theme-4 tw-cursor-pointer`}
								onClick={() => {
									ref.slickNext();
									setCurrentSideIndex((prev) => {
										if (prev < dataCourseSlide.length - 1) {
											return prev + 1;
										}
										return dataCourseSlide.length - 1;
									});
								}}
							>
								<RightOutlined className="tw-text-white tw-text-[10px]" />
							</div>
						)}
					</>
				)}
			</div>
		);
	};

	return (
		<div className="course-slide-introduction tw-w-[700px] container tw-flex tw-flex-col tw-justify-center tw-items-center">
			{isFullDataForSlide ? (
				<>
					{' '}
					<div className="tw-w-full tw-relative">
						{isCompleteAutoPlay && renderArrows()}
						<Slider
							ref={(ref) => setRef(ref)}
							className="tw-w-full"
							arrows={true}
							dots={false}
							infinite={false}
							speed={500}
							slidesToShow={1}
							slidesToScroll={1}
							onSwipe={(e) => {
								if (e === 'left') {
									setCurrentSideIndex((prev) => {
										if (prev < dataCourseSlide.length - 1) {
											return prev + 1;
										}
										return dataCourseSlide.length - 1;
									});
								} else {
									setCurrentSideIndex((prev) => {
										if (prev > 0) {
											return prev - 1;
										}
										return 0;
									});
								}
							}}
						>
							{dataCourseSlide.map((item, index) => {
								return (
									<div className="tw-flex tw-flex-col tw-relative tw-h-[18rem]">
										<CourseSlide
											key={index}
											triggerReplay={currentSideIndex === index}
											audioId={index}
											imageUrl={item.image}
											src={item.audio}
											content={item.content}
											isLastSlide={currentSideIndex === dataCourseSlide.length - 1}
											setIsRevert={setIsRevert}
											nextSlide={nextSlide}
											setNextSlide={setNextSlide}
										/>
										<div className="flex-1 color-theme-4 tw-w-full">{item.content}</div>
									</div>
								);
							})}
						</Slider>
						{currentSideIndex === -1 && (
							<div
								onClick={() => {
									setCurrentSideIndex(0);
									setNextSlide(0);
								}}
								className="tw-absolute tw-mx-auto tw-left-0 tw-right-0 tw-top-40 tw-w-20 tw-h-20 tw-flex tw-items-center tw-justify-center tw-rounded-full bg-theme-4 tw-cursor-pointer"
							>
								<CaretRightOutlined className="tw-text-white tw-text-5xl tw-leading-none" />
							</div>
						)}
						{currentSideIndex === dataCourseSlide.length - 1 && isRevert && (
							<div
								onClick={() => {
									ref.slickGoTo(0);
									setCurrentSideIndex(0);
									setIsRevert(false);
								}}
								className="tw-absolute tw-mx-auto tw-left-0 tw-right-0 tw-top-40 tw-w-20 tw-h-20 tw-flex tw-items-center tw-justify-center tw-rounded-full bg-theme-4 tw-cursor-pointer"
							>
								<ReloadOutlined className="tw-text-white tw-text-5xl tw-leading-none" />
							</div>
						)}
					</div>
					<ContextSlide audioUrl={contextAudio} content={context} />
				</>
			) : (
				<Empty className="tw-mt-20" description="Not enough data to display slide" />
			)}
		</div>
	);
};

export default PageSlideIntroduction;
