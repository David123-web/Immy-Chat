import React from "react";

interface ISection {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Section = (props: ISection) => {
  return (
    <div className="tw-mb-12 tw-flex tw-flex-col tw-relative">
      <div className="tw-mb-4 tw-flex tw-justify-between tw-h-8">
        <div className="tw-font-semibold tw-text-2xl">{props.label}</div>
        <div>{props.icon}</div>
      </div>
      {props.children}
    </div>
  );
};

export default Section;
