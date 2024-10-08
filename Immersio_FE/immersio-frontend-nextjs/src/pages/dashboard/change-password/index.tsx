import DashboardRoute from '@/components/routes/DashboardRoute';
import { withTranslationsProps } from '@/src/next/with-app';
import Head from 'next/head';

const ChangePasswordPage = () => {
	return (
		<>
			<Head>
				<title>Change Password</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<DashboardRoute>ChangePasswordPage</DashboardRoute>
		</>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default ChangePasswordPage;
