import React from 'react';

type Props = {
  url: string;
  title: string;
  coverPath: string;

};

function AudioPlayer({ url, title }: Props) {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <p className="w-64 text-center truncate hover:w-full">{title}</p>

      </div>
    </>
  );
}

export default AudioPlayer;