import ProfileUser from '@/components/People/ProfileUser';
import { ROLE_TYPE } from '@/src/interfaces/auth/auth.interface';
import { withTranslationsProps } from '@/src/next/with-app';

const ProfileCustomerService = () => {
	return <ProfileUser role={ROLE_TYPE.CUSTOMER_SERVICE} />;
};

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default ProfileCustomerService;
