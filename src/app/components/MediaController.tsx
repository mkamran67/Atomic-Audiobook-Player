import React from "react";
import { BookmarkAltSolid, ClockOutline } from "@graywolfai/react-heroicons";

function MediaController() {
  return (
    <div className="w-full h-full p-1 bg-gray-400 lg:p-4">
      <div className="w-full h-full bg-gray-700">
        <ul>
          <li>
            <ClockOutline className="w-6 text-white" />
          </li>
          <li>
            <BookmarkAltSolid className="w-6 text-white" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MediaController;
