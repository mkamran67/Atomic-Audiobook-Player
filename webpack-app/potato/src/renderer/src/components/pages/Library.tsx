import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import GalleryView from "../library/GalleryView";

export default function Library() {
  const { books } = useSelector((state: RootState) => state.library);
  return <div className="p-4">{books && <GalleryView books={books} />}</div>;
}
