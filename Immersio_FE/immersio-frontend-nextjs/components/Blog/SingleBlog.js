import Link from 'next/link';
import SwiperCore, { EffectFade, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
SwiperCore.use([Navigation]);

const SingleBlog = ({ blog }) => {
   return (
      <article className={`postbox__item format-image mb-50 transition-3 md:tw-px-6 lg:tw-w-[33.3333%]`}>
         {!blog?.slider &&
            blog?.videoPopup ? <div className="postbox__thumb postbox__video w-img p-relative">
            <Link href={`/blog/${blog?.id}`}>
               <a>
                  <img src={blog?.img} alt="" />
               </a>
            </Link>
            <button onClick={onOpenModal} href="https://youtu.be/-WRZI63emjs"
               className="play-btn pulse-btn popup-video">
               <i className="fas fa-play"></i>
            </button>
            </div> : !blog?.slider && <div className="postbox__thumb w-img">
               <Link href={`/blog/${blog?.id}`}>
                  <a >
                     <img src={blog?.img} alt="" />
                  </a>
               </Link>
            </div>
         }

         {
            blog?.slider && <div className='postbox__slider p-relative'>
               <Swiper
                  spaceBetween={50}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{ delay: 5000 }}
                  effect={"fade"}
                  className="swiper-wrapper"
                  modules={[EffectFade]}
                  navigation={{ nextEl: '.postbox-slider-button-next', prevEl: '.postbox-slider-button-prev' }}
               >
                  <SwiperSlide className="postbox__slider-item swiper-slide">
                     <img src="assets/img/blog/blog-big-4.jpg" alt="" />
                  </SwiperSlide>
                  <SwiperSlide className="postbox__slider-item swiper-slide">
                     <img src="assets/img/blog/blog-big-5.jpg" alt="" />
                  </SwiperSlide>
                  <SwiperSlide className="postbox__slider-item swiper-slide">
                     <img src="assets/img/blog/blog-big-6.jpg" alt="" />
                  </SwiperSlide>
               </Swiper>

               <div className="postbox-nav">
                  <button className="postbox-slider-button-next"><i className="fal fa-arrow-right"></i></button>
                  <button className="postbox-slider-button-prev"><i className="fal fa-arrow-left"></i></button>
               </div>
            </div>
         }

         <div className="postbox__content tw-py-6">
            <div className="postbox__meta">
               <span><i className="far fa-calendar-check"></i> {blog?.date} </span>
               <span><a href="#"><i className="far fa-user"></i> {blog?.blog_author} </a></span>
               <span><a href="#"><i className="fal fa-comments"></i> 02 Comments</a></span>
            </div>
            <h3 className="postbox__title">
               <Link href={`/blog/${blog?.id}`}>
                  <a >{blog?.title}</a>
               </Link>
            </h3>
            <div className="postbox__text">
               <p>{blog.description}</p>
            </div>
            <Link href={`/blog/${blog?.id}`}>
               <a className="color-theme-3 tw-font-bold tw-underline">Read More</a>
            </Link>
         </div>
      </article>
   );
};

export default SingleBlog;