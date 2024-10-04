import Head from 'next/head';
import FeaturesArea from '../../../components/v2/FeaturesArea';
import DefaultLayout from '../../layouts';
import { withTranslationsProps } from '../../next/with-app';

const Features = () => {
  return (
    <>
      <Head>
        <title>Features Page</title>
      </Head>

      <DefaultLayout>
        <FeaturesArea />
      </DefaultLayout>
    </>
  );
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default Features;