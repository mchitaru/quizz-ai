import clsx from "clsx";
import React from "react";

type Props = {
  percentage: number;
  color: string;
};

const Bar = (props: Props) => {
  const { percentage, color } = props;

  const barStyle = {
    height: `${percentage}%`,
  };
  const barBgClasses: Record<string, string> = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
  };
  return (
    <div className="h-40 flex items-end justify-end">
      <div
        className={clsx(
          barBgClasses[color],
          "w-14 rounded-xl border-2 border-black"
        )}
        style={barStyle}
      ></div>
    </div>
  );
};

export default Bar;
