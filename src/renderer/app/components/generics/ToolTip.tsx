import React from "react";

interface Tip {
  tipId: string;
  children: any;
  tipPosition: string;
}

function ToolTip({ tipId, tipPosition, children }: Tip) {
  return (
    <>
      <span
        id={tipId}
        className="absolute z-10 px-2 py-1 mt-4 text-center text-black transition-opacity duration-200 ease-in bg-gray-100 rounded shadow-xl opacity-0 whitespace-nowrap -right-3/4 top-3/4 group-hover:opacity-100"
      >
        {children}
      </span>
    </>
  );
}

export default ToolTip;
