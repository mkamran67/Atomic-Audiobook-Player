import React, { useEffect, useRef, useState } from 'react';
import { useAudio, useAudioPlayer } from '../../utils/customHooks';
import { convertURI, convertURIForAudio } from '../../utils/funcs';
import { PlayIcon } from '@heroicons/react/24/solid';

type Props = {
  url: string;
  title: string;
};

function AudioPlayer({ url, title }: Props) {
  const encodedURL = 'get-audio://' + url;


  const {
    changeVolume,
    currentTime,
    duration,
    isPlaying,
    seek,
    togglePlayPause,
    volume
  } = useAudioPlayer(encodedURL);





  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <p className="text-center truncate max-w-32 hover:w-full">{title}</p>
        {/* <audio controls src={audio} /> */}
        <button onClick={togglePlayPause}>
          {
            isPlaying ?
              'Pause' :
              <PlayIcon className='w-12 h-12 text-white fill-white' />
          }
        </button>

        <p>{currentTime}/{duration}</p>
      </div>
    </>
  );
}

export default AudioPlayer;