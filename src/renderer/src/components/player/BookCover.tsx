type Props = {
  imgSrc: string;
};

function BookCover({ imgSrc }: Props) {
  return (
    <div className="mx-2 md:mx-4 overflow-hidden rounded-lg shrink-0">
      <div className="flex items-center w-16 h-20 md:w-24 md:h-28 bg-base-200 rounded-lg justify-evenly">
        {
          imgSrc ?
            <img src={imgSrc} className='object-cover w-full h-full rounded-lg' /> :
            <p className="text-xs md:text-sm text-center text-base-content/60">No Cover</p>
        }
      </div>
    </div>
  );
}

export default BookCover;
