import FormAddUpdateCampus from '@/components/TutorMatch/FormAddUpdateCampus';
import { withTranslationsProps } from '@/src/next/with-app';

const AddTutorCampus = () => {
	return (
		<FormAddUpdateCampus/>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default AddTutorCampus;
