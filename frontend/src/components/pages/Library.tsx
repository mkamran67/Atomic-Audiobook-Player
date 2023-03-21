import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBooks } from "../Library/booksSlice";

type Props = {};

export default function Library({}: Props) {
  // const { ipcRenderer } = window.require("electron");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let loaderText = "Scanning for books...";

  const setFolder = async () => {
    setLoading(true);
    window.api.send("requestToElectron", {
      type: "newAudioBookDirectory",
      payload: null,
    });
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
