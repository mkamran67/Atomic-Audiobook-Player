import React, { useEffect, useRef, useState } from "react";
import Loader from "../components/generics/Loader";
import SetRootDirectory from "../components/settings/SetRootDirectory";

function Settings() {
  const [loading, setLoading] = useState(false);

  if (loading) return <Loader />;

  return (
    <div className="flex w-11/12 p-10 mx-auto my-4 bg-gray-200 rounded">
      <ul className="flex w-full">
        <SetRootDirectory setLoading={setLoading} />
      </ul>
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
