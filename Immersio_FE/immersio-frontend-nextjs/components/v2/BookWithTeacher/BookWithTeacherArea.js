import BookBlock from "./BookBlock"

const BookWithTeacherArea = ({ showRedirect = false }) => {
  return (
    <>
      <section className="book-with-teacher__area">
        <div className="book-with-teacher__block">
          <BookBlock showRedirect={showRedirect} />
        </div>
      </section>
    </>
  )
}

export default BookWithTeacherArea