import { Spin } from 'antd';
import React from 'react';

const LoadingPage = () => {
	return (
		<div className="tw-h-screen tw-w-screen tw-flex tw-justify-center tw-items-center">
			<Spin size='large' />
		</div>
	);
};

export default LoadingPage;
