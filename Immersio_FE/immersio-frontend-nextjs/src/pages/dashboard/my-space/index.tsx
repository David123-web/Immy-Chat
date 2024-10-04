import Achievement from '@/components/MySpace/Achievement';
import PrivateTutorClasses from '@/components/MySpace/PrivateTutorClasses';
import SelfStudyCourses from '@/components/MySpace/SelfStudyCourses';
import DashboardRoute from '@/components/routes/DashboardRoute';
import { withTranslationsProps } from '@/src/next/with-app';
import Head from 'next/head';

const MySpace = () => {
	return (
		<>
			<Head>
				<title>My Space</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<DashboardRoute>
				<Achievement />
				<SelfStudyCourses/>
        <PrivateTutorClasses/>
			</DashboardRoute>
		</>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default MySpace;
