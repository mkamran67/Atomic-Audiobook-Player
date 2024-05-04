import {
  BuildingLibraryIcon,
  CalendarIcon, Cog6ToothIcon, HomeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: false },
  { name: "Library", href: "/library", icon: BuildingLibraryIcon, current: false },
  { name: "Stats", href: "/stats", icon: CalendarIcon, current: false },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon, current: false },
];

const playlists = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
  { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
];


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

function LeftNav() {
  return (
    <nav className="flex flex-col flex-1">
      <ul role="list" className="flex flex-col flex-1 gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <item.icon className="w-6 h-6 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <div className="text-xs font-semibold leading-6 text-gray-400">Playlists</div>
          <ul role="list" className="mt-2 -mx-2 space-y-1">
            {playlists.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                    {item.initial}
                  </span>
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default LeftNav;