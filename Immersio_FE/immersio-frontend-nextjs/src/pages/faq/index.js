import Head from 'next/head';
import Faq from '../../../components/v2/Faq';
import DefaultLayout from '../../layouts';
import { withTranslationsProps } from '../../next/with-app';

const FAQPage = () => {
   return (
      <>
         <Head>
         <title>FAQ Page</title>
         </Head>

         <DefaultLayout>
            <Faq />
         </DefaultLayout>
      </>
   );
};

export async function getServerSideProps(ctx) {
   return await withTranslationsProps(ctx)
 }

export default FAQPage;