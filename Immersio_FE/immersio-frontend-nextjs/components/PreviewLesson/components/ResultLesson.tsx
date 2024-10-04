import { useMobXStores } from '@/src/stores';
import DiamondIcon from '@/public/assets/img/my-space/Diamond.svg';

const ResultLesson = () => {
	const { globalStore } = useMobXStores();
	return globalStore.currentRewarding.currentDrillHealthPoint < 70 ? (
		<div className="tw-flex tw-h-full tw-flex-col tw-gap-8 tw-justify-center tw-items-center">
			<div className="tw-text-2xl tw-font-semibold">Victory is near!</div>
			<div className="tw-text-neutral-500">You've Conquered the Lesson!</div>
			<div className="tw-text-neutral-500">
				<div>Great job on completing the lesson!</div>
				<div>You're so close to mastering this material that we can practically hear</div>
				<div>your brain flexing. To really level up your language skills, we suggest</div>
				<div>giving this lsson another whirl and nailing those drills at 70% or higher.</div>
			</div>
		</div>
	) : (
		<div className="tw-flex tw-h-full tw-flex-col tw-gap-8 tw-justify-center tw-items-center tw-font-semibold">
			<div className="tw-text-2xl">You did it!</div>
			<div>You've earned</div>
			<div>
				<div>{globalStore.currentRewarding.currentGems}</div>
				<DiamondIcon style={{ width: '60px', height: '60px', marginRight: '5px' }} />
			</div>
			<div className="tw-w-60 tw-text-center">Languages Gems for your outstanding effort.</div>
		</div>
	);
};

export default ResultLesson;
