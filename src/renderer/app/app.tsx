import React from "react";
import Nav from "./components/Nav";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Player from "./components/rightside/Player";

const App = () => {
  return (
    <Router>
      <div className="w-screen h-screen bg-white app">
        <div className="flex w-full h-full">
          <div className="flex content-around justify-around py-2 mr-2 text-white bg-white">
            <Nav />
          </div>
          <div className="w-4/5 h-full bg-gray-600">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/library" component={Library} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </div>
          <div className="h-full bg-white flex-2">
            <Player />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
