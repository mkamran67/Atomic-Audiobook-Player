import { PlayCircleIcon, ForwardIcon, PauseCircleIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, EllipsisHorizontalCircleIcon } from "@heroicons/react/20/solid";

type Props = {
  setIsPlaying: (stateChange: boolean) => void,
  isPlaying: boolean,
  isThereAudio: boolean,
  steppingAround: (amount: number, direction: string) => void,
}

function ButtonGroup({ setIsPlaying, isPlaying, isThereAudio, steppingAround }: Props) {


  if (!isThereAudio) {
    return (
      <div className="flex">
        <div className="tooltip" data-tip="Select a book">
          <EllipsisHorizontalCircleIcon className="w-10 h-10 text-gray-500 rotate-180 cursor-default" />
        </div>
      </div>
    )
  }


  return (
    <div className="flex">
      <ForwardIcon className="w-10 h-10 text-gray-500 rotate-180 cursor-pointer hover:text-gray-800" />
      <div className="tooltip" data-tip="10 Seconds Backwards">
        <ChevronDoubleRightIcon
          onClick={() => steppingAround(15, "backward")}
          className="w-10 h-10 text-gray-500 rotate-180 cursor-pointer hover:text-gray-800" />
      </div>
      {isPlaying ? (
        <PauseCircleIcon
          className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800"
          onClick={() => setIsPlaying(false)}
        />
      ) : (
        <PlayCircleIcon
          className={"w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800"}
          onClick={() => setIsPlaying(true)}
        />
      )}
      <div className="tooltip" data-tip="10 Seconds Forward">
        <ChevronDoubleLeftIcon className="w-10 h-10 text-gray-500 rotate-180 cursor-pointer hover:text-gray-800" onClick={() => steppingAround(15, "forward")}
        />
      </div>
      <ForwardIcon className="w-10 h-10 text-gray-500 cursor-pointer hover:text-gray-800" />
    </div>
  )
}

export default ButtonGroup