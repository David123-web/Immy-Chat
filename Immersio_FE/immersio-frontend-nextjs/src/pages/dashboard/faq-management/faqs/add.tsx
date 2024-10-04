import FormAddUpdateFAQ from '@/components/FAQManagement/FormAddUpdateFAQ'
import { withTranslationsProps } from '@/src/next/with-app'

const AddFAQ = () => {
  return (
    <FormAddUpdateFAQ />
  )
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default AddFAQ