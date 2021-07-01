import { ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";

function Settings() {
  const inputFile = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onClickFolderHandler = (e: any) => {
    if (typeof e.target.files[0] !== undefined) {
      let pathArr = e.target.files[0].path.split(" ")[0].split("\\");

      console.log(pathArr.slice(1, pathArr.length - 1).join("\\"));
    } else {
      console.log(`undefined`);
    }
  };

  const ipcTester = (e: any) => {
    e.preventDefault();
    ipcRenderer.send("asynchronous-message", "test");

    ipcRenderer.on("asynchronous-reply", (event, args) => {
      console.log(args);
    });
  };

  return (
    <div className="flex w-full p-10 my-10 bg-gray-300">
      <p>Settings</p>
      <button onClick={ipcTester} className="p-4 m-4 bg-gray-400">
        Button
      </button>
    </div>
  );
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}

export default Settings;
