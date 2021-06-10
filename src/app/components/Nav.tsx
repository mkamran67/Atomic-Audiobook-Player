import React from "react";
import { Link } from "react-router-dom";
function Nav() {
  return (
    <div className="content-around justify-around w-full h-full py-10 text-white bg-black row-span-full">
      <ul className="flex flex-col items-center justify-center">
        <li className="mt-20 link-button">
          <Link to="/">My Library</Link>
        </li>
        <li className="link-button">
          <Link to="/Search">Search</Link>
        </li>
        <li className="link-button">
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
