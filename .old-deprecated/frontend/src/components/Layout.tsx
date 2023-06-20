import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Bars3BottomLeftIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../store";
import { ResponseFromElectronType } from "../types/library.types";
import { setError } from "./LayoutSlice";
import { setBooks } from "./library/booksSlice";
import Loader from "./loader/Loader";
import { clearLoading } from "./loader/loaderSlice";
import { setCurrentBook } from "./player/playerSlice";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Library", href: "/library", icon: BuildingLibraryIcon },
  { name: "Folders", href: "/folders", icon: FolderIcon },
  { name: "Stats", href: "/stats", icon: CalendarIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loading = useSelector((state: RootState) => state.loader);
  const dispatch = useDispatch();
  const location = useLocation(); // Used for sidebar active selection

  useEffect(() => {
    // Ask Electron to reload library if it exists
    window.api.send("requestToElectron", { type: "getAllBooksSimplified", payload: null });

    // Request settings/history information from Electron
    window.api.send("requestToElectron", { type: "getSettings", payload: null });

    // Recieve library information from Electron
    window.api.receive("responseFromElectron", (res: ResponseFromElectronType) => {
      const { type, data } = res;

      switch (type) {
        case "bookData": {
          dispatch(setBooks(data));
          dispatch(clearLoading());
          break;
        }
        case "settingsData": {
          console.log("👉 -> file: Layout.tsx:61 -> data:", data);
          break;
        }
        case "bookDetails": {
          dispatch(setCurrentBook(data));
          break;
        }
        case "error_type": {
          console.log("👉 -> file: Layout.tsx:70 -> data:", data);
          dispatch(clearLoading());
          dispatch(setError(data));
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
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white dark:bg-gray-900">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 right-0 pt-2 -mr-12">
                        <button
                          type="button"
                          className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex items-center flex-shrink-0 px-4">
                      <img
                        className="w-auto h-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </div>
                    <div className="flex-1 h-0 mt-5 overflow-y-auto">
                      <nav className="px-2 space-y-1">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              location.pathname === item.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                location.pathname === item.href
                                  ? "text-gray-500"
                                  : "text-gray-400 group-hover:text-gray-500",
                                "mr-4 flex-shrink-0 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
                <div className="flex-shrink-0 w-14" aria-hidden="true">
                  {/* Dummy element to force sidebar to shrink to fit close icon */}
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
              <div className="flex flex-col flex-grow mt-5">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          location.pathname === item.href ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
                          "mr-3 flex-shrink-0 h-6 w-6"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 md:pl-64">
            <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white">
              <button
                type="button"
                className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="w-6 h-6" aria-hidden="true" />
              </button>
              <div className="flex justify-between flex-1 px-2 ">
                <div className="flex flex-1">
                  <form className="flex w-full">
                    <label htmlFor="search-field" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="absolute inset-y-0 flex items-center pointer-events-none left-4">
                        <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <input
                        id="search-field"
                        className="block w-full h-full py-2 pl-12 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder="Search Books or press Ctrl + K"
                        type="search"
                        name="search"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <main className="flex-1">
              <div className="p-2 bg-white border-t dark:bg-gray-900 border-t-gray-100">
                <div>
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
