import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import GalleryView from "../library/GalleryView";
import ListView from "../library/ListView";
import { useMemo } from "react";
import { BookDataType } from "../../types/library.types";

export default function Library() {
  const library = useSelector((state: RootState) => state.library);
  const { libraryView } = useSelector((state: RootState) => state.settings);

  const booksCombined = useMemo(() => {
    const combinedBooks: BookDataType[] = [];
    library.forEach((bookSet) => {
      bookSet.books.forEach((book) => {
        combinedBooks.push(book);
      });
    });
    return combinedBooks;
  }, [library]);



  if (library) {
    if (libraryView === 'gallery') {
      return <div className="p-4">{<GalleryView books={booksCombined} />}</div>;
    } else if (libraryView === 'list') {
      return <div className="p-4">{<ListView books={booksCombined} />}</div>;
    }
  } else {
    return null;
  }
}
