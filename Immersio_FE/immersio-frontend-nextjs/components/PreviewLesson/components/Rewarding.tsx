import HeartIcon from '@/public/assets/img/course/reward/Heart.svg';
import DiamondIcon from '@/public/assets/img/my-space/Diamond.svg';
import { useMobXStores } from '@/src/stores';
import { Progress } from 'antd';
import { observer } from 'mobx-react-lite';

const Rewarding = () => {
	const {globalStore} = useMobXStores();
	return (
		<div className='tw-flex tw-w-1/6 tw-items-center tw-gap-4 bg-theme-6 !tw-cursor-default tw-fixed tw-right-6'>
			<div className="tw-text-base tw-font-semibold">
				<DiamondIcon style={{ width: '30px', height: '30px', marginRight: '5px' }} /> {globalStore.currentRewarding.currentGems}
			</div>
			<div className="rewarding-progress-bar tw-flex tw-items-center tw-w-1/2">
				<HeartIcon style={{ width: '35px', height: '35px' }} />
				<Progress percent={globalStore.currentRewarding.currentDrillHealthPoint} size="small" showInfo={false} status={globalStore.currentRewarding.currentDrillHealthPoint > 80 ? 'success' : 'exception'} />
			</div>
		</div>
	);
};

export default observer(Rewarding);
