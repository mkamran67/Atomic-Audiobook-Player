import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type Props = {}

const Search = (props: Props) => {
  return (
    <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-gray-900 border-b shadow-sm shrink-0 gap-x-6 border-white/5 sm:px-6 lg:px-8">
      <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
        <form className="flex flex-1" action="#" method="GET">
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
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Search