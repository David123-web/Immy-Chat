import Head from 'next/head';
import ContactAreaImmersio from '../../../components/v2/ContactArea';
import DefaultLayout from '../../layouts';
import { withTranslationsProps } from '../../next/with-app';

const ContactPage = () => {
   return (
      <>
         <Head>
         <title>Contact Page</title>
         </Head>

         <DefaultLayout>
            <ContactAreaImmersio />
         </DefaultLayout>
      </>
   );
};

export async function getServerSideProps(ctx) {
   return await withTranslationsProps(ctx)
 }

export default ContactPage;