const MyCourses = () => {
  return null
};

export default MyCourses;

export function getServerSideProps() {
  return {
    redirect: {
      destination: `/dashboard/student/recordings`,
    },
  };
}