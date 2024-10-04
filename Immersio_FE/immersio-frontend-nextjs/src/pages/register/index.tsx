import { jwtValidate } from '@/src/helpers/auth';
import { withTranslationsProps } from '@/src/next/with-app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SignUp from '../../../components/Register/SignUp';
import { RouterConstants } from '../../../constants/router';
import DefaultLayout from '../../layouts';

const Register = () => {
	const router = useRouter();
  // const isMaintenance = getQueryParams('isMaintenance');
	useEffect(() => {
		if (jwtValidate()) {
			router.push(RouterConstants.HOME.path);
		}
		// if (isMaintenance === null) {
		// 	router.push(RouterConstants.MAINTENANCE.path);
		// }
	}, []);

	return (
		<>
			<Head>
				<title>Sign Up Page</title>
			</Head>

			<DefaultLayout hideSidebar>
				<SignUp />
			</DefaultLayout>
		</>
	);
};

export async function getServerSideProps(ctx) {
	return await withTranslationsProps(ctx)
}

export default Register;
