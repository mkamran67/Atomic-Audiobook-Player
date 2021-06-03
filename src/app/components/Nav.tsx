import React from "react";
import { Link } from "react-router-dom";
function Nav() {
  return (
    <div className="bg-black text-white py-10 col-span-2 row-span-full h-full w-full content-around justify-around">
      <ul className="flex flex-col justify-center items-center">
        <li className="link-button mt-20">
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
