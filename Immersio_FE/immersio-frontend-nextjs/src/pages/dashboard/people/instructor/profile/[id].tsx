import ProfileUser from '@/components/People/ProfileUser';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';

const ProfileInstructor = () => {
	return <ProfileUser role={ROLE_TYPE.INSTRUCTOR} />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default ProfileInstructor;
