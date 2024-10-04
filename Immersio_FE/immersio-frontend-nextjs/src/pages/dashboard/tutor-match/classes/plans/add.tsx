import FormAddUpdatePlan from '@/components/TutorMatch/FormAddUpdatePlan';
import { withTranslationsProps } from '@/src/next/with-app';

const AddPlan = () => {
	return <FormAddUpdatePlan />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default AddPlan;
