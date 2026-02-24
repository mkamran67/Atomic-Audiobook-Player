
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
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
import { appendLibrary, setBooks } from '../../state/slices/booksSlice';
import { setCurrentBook } from '../../state/slices/playerSlice';
import { IncomingElectronResponseType } from '../../types/layout.types';
import { setSettings } from '../settings/settingsSlice';
import Search from '../Search';
import UIHandler from '../alerts/UIHandler';
import { useTheme } from '../../utils/useTheme';
import { clearError, clearInfo, clearWarning, setError, setInfo, setWarning } from '../../state/slices/errorsSlice';
import { setStats } from '../../state/slices/statsSlice';
import Sidebar from './Sidebar';
import Player from '../player/Player';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';

function MobileOverlay() {
  const { isOpen, close } = useSidebar();
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 md:hidden"
      onClick={close}
    />
  );
}

function LayoutContent() {
  useTheme();
  const dispatch = useDispatch();
  const oneTime = useRef(true);

  useEffect(() => {
    if (!oneTime.current) return;
    oneTime.current = false;

    window.api.send(REQUEST_TO_ELECTRON, { type: READ_LIBRARY_FILE, payload: null });
    window.api.send(REQUEST_TO_ELECTRON, { type: READ_SETTINGS_FILE, payload: null });
    window.api.send(REQUEST_TO_ELECTRON, { type: GET_PREVIOUS_BOOK, payload: null });

    // Register listener once
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
      <Sidebar />
      <MobileOverlay />
      <div className="pb-32 md:pl-72 md:pb-36">
        <Search />
        <main>
          <div className="divide-y divide-base-content/5">
            <div className='m-2 mb-16'>
              <UIHandler />
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <Player />
    </>
  );
}

export default function Layout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
