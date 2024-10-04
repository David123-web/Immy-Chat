import { useTranslation } from "next-i18next";
import Head from "next/head";
import TeacherRegisterForm from "../../../components/TeachRegister/TeacherRegisterForm.tsx";
import TeamArea from '../../../components/v2/TeamArea.js';
import DefaultLayout from "../../layouts";
import { withTranslationsProps } from '../../next/with-app';

function Teach() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Become an instructor</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <DefaultLayout>
        <div className="teach__page tw-pt-[60px] md:tw-pt-[100px] tw-pb-10 tw-px-0">
          <TeamArea />
          <section id="breadcrumb-teacher-register-section" className="breadcrumb-teacher-register-section">
            <TeacherRegisterForm
              title={t('teach.form_title')}
              description={t('teach.form_description')}
            />
          </section>
        </div>
      </DefaultLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default Teach;