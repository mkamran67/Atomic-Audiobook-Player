import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Layout from "./components/Layout";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import ErrorPage from "./components/pages/ErrorPage";
import Home from "./components/pages/Home";
import Library from "./components/pages/Library";
import Folders from "./components/pages/Folders";
import Stats from "./components/pages/Stats";
import Settings from "./components/pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/library",
        element: <Library />,
      },
      {
        path: "/folders",
        element: <Folders />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
