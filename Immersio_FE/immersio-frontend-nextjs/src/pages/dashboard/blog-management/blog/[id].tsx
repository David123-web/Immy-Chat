import FormAddUpdateBlog from '@/components/BlogManagement/FormAddUpdateBlog'
import { withTranslationsProps } from '@/src/next/with-app'

const EditBlog = () => {
  return (
    <FormAddUpdateBlog isUpdate={true}/>
  )
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default EditBlog