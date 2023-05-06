import { useSelector } from "react-redux";
import { RootState } from "../../store";
import GalleryView from "../library/GalleryView";

export default function Library() {
  const { error, books } = useSelector((state: RootState) => state.books);
  return <div className="p-4">{!error && <GalleryView books={books} />}</div>;
}
