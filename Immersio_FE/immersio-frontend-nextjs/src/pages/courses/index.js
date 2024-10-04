import Head from 'next/head';
import CourseIntroduction from '../../../components/Courses/CourseIntroduction';
import CourseListing from '../../../components/Courses/CourseListing';
import BreadCrumb from '../../../components/common/BreadCrumb';
import DefaultLayout from '../../layouts';

const Courses = () => {
   return (
      <>
        <Head>
          <title>Courses Page</title>
        </Head>
        <DefaultLayout>
          <>
            <BreadCrumb title="Core Courses" />
            <CourseIntroduction />
            <CourseListing items={6} />
          </>
        </DefaultLayout>
      </>
   );
};

export default Courses;

export function getServerSideProps() {
  // In new skin v2 - we don't need this page
  return {
    redirect: {
      destination: `/`,
    },
  };
}