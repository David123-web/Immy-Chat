import FormAddUpdateCampus from '@/components/TutorMatch/FormAddUpdateCampus';
import { withTranslationsProps } from '@/src/next/with-app';
import React from 'react'

const UpdateCampus = () => {
  return (
		<FormAddUpdateCampus isUpdate/>
	);
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default UpdateCampus