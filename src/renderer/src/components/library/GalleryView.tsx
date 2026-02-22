import { GET_BOOK_DETAILS, REQUEST_TO_ELECTRON } from "../../../../../src/shared/constants";
import { BookDataType } from "../../types/library.types";
import BookCard from "./BookCard";

type Props = {
  books: BookDataType[];
};

function GalleryView({ books }: Props) {
  const setPlaying = (e: any, bookPath: string) => {
    e.preventDefault();

    try {
      window.api.send(REQUEST_TO_ELECTRON, {
        type: GET_BOOK_DETAILS,
        data: {
          path: bookPath,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ul role="list" className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
      {books.map((book, index) => {
        return (
          <BookCard
            key={index + "bookCard"}
            image={book.cover}
            bookPath={book.dirPath}
            title={book.title}
            author={book.author}
            setPlaying={setPlaying}
          />
        );
      })}
    </ul>
  );
}

export default GalleryView;
