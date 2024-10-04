import { observer } from 'mobx-react-lite';
import DashboardNav from '../Navigation/DashboardNav';
import Navigator from '../Navigation/Navigator';
import { useEffect, useState } from 'react';

const DashboardRoute = ({ children }) => {
	const [show, setShow] = useState(true);
	const mergedConfig = {
		show,
		setShow
	}

	useEffect(() => {
		if (typeof window !== 'undefined' && window.innerWidth < 767) {
			setShow(false)
		}
	}, [])

	return (
		<>
			<style jsx global>
				{`
					.section-uploader .ant-upload.ant-upload-select-picture-card {
						width: 100%;
						height: 160px;
					}
					.section-uploader-error .ant-upload.ant-upload-select-picture-card {
						border-color: red;
					}
				`}
			</style>
			<Navigator {...mergedConfig} />
			<div className="tw-flex">
				<DashboardNav {...mergedConfig} />
				<div className={`navLayout ${show ? 'md:tw-w-[calc(100%_-_260px)]' : 'md:tw-w-[calc(100%_-_80px)]'}`}>
					<div className="layoutContent">{children}</div>
				</div>
			</div>
		</>
	);
};

export default observer(DashboardRoute);
