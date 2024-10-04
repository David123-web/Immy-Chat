import { useTranslation } from 'next-i18next';
import { Tab, Tabs } from 'react-bootstrap';

const Faq = () => {
   const { t } = useTranslation();

   return (
      <>
         <section className="tw-pt-[40px] md:tw-pt-[80px] tw-pb-10">
            <div className="container tw-px-5 md:tw-px-[12px]">
               <div className="row">
                  <div className="col-xxl-12 col-xl-12 col-lg-12 md:tw-px-0">
                     <Tabs
                        defaultActiveKey="general"
                        transition={false}
                        id="noanim-tab-example"
                        className="pt-35 pb-35 faq__tabs tw-justify-start"
                     >
                        <Tab eventKey="general" title="GENERAL">
                           <div className="faq__tabs-content faq__item-wrapper">
                              <div className="faq__accordion">
                                 <div className="accordion" id="faqaccordion">
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqOne">
                                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                             {t('faq.q_1')}
                                          </button>
                                       </h2>
                                       <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="faqOne" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_1')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqTwo">
                                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                             {t('faq.q_2')}
                                          </button>
                                       </h2>
                                       <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="faqTwo" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_2')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqThree">
                                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                             {t('faq.q_3')}
                                          </button>
                                       </h2>
                                       <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="faqThree" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_3')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </Tab>
                        <Tab eventKey="course" title="COURSE">
                           <div className="faq__tabs-content faq__item-wrapper">
                              <div className="faq__accordion">
                                 <div className="accordion" id="faqaccordion">
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqOne">
                                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                             {t('faq.q_4')}
                                          </button>
                                       </h2>
                                       <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="faqOne" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_4')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqTwo">
                                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                             {t('faq.q_5')}
                                          </button>
                                       </h2>
                                       <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="faqTwo" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_5')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqThree">
                                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                             {t('faq.q_6')}
                                          </button>
                                       </h2>
                                       <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="faqThree" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_6')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </Tab>
                        <Tab eventKey="instructors" title="INSTRUCTORS">
                           <div className="faq__tabs-content faq__item-wrapper">
                              <div className="faq__accordion">
                                 <div className="accordion" id="faqaccordion">
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqOne">
                                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                             {t('faq.q_7')}
                                          </button>
                                       </h2>
                                       <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="faqOne" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_7')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqTwo">
                                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                             {t('faq.q_8')}
                                          </button>
                                       </h2>
                                       <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="faqTwo" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_8')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="accordion-item">
                                       <h2 className="accordion-header" id="faqThree">
                                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                             {t('faq.q_9')}
                                          </button>
                                       </h2>
                                       <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="faqThree" data-bs-parent="#faqaccordion">
                                          <div className="accordion-body">
                                             <p>
                                                {t('faq.a_9')}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </Tab>
                     </Tabs>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
};

export default Faq;