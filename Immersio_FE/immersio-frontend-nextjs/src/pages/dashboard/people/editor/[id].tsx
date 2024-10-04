import FormAddUpdateUser from '@/components/People/FormAddUpdateUser';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';

const EditEditor = () => {
	return <FormAddUpdateUser isUpdate role={ROLE_TYPE.EDITOR} />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default EditEditor;
