import { ArrowLeftOutlined } from "@ant-design/icons"
import { SearchIcon } from "./Header"
import { useCallback, useState } from "react";
import Link from "next/link";

const SearchMobile = ({ onClickShowSearchFormMobile, searchValue, setSearchValue, coursesResult, handleOnSubmit }) => {
  return (
    <div className="md:tw-hidden tw-fixed tw-z-[100] tw-top-0 tw-w-full tw-h-full bg-theme-7">
      <div className="tw-flex tw-items-center tw-space-x-8 tw-p-5">
        <ArrowLeftOutlined className="tw-text-[24px]" onClick={onClickShowSearchFormMobile} />
        <div className="relative tw-flex-1">
          <div className={`header__search tw-flex-1`}>
            <form onSubmit={handleOnSubmit}>
              <div className="header__search-input">
                <input type="text" placeholder="Search..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <button className="header__search-btn" type="submit">
                  <SearchIcon />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
     
      {coursesResult.length > 0 && 
        <div className="tw-px-5 tw-overflow-auto" style={{ height: `calc(100vh - 80px)` }}>
          {coursesResult?.map((course) => (
            <Link key={`course-${course.id}`} href={`/courses/${course.slug}-c${course.id}`}>
              <a 
                className="tw-block tw-border-b border-theme-6 tw-border-solid tw-border-t-0 tw-border-r-0 tw-border-l-0 tw-pb-2 tw-mb-2">
                {course.title}
              </a>
            </Link>
          ))}
        </div>}
        
      
    </div>
  )
}

export default SearchMobile