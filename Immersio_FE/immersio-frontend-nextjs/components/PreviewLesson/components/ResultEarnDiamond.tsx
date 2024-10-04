import { useMobXStores } from '@/src/stores';
import DiamondIcon from '@/public/assets/img/my-space/Diamond.svg';

const ResultEarnDiamond = () => {
	const { globalStore } = useMobXStores();
	return (
		<div className="tw-flex tw-h-full tw-flex-col tw-gap-8 tw-justify-center tw-items-center tw-font-semibold">
			<div className="tw-text-2xl">You did it!</div>
			<div>You've earned</div>
			<div>
				<div>{globalStore.currentRewarding.currentGems}</div>
				<DiamondIcon style={{ width: '60px', height: '60px', marginRight: '5px' }} />
			</div>
			<div className='tw-w-60 tw-text-center'>Languages Gems for your outstanding effort.</div>
		</div>
	);
};

export default ResultEarnDiamond;
