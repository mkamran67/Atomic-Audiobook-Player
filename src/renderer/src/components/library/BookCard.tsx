import default_img from '../../assets/default-book-cover.jpg';
import { convertURI } from '../../utils/funcs';

type Props = {
  title: string;
  image: string | undefined;
  bookPath: string;
  author: string;
  setPlaying: (arg0: any, arg1: string) => void;
};

export default function BookCard({ image, bookPath, title, author, setPlaying }: Props) {

  const imageSrc = image && image !== "none" ? convertURI(image) : default_img;

  return (
    <div
      className="relative rounded-md shadow-xl cursor-pointer overflow-clip group aspect-[3/4]"
      onClick={(e) => setPlaying(e, bookPath)}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 z-10 bg-black opacity-0 transition-opacity duration-150 group-hover:opacity-40" />
      {/* Cover image */}
      <img
        className="object-cover w-full h-full"
        src={imageSrc}
        alt={title || "Book cover"}
      />
      {/* Title/Author gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
        <p className="text-sm font-semibold text-white truncate">
          {title || bookPath.split(/[\\/]/).pop()}
        </p>
        {author && (
          <p className="text-xs text-gray-300 truncate">{author}</p>
        )}
      </div>
    </div>
  );
}
