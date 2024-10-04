import FormAddUpdateClass from '@/components/TutorMatch/FormAddUpdateClass';
import { withTranslationsProps } from '@/src/next/with-app';

const AddClass = () => {
	return <FormAddUpdateClass/>
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default AddClass;
