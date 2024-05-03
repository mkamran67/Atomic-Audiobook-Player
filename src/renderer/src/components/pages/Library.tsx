import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import GalleryView from "../library/GalleryView";
import ListView from "../library/ListView";
import { useMemo, useState } from "react";
import { BookDataType } from "../../types/library.types";
import { ListBulletIcon } from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { changeLibraryView } from "../settings/settingsSlice";
import { LibraryView } from "../../../../../src/shared/types";
import { Switch } from "@headlessui/react";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Library() {
  const dispatch = useDispatch();
  const library = useSelector((state: RootState) => state.library);
  const { libraryView } = useSelector((state: RootState) => state.settings);
  const { searchTerm } = useSelector((state: RootState) => state.search);

  const booksCombined = useMemo(() => {
    const combinedBooks: BookDataType[] = [];
    library.forEach((bookSet) => {
      bookSet.books.forEach((book) => {
        // combinedBooks.push(book);
        if (searchTerm) {
          if (book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            combinedBooks.push(book);
          }
        } else {
          combinedBooks.push(book);
        }
      });
    });
    return combinedBooks;
  }, [library, searchTerm]);

  const viewHandler = () => {

    let payLoad = {
      libraryView: LibraryView.LIST
    };

    if (libraryView === 'gallery') {
      payLoad.libraryView = LibraryView.LIST;
    } else {
      payLoad.libraryView = LibraryView.GALLERY;
    }

    dispatch(changeLibraryView(payLoad));
  };

  return (
    library && (
      <div className="p-4">
        <div className="flex items-center justify-between w-full mb-4">
          <p className="w-full">Found {booksCombined.length} books</p>
          <label className="flex-grow cursor-pointer label">
            <ListBulletIcon className="w-6 h-6 mx-2" />
            <Switch
              checked={true}
              onChange={viewHandler}
              className={
                classNames(
                  libraryView === 'gallery' ? 'bg-indigo-600' : 'bg-gray-700',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                )
              }
            >
              <span className="sr-only">change layout</span>
              <span
                aria-hidden="true"
                className={
                  classNames(
                    libraryView === 'gallery' ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  )
                }
              />
            </Switch>
            <PhotoIcon className="w-6 h-6 mx-2" />
          </label>
        </div>
        {libraryView === 'gallery' ?
          (
            <GalleryView books={booksCombined} />
          ) :
          (
            <ListView books={booksCombined} />
          )
        }
      </div>
    )
  );
}
