import React, { useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";
import { FolderOpenIcon } from "@heroicons/react/outline";
import ToolTip from "../generics/ToolTip";

interface Props {
  currentRootDirectory: string;
  setLoading: Function;
}

function SetRootDirectory({ currentRootDirectory, setLoading }: Props) {
  // const [mounted, setMounted] = useState(false);
  const [currDir, setcurrDir] = useState(currentRootDirectory);
  const booksList = useRef([]);
  const currentRootDir = useRef("");

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  //   const onClickFolderHandler = (e: any) => {
  //     if (typeof e.target.files[0] !== undefined) {
  //       let pathArr = e.target.files[0].path.split(" ")[0].split("\\");

  //       console.log(pathArr.slice(1, pathArr.length - 1).join("\\"));
  //     } else {
  //       console.log(`undefined`);
  //     }
  //   };

  const openFolder = (e: any) => {
    e.preventDefault();

    setLoading(true);

    ipcRenderer.send("asynchronous-open-folder");

    ipcRenderer.on("asynchronous-reply", (event, args) => {
      // console.log(`got a reply`);
      // Check if it didn't fail -> Continue
      if (!args[0]) {
        booksList.current = args[2];
        currentRootDir.current = args[1];
        setcurrDir(args[1]);
      }
    });
    setLoading(false);
  };

  return (
    <li id="Set_Root_Directory" className="w-full hover:bg-gray-300">
      <div className="flex flex-row justify-between w-full my-10">
        <p className="pl-10 text-2xl">Set your root directory</p>
        {currentRootDir.current.length > 1 && (
          <div className="flex flex-col">
            <p>Current Root Directory</p>
            <p className="font-mono text-lg">{currentRootDir.current}</p>
          </div>
        )}

        <button
          onClick={openFolder}
          className="relative p-2 text-white bg-blue-500 rounded-md lg:mr-20 group"
        >
          <FolderOpenIcon className="inline w-8" />
          <ToolTip tipId="root-directory" tipPosition="bottom">
            Open Directory
          </ToolTip>
        </button>
      </div>
    </li>
  );
}

SetRootDirectory.defaultProps = {
  currentRootDirectory: "",
};

export default SetRootDirectory;
