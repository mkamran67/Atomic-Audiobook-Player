import React, { useEffect, useState } from "react";
type Props = {};

export default function Library({}: Props) {
  // const { ipcRenderer } = window.require("electron");
  const [loading, setLoading] = useState(false);
  let loaderText = "Loading...";

  const setFolder = async () => {
    let path = "";

    // Set a root directory for audiobooks
    console.log(`Folder`);

    // ipcRenderer
    window.api.send("toMain", "Potatos grow underground.");
    window.api.receive("fromMain", (data: string) => {
      setLoading(true);
      path = data;
    });

    if (path) {
      if (path === "Failed") {
        loaderText = "Looks like you cancelled, we'll keep the old folder as root.";
        setLoading(false);
      } else {
        window.api.receive("done", (data: string) => {
          setLoading(false);
          // Check for directory info etc...
        });
      }
    }
  };

  return (
    <div>
      {loading ? (
        <p>{loaderText}</p>
      ) : (
        <button
          onClick={setFolder}
          type="button"
          className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={loading}
        >
          Button text
        </button>
      )}
    </div>
  );
}
