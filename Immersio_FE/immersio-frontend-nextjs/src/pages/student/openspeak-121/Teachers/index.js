import BookBlock from '../../../../../components/v2/BookWithTeacher/BookBlock'
import StudentRoute from '../../../../../components/routes/StudentRoute'
const Teachers = () => {
	return(
		<StudentRoute>
			<div className="card-header" style={{justifyContent: 'center'}}>
            	<h3 className="page-title float-left mb-2 mt-2">All tutors</h3>
            </div>
            <div className="container mt-4">
            <div className="row book-with-teacher__block">
              <BookBlock />
            </div>
        </div>
		</StudentRoute>
	)
}

export default Teachers