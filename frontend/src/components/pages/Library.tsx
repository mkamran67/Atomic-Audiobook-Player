import { useSelector } from "react-redux";
import { RootState } from "../../store";
import GalleryView from "../Library/GalleryView";

export default function Library() {
  const { error, books } = useSelector((state: RootState) => state.books);
  return <div>{!error && <GalleryView books={books} />}</div>;
}
