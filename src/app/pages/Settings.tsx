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

  if (mounted) {
    // console.log(window.ipcRenderer);
    window.ipcRenderer.on("pong", (event: any, arg: any) => {
      console.log(event);
    });
    window.ipcRenderer.send("ping");
  }

  return (
    <div>
      Settings
      <input
        ref={inputFile}
        type="file"
        onChange={onClickFolderHandler}
        directory=""
        webkitdirectory=""
      />
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
