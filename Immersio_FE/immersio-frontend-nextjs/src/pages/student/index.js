import { useRouter } from "next/router";
import { useEffect } from "react";
import StudentRoute from "../../../components/routes/StudentRoute";
//import { Context } from '../../context'
import { RouterConstants } from "../../../constants/router";
import { jwtValidate } from "../../helpers/auth";

const StudentIndex = () => {
  const router = useRouter();
  useEffect(() => {
    if (!(jwtValidate())) {
      router.push(RouterConstants.LOGIN.path);
    }
  }, []);

  return <StudentRoute />;
};

export default StudentIndex;
