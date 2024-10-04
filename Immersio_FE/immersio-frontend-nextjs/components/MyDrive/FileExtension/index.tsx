import { generateColor } from "@/src/helpers/strings";

const FileExtension = ({ ext }: { ext: string }) => {
  return (
    <div
      style={{
        background: generateColor(ext ?? 'default'),
      }}
      className={`tw-w-10 tw-h-10 tw-flex tw-justify-center tw-items-center tw-aspect-square tw-p-[2px] tw-rounded-sm color-theme-7 tw-text-xs tw-uppercase tw-font-semibold`}
    >
      {ext ?? 'N/A'}
    </div>
  );
};

export default FileExtension;
