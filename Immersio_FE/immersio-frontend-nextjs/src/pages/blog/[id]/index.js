import Head from 'next/head';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BlogRightSide from "../../../../components/Blog/BlogRightSide";
import { DUMPS } from '../../../../components/Blog/BlogArea';
import DefaultLayout from "../../../layouts";
import { withTranslationsProps } from '../../../next/with-app';

const BlogDetails = () => {
   const router = useRouter();
   
   const blogs = DUMPS;
   const [blog, setBlog] = useState();
   useEffect(() => {
      if (router?.query?.id) {
         const filter = blogs.filter((item) => item?.id?.toString() === router?.query?.id)
         if (filter?.length) {
            setBlog(filter[0])
         }
      }
   }, [router.query])

   return (
      <>
         <Head>
            <title>Blog Details Page</title>
         </Head>

         <DefaultLayout>
            <>
               <section className="blog__area tw-pt-[100px] tw-pb-10">
                  <div className="container">
                     <div className="row">
                        <div className="col-xxl-8 col-xl-8 col-lg-8">
                           <div className="postbox__wrapper postbox__details pr-20">
                              <div className="postbox__item transition-3 mb-70">
                                 <div className="postbox__thumb m-img">
                                    <img src={blog?.img} alt="" />
                                 </div>
                                 <div className="postbox__content">
                                    <div className="postbox__meta">
                                       <span>
                                          <a href="#">
                                             <i className="far fa-user"></i> {blog?.blog_author}
                                          </a>
                                       </span>
                                       <span>
                                          <i className="far fa-calendar-check"></i> {blog?.date}
                                       </span>
                                       <span>
                                          <a href="#">
                                             <i className="far fa-tag"></i> {blog?.tag}
                                          </a>
                                       </span>
                                    </div>
                                    <h3 className="postbox__title">{blog?.title}</h3>
                                    <div className="postbox__text mb-40" dangerouslySetInnerHTML={{ __html: blog?.content }} />
                                    <div className="postbox__line"></div>
                                    {(blog?.keywords || [])?.length ? (
                                       <div className="postbox__meta-3 d-sm-flex align-items-center">
                                          <span>Keywords :</span>
                                          <div className="tagcloud">
                                             {blog.keywords.map((item, index) => (
                                                <a key={index} href="#">{item}</a>
                                             ))}
                                          </div>
                                       </div>
                                    ) : null}
                                 </div>
                              </div>
                           </div>
                        </div>
                        {/* BlogRightSide */}
                        <BlogRightSide blogs={blogs} dynamicPage={true} />
                     </div>
                  </div>
               </section>
            </>
         </DefaultLayout>
      </>
   );
};

export async function getServerSideProps(ctx) {
   return await withTranslationsProps(ctx)
}

export default BlogDetails;