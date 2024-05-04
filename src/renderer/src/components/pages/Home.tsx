import ContinueReading from "../home/ContinueReading";
import TimeLine from "../home/TimeLine";


export default function Home() {
  return (
    <div className="flex w-full h-full gap-2 text-gray-100">
      <div className="flex w-full">
        <div className="grid flex-grow rounded-lg bg-base-200 place-items-center">
          <ContinueReading />
        </div>
        <div className="invisible mx-1 divider divider-horizontal"></div>
        <div className="grid flex-grow rounded-lg bg-base-200 place-items-center">
          <TimeLine />
        </div>
      </div>
    </div>
  );
}
