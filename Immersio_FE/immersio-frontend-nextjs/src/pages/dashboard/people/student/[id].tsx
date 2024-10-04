import FormAddUpdateUser from '@/components/People/FormAddUpdateUser';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';

const EditStudent = () => {
	return <FormAddUpdateUser isUpdate role={ROLE_TYPE.STUDENT} />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default EditStudent;
