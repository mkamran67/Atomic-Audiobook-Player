
import {
  BuildingLibraryIcon,
  CalendarIcon, Cog6ToothIcon, HomeIcon
} from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import {
  APPEND_BOOKS,
  ELECTRON_ERROR,
  ELECTRON_INFO,
  ELECTRON_WARNING,
  GET_BOOK_DETAILS,
  GET_PREVIOUS_BOOK,
  READ_LIBRARY_FILE,
  READ_SETTINGS_FILE,
  READ_STATS_FILE,
  REQUEST_TO_ELECTRON,
  RESPONSE_FROM_ELECTRON
} from '../../../../shared/constants';
import appLogo from '../../assets/app-icon.png';
import { appendLibrary, setBooks } from '../../state/slices/booksSlice';
import { setCurrentBook } from '../../state/slices/playerSlice';
import { IncomingElectronResponseType } from '../../types/layout.types';
import Player from '../player/Player';
import { setSettings } from '../settings/settingsSlice';
import Search from '../Search';
import UIHandler from '../alerts/UIHandler';
import { clearError, clearInfo, clearWarning, setError, setInfo, setWarning } from '../../state/slices/errorsSlice';
import { setStats } from '../../state/slices/statsSlice';

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

export default function Layout() {
  const dispatch = useDispatch();
  const oneTime = useRef(true);


  useEffect(() => {
    if (oneTime.current) {
      window.api.send(
        REQUEST_TO_ELECTRON,
        {
          type: READ_LIBRARY_FILE,
          payload: null
        }
      );

      window.api.send(
        REQUEST_TO_ELECTRON,
        {
          type: READ_SETTINGS_FILE,
          payload: null
        }
      );

      window.api.send(
        REQUEST_TO_ELECTRON,
        {
          type: GET_PREVIOUS_BOOK,
          payload: null
        }
      );
      oneTime.current = false;
    }

    // Recieve information from Electron -> Listeners
    window.api.receive(RESPONSE_FROM_ELECTRON, async (res: IncomingElectronResponseType) => {
      const { type, data } = res;

      switch (type) {
        case APPEND_BOOKS: {
          dispatch(appendLibrary(data));
          break;
        }
        case READ_LIBRARY_FILE: {
          dispatch(setBooks(data));

          break;
        }
        case READ_SETTINGS_FILE: {
          console.log(`Got Settings`);
          dispatch(setSettings(data));
          break;
        }
        case GET_BOOK_DETAILS: {
          dispatch(setCurrentBook(data));
          break;
        }
        case ELECTRON_ERROR: {
          dispatch(setError(data));
          setTimeout(() => {
            dispatch(clearError());
          }, 5000);
          break;
        }
        case ELECTRON_WARNING: {
          dispatch(setWarning(data));
          setTimeout(() => {
            dispatch(clearWarning());
          }, 5000);
          break;
        }
        case ELECTRON_INFO: {
          dispatch(setInfo(data));
          setTimeout(() => {
            dispatch(clearInfo());
          }, 5000);
          break;
        }
        case READ_STATS_FILE: {
          dispatch(setStats(data));
          setTimeout(() => {
            dispatch(clearInfo());
          }, 5000);
          break;
        }

        default: {
          console.log(`You've hit default case in Layout.js ${type}`);
          break;
        }
      }
    });
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div className="fixed inset-y-0 z-50 flex flex-col w-72">
        <div className="flex flex-col px-6 pb-40 overflow-y-auto grow gap-y-5 bg-black/10 ring-1 ring-white/5">
          {/* Icon */}
          <div className="flex items-center h-16 shrink-0">
            <img
              className="w-12 h-auto cursor-default "
              src={appLogo}
              alt="Atomic Audiobook Player Logo"
            />
            <p className='cursor-default'>Atomic Audiobook Player</p>
          </div>
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
        </div>
        <Player />
      </div>
      <div className="pb-40 pl-72">
        {/* Sticky search header */}
        <Search />
        <main>
          <h1 className="sr-only">Account Settings</h1>
          <header className="border-b border-white/5">
            {/* Secondary navigation */}
            {/* TODO -> Implement with folders or something */}
            {/* <Breadcrumbs /> */}
          </header>
          {/* CONTENT */}
          <div className="divide-y divide-white/5">
            <div className='m-2'>
              <UIHandler />
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}