import { IPlanDrill } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import DragAndDropDemo from '../Instructor/tools/drills/DragAndDrop/DragAndDropDemo';

type Props = {
	drill: IPlanDrill;
};

const DragAndDropDrillClassEnv = (props: Props) => {
	const { drill: drillSelected } = props;
	const [sectionIndex, setSectionIndex] = useState(0);
	const demoRef = useRef(null);
	const indexRef = useRef(0);

	const nextSection = () => {
		if (sectionIndex < drillSelected.data.length - 1) setSectionIndex(sectionIndex + 1);
	};

	const prevSection = () => {
		if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
	};

	return (
		<div className="tw-relative">
			<DragAndDropDemo
				demoRef={demoRef}
				key={sectionIndex}
				words={drillSelected.data.map((x) => x.question)}
				images={drillSelected.data.map((x) => x.mediaUrl)}
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

export default DragAndDropDrillClassEnv;
