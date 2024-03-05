import { useMemo } from "react";
import { BookDataType, LibraryBookSetType } from "../../types/library.types";
import BookCard from "./BookCard";
import { GET_BOOK_DETAILS, REQUEST_TO_ELECTRON } from "../../../../../src/shared/constants";

type Props = {
  books: LibraryBookSetType[];
};

function GalleryView({ books }: Props) {
  let counter = 0;

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

  const booksCombined = useMemo(() => {
    const combinedBooks: BookDataType[] = [];
    books.forEach((bookSet) => {
      bookSet.books.forEach((book) => {
        combinedBooks.push(book);
      });
    });
    return combinedBooks;
  }, [books]);

  return (
    <>
      <ul role="list" className="grid grid-flow-row grid-cols-6 gap-6">
        {booksCombined && booksCombined.map((book, index) => {
          counter++;
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
      <p>Found {counter} books.</p>
    </>
  );
}

export default GalleryView;
