import LoadingPage from '@/components/common/LoadingPage';
import { useMobXStores } from '@/src/stores';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'antd/dist/antd.css';
import { observer } from 'mobx-react-lite';
import { NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SSRProvider from 'react-bootstrap/SSRProvider';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import 'react-responsive-modal/styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'swiper/css/bundle';
import { RouterConstants } from '../../constants/router';
import { OPSProvider } from '../../context';
import { QUERY_KEYS, useQuery } from '../../hooks/useQuery';
import '../../public/assets/scss/css/styles.css';
import { persistor, store } from '../../redux/store';
import { jwtValidate } from '../helpers/auth';
import '../helpers/firebase';
import { firebaseCloudMessaging } from '../helpers/firebase';
import { ROLE_TYPE } from '../interfaces/auth/auth.interface';
import {
	IGetListCountriesResponse,
	IGetProficiencyLevelsResponse,
	ITimeZone,
} from '../interfaces/common/common.interface';
import { IGetCourseLanguagesResponse } from '../interfaces/course/course.interface';
import { IRegisterNotificationsRequest } from '../interfaces/notifications/notification.interface';
import { IGetSubdomainConfigResponse } from '../interfaces/subdomain/subdomain.interface';
import { ICreditsResponse } from '../interfaces/subscriptions/subscriptions.interface';
import { getListCountries, getListProficiencyLevels, getTimezones } from '../services/common/apiCommon';
import { getCourseLanguages } from '../services/courses/apiCourses';
import { registerNotifications } from '../services/notifications/apiNotifications';
import { getCreditValue } from '../services/settings/apiSettings';
import { getSubdomainConfig } from '../services/subdomain/apiSubdomain';
import { getCurrentUser } from '../services/user/apiUser';
import { authStore } from '../stores/auth/auth.store';
import './index.scss';

const googleAppId = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_APP_ID;

if (typeof window !== 'undefined') {
	require('bootstrap/dist/js/bootstrap');
}

const queryClient = new QueryClient({
	defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const Wrapper = observer((props: any) => {
	const { getLayout, Component, pageProps } = props;
	const router = useRouter();
	const { userStore, subdomainStore, globalStore } = useMobXStores();
	const [tokenFirebase, setTokenFirebase] = useState('');
	useEffect(() => {
		setToken();
		// Background message received
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('message', (event) => {
				globalStore.setTriggerGetNotifications();
				console.log('Background message received:', event);
			});
		}
	}, []);

	async function setToken() {
		try {
			const token = await firebaseCloudMessaging.init();
			if (token) {
				setTokenFirebase(token);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (jwtValidate()) {
			getCurrentUserQuery.refetch();
			authStore.setIsLoginSuccess(true);
		}
	}, []);

	/* -------------------------- GET SUBDOMAIN CONFIG -------------------------- */
	const getSubdomainConfigQuery = useQuery<IGetSubdomainConfigResponse>(
		'getSubdomainConfigQuery',
		() => getSubdomainConfig(),
		{
			onSuccess: (res) => {
				subdomainStore.setSubdomain(res.data);
				if (res.data?.subdomainTheme?.textColor) {
					document.documentElement.style.setProperty('--tp-new_theme-1', res.data?.subdomainTheme?.textColor);
				}
				if (res.data?.subdomainTheme?.primaryColor) {
					document.documentElement.style.setProperty('--tp-new_theme-3', res.data?.subdomainTheme?.primaryColor);
				}
				if (res.data?.subdomainTheme?.secondaryColor) {
					document.documentElement.style.setProperty('--tp-new_theme-4', res.data?.subdomainTheme?.secondaryColor);
				}
				if (res.data?.subdomainTheme?.accentColor) {
					document.documentElement.style.setProperty('--tp-new_theme-5', res.data?.subdomainTheme?.accentColor);
				}
				if (res.data?.subdomainTheme?.linkColor) {
					document.documentElement.style.setProperty('--tp-new_theme-2', res.data?.subdomainTheme?.linkColor);
				}
				if (res.data?.subdomainTheme?.backgroundColor) {
					document.documentElement.style.setProperty('--tp-new_theme-6', res.data?.subdomainTheme?.backgroundColor);
				}
				document.documentElement.style.setProperty('--tp-new_theme-7', 'white');
			},
			onError: (err) => {
				toast.error(err?.data?.message);
			},
		}
	);

	/* ------------------------------- GET CURRENCY ----------------------------- */
	useQuery<ICreditsResponse>(['ICreditsResponse'], () => getCreditValue(), {
		enabled: jwtValidate() && getSubdomainConfigQuery.isSuccess,
		onSuccess: (res) => {
			globalStore.setCurrencySubdomain(res.data.currency);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	/* ---------------------------- GET CURRENT USER ---------------------------- */
	const getCurrentUserQuery = useQuery([QUERY_KEYS.GET_ME], () => getCurrentUser(), {
		enabled: authStore.isLoginSuccess,
		onSuccess: (res) => {
			userStore.setCurrentUser(res.data);
			if ((res.data.role === ROLE_TYPE.INSTRUCTOR || res.data.role === ROLE_TYPE.TUTOR) && !res.data.roleProfile?.id) {
				router.push(RouterConstants.TEACHER_APPLICATION.path);
			}
		},
		onError: (err) => {
			toast.error(err?.data?.message);
		},
	});

	/* ------------------------- REGISTER NOTIFICATIONS ------------------------- */
	useQuery<boolean, IRegisterNotificationsRequest>(
		['IRegisterNotificationsRequest'],
		() =>
			registerNotifications({
				deviceId: 'string',
				token: tokenFirebase,
			}),
		{
			enabled: jwtValidate(),
			onError: (err) => {
				toast.error(err?.data?.message);
			},
		}
	);

	/* -------------------------- GET COURSE LANGUAGES -------------------------- */
	const getCourseLanguagesQuery = useQuery<IGetCourseLanguagesResponse[]>(
		'IGetCourseLanguagesResponse1',
		() => getCourseLanguages(),
		{
			enabled: getSubdomainConfigQuery.isSuccess,
			onSuccess: (res) => {
				globalStore.setCourseLanguages(res.data);
			},
			onError: (err) => {
				toast.error(err?.data?.message);
			},
		}
	);

	/* -------------------------------- GET LEVEL ------------------------------- */
	const getListProficiencyLevelsQuery = useQuery<IGetProficiencyLevelsResponse[]>(
		'IGetListProficiencyLevelsResponse2',
		() => getListProficiencyLevels(),
		{
			enabled: getSubdomainConfigQuery.isSuccess,
			onSuccess: (res) => {
				globalStore.setProficiencyLevels(res.data);
			},
			onError: (err) => {
				toast.error(err?.data?.message);
			},
		}
	);

	/* ------------------------------ GET COUNTRIES ----------------------------- */
	const getListCountriesQuery = useQuery<IGetListCountriesResponse[]>(
		'IGetListCountriesResponse',
		() => getListCountries(),
		{
			enabled: getSubdomainConfigQuery.isSuccess,
			onSuccess: (res) => {
				globalStore.setListCountries(res.data);
			},
			onError: (err) => {
				toast.error(err?.data?.message);
			},
		}
	);
	/* ------------------------------ GET TIMEZONE ----------------------------- */
	const getTimezonesQuery = useQuery<ITimeZone[]>('ITimeZone', () => getTimezones(), {
		enabled: getSubdomainConfigQuery.isSuccess,
		onSuccess: (res) => {
			globalStore.setTimezone(res.data);
		},
		onError: (err) => {
			toast.error(err?.data?.message);
		},
	});

	const isHasCommonData = () => {
		const isSuccessCommon =
			getSubdomainConfigQuery.isSuccess &&
			getTimezonesQuery.isSuccess &&
			getListCountriesQuery.isSuccess &&
			getListProficiencyLevelsQuery.isSuccess &&
			getCourseLanguagesQuery.isSuccess;
		if (jwtValidate()) {
			return isSuccessCommon && getCurrentUserQuery.isSuccess;
		}
		return isSuccessCommon;
	};

	return getLayout(<div id="root_page">{isHasCommonData() ? <Component {...pageProps} /> : <LoadingPage />}</div>);
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	return (
		<React.Fragment>
			<SSRProvider>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<OPSProvider>
							<GoogleOAuthProvider clientId={googleAppId}>
								<ToastContainer position="top-right" />
								<QueryClientProvider client={queryClient}>
									<Wrapper getLayout={getLayout} Component={Component} pageProps={pageProps} />
								</QueryClientProvider>
							</GoogleOAuthProvider>
						</OPSProvider>
					</PersistGate>
				</Provider>
			</SSRProvider>
		</React.Fragment>
	);
}

export default appWithTranslation(MyApp);
