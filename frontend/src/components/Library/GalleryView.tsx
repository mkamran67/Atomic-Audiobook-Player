import { BookDataType } from "../../types/library.types";
import BookCard from "./BookCard";

type Props = {
  books: BookDataType[];
};

function GalleryView({ books }: Props) {
  console.log(books);

  return (
    <>
      {books &&
        books.map((book: BookDataType) => (
          <BookCard title={book.title} bookPath={book.dirPath} image={book.cover} artist={book.artist} />
        ))}
    </>
  );
}

export default GalleryView;
