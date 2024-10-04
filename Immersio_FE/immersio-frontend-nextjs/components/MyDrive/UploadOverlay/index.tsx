import UploadIcon from "@/public/assets/img/mydrive/upload.svg";
import { useEffect, useState } from "react";

const UploadOverlay = ({ openUpload = false }: { openUpload: boolean }) => {
  const [isRender, setIsRender] = useState(openUpload); // using mobx global state

  useEffect(() => {
    // using mobx global state
    setIsRender(openUpload);
  }, [openUpload]);

  return isRender ? (
    <>
      <input
        type={"file"}
        className="tw-fixed tw-z-50 tw-top-0 tw-w-screen tw-h-screen tw-bg-transparent tw-opacity-0"
        onChange={() => setIsRender(false)}
      />
      <div className="tw-fixed tw-z-40 tw-top-0 tw-w-screen tw-h-screen tw-bg-[#212b36e6] tw-flex tw-flex-col tw-items-center tw-justify-center">
        <div>
          <UploadIcon />
        </div>
        <div className="color-theme-7 tw-text-4xl tw-mt-6">
          Drop your files anywhere to start uploading
        </div>
      </div>
      <div
        onClick={() => setIsRender(false)}
        className="tw-fixed tw-z-[60] tw-top-4 tw-right-4 tw-w-8 tw-h-8 tw-cursor-pointer"
      >
        <img
          className="tw-w-full tw-h-full"
          src="/assets/img/mydrive/close.png"
          alt="close"
        />
      </div>
    </>
  ) : null;
};

export default UploadOverlay;
