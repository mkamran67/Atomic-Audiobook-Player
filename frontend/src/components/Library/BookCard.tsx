import { MouseEvent, MouseEventHandler } from "react";
import default_img from "../../assets/default-book-cover.jpg";

type Props = {
  title: string;
  image: string | undefined;
  bookPath: string;
  artist: string;
  setPlaying: (arg0: any, arg1: string) => void;
};

export default function BookCard({ title, image, bookPath, artist, setPlaying }: Props) {
  return (
    <div
      className="relative h-56 rounded-md shadow-xl cursor-pointer overflow-clip w-44 group "
      onClick={(e) => setPlaying(e, bookPath)}
    >
      <div className="absolute z-10 invisible w-full h-full duration-150 ease-in-out bg-black rounded-md opacity-0 hover:shadow-2xl hover:opacity-50 hover:transition-opacity group-hover:visible"></div>
      <img className="object-center w-48 h-56" src={image ? `image-file://${image}` : default_img} alt={"Book cover"} />
    </div>
  );
}
