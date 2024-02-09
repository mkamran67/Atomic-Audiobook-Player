
import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/Layout';
import ErrorPage from './components/pages/ErrorPage';
import Home from './components/pages/Home';
import Library from './components/pages/Library';
import Settings from './components/pages/Settings';
import Stats from './components/pages/Stats';
import Player from './components/player/Player';
import store from './store';

const router = createHashRouter([
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
        <Player />
      </Provider>
    </div>
  );
}

export default App;