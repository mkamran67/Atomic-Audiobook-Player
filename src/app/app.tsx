import React from "react";
import Nav from "./components/Nav";
import OpenFolder from "./components/OpenFolder";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import MediaController from "./components/MediaController";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <div className="w-screen h-screen app bg-darkest">
        <div className="flex w-full h-full">
          <Nav />
          <div className="w-full h-full bg-gray-600 ">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/library" component={Library} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </div>
          <MediaController />
        </div>
      </div>
    </Router>
  );
};

export default App;
