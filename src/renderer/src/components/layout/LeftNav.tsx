import {
  BuildingLibraryIcon,
  CalendarIcon, Cog6ToothIcon, HomeIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Library", href: "/library", icon: BuildingLibraryIcon },
  { name: "Stats", href: "/stats", icon: CalendarIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

const playlists = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P' },
  { id: 2, name: 'Protocol', href: '#', initial: 'P' },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T' },
];


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

function LeftNav() {
  const location = useLocation();
  const { close } = useSidebar();

  return (
    <nav className="flex flex-col flex-1">
      <ul role="list" className="flex flex-col flex-1 gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => {
              const isCurrent = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={close}
                    className={classNames(
                      isCurrent
                        ? 'bg-base-300 text-base-content'
                        : 'text-base-content/60 hover:text-base-content hover:bg-base-300',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon className="w-6 h-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
        <li>
          <div className="text-xs font-semibold leading-6 text-base-content/60">Playlists</div>
          <ul role="list" className="mt-2 -mx-2 space-y-1">
            {playlists.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={close}
                  className="text-base-content/60 hover:text-base-content hover:bg-base-300 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-base-200 text-[0.625rem] font-medium text-base-content/60 group-hover:text-base-content">
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
