
const BreadCrumb = ({ title, subtitle }) => {
   return (
      <>
         <section className="theme-bg-3 breadcrumb__area include-bg pt-200 pb-100 breadcrumb__overlay">
            <div className="container">
               <div className="row">
                  <div className="col-xxl-12">
                     <div className="breadcrumb__content text-center p-relative z-index-1">
                        <h3 className="breadcrumb__title">{title}</h3>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
};

export default BreadCrumb;