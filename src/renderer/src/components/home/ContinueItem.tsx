import { GET_BOOK_DETAILS, READ_LIBRARY_FILE, REQUEST_TO_ELECTRON } from '../../../../../src/shared/constants';
import { BookStatStructure } from '../../../../../src/shared/types';
import default_img from '../../assets/default-book-cover.jpg';
import { convertURI } from '../../utils/funcs';

type Props = {
  book: BookStatStructure;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthDate = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];

function ContinueItem({ book }: Props) {

  const {
    bookAuthor, bookDirectory, bookPath, bookTitle, chapterCount, coverPath, currentChapterPath, currentTime, currentTrack, endedDateAndTime, markedForPrevious, startDateAndTime
  } = book;
  const imgSrc = book.coverPath !== 'none' ? convertURI(book.coverPath) : null;
  const newDate = new Date(startDateAndTime);

  const formattedDate = `${months[newDate.getMonth()]} ${monthDate[newDate.getDay() + 1]} ${newDate.getFullYear().toString()}`;

  const handleContinue = () => {
    window.api.send(REQUEST_TO_ELECTRON, {
      type: GET_BOOK_DETAILS,
      data: {
        path: bookDirectory,
      },
    });
  };

  return (
    <li key={book.bookAuthor} className="mx-2 md:mx-6 my-4 rounded-lg shadow-xl max-h-64 flex flex-col lg:flex-row bg-base-100 overflow-hidden">
      <figure className='max-w-full lg:max-w-64 shrink-0'>
        {imgSrc ? (<img src={imgSrc} alt="Album" className="w-full h-full object-cover" />) : <img src={default_img} alt="Album" className="w-full h-full object-cover" />}
      </figure>
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-lg font-bold">{bookTitle}</h2>
          <h6>by {bookAuthor}</h6>
          <p className="text-sm text-base-content/60">Started on {formattedDate}</p>
        </div>
        <div className="flex justify-end mt-2">
          <button onClick={handleContinue} className="px-4 py-2 rounded-md bg-success text-white font-medium hover:bg-success/80 transition-colors">
            Continue Listening
          </button>
        </div>
      </div>
    </li >
  );
}

export default ContinueItem;
