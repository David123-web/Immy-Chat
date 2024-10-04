import FormAddUpdateUser from '@/components/People/FormAddUpdateUser';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';

const AddTutor = () => {
	return <FormAddUpdateUser role={ROLE_TYPE.TUTOR} />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default AddTutor;
