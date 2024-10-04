import SetNewPasswordModal from '@/components/Login/SetNewPasswordModal';
import { logout } from '@/src/helpers/auth';
import { getQueryParams } from '@/src/helpers/getQueryParams';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import LoginArea from '../../../components/Login/LoginArea';
import { useCheckRole } from '../../../hooks/useAuth';
import DefaultLayout from '../../layouts';
import { withTranslationsProps } from '@/src/next/with-app';

const SignIn = () => {
	const [isOpenSetNewPasswordModal, setIsOpenSetNewPasswordModal] = useState(false);
	if (!getQueryParams('hashcode')) {
		useCheckRole();
	}

	useEffect(() => {
		if (getQueryParams('hashcode')) {
			setIsOpenSetNewPasswordModal(true);
		}
	}, []);

	return (
		<>
			<Head>
				<title>Sign In Page</title>
			</Head>

			<DefaultLayout hideSidebar>
				<LoginArea />
			</DefaultLayout>
			<SetNewPasswordModal
				open={isOpenSetNewPasswordModal}
				handleOk={() => {}}
				token={getQueryParams('hashcode')}
				handleCancel={() => {
					setIsOpenSetNewPasswordModal(false);
					logout();
				}}
			/>
		</>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx)
}

export default observer(SignIn);
