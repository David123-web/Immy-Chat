import FormAddUpdateBlog from '@/components/BlogManagement/FormAddUpdateBlog'
import { withTranslationsProps } from '@/src/next/with-app'

const AddBlog = () => {
  return (
    <FormAddUpdateBlog />
  )
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default AddBlog