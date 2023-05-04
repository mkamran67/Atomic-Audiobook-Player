import { BookDataType } from "../../types/library.types";
import BookCard from "./BookCard";

type Props = {
  books: BookDataType[];
};

function GalleryView({ books }: Props) {
  let counter = 0;

  return (
    <>
      <ul role="list" className="grid grid-flow-row grid-cols-6 gap-6">
        {books &&
          books.map((book) => {
            counter++;

            return (
              <li key={`book-${counter}`}>
                <BookCard artist={book.artist} title={book.title} bookPath={book.dirPath} image={book.cover} />
              </li>
            );
          })}
      </ul>
    </>
  );
}

export default GalleryView;
