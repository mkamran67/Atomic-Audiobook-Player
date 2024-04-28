import React, { useEffect, useRef, useState } from 'react';
import { useAudio, useAudioPlayer } from '../../utils/customHooks';
import { convertURI, convertURIForAudio } from '../../utils/funcs';

type Props = {
  url: string;
  title: string;
};

function AudioPlayer({ url, title }: Props) {

  const encodedURL = convertURIForAudio(url);
  // const encodedURL = 'get-audio://' + url;
  console.log("file: AudioPlayer.tsx:13 -> encodedURL:", encodedURL);


  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <p className="text-center truncate max-w-32 hover:w-full">{title}</p>
        <audio controls>
          <source src={encodedURL} />
          Your browser does not support the audio element.
        </audio>
        {/* <button onClick={toggle}>{'Play'}</button> */}
      </div>
    </>
  );
}

export default AudioPlayer;