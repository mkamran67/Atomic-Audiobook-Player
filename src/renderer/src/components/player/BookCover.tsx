import { convertURI } from '../../utils/funcs';

type Props = {
  imgSrc: string;
};

function BookCover({ imgSrc }: Props) {
  return (
    <div className="mx-4 overflow-hidden rounded-lg">
      <div className="flex items-center w-32 h-40 bg-gray-800 rounded-lg justify-evenly">
        {
          imgSrc ?
            <img src={imgSrc} className='object-fill w-full h-full' /> :
            <p className="text-lg text-center -rotate-45 -translate-x-2">No Cover</p>
        }
      </div>
    </div>
  );
}

export default BookCover;