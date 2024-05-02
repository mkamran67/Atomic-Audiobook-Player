import { useAudioPlayer } from '../../utils/customHooks';
import { PlayCircleIcon, PauseCircleIcon, SpeakerXMarkIcon, SpeakerWaveIcon, BackwardIcon, ForwardIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import { formatTime, secondsToPercentage } from '../../utils/timeConversions';
import { MinimumChapterDetails } from '../../../../../src/shared/types';
import { useDispatch } from 'react-redux';
import { setCurrentPlayingChapter } from '../../state/slices/playerSlice';

type Props = {
  url: string;
  title: string;
  bookURL: string;
  currentTrack: number;
  incomingTime: number;
  chapterList: MinimumChapterDetails[];
};

function AudioPlayer({ url, title, bookURL, currentTrack, incomingTime, chapterList }: Props) {
  const encodedURL = 'get-audio://' + url;
  const dispatch = useDispatch();

  const {
    changeVolume,
    seek,
    togglePlayPause,
    currentTime,
    isPlaying,
    volume,
    audio
  } = useAudioPlayer(encodedURL, bookURL, currentTrack, incomingTime);

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    changeVolume(Number(value));
  };

  const toggleMute = () => {
    if (volume === 0) {
      changeVolume(100);
    } else {
      changeVolume(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const percentage = (value / 100);
    const newTime = percentage * audio.duration;
    seek(newTime);
  };

  const skipChapter = (direction: 'forward' | 'backward') => {
    console.log(`Changing chapters`);
    let chapterIndex = 0;
    let currentChapterIndex = 0;

    for (let index = 0; index < chapterList.length; index++) {
      const chapter = chapterList[index];
      if (chapter.path === url) {
        currentChapterIndex = index;
        break;
      }
    }

    if (direction === 'forward') {
      if ((currentChapterIndex + 1) > chapterList.length) {
        // REVIEW -> handle error in UI
        return;
      } else {
        chapterIndex = currentChapterIndex + 1;
      }
    } else {
      if ((currentChapterIndex - 1) < 0) {
        // REVIEW -> handle error in UI
        return;
      } else {
        chapterIndex = currentChapterIndex - 1;
      }
    }

    const newChapter = chapterList[chapterIndex];
    dispatch(setCurrentPlayingChapter({ currentlyPlaying: newChapter.path }));
  };


  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-2">
        <div className='flex items-center justify-center w-full h-full text-white'>
          <div className='flex flex-col items-center justify-center gap-2 grow'>
            {/* << < |||> > >> */}
            <div className='flex items-center justify-center'>
              <div className="tooltip" data-tip="Chapter Rewind">
                <button onClick={() => skipChapter('backward')}>
                  <BackwardIcon className='w-8 h-8' />
                </button>
              </div>
              <div className="tooltip" data-tip="15 Seconds back">
                <button className=''>
                  <ChevronDoubleDownIcon className='w-8 h-8 rotate-90' />
                </button>
              </div>
              <div className="tooltip" data-tip="Play or Pause">
                <button onClick={togglePlayPause}>
                  {
                    isPlaying ?
                      <PauseCircleIcon className='w-14 h-14 hover:text-gray-300' /> :
                      <PlayCircleIcon className='w-14 h-14 hover:text-gray-300' />
                  }
                </button>
              </div>
              <div className="tooltip" data-tip="15 Seconds Forward">
                <button className=''>
                  <ChevronDoubleDownIcon className='w-8 h-8 -rotate-90' />
                </button>
              </div>
              <div className="tooltip" data-tip="Chapter Forward">
                <button onClick={() => skipChapter('forward')}>
                  <ForwardIcon className='w-8 h-8' />
                </button>
              </div>
            </div>
            {/* <----- Chapter Range/Seeker ----> */}
            <div className='flex items-center justify-center w-full gap-2'>
              <p>{formatTime(Math.ceil(currentTime))}</p>
              <input
                type="range"
                min={0}
                max={100}
                value={secondsToPercentage(currentTime, audio.duration) ? secondsToPercentage(currentTime, audio.duration) : 0}
                onChange={handleSeek}
                className="range range-xs" />
              <p>{formatTime(Math.ceil(audio.duration - currentTime))}</p>
            </div>
          </div>
          {/* Volume o--> */}
          <div className='flex flex-row items-center justify-center h-full mr-6'>
            <button onClick={toggleMute} className='w-6 h-w-6 hover:text-gray-300'>
              {volume === 0 ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={handleVolume}
              className="range range-xs [--range-shdw:green] ml-2" />
          </div>
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;;;