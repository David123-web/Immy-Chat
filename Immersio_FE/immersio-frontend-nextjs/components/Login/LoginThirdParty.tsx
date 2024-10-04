import { RouterConstants } from '@/constants/router';
import { useMutation } from '@/hooks/useMutation';
import { QUERY_KEYS } from '@/hooks/useQuery';
import { ILoginThirdPartyRequest, ROLE_TYPE, SocialMediaType } from '@/src/interfaces/auth/auth.interface';
import { loginThirdParty } from '@/src/services/auth/apiAuth';
import { authStore } from '@/src/stores/auth/auth.store';
import { useGoogleLogin } from '@react-oauth/google';
import { setCookie } from 'cookies-next';
import { observer } from 'mobx-react-lite';
import router from 'next/router';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const facebookAppId = process.env.NEXT_PUBLIC_REACT_APP_FACEBOOK_APP_ID;

interface ILoginThirdParty {
	role: ROLE_TYPE;
}

const LoginThirdParty = (props: ILoginThirdParty) => {
	const { role } = props;
	const queryClient = useQueryClient();

	const responseFacebook = (response) => {
		const fbResponse: ILoginThirdPartyRequest = {
			role: role,
			socialId: response.id,
			socialType: SocialMediaType.FACEBOOK,
			accessToken: response.accessToken,
			firstName: response.first_name,
			lastName: response.last_name,
		};
		loginThirdPartyMutation.mutate(fbResponse);
	};
	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			getGoogleUserId(tokenResponse.access_token);
		},
	});
	const onSuccessGoogle = (ggInfo, accessToken, tokenInfo) => {
		const ggResponse: ILoginThirdPartyRequest = {
			role: role,
			socialId: tokenInfo.sub,
			socialType: SocialMediaType.GOOGLE,
			accessToken: accessToken,
			firstName: ggInfo.given_name,
			lastName: ggInfo.family_name,
		};
		loginThirdPartyMutation.mutate(ggResponse);
	};

	const getGoogleUserId = async (token: string) => {
		const userInfo = await new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', `https://www.googleapis.com/oauth2/v3/userinfo`);
			xhr.setRequestHeader('Authorization', `Bearer ${token}`);
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) resolve(JSON.parse(this.responseText));
				else resolve({ err: '404' });
			};
			xhr.send();
		});
		const tokenInfo = await new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', `https://www.googleapis.com/oauth2/v3/tokeninfo`);
			xhr.setRequestHeader('Authorization', `Bearer ${token}`);
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) resolve(JSON.parse(this.responseText));
				else resolve({ err: '404' });
			};
			xhr.send();
		});
		onSuccessGoogle(userInfo, token, tokenInfo);
	};

	const loginThirdPartyMutation = useMutation<any, ILoginThirdPartyRequest>(loginThirdParty, {
		onSuccess: (res) => {
			const loginResponse = res.data;
			setCookie('accessToken', loginResponse.accessToken);
			authStore.setIsLoginSuccess(true);
			if (loginResponse.roleProfile?.id) {
				if ([ROLE_TYPE.INSTRUCTOR, ROLE_TYPE.TUTOR].includes(loginResponse.role)) {
					router.push(RouterConstants.DASHBOARD.path);
				} else if (loginResponse.role == ROLE_TYPE.STUDENT) {
					router.push(RouterConstants.DASHBOARD_MY_SPACE.path);
				} else {
					router.push(RouterConstants.DASHBOARD.path);
				}
			}
			queryClient.invalidateQueries(QUERY_KEYS.GET_ME);
		},
		onError: (err) => {
			toast.error(err.data?.message);
		},
	});

	return (
		<div className="tw-flex tw-h-12 tw-justify-center tw-gap-5">
			{/* <FacebookLogin
				appId={facebookAppId}
				autoLoad={false}
				callback={responseFacebook}
				fields="first_name,last_name"
				render={(renderProps) => (
					<div
						onClick={renderProps.onClick}
						className="tw-flex tw-justify-center tw-items-center tw-h-full tw-aspect-square tw-cursor-pointer tw-rounded-full bg-theme-7 tw-shadow-[0_7px_24px_#37474F1F]"
					>
						<img className="tw-h-5" src="/assets/img/icon/facebook.png" alt="fb" />
					</div>
				)}
			/> */}
			{/* <GoogleLogin
        clientId={googleAppId.toString()}
        autoLoad={false}
        render={(renderProps) => (
          
        )}
        onSuccess={onSuccessGoogle}
        onFailure={onSuccessGoogle}
        cookiePolicy={"single_host_origin"}
      /> */}
			<div
				onClick={() => login()}
				className="tw-flex tw-justify-center tw-items-center tw-h-full tw-aspect-square tw-cursor-pointer tw-rounded-full bg-theme-7 tw-shadow-[0_7px_24px_#37474F1F]"
			>
				<img className="tw-w-7" src="/assets/img/icon/google.png" alt="fb" />
			</div>
		</div>
	);
};

export default observer(LoginThirdParty);
