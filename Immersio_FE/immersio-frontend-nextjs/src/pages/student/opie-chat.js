import React from "react"
import OpieChat from '../../../components/Chat/OpieChat'
import StudentRoute from '../../../components/routes/StudentRoute'
import { withTranslationsProps } from "../../next/with-app"

const ChatWithOpie = () => {
	return(
		<StudentRoute>     
			<div className="animated fadeIn">
				<OpieChat />
			</div>
		</StudentRoute> 
	)
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default ChatWithOpie