import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { setSearchTerm } from '../state/slices/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ChangeEvent, ReactHTMLElement } from 'react';


const Search = () => {
  const dispatch = useDispatch();
  const { searchTerm } = useSelector((state: RootState) => state.search);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // e.preventdefault();
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-gray-900 border-b shadow-sm shrink-0 gap-x-6 border-white/5 sm:px-6 lg:px-8">
      <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
        <form className="flex flex-1">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <MagnifyingGlassIcon
              className="absolute inset-y-0 left-0 w-5 h-full text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block w-full h-full py-0 pl-8 pr-0 text-white bg-transparent border-0 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              type="search"
              name="search"
              onChange={handleChange}
              value={searchTerm}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;