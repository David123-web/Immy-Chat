import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { viewPublicThumbnail } from '../../src/services/files/apiFiles';
import { Spin } from 'antd';

const LoadingImage = ({ thumbnailId }) => {
	const [image, setImage] = useState()
	useEffect(() => {
		loadImage()
	}, [thumbnailId])

	const loadImage = async () => {
		if (thumbnailId) {
			try {
				const responseThumb = await viewPublicThumbnail(thumbnailId);
				if (responseThumb?.data) {
					setImage(responseThumb.data)
				}
			} catch (error) {
				toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
			}
		}
	}

	if (!image) {
		return (
			<div
				className="mb-5"
				style={{
					width: '100%',
					height: 0,
					paddingBottom: '55%',
					position: 'relative',
					backgroundColor: '#f5f6f7',
				}}
			>
				<div className="tw-absolute tw-inset-x-0 tw-inset-y-0 tw-flex tw-items-center tw-justify-center">
					<Spin />
				</div>
			</div>
		)
	}

	return (
		<div
      className="mb-5"
      style={{
        backgroundImage: `url(${image})`,
        width: '100%',
        height: 0,
        paddingBottom: '55%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
	)
}

export default LoadingImage