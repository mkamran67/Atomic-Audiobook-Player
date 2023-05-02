import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../loader/loaderSlice";
import { RootState } from "../../store";

type Props = {};

export default function Library({}: Props) {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loader);
  const setFolder = async () => {
    dispatch(setLoading());
    window.api.send("requestToElectron", {
      type: "newAudioBookDirectory",
      payload: null,
    });
  };

  return (
    <div>
      <button
        onClick={setFolder}
        type="button"
        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={loading}
      >
        Button text
      </button>
    </div>
  );
}
