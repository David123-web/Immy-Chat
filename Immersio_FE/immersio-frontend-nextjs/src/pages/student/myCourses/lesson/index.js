import PreviewPage from "../../../../../components/PreviewLesson";
import { withTranslationsProps } from "../../../../next/with-app";

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default PreviewPage