import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { setSearchTerm } from '../state/slices/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ChangeEvent } from 'react';
import { useSidebar } from '../context/SidebarContext';


const Search = () => {
  const dispatch = useDispatch();
  const { searchTerm } = useSelector((state: RootState) => state.search);
  const { toggle } = useSidebar();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-base-100 border-b shadow-sm shrink-0 gap-x-4 border-base-content/5 sm:px-6 lg:px-8">
      <button
        onClick={toggle}
        className="p-2 text-base-content/60 hover:text-base-content md:hidden"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
        <form className="flex flex-1">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <MagnifyingGlassIcon
              className="absolute inset-y-0 left-0 w-5 h-full text-base-content/50 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block w-full h-full py-0 pl-8 pr-0 text-base-content bg-transparent border-0 focus:ring-0 sm:text-sm"
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
