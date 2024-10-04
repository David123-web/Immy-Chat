import { Progress } from "antd";
import { useEffect, useState } from "react";
// import CloseIcon from "@/public/assets/img/mydrive/close.svg";
import DashIcon from "@/public/assets/img/mydrive/dash.svg";

const ProgressItem = () => {
  const [percent, setPercent] = useState<number>(0);
  useEffect(() => {
    let idInterval: any = null;

    if (percent < 100) {
      idInterval = setInterval(() => {
        setPercent((prev) => prev + 1);
      }, 500);
    } else {
      clearInterval(idInterval);
    }
  }, [percent]);

  return (
    <div className="progress___item">
      <div className="tw-flex tw-justify-between tw-items-center">
        <div className="tw-truncate tw-w-36 tw-font-medium -tw-mb-2">
          Filename.min.scss
        </div>
        <div className="tw-text-xs -tw-mb-2">40.03 KB</div>
      </div>
      <Progress percent={percent} size="small" />
    </div>
  );
};

const UploadProgress = () => {
  const [display, setDisplay] = useState(true);
  const [hideProgress, setHideProgress] = useState(false);

  return display ? (
    <div className="tw-w-80 tw-h-auto tw-fixed tw-bottom-0 tw-right-20 tw-shadow-xl">
      <div className="bg-theme-3 color-theme-7 tw-flex tw-justify-between tw-items-center tw-px-6 tw-py-4 tw-rounded-md tw-rounded-b-none">
        <div className="tw-font-medium">Uploading 2 files</div>
        <div className="tw-flex tw-justify-evenly tw-items-center tw-gap-x-2">
          <div
            className="tw-cursor-pointer tw-w-6 tw-h-6"
            onClick={() => setHideProgress(!hideProgress)}
          >
            {/* <img className="tw-w-full tw-h-full" src="/assets/img/mydrive/dash.svg" alt="close" /> */}
            <DashIcon/>
          </div>
          <div
            className="tw-cursor-pointer tw-w-6 tw-h-6"
            onClick={() => setDisplay(false)}
          >
            <img className="tw-w-full tw-h-full" src="/assets/img/mydrive/close.png" alt="close" />
          </div>
        </div>
      </div>

      <div
        className={`bg-theme-7 tw-px-4 border-theme-6 tw-border tw-border-t-0 tw-rounded-md tw-transition-all tw-duration-300 ${
          hideProgress ? "tw-h-52 tw-py-4" : "tw-h-0"
        }`}
      >
        <div className="tw-overflow-y-auto tw-h-full tw-pr-2">
          <ProgressItem />
          <ProgressItem />
          <ProgressItem />
          <ProgressItem />
          <ProgressItem />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default UploadProgress;
