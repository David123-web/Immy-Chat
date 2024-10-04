const IntroductionIntructor = ({ coAuthor = {} }) => {
  return (
    <section className="detail-book-block-wrapper">
      <div className="detail-book-block-wrapper__item">
        <div className="photo">
          <img src={"/assets/img/open-speak/no-image.jpg"} alt='' width={200} height={"100%"} />
        </div>
        <div className="info" style={{ flex: 1 }}>
          <div>
            <b className="info__name">{coAuthor?.profile?.firstName + ' ' + coAuthor?.profile?.lastName}</b>
            <p className="info__address">{coAuthor?.bio}</p>
            <div className="info__lesson" dangerouslySetInnerHTML={{ __html: coAuthor?.experienceDesc }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntroductionIntructor