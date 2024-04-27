import { convertURI } from '../../utils/funcs';
import DefaultCover from './DefaultCover';

type Props = {
  imgSrc: string;
};

function BookCover({ imgSrc }: Props) {
  return (
    <>
      {
        imgSrc ?
          <img src={convertURI(imgSrc)} className="rounded-lg max-w-32" /> :
          <DefaultCover />
      }
    </>
  );
}

export default BookCover;