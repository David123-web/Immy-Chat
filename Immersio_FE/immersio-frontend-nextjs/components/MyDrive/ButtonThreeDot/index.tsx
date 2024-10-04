import { MouseEventHandler } from "react";
import { overrideTailwindClasses } from "tailwind-override";

interface IButtonThreeDot {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const ButtonThreeDot = (props: IButtonThreeDot) => {
  return (
    <div
      className={overrideTailwindClasses(`tw-font-bold tw-text-zinc-400 tw-text-2xl
      tw-cursor-pointer tw-border tw-border-zinc-400 tw-rounded-[0.25rem] tw-w-10 tw-h-10
      tw-transition-all tw-duration-300 hover:bg-theme-3 hover:color-theme-7
    ${props.className ?? ""}
    `)}
      onClick={props.onClick}
    >
      <div className="tw-h-full tw-flex tw-justify-center">...</div>
    </div>
  );
};

export default ButtonThreeDot;
