import { useState } from "react";

type Props = {};

export default function Library({}: Props) {
  // const { ipcRenderer } = window.require("electron");
  const [loading, setLoading] = useState(false);
  let loaderText = "Loading...";

  const setFolder = async () => {
    let path = "";
    setLoading(true);

    // Popup for directory selector
    window.api.send("requestToElectron", { type: "firstTimeScanForBooks", data: null });

    // // if it's cancelled -> reset loading
    // window.api.receive("fromMain", (data: MainResponseType) => {
    //   // if true -> SetLoading -> true
    //   if (data.results) {
    //     setLoading(true);
    //     //REVIEW -  setPath in state
    //   } else {
    //     // if false -> SetLoading -> false
    //     setLoading(false);
    //   }
    // });
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
