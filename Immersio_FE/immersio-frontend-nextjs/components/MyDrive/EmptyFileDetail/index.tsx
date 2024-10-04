import FileDetailsIcon from "@/public/assets/img/mydrive/filedetailsicon.svg";
const EmptyFileDetail = () => {
  return (
    <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center">
      <FileDetailsIcon className="tw-mb-7" />
      <div
        className="color-theme-1 tw-text-center"
      >
        Select a file or folder to view it’s details
      </div>
    </div>
  );
};

export default EmptyFileDetail;
