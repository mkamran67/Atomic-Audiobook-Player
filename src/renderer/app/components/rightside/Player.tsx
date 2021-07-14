import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import UpNext from "./UpNext/UpNext";

function Player() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="w-full h-full bg-white">
      <div className="bg-gray-400 border border-gray-400 w-96">
        <div className="w-full bg-white">
          <UpNext />
        </div>
        <div className="mx-2 bg-white border-t border-gray-400 border-none"></div>
      </div>
    </div>
  );
}

export default Player;
