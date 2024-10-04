import CurriculumTimeline from '../CurriculumTimeline';

const DetailsTabItems = ({ isPreviewAdmin, dataSource, dynamicPage, data, setIsShowPreviewLesson }) => {
   return (
      <>
         <style jsx global>
            {`
               .navLayout .custom-timeline .ant-tabs-content-holder {
                  background: transparent;
               }
            `}
         </style>

         <div className="course__tab-2 mb-45">
            <ul className="nav nav-tabs" id="courseTab" role="tablist">
               <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="true"> <span>Description</span> </button>
               </li>
               <li className="nav-item" role="presentation">
                  <button className="nav-link " id="curriculum-tab" data-bs-toggle="tab" data-bs-target="#curriculum" type="button" role="tab" aria-controls="curriculum" aria-selected="false"> <span>Curriculum</span> </button>
               </li>
               <li className="nav-item" role="presentation">
                  <button className="nav-link" id="tutor-tab" data-bs-toggle="tab" data-bs-target="#tutor" type="button" role="tab" aria-controls="tutor" aria-selected="false"> <span>Tutors</span> </button>
               </li>
            </ul>
         </div>

         <div className="course__tab-content md:tw-mb-[95px]">
            <div className="tab-content" id="courseTabContent">
               <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                  <div className="course__description">
                     <h3>Course Overview</h3>
                     <p dangerouslySetInnerHTML={{ __html: data?.description }} />
                     <h3>Learning outcome</h3>
                     <p className='mt-20 mb-20' dangerouslySetInnerHTML={{ __html: data.learningOutcome }} />
                     <h3>Requirement</h3>
                     <p className='mt-20 mb-20' dangerouslySetInnerHTML={{ __html: data.requirement }} />

                     {/* <div className="course__tag-4 mb-35 mt-35">
                        <i className="fal fa-tag"></i>
                        <a href="#">Big data,</a>
                        <a href="#">Data analysis,</a>
                        <a href="#">Data modeling</a>
                     </div> */}
                     {/* <div className="course__description-list mb-45">
                        <h4>What is the Target Audience?</h4>
                        <ul>
                           <li> <i className="fa-solid fa-check"></i> Business managers, leaders</li>
                           <li> <i className="fa-solid fa-check"></i> Downloadable lectures, code and design assets for all projects</li>
                           <li> <i className="fa-solid fa-check"></i> Anyone who is finding a chance to get the promotion</li>
                        </ul>
                     </div> */}
                     {/* <div className="course__instructor mb-45">
                        <h3>Other Instructors</h3>
                        <div className="course__instructor-wrapper d-md-flex align-items-center">
                           <div className="course__instructor-item d-flex align-items-center mr-70">
                              <div className="course__instructor-thumb mr-20">
                                 {
                                    dynamicPage ? <img src={"/" + "assets/img/course/tutor/course-tutor-4.jpg"} alt="" /> : <img src="assets/img/course/tutor/course-tutor-4.jpg" alt="" />
                                 }
                              </div>
                              <div className="course__instructor-content">
                                 <h3>Eleanor Fant</h3>
                                 <p>Instructor</p>
                              </div>
                           </div>
                           <div className="course__instructor-item d-flex align-items-center mr-70">
                              <div className="course__instructor-thumb mr-20">
                                 {
                                    dynamicPage ? <img src={"/" + "assets/img/course/tutor/course-tutor-3.jpg"} alt="" /> : <img src="assets/img/course/tutor/course-tutor-3.jpg" alt="" />
                                 }
                              </div>
                              <div className="course__instructor-content">
                                 <h3>Lauren Stamps</h3>
                                 <p>Teacher</p>
                              </div>
                           </div>
                           <div className="course__instructor-item d-flex align-items-center mr-70">
                              <div className="course__instructor-thumb mr-20">
                                 {
                                    dynamicPage ? <img src={"/" + "assets/img/course/tutor/course-tutor-2.jpg"} alt="" /> : <img src="assets/img/course/tutor/course-tutor-2.jpg" alt="" />
                                 }
                              </div>
                              <div className="course__instructor-content">
                                 <h3>Jonquil Von</h3>
                                 <p>Associate</p>
                              </div>
                           </div>
                        </div>
                     </div> */}
                  </div>
               </div>

               <div className="tab-pane fade custom-timeline" id="curriculum" role="tabpanel" aria-labelledby="curriculum-tab">
                  <CurriculumTimeline isPreviewAdmin={isPreviewAdmin} data={data} setIsShowPreviewLesson={setIsShowPreviewLesson} />
               </div>

               <div className="tab-pane fade" id="tutor" role="tabpanel" aria-labelledby="tutor-tab">
                  Tutors
               </div>
            </div>
         </div>
      </>
   );
};

export default DetailsTabItems;