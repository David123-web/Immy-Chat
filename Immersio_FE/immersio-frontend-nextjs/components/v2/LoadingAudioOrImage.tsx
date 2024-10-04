import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { viewFileLinkByID } from '../../src/services/files/apiFiles';

export const getValidUrl = (url = "") => {
	var pattern = /^((http|https|ftp):\/\/)/;

	if(!pattern.test(url)) {
		return false
	}

	return true
};

const LoadingAudioOrImage = ({
	src, width = 300, height = 60, children
}: { src?: string; width?: number; height?: number; children: Function }) => {
	const [srcState, setSrcState] = useState<any>('')
	useEffect(() => {
		if (getValidUrl(src)) {
			setSrcState(src)
		} else {
			loadAudio()
		}
	}, [src])

	const loadAudio = async () => {
		if (src) {
			try {
				const responseThumb = await viewFileLinkByID(src);
				if (responseThumb?.data) {
					setSrcState(responseThumb.data)
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		}
	}

	if (!srcState) {
		return (
			<div
				style={{
					width,
					height,
					position: 'relative',
				}}
			>
				<div className="tw-absolute tw-inset-x-0 tw-inset-y-0 tw-flex tw-items-center tw-justify-center">
					<Spin />
				</div>
			</div>
		)
	}

	return children({ srcState })
}

export default LoadingAudioOrImage