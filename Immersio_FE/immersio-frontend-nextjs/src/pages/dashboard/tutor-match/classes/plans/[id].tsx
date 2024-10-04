import FormAddUpdatePlan from '@/components/TutorMatch/FormAddUpdatePlan';
import { withTranslationsProps } from '@/src/next/with-app';

const EditPlan = () => {
	return <FormAddUpdatePlan isUpdate />;
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default EditPlan