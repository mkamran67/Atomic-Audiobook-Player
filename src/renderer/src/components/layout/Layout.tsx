
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { APPEND_BOOKS, ELECTRON_ERROR, ELECTRON_INFO, ELECTRON_WARNING, GET_BOOK_DETAILS, READ_LIBRARY_FILE, READ_SETTINGS_FILE, REQUEST_TO_ELECTRON, RESPONSE_FROM_ELECTRON } from '../../../../shared/constants';
import { setError } from '../../state/slices/layoutSlice';
import { clearLoading } from '../../state/slices/loaderSlice';
import { RootState } from '../../state/store';
import { IncomingElectronResponseType } from '../../types/layout.types';
import Loader from '../loader/Loader';




function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loading = useSelector((state: RootState) => state.loader);
  const { error, type, message } = useSelector((state: RootState) => state.layout);
  console.log("👉 -> file: Layout.tsx:39 -> message:", message);
  console.log("👉 -> file: Layout.tsx:39 -> type:", type);
  console.log("👉 -> file: Layout.tsx:39 -> error:", error);


  const location = useLocation(); // Used for sidebar active selection
  const dispatch = useDispatch();

  useEffect(() => {
    // Requesting data from Electron -> Listeners
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
          console.log('👉 -> file: handler.ts:27 -> data:', data);
          // dispatch(setBooks(data));
          // dispatch(clearLoading());
          break;
        }
        case READ_SETTINGS_FILE: {
          console.log('👉 -> file: Layout.tsx:61 -> data:', data);
          break;
        }
        case GET_BOOK_DETAILS: {
          console.log('👉 -> file: handler.ts:35 -> data:', data);
          // dispatch(setCurrentBook(data));
          break;
        }
        case ELECTRON_ERROR: {
          console.log('👉 -> file: Layout.tsx:74 -> data:', data);
          dispatch(clearLoading());
          dispatch(setError({ error: true, type: 'error', message: data }));
          // setTimeout(() => {
          //   dispatch(clearError());
          // }, 5000);
          break;
        }
        case ELECTRON_WARNING: {
          console.log('👉 -> file: Layout.tsx:80 -> data:', data);
          dispatch(clearLoading());
          dispatch(setError({ error: true, type: 'warning', message: data }));
          // setTimeout(() => {
          //   dispatch(clearError());
          // }, 5000);
          break;
        }
        case ELECTRON_INFO: {
          console.log('👉 -> file: Layout.tsx:80 -> data:', data);
          dispatch(clearLoading());
          dispatch(setError({ error: true, type: 'info', message: data }));
          // setTimeout(() => {
          //   dispatch(clearError());
          // }, 5000);
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
      {loading ? (
        <Loader />
      ) : (

        <Loader />
      )}
    </>
  );
}
