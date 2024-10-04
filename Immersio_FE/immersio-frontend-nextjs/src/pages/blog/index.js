import Head from 'next/head';
import DefaultLayout from '../../layouts';
import BlogArea from '../../../components/Blog/BlogArea';
import { withTranslationsProps } from '../../next/with-app';

const Blog = () => {
   return (
      <>
         <Head>
            <title>Blog Page</title>
         </Head>

         <DefaultLayout>
            <BlogArea />
         </DefaultLayout>
      </>
   );
};

export async function getServerSideProps(ctx) {
   return await withTranslationsProps(ctx)
 }

export default Blog;