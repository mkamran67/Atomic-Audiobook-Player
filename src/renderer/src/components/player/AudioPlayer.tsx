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

  const skipChapter = (direction: 'forward' | 'backward') => {
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
      if ((currentChapterIndex + 1) >= chapterList.length) {
        return;
      } else {
        chapterIndex = currentChapterIndex + 1;
      }
    } else {
      if ((currentChapterIndex - 1) < 0) {
        return;
      } else {
        chapterIndex = currentChapterIndex - 1;
      }
    }

    const newChapter = chapterList[chapterIndex];
    dispatch(setCurrentPlayingChapter({ currentlyPlaying: newChapter.path }));
  };

  const {
    changeVolume,
    seek,
    togglePlayPause,
    onPlaying,
    currentTime,
    isPlaying,
    volume,
    duration
  } = useAudioPlayer(encodedURL, bookURL, currentTrack, incomingTime, () => skipChapter('forward'));

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
    const newTime = percentage * duration;
    seek(newTime);
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seek(newTime);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1 md:gap-2 px-2">
      <div className='flex items-center justify-center w-full h-full text-base-content'>
        <div className='flex flex-col items-center justify-center gap-1 md:gap-2 grow'>
          {/* Playback controls */}
          <div className='flex items-center justify-center gap-1'>
            <div className="tooltip" data-tip="Chapter Rewind">
              <button onClick={() => skipChapter('backward')}>
                <BackwardIcon className='w-6 h-6 md:w-8 md:h-8 hover:text-base-content/70' />
              </button>
            </div>
            <div className="tooltip" data-tip="15 Seconds back">
              <button onClick={() => skipTime(-15)}>
                <ChevronDoubleDownIcon className='w-6 h-6 md:w-8 md:h-8 rotate-90 hover:text-base-content/70' />
              </button>
            </div>
            <div className="tooltip" data-tip="Play or Pause">
              <button onClick={togglePlayPause}>
                {
                  isPlaying ?
                    <PauseCircleIcon className='w-10 h-10 md:w-14 md:h-14 hover:text-base-content/70' /> :
                    <PlayCircleIcon className='w-10 h-10 md:w-14 md:h-14 hover:text-base-content/70' />
                }
              </button>
            </div>
            <div className="tooltip" data-tip="15 Seconds Forward">
              <button onClick={() => skipTime(15)}>
                <ChevronDoubleDownIcon className='w-6 h-6 md:w-8 md:h-8 -rotate-90 hover:text-base-content/70' />
              </button>
            </div>
            <div className="tooltip" data-tip="Chapter Forward">
              <button onClick={() => skipChapter('forward')}>
                <ForwardIcon className='w-6 h-6 md:w-8 md:h-8 hover:text-base-content/70' />
              </button>
            </div>
          </div>
          {/* Seek bar */}
          <div className='flex items-center justify-center w-full gap-2 px-2'>
            <p className='text-xs md:text-sm whitespace-nowrap'>{formatTime(Math.ceil(currentTime))}</p>
            <input
              type="range"
              min={0}
              max={100}
              value={duration ? secondsToPercentage(currentTime, duration) : 0}
              onChange={handleSeek}
              className="range range-xs" />
            <p className='text-xs md:text-sm whitespace-nowrap'>{formatTime(Math.ceil(duration - currentTime))}</p>
          </div>
        </div>
        {/* Volume */}
        <div className='flex flex-row items-center justify-center h-full mr-2 md:mr-6 shrink-0'>
          <button onClick={toggleMute} className='w-6 h-6 hover:text-base-content/70'>
            {volume === 0 ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={handleVolume}
            className="hidden md:block range range-xs [--range-shdw:green] ml-2" />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
