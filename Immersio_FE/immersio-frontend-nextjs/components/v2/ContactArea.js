import { Button } from "antd";
import { useTranslation } from "next-i18next";

const ContactArea = () => {
   const { t } = useTranslation();

   return (
      < >
         <section className="contact__area tw-pt-[60px] md:tw-pt-[100px] tw-pb-10 tw-px-4 md:tw-px-0">
            <div className="container">
               <div className="row">
                  <div className="col-xxl-7 col-xl-7 col-lg-6 tw-px-0">
                     <div className="contact__wrapper">
                        <div className="section__title-wrapper mb-40">
                           <h2 className="section__title">
                              {t('contact.title')}
                           </h2>
                        </div>
                        <div className="contact__form">
                           <form action="#">
                              <div className="row">
                                 <div className="col-xxl-6 col-xl-6 col-md-6">
                                    <div className="contact__form-input">
                                       <input required type="text" placeholder={t('contact.name_placeholder')} />
                                    </div>
                                 </div>
                                 <div className="col-xxl-6 col-xl-6 col-md-6">
                                    <div className="contact__form-input">
                                       <input required type="email" placeholder={t('contact.email_placeholder')} />
                                    </div>
                                 </div>
                                 <div className="col-xxl-12">
                                    <div className="contact__form-input">
                                       <input required type="text" placeholder={t('contact.subject_placeholder')} />
                                    </div>
                                 </div>
                                 <div className="col-xxl-12">
                                    <div className="contact__form-input">
                                       <textarea required placeholder={t('contact.msg_placeholder')} />
                                    </div>
                                 </div>
                                 <div className="col-xxl-12">
                                    <div className="contact__form-agree  d-flex align-items-center mb-20">
                                       <input required className="e-check-input" type="checkbox" id="e-agree" />
                                       <label className="e-check-label" htmlFor="e-agree">{t('contact.i_a')}<a href="#">{t('contact.terms')}</a></label>
                                    </div>
                                 </div>
                                 <div className="col-xxl-12">
                                    <div className="contact__btn">
                                       <Button type='primary' disabled className="tp-btn color-theme-7">{t('contact.send_msg')}</Button>
                                    </div>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
                  <div className="col-xxl-4 offset-xxl-1 col-xl-4 offset-xl-1 col-lg-5 offset-lg-1 tw-px-0">
                     <div className="contact__info bg-theme-7 p-relative z-index-1">
                        <div className="contact__shape">
                           <img className="contact-shape-1" src="assets/img/contact/contact-shape-1.png" alt="" />
                           <img className="contact-shape-2" src="assets/img/contact/contact-shape-2.png" alt="" />
                           <img className="contact-shape-3" src="assets/img/contact/contact-shape-3.png" alt="" />
                        </div>
                        <div className="contact__info-inner bg-theme-7">
                           <ul>
                              <li>
                                 <div className="contact__info-item d-flex align-items-start mb-35">
                                    <div className="contact__info-icon mr-15">
                                       <svg className="map" viewBox="0 0 24 24">
                                          <path className="st0" d="M21,10c0,7-9,13-9,13s-9-6-9-13c0-5,4-9,9-9S21,5,21,10z" />
                                          <circle className="st0" cx="12" cy="10" r="3" />
                                       </svg>
                                    </div>
                                    <div className="contact__info-text">
                                       <h4>{t('contact.office')}</h4>
                                       <p>
                                         <a target="_blank" rel="noreferrer" href="">
                                             Immersio Learning Inc.<br/>
                                             UBC Robson Square<br/>
                                             800 Robson Street<br/>
                                             Vancouver, BC Canada V6Z 3B7
                                         </a>
                                       </p>
                                    </div>
                                 </div>
                              </li>
                              <li>
                                 <div className="contact__info-item d-flex align-items-start mb-35">
                                    <div className="contact__info-icon mr-15">
                                       <svg className="mail" viewBox="0 0 24 24">
                                          <path className="st0" d="M4,4h16c1.1,0,2,0.9,2,2v12c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V6C2,4.9,2.9,4,4,4z" />
                                          <polyline className="st0" points="22,6 12,13 2,6 " />
                                       </svg>
                                    </div>
                                    <div className="contact__info-text">
                                       <h4>{t('contact.email')}</h4>
                                       <p><a href="mailto:info@immersio.io">info@immersio.io</a></p>
                                    </div>
                                 </div>
                              </li>
                              <li>
                                 <div className="contact__info-item d-flex align-items-start mb-35">
                                    <div className="contact__info-icon mr-15">
                                       <svg className="call" viewBox="0 0 24 24">
                                          <path className="st0" d="M22,16.9v3c0,1.1-0.9,2-2,2c-0.1,0-0.1,0-0.2,0c-3.1-0.3-6-1.4-8.6-3.1c-2.4-1.5-4.5-3.6-6-6  c-1.7-2.6-2.7-5.6-3.1-8.7C2,3.1,2.8,2.1,3.9,2C4,2,4.1,2,4.1,2h3c1,0,1.9,0.7,2,1.7c0.1,1,0.4,1.9,0.7,2.8c0.3,0.7,0.1,1.6-0.4,2.1  L8.1,9.9c1.4,2.5,3.5,4.6,6,6l1.3-1.3c0.6-0.5,1.4-0.7,2.1-0.4c0.9,0.3,1.8,0.6,2.8,0.7C21.3,15,22,15.9,22,16.9z" />
                                       </svg>
                                    </div>
                                    <div className="contact__info-text">
                                       <h4>{t('contact.phone')}</h4>
                                       <p><a href="tel:+(1)-604-754-3752">+1 (604) 754-3752</a></p>
                                    </div>
                                 </div>
                              </li>
                           </ul>
                           <div className="contact__social pl-30">
                              <h4>{t('contact.follow_us')}</h4>
                              <ul>
                                 <li><a href="#" className="fb" ><i className="fa-brands fa-facebook-f"></i></a></li>
                                 <li><a href="#" className="tw" ><i className="fa-brands fa-twitter"></i></a></li>
                                 <li><a href="#" className="pin" ><i className="fa-brands fa-pinterest-p"></i></a></li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
 };
 
 const ContactAreaImmersio = () => {
   return (
     <section className="contact__area contact__area-mobile p-relative">
       <div className="container tw-px-5 md:tw-px-[12px]">
         <div className="row">
           <ContactArea />
         </div>
       </div>
     </section>
   )
 }
 
 export default ContactAreaImmersio