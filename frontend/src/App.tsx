// Modules / Dependencies
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Local imports
import store from "./store";
import Layout from "./components/Layout";
import ErrorPage from "./components/pages/ErrorPage";
import Home from "./components/pages/Home";
import Library from "./components/pages/Library";
import Folders from "./components/pages/Folders";
import Stats from "./components/pages/Stats";
import Settings from "./components/pages/Settings";
// import { MainResponseType } from "./types/library.types";

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
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
