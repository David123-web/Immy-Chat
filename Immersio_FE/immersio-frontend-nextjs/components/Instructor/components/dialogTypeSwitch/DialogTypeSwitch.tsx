import { Switch } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface IDialogTypeSwitch {
	value: {
		isShowVideo: boolean;
		isShowSlide: boolean;
	};
	setValue: (data: { isShowVideo: boolean; isShowSlide: boolean }) => void;
}

const DialogTypeSwitch = (props: IDialogTypeSwitch) => {
  const { value, setValue } = props;
	// const [isShowVideo, setIsShowVideo] = useState<boolean>(true);
	// const [isShowSlide, setIsShowSlide] = useState<boolean>(true);

	const onChangeIsShowVideo = (checked: boolean) => {
		if (!(value.isShowSlide || checked)) {
			toast.warning('Please Enable at Least one Option');
		} else {
      setValue({
        isShowVideo: checked,
        isShowSlide: value.isShowSlide
      })
		}
	};

	const onChangeIsShowSlide = (checked: boolean) => {
		if (!(value.isShowVideo || checked)) {
			toast.warning('Please Enable at Least one Option');
		} else {
      setValue({
        isShowVideo: value.isShowVideo,
        isShowSlide: checked
      })
		}
	};

	return (
		<>
			<div className="tw-flex tw-flex-col tw-gap-4 tw-mt-3">
				<div>
					<Switch checked={value.isShowVideo} onChange={onChangeIsShowVideo} /> Show Lesson introduction Video
				</div>
				<div>
					<Switch checked={value.isShowSlide} onChange={onChangeIsShowSlide} /> Show  Auto generated dialogue Video
				</div>
			</div>
		</>
	);
};

export default DialogTypeSwitch;
