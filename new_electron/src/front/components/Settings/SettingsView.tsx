import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../loader/loaderSlice";
import { RootState } from "../../store";
import SettingsButton from "./SettingsButton";

export default function SettingsView() {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loader);
  const setFolder = async () => {
    dispatch(setLoading());
    window.api.send("requestToElectron", {
      type: "newAudioBookDirectory",
      payload: null,
    });
  };

  // TODO: Add a button for saving settings
  // TODO: Change theme dropdown
  // -> https://daisyui.com/docs/themes/

  return (
    <div className="h-screen overflow-auto rounded-lg bg-slate-50">
      <h3 className="pt-10 ml-10 font-mono text-3xl font-bold text-black cursor-default">Library 📚</h3>
      <ul className="flex flex-col px-10">
        <li className="flex items-center p-3 first:pt-6">
          <SettingsButton
            btnText="Select Library Folder"
            description="Select the root folder of your library"
            isDisabled={loading}
            setAction={setFolder}
            // REVIEW -> Need to fix tooltip position
            // TODO -> Click to create
            tooltip="Fix tooltip position"
          />
        </li>
        <li className="flex items-center p-3 first:pt-6">
          <SettingsButton
            btnText="Select Library Folder"
            description="Select the root folder of your library"
            isDisabled={loading}
            setAction={setFolder}
          />
        </li>
      </ul>
    </div>
  );
}
