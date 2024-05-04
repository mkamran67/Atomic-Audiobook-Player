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
    <li key={book.bookAuthor} className="mx-6 my-4 rounded-md shadow-xl max-h-64 card lg:card-side bg-base-100">
      <figure className='max-w-64'>
        {imgSrc ? (<img src={imgSrc} alt="Album" />) : <img src={default_img} alt="Album" />}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{bookTitle}</h2>
        <h6>by {bookAuthor}</h6>
        <p>Started on {formattedDate}</p>
        <div className="justify-end card-actions">
          <button onClick={handleContinue} className="text-black bg-green-500 btn hover:bg-green-700">
            Continue Listening
          </button>
        </div>
      </div>
    </li >
  );
}

export default ContinueItem;