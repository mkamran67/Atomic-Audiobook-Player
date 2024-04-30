import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../../utils/customHooks';
import { convertURI, convertURIForAudio } from '../../utils/funcs';
import { PlayIcon } from '@heroicons/react/24/solid';

type Props = {
  url: string;
  title: string;
  bookURL: string;
  currentTrack: number;
};

function AudioPlayer({ url, title, bookURL, currentTrack }: Props) {
  const encodedURL = 'get-audio://' + url;


  const {
    changeVolume,
    currentTime,
    duration,
    isPlaying,
    seek,
    togglePlayPause,
    volume,
  } = useAudioPlayer(encodedURL, bookURL, currentTrack);



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