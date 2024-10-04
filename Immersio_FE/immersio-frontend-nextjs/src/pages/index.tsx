import { useMobXStores } from '@/src/stores';
import Head from 'next/head';
import AllCourseBrowser from '../../components/Home/AllCourseBrowser';
import DefaultLayout from '../layouts';
import { withTranslationsProps } from '../next/with-app';

function Home() {
	const { subdomainStore } = useMobXStores();

	return (
		<>
			<Head>
				<title>{subdomainStore?.subdomain?.title || 'Homepage'}</title>
			</Head>

			<DefaultLayout>
				<AllCourseBrowser />
			</DefaultLayout>
		</>
	);
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default Home;