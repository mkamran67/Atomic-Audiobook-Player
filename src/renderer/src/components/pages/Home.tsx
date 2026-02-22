import ContinueReading from "../home/ContinueReading";
import TimeLine from "../home/TimeLine";


export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-2 text-gray-100">
      <div className="flex-1 rounded-lg bg-base-200">
        <ContinueReading />
      </div>
      <div className="flex-1 rounded-lg bg-base-200">
        <TimeLine />
      </div>
    </div>
  );
}
