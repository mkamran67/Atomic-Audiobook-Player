import { useMemo } from "react";
import { BookDataType, LibraryBookSetType } from "../../types/library.types";
import BookCard from "./BookCard";

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
      window.api.send("requestToElectron", {
        type: "getBookDetails",
        data: {
          path: bookPath,
        },
      });
    } catch (err) {
      console.error(err);
      // TODO: Handle error with UI element
    }
  };

  // const booksCombined = useMemo(() => {

  //   const combinedBooks: BookDataType[] = [];

  //   books.forEach((bookSet) => {
  //     bookSet.books.forEach((book) => {
  //       combinedBooks.push(book);
  //     });
  //   });

  //   return combinedBooks;

  // }, [books]);
  console.log("👉 -> file: GalleryView.tsx:37 -> booksCombined:", books);

  return (
    <>
      <ul role="list" className="grid grid-flow-row grid-cols-6 gap-6">
        {/* {books 


          } */}
      </ul>
    </>
  );
}

export default GalleryView;
