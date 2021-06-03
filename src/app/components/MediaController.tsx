import React from "react";
import { BookmarkAltSolid, ClockOutline } from "@graywolfai/react-heroicons";

function MediaController() {
  return (
    <div className="h-full w-full bg-gray-400 col-span-10 p-4">
      <div className="bg-gray-700 h-full w-full">
        <ul>
          <li>
            <ClockOutline className="text-white w-6" />
          </li>
          <li>
            <BookmarkAltSolid className="text-white w-6" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MediaController;
