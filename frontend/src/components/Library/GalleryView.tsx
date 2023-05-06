import { BookDataType } from "../../types/library.types";
import BookCard from "./BookCard";

type Props = {
  books: BookDataType[];
};

function GalleryView({ books }: Props) {
  let counter = 0;

  // TODO: Add a loading state/spinner for images
  // TODO: Change first click to view more info of the book rather than playing it.

  // 1. onClick set the clicked book as currentPlaying
  const setPlaying = (test) => {
    console.log(test);
  };

  return (
    <>
      <ul role="list" className="grid grid-flow-row grid-cols-6 gap-6">
        {books &&
          books.map((book) => {
            counter++;

            return (
              <li key={`book-${counter}`}>
                <BookCard
                  artist={book.artist}
                  title={book.title}
                  bookPath={book.dirPath}
                  image={book.cover}
                  setPlaying={setPlaying}
                />
              </li>
            );
          })}
      </ul>
    </>
  );
}

export default GalleryView;
