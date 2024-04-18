import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { statsBooksState } from "../../../../../src/shared/types";

const tempData: statsBooksState[] = [
  {
    chapters: [
      {
        chapters: 2,
        comments: [
          "",
          ""
        ],
        length: 130
      }
    ],
    duration: 120,
    durationPlayed: 37,
    imgPath: "",
    path: "",
    title: "temp book"
  }
];

function ContinueReading() {
  const { stats } = useSelector((state: RootState) => state.stats);



  return (
    <div className="w-full h-full">
      {
        stats.length > 0 ?
          (
            <>
              <h3 className="p-2 text-xl text-ellipsis">
                Continue Reading
              </h3>
              <ul className='w-full h-full'>

              </ul>
            </>
          ) : (
            <h3 className="p-4 text-xl">
              Start listening to some books to see their stats listed here...
            </h3>
          )
      }

    </div>
  );
}

export default ContinueReading;