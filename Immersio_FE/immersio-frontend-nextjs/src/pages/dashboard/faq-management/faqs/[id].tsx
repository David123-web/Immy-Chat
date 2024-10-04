import FormAddUpdateFAQ from '@/components/FAQManagement/FormAddUpdateFAQ';
import { withTranslationsProps } from '@/src/next/with-app';

const UpdateFAQ = () => {
	return <FormAddUpdateFAQ isUpdate />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default UpdateFAQ;
