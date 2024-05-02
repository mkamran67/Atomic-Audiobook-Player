import { useAudioPlayer } from '../../utils/customHooks';
// import { PlayIcon } from '@heroicons/react/24/solid';
import { PlayCircleIcon, PauseCircleIcon, SpeakerXMarkIcon, SpeakerWaveIcon, BackwardIcon, ForwardIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import { formatTime, secondsToPercentage } from '../../utils/timeConversions';
import { MinimumChapterDetails } from '../../../../../src/shared/types';
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


  const {
    changeVolume,
    currentTime,
    duration,
    isPlaying,
    seek,
    togglePlayPause,
    volume,
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
    const newTime = percentage * duration;

    seek(newTime);
  };


  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-2">
        {/* <p className="text-center truncate max-w-32 hover:w-full">{title}</p> */}
        <div className='flex items-center justify-center w-full h-full text-white'>
          <div className='flex flex-col items-center justify-center gap-2 grow'>
            {/* << < |||> > >> */}
            <div className='flex items-center justify-center'>
              <div className="tooltip" data-tip="Chapter Rewind">
                <button className=''><BackwardIcon className='w-8 h-8' /></button>
              </div>
              <div className="tooltip" data-tip="15 Seconds back">
                <button className=''><ChevronDoubleDownIcon className='w-8 h-8 rotate-90' /></button>
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
                <button className=''><ChevronDoubleDownIcon className='w-8 h-8 -rotate-90' /></button>
              </div>
              <div className="tooltip" data-tip="Chapter Forward">
                <button><ForwardIcon className='w-8 h-8' /></button>
              </div>
            </div>
            {/* <----- Chapter Range/Seeker ----> */}
            <div className='flex items-center justify-center w-full gap-2'>
              <p>{formatTime(Math.ceil(currentTime))}</p>
              <input
                type="range"
                min={0}
                max={100}
                value={secondsToPercentage(currentTime, duration) ? secondsToPercentage(currentTime, duration) : 0}
                onChange={handleSeek}
                className="range range-xs" />
              <p>{formatTime(Math.ceil(duration - currentTime))}</p>
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