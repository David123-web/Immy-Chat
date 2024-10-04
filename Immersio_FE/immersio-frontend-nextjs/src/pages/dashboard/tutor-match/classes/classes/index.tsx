import StudentClassList from '@/components/TutorMatch/StudentClassList';
import TutorClassesTable from '@/components/TutorMatch/TutorClassesTable';
import { withTranslationsProps } from '@/src/next/with-app';
import { userStore } from '@/src/stores/users/users.store';
import TutorClassesLayout from '../../../../../../components/TutorMatch/layout/TutorClasses';

const ClassesPage = () => {
	return (
		<TutorClassesLayout>
			{userStore.currentUser.role === 'STUDENT' ? <StudentClassList/> : <TutorClassesTable />}
		</TutorClassesLayout>
	);
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default ClassesPage;
