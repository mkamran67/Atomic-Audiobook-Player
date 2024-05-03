import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { BookDataType, LibraryBookSetType } from '../../types/library.types';
import ListViewItem from './ListViewItem';
import { GET_BOOK_DETAILS, REQUEST_TO_ELECTRON } from "../../../../../src/shared/constants";

type Props = {
  books: BookDataType[];
};

export default function ListView({ books }: Props) {
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
    <ul role="list" className="divide-y divide-gray-700">
      {books.map((book, index) => {
        return (
          <ListViewItem
            key={index + "bookCard"}
            book={book}
            setPlaying={setPlaying}
          />
        );
      })
      }
    </ul>
  );
}
