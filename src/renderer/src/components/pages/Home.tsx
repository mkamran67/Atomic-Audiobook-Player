import ContinueReading from "../home/ContinueReading";
import TimeLine from "../home/TimeLine";


export default function Home() {
  return (
    <div className="flex w-full h-full gap-2 text-gray-100">
      <section className="w-3/4 h-auto bg-gray-800 rounded">
        <ContinueReading />
      </section>
      <section className="m-2">
        <TimeLine />
      </section>
    </div>
  );
}
