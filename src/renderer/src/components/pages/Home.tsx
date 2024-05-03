import ContinueReading from "../home/ContinueReading";
import TimeLine from "../home/TimeLine";


export default function Home() {
  return (
    <div className="flex w-full h-full gap-2 text-gray-100">
      <div className="flex w-full">
        <div className="grid flex-grow card bg-base-200 rounded-box place-items-center">
          <ContinueReading />
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="grid flex-grow card bg-base-200 rounded-box place-items-center">
        </div>
      </div>

    </div>
  );
}
