import React, { useEffect } from "react";
type Props = {};

export default function Library({}: Props) {
  const { ipcRenderer } = window.require("electron");

  const setFolder = () => {
    // Set a root directory for audiobooks
    console.log(`Folder`);

    // ipcRenderer
  };

  // useEffect(() => {
  //   window.api.receive("fromMain", (data: any) => {
  //     console.log(data);
  //   });

  //   return () => {
  //     window.api.removeEventListenere("fromMain", (data: any) => {
  //       console.log(data);
  //     });
  //   };
  // }, []);

  return (
    <div>
      <button
        onClick={setFolder}
        type="button"
        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Button text
      </button>
    </div>
  );
}
