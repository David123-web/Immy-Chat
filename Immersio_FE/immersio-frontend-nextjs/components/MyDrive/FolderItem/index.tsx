import FolderImg from "@/public/assets/img/mydrive/folder.svg";

interface IFolderItem {
  name: string;
  location: string;
  isSelected: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const FolderItem = (props: IFolderItem) => {
  return (
    <div
      id="folder-item"
      className={`tw-flex tw-flex-col tw-h-[7.125rem] tw-w-48 tw-rounded-[0.25rem] tw-border tw-border-solid
      border-theme-6 hover:border-theme-3 tw-px-3 tw-pt-3 tw-pb-3
      tw-transition-all tw-duration-300 tw-cursor-pointer
      ${props.isSelected ? "bg-theme-3" : "bg-theme-7"}
      `}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
    >
      <div className="tw-w-full tw-flex tw-h-10 tw-mb-2">
      <FolderImg className={`tw-w-10 ${props.isSelected ? 'tw-fill-white' : 'fill-theme-3'}`} />
      </div>
      <div
        className={`tw-w-full tw-truncate tw-font-semibold tw-transition-all tw-duration-300 ${
          props.isSelected ? "color-theme-7" : ""
        }`}
      >
        {props.name}
      </div>
      <div
        className={`tw-text-xs tw-w-full tw-truncate tw-transition-all tw-duration-300 ${
          props.isSelected ? "color-theme-7" : "color-theme-1"
        }`}
      >
        {props.location}
      </div>
    </div>
  );
};

export default FolderItem;
