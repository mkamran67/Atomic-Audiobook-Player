
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  BuildingLibraryIcon,
  CalendarIcon, Cog6ToothIcon, HomeIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import appLogo from '../../assets/app-icon.png'
import Breadcrumbs from './Breadcrumbs';
import { APPEND_BOOKS, ELECTRON_ERROR, ELECTRON_INFO, ELECTRON_WARNING, GET_BOOK_DETAILS, READ_LIBRARY_FILE, READ_SETTINGS_FILE, REQUEST_TO_ELECTRON, RESPONSE_FROM_ELECTRON } from '../../../../shared/constants';
import { IncomingElectronResponseType } from '../../types/layout.types';
import { clearLoading, setLoading } from '../../state/slices/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, setError } from '../../state/slices/layoutSlice';
import { setSettings } from '../settings/settingsSlice';
import { setBooks } from '../../state/slices/booksSlice';
import { RootState } from '../../state/store';
import Loader from '../loader/Loader';

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
]

const secondaryNavigation = [
  { name: 'Account', href: '#', current: true },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Billing', href: '#', current: false },
  { name: 'Teams', href: '#', current: false },
  { name: 'Integrations', href: '#', current: false },
]


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout() {

  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loader);
  // const { error, type, message } = useSelector((state: RootState) => state.layout);

  // const dispatch = useDispatch();
  const location = useLocation().pathname;

  useEffect(() => {
    // Requesting data from Electron -> Listeners
    dispatch(setLoading());
    window.api.send(
      REQUEST_TO_ELECTRON,
      {
        type: READ_LIBRARY_FILE,
        payload: null
      }
    );

    window.api.send(
      RESPONSE_FROM_ELECTRON,
      {
        type: READ_SETTINGS_FILE,
        payload: null
      }
    );

    // Recieve information from Electron -> Listeners
    window.api.receive(RESPONSE_FROM_ELECTRON, async (res: IncomingElectronResponseType) => {
      const { type, data } = res;

      switch (type) {
        case APPEND_BOOKS: {
          dispatch(setBooks(data));
          dispatch(clearLoading());
          break;
        }
        case READ_SETTINGS_FILE: {
          dispatch(setSettings(data));
          break;
        }
        case GET_BOOK_DETAILS: {
          // dispatch(setCurrentBook(data));
          break;
        }
        case ELECTRON_ERROR: {
          dispatch(clearLoading());
          dispatch(setError({ error: true, type: 'error', message: data }));
          setTimeout(() => {
            dispatch(clearError());
          }, 5000);
          break;
        }
        case ELECTRON_WARNING: {
          dispatch(clearLoading());
          dispatch(setError({ error: true, type: 'warning', message: data }));
          setTimeout(() => {
            dispatch(clearError());
          }, 5000);
          break;
        }
        case ELECTRON_INFO: {
          dispatch(clearLoading());
          dispatch(setError({ error: true, type: 'info', message: data }));
          setTimeout(() => {
            dispatch(clearError());
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
        <div className="flex flex-col px-6 overflow-y-auto grow gap-y-5 bg-black/10 ring-1 ring-white/5">
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
      </div>

      <div className="pl-72">
        {/* Sticky search header */}
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
              {
                loading ? (<Loader />) : (<Outlet />)
              }
            </div>
          </div>
        </main>
      </div>
    </>
  );
}