import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { READ_STATS_FILE, REQUEST_TO_ELECTRON } from "../../../../../src/shared/constants";
import { useEffect } from "react";
import ContinueItem from "./ContinueItem";


function ContinueReading() {
  const { stats } = useSelector((state: RootState) => state.stats);


  useEffect(() => {
    window.api.send(REQUEST_TO_ELECTRON, { type: READ_STATS_FILE, payload: null });
  }, []);




  return (
    <div className="w-full h-full">
      {
        stats.length > 0 ?
          (
            <>
              <h3 className="w-full p-4 text-2xl">
                Continue Listening
              </h3>
              <ul className='w-full h-full shadow-sm'>
                {
                  stats.map((book, index) => (
                    <ContinueItem key={book.bookTitle} book={book} />
                  ))
                }
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