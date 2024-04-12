import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { BookDataType, LibraryBookSetType } from '../../types/library.types';
import ListViewItem from './ListViewItem';

type Props = {
  books: BookDataType[];
};

export default function ListView({ books }: Props) {


  return (
    <ul role="list" className="divide-y divide-gray-700">
      {books.map((book, index) => {
        return (
          <ListViewItem
            key={index + "bookCard"}
            book={book}
          />
        );
      })
      }
    </ul>
  );
}
