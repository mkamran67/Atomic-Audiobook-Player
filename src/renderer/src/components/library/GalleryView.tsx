import { GET_BOOK_DETAILS, REQUEST_TO_ELECTRON } from "../../../../../src/shared/constants";
import { BookDataType } from "../../types/library.types";
import BookCard from "./BookCard";

type Props = {
  books: BookDataType[];
};

function GalleryView({ books }: Props) {
  // TODO: Add a loading state/spinner for images
  // TODO: Change first click to view more info of the book rather than playing it.

  // 1. onClick set the clicked book as currentPlaying
  const setPlaying = (e: any, bookPath: string) => {
    e.preventDefault();

    // Request book from Electron
    try {
      // Request settings information from Electron
      window.api.send(REQUEST_TO_ELECTRON, {
        type: GET_BOOK_DETAILS,
        data: {
          path: bookPath,
        },
      });
    } catch (err) {
      console.error(err);
      // TODO: Handle error with UI element
    }
  };

  return (
    <>
      <ul role="list" className="grid grid-flow-row gap-4 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-5 sm:grid-cols-2 2xl:grid-cols-8">
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
    </>
  );
}

export default GalleryView;
