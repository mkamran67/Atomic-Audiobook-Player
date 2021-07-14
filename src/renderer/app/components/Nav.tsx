import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  SearchIcon,
  CogIcon,
  StarIcon,
} from "@heroicons/react/outline";

function Nav() {
  return (
    <div className="h-full bg-indigo-400 rounded-tr-2xl rounded-br-2xl">
      <ul className="flex flex-col items-center justify-start h-full">
        <li className="mt-12 mb-4">
          <Link to="/">
            <BookOpenIcon className="link-button " />
          </Link>
        </li>
        <li className="my-4">
          <Link to="/Search">
            <SearchIcon className="link-button " />
          </Link>
        </li>
        <li className="my-4">
          <Link to="/settings">
            <CogIcon className="link-button " />
          </Link>
        </li>
        <li className="my-4">
          <Link to="/favorites">
            <StarIcon className="link-button " />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
