import React from 'react';
import { BookStatStructure } from '../../../../../src/shared/types';
import default_img from '../../assets/default-book-cover.jpg';
import { convertURI } from '../../utils/funcs';

type Props = {
  book: BookStatStructure;
};

function ContinueItem({ book }: Props) {

  const imgSrc = book.coverPath !== 'none' ? convertURI(book.coverPath) : null;

  return (
    <li key={book.bookAuthor} className="mx-2 my-4 shadow-xl max-h-64 card lg:card-side bg-base-100">
      <figure className='max-w-64'>
        {imgSrc ? (<img src={imgSrc} alt="Album" />) : <img src={default_img} alt="Album" />}
      </figure>
      <div className="card-body">
        <h2 className="card-title">New album is released!</h2>
        <p>Click the button to listen on Spotiwhy app.</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary">Listen</button>
        </div>
      </div>
    </li>
  );
}

export default ContinueItem;