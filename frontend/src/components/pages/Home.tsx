import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
// import { useDispatch } from "react-redux";

type Props = {};

export default function Home({}: Props) {
  // const state = useSelector((state) => state);
  // const dispatch = useDispatch();

  // console.log(state);

  return (
    <div className="w-full h-full">
      <span className="inline-flex rounded-md shadow-sm isolate">
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </span>
    </div>
  );
}
