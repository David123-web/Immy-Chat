import * as React from 'react';
import Head from 'next/head';
import DefaultLayout from '../../layouts';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useMutation } from '@/hooks/useMutation';
import { verifyEmail } from '@/src/services/auth/apiAuth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { RouterConstants } from '@/constants/router';
import { getQueryParams } from '@/src/helpers/getQueryParams';
import { IEmailVerifyRequest } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';

const VerifyEmail = () => {
	const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
	const router = useRouter();
	const verifyMutation = useMutation(verifyEmail, {
		onSuccess: () => {
			toast.success('Verify email successfully');
			router.push(RouterConstants.LOGIN.path);
		},
		onError: (err) => {
			//change content in popup notify request error
			toast.error(err.data?.message);
			router.push('/404');
		},
	});

	useEffect(() => {
		if (getQueryParams('hashcode')) {
			const emailVerifyRequest: IEmailVerifyRequest = {
				token: getQueryParams('hashcode'),
			};
			verifyMutation.mutate(emailVerifyRequest);
		} else {
			router.push('/404');
		}
	}, []);

	return (
		<>
			<Head>
				<title>Verify Email</title>
			</Head>
			<Spin indicator={antIcon}>
				<DefaultLayout>
					<div className="tw-w-full tw-h-[100vh]"></div>
				</DefaultLayout>
			</Spin>
		</>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default VerifyEmail;
