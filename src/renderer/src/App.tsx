
import { Provider } from 'react-redux';
import { createHashRouter, createMemoryRouter, HashRouter, Route, RouterProvider, Routes } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ErrorPage from './components/pages/ErrorPage';
import Home from './components/pages/Home';
import Library from './components/pages/Library';
import Settings from './components/pages/Settings';
import Stats from './components/pages/Stats';
import Player from './components/player/Player';
import store from './state/store';
import Loader from './components/loader/Loader';


const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: Loader,
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

function App(): JSX.Element {
  return (
    <div className="App">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
