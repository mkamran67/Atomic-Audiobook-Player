import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import GalleryView from "../library/GalleryView";

export default function Library() {
  const library = useSelector((state: RootState) => state.library);

  return <div className="p-4">{library && <GalleryView books={library} />}</div>;
}
