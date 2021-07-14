import React from "react";
import NextItem from "./NextItem";

function UpNext() {
  return (
    <div className="flex flex-col m-2">
      <h4 className="p-1 text-2xl font-semibold text-black dark:text-white">
        Up Next
      </h4>
      <ul>
        <NextItem />
      </ul>
    </div>
  );
}

export default UpNext;
