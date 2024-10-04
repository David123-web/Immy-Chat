import { HomeOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useRouter } from 'next/router';

const HomeIcon = () => {
	return <HomeOutlined className='color-theme-7' style={{ fontSize: 24 }} />
}

const FeatureIcon = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" width="24.431" height="24.43" viewBox="0 0 24.431 24.43">
		<path fill='white' class="a" d="M46.331,22.21H25.74a1.92,1.92,0,0,0-1.92,1.92V44.72a1.92,1.92,0,0,0,1.92,1.92H46.331a1.92,1.92,0,0,0,1.92-1.92V24.128A1.92,1.92,0,0,0,46.331,22.21ZM35.378,26.2a1.343,1.343,0,1,1-.217,1.624,1.342,1.342,0,0,1,.217-1.624ZM37.44,41.7H33.448l.049-.042,1.725-1.924V34.094l-2-3.886h4.2v8.105l1.75,3.389Z" transform="translate(-23.82 -22.21)"/>
	</svg>
}
const TutorIcon = ({ isDisabled }) => {
	return <svg xmlns="http://www.w3.org/2000/svg" width="25.322" height="23.383" viewBox="0 0 25.322 23.383">
		<path fill={isDisabled ? '#5b7478' : 'white'} class="a" d="M54.062,64.006c3.295,0,6.09,1.7,6.09,4.994V87.264a.12.12,0,0,1-.231.043V87.3a5.726,5.726,0,0,0-5.012-4.293,7.73,7.73,0,0,0-5.67,2.259.656.656,0,0,1-.4.177h-.274c-.225,0-.463-.164-.463-.371V67.423C48.094,65.468,50.767,64.006,54.062,64.006ZM67.46,64c-3.295,0-6.09,1.7-6.09,4.994V87.258a.12.12,0,0,0,.231.043v-.006A5.786,5.786,0,0,1,66.613,83a7.717,7.717,0,0,1,5.67,2.259.693.693,0,0,0,.4.177h.274c.225,0,.463-.164.463-.371V67.41C73.428,65.462,70.754,64,67.46,64Z" transform="translate(-48.1 -64)"/>
	</svg>
}
const PricingIcon = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" width="17.419" height="24.481" viewBox="0 0 17.419 24.481">
		<path fill='white' class="a" d="M123.536,48H109.883A1.881,1.881,0,0,0,108,49.883V70.6a1.881,1.881,0,0,0,1.883,1.883h13.653a1.881,1.881,0,0,0,1.883-1.883V49.883A1.881,1.881,0,0,0,123.536,48Zm-.706,16.007v4.708a1.412,1.412,0,1,1-2.825,0V64.007a1.412,1.412,0,1,1,2.825,0Zm0-4.708a1.412,1.412,0,1,1-1.412-1.412A1.409,1.409,0,0,1,122.83,59.3Zm-4.708,9.416A1.412,1.412,0,1,1,116.71,67.3,1.409,1.409,0,0,1,118.122,68.715Zm0-4.708a1.412,1.412,0,1,1-1.412-1.412A1.409,1.409,0,0,1,118.122,64.007Zm0-4.708a1.412,1.412,0,1,1-1.412-1.412A1.409,1.409,0,0,1,118.122,59.3Zm-4.708,9.416A1.412,1.412,0,1,1,112,67.3,1.409,1.409,0,0,1,113.414,68.715Zm0-4.708A1.412,1.412,0,1,1,112,62.595,1.409,1.409,0,0,1,113.414,64.007Zm0-4.708A1.412,1.412,0,1,1,112,57.887,1.409,1.409,0,0,1,113.414,59.3Zm-2.825-4.708V51.766a.944.944,0,0,1,.942-.942h10.358a.944.944,0,0,1,.942.942v2.825a.944.944,0,0,1-.942.942H111.531A.944.944,0,0,1,110.589,54.591Z" transform="translate(-108 -48)"/>
	</svg>
}
const BecomeInstructorIcon = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" width="22.338" height="22.338" viewBox="0 0 22.338 22.338">
		<g transform="translate(-48 -48)" fill='white'><path class="a" d="M184.88,234.036l-3.067-3.067a.132.132,0,0,0-.2.025l-3.1,6.165a.128.128,0,0,0,.175.175l6.165-3.1A.132.132,0,0,0,184.88,234.036Z" transform="translate(-123.868 -173.643)"/><path class="a" d="M59.169,48A11.169,11.169,0,1,0,70.338,59.169,11.167,11.167,0,0,0,59.169,48Zm2.18,13.387-8.57,4.323a.11.11,0,0,1-.15-.15l4.328-8.57a.125.125,0,0,1,.038-.038l8.565-4.323a.11.11,0,0,1,.15.15l-4.328,8.57A.072.072,0,0,1,61.349,61.387Z"/></g>
	</svg>
}
const BlogIcon = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" width="19.334" height="19.334" viewBox="0 0 19.334 19.334">
		<path fill='white' class="a" d="M13.168,19.334a6.145,6.145,0,0,0,6.128-6.1L19.334,8.3l-.057-.269-.162-.338-.274-.212c-.356-.279-2.158.019-2.643-.422-.344-.314-.4-.883-.5-1.653a4.768,4.768,0,0,0-.55-2.075A6.74,6.74,0,0,0,10.413,0H6.127A6.136,6.136,0,0,0,0,6.109v7.126a6.131,6.131,0,0,0,6.127,6.1ZM6.205,4.991H9.6a1.167,1.167,0,1,1,0,2.335h-3.4a1.167,1.167,0,1,1,0-2.335ZM5.032,13.145a1.169,1.169,0,0,1,1.173-1.162h6.9a1.162,1.162,0,1,1,0,2.325h-6.9A1.174,1.174,0,0,1,5.032,13.145Z"/>
	</svg>
}
const ContactIcon = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" width="24.873" height="24.873" viewBox="0 0 24.873 24.873">
		<path fill='white' class="a" d="M60.437,48A12.431,12.431,0,0,0,48.072,59.127a11.984,11.984,0,0,0,0,2.619A12.435,12.435,0,1,0,60.437,48Zm8.12,19.5C67.2,66.984,65,66.23,63.629,65.824c-.144-.042-.161-.054-.161-.64a3.4,3.4,0,0,1,.395-1.393,6.949,6.949,0,0,0,.55-1.889,4.2,4.2,0,0,0,.813-1.967,2.624,2.624,0,0,0-.024-1.65,1.061,1.061,0,0,1-.036-.1,10.751,10.751,0,0,1,.185-2.32A4.272,4.272,0,0,0,64.46,52.8a4.57,4.57,0,0,0-3.5-1.674H59.916A4.564,4.564,0,0,0,56.448,52.8a4.254,4.254,0,0,0-.9,3.067,10.752,10.752,0,0,1,.185,2.32c-.012.042-.024.072-.036.108a2.579,2.579,0,0,0-.024,1.65,4.266,4.266,0,0,0,.813,1.967,7.236,7.236,0,0,0,.55,1.889,3.34,3.34,0,0,1,.227,1.411c0,.592-.024.6-.155.64-1.417.419-3.522,1.16-4.783,1.662A10.762,10.762,0,1,1,68.556,67.5Z" transform="translate(-48 -48)"/>
	</svg>
}
const FAQIcon = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" width="24.467" height="19.549" viewBox="0 0 24.467 19.549">
		<g transform="translate(0 -25.418)" fill='white'><path class="a" d="M127.744,25.431a6.341,6.341,0,0,0,.4,12.67c.149,0,.3-.007.443-.017l1.888,1.89a.456.456,0,0,0,.779-.322V37.285a6.341,6.341,0,0,0-3.515-11.854Zm.98,10.6a.82.82,0,0,1-.576.239.776.776,0,0,1-.158-.016.625.625,0,0,1-.152-.046.874.874,0,0,1-.142-.074.767.767,0,0,1-.125-.1.814.814,0,0,1,0-1.153.752.752,0,0,1,.125-.1.873.873,0,0,1,.142-.076.974.974,0,0,1,.152-.046.815.815,0,0,1,.734,1.376Zm1.944-5.93a2.507,2.507,0,0,1-.714,1.757l-1.262,1.192v.231a.544.544,0,1,1-1.087,0v-.465a.544.544,0,0,1,.17-.4l1.416-1.337a1.414,1.414,0,0,0,.389-.982v-.052a1.432,1.432,0,0,0-1.47-1.431,1.464,1.464,0,0,0-1.394,1.476.544.544,0,1,1-1.087,0,2.558,2.558,0,0,1,2.453-2.563h.067a2.519,2.519,0,0,1,2.518,2.519Z" transform="translate(-110.023)"/><path class="a" d="M12.513,78.476A7.722,7.722,0,0,1,10.661,71.3H.679A.679.679,0,0,0,0,71.98V82.89a.679.679,0,0,0,.679.679h9.438l2.7,2.707a.456.456,0,0,0,.779-.322V83.569H15.56a.679.679,0,0,0,.679-.679v-1.6l-.005-.627A7.726,7.726,0,0,1,12.513,78.476Zm-9.946-4.67H8.824a.544.544,0,0,1,0,1.087H2.568a.544.544,0,0,1,0-1.087Zm0,3.239H9.749a.544.544,0,1,1,0,1.087H2.568a.544.544,0,1,1,0-1.087Zm9.5,4.1h-9.5a.544.544,0,1,1,0-1.087h9.5a.544.544,0,1,1,0,1.087Z" transform="translate(0 -41.444)"/></g>
	</svg>
}
const WrapperIcon = ({ children }) => {
	return (
		<div className="tw-mr-5 tw-flex tw-items-center tw-justify-center tw-w-[25px]">
			{children}
		</div>
	)
}

const Sidebar = ({ t, show }) => {
	const router = useRouter()

	const sidebarRendered = () => {
		function getItem(
			label,
			key,
			icon,
			disabled,
			children,
			type,
		) {
			return {
				key,
				icon,
				disabled,
				children,
				label: show ? label : '',
				type,
			};
		}

		const items = [
			getItem(t('header.menu.home'), '/', <WrapperIcon><HomeIcon /></WrapperIcon>, false),
			getItem(t('header.menu.features'), '/features', <WrapperIcon><FeatureIcon /></WrapperIcon>, false),
			getItem(t('header.menu.tutor_match'), '/tools/open-speak', <WrapperIcon><TutorIcon isDisabled={true} /></WrapperIcon>, true),
			getItem(t('header.menu.pricing'), '/pricing', <WrapperIcon><PricingIcon /></WrapperIcon>, false),
			getItem(t('header.menu.become'), '/teach', <WrapperIcon><BecomeInstructorIcon /></WrapperIcon>, false),
			getItem(t('header.menu.blog'), '/blog', <WrapperIcon><BlogIcon /></WrapperIcon>, false),
			getItem(t('header.menu.contact'), '/contact', <WrapperIcon><ContactIcon /></WrapperIcon>, false),
			getItem(t('header.menu.faq'), '/faq', <WrapperIcon><FAQIcon /></WrapperIcon>, false),
		];

		const onClick = (e) => {
			router.push(e.key)
		};

		return (
			<div className="sidebar__content">
				<Menu
					defaultSelectedKeys={[router.pathname]}
					mode="inline"
					theme="dark"
					items={items}
					onClick={onClick}
				/>
			</div>
		)
	}

	return (
		<div className={`tw-hidden md:tw-block sidebar bg-theme-2 ${show ? 'tw-w-[260px] tw-min-w-[260px]' : 'tw-w-[80px] tw-min-w-[80px]'} tw-fixed tw-h-full tw-min-h-0 tw-flex-col tw-top-[80px]`}>
			{sidebarRendered()}
		</div>
	);
};

export default Sidebar;
