import { BookDataType } from '../../types/library.types';
import default_img from '../../assets/default-book-cover.jpg';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

type Props = {
  book: BookDataType;
  key: string;
};


function ListViewItem({ book, key }: Props) {

  const { title, author, cover, dirPath } = book;
  console.log("👉 -> file: ListViewItem.tsx:13 -> title:", title);
  const coverSrc = cover ? `get-file://${cover}` : default_img;


  return (
    <li
      key={key}
      className="relative flex justify-between px-4 py-5 cursor-pointer gap-x-6 hover:bg-gray-800 sm:px-6 lg:px-8"
    >
      <div className="flex min-w-0 gap-x-4">
        <img className="flex-none w-12 h-12 rounded-md bg-gray-50" src={coverSrc} alt={title + 'cover'} />
        <div className="flex-auto min-w-0">
          <p className="text-sm font-semibold leading-6 text-white truncate">
            <span className="absolute inset-x-0 bottom-0 truncate -top-px" />
            {title ? title : dirPath.split('\\').pop()}
          </p>
          <p className="flex mt-1 text-xs leading-5 text-gray-300 truncate">
            {author}
          </p>
        </div>
      </div>
      <div className="flex items-center shrink-0 gap-x-4">
        <div className="hidden sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-200 truncate max-w-48 xl:max-w-lg">{dirPath}</p>
          {/* {person.lastSeen ? (
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
            </p>
          ) : (
            <div className="mt-1 flex items-center gap-x-1.5">
              <div className="flex-none p-1 rounded-full bg-emerald-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs leading-5 text-gray-500">Online</p>
            </div>
          )} */}
        </div>
        <ChevronRightIcon className="flex-none w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>
    </li>
  )
}

export default ListViewItem