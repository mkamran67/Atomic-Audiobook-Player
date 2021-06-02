import React from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/solid";
import Home from "../pages/Home";
function Nav() {
  return (
    <Router>
      <div>
        <Link to="/">
          <MenuIcon className="h-5 w-5 text-blue-500" />
        </Link>
      </div>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/library">Library</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </div>
    </Router>
  );
}

export default Nav;
