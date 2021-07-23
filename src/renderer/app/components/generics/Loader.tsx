import { BookOpenIcon } from "@heroicons/react/outline";
import React from "react";

interface Props {
  loadingText: string;
}

function Loader({ loadingText }: Props) {
  return (
    <div className="absolute inset-0 z-20 bg-gray-400 ">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <BookOpenIcon className="w-20 text-blue-700 animate-pulse" />
        <h1>
          {loadingText.length > 0
            ? { loadingText }
            : "Building your Audiobook library, please wait..."}
        </h1>
      </div>
    </div>
  );
}

Loader.defaultProps = {
  loadingText: "",
};

export default Loader;
