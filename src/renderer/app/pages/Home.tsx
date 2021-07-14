import {
  SearchCircleIcon,
  ArrowNarrowRightIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import React from "react";

function Home() {
  return (
    <div>
      <div className="flex flex-col m-4 bg-gray-100 rounded">
        <div className="flex items-center justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-1/3 p-2 m-4 text-xl text-gray-800 border-t-0 border-b-2 border-l-0 border-r-0 border-gray-400 focus:outline-none focus:border-indigo-400"
          />
          <SearchIcon className="h-12 p-2 text-indigo-500 bg-white rounded cursor-pointer hover:shadow-lg hover:text-indigo-600" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="p-2 m-2 text-2xl text-gray-600">Recent Books</h3>
            <button className="flex items-center justify-center p-2 my-2 text-center bg-white group">
              <p className="mx-1 text-gray-400 group-hover:text-indigo-600">
                More
              </p>
              <ArrowNarrowRightIcon className="w-6 text-gray-400 group-hover:text-indigo-600" />
            </button>
          </div>
          {/* Recent Books */}
          <div className="flex items-center justify-evenly">
            <div className="w-64 h-64 bg-indigo-300 rounded-md"></div>
            <div className="w-64 h-64 bg-red-300 rounded-md"></div>
            <div className="w-64 h-64 bg-green-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
