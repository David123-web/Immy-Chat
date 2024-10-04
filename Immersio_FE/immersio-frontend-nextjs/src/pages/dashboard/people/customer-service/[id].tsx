import FormAddUpdateUser from '@/components/People/FormAddUpdateUser';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';

const EditCustomerService = () => {
	return <FormAddUpdateUser isUpdate role={ROLE_TYPE.CUSTOMER_SERVICE} />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default EditCustomerService;
