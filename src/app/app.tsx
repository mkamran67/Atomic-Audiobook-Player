import React from "react";
import Nav from "./components/Nav";
import OpenFolder from "./components/OpenFolder";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Library from "./pages/Library";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import MediaController from "./components/MediaController";

const App = () => {
  return (
    <Router>
      <div className="app bg-darkest w-screen h-screen">
        <div className="h-full w-full grid grid-cols-12 grid-rows-6">
          <Nav />
          <MediaController />
          <div className=" bg-gray-600 w-full h-full col-span-10 row-span-5">
            <Switch>
              <Route exact path="/" component={Library} />
              <Route path="/search" component={Search} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
