import FormAddUpdateClass from '@/components/TutorMatch/FormAddUpdateClass'
import { withTranslationsProps } from '@/src/next/with-app'

const UpdateClass = () => {
  
	return <FormAddUpdateClass isUpdate/>
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default UpdateClass