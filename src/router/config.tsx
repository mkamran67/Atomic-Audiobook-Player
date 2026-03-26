import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Library from "../pages/library/page";
import Settings from "../pages/settings/page";
import Bookmarks from "../pages/bookmarks/page";
import Collections from "../pages/collections/page";
import BulkEdit from "../pages/bulk-edit/page";

const routes: RouteObject[] = [
  { path: "/",            element: <Home />        },
  { path: "/library",     element: <Library />     },
  { path: "/settings",    element: <Settings />    },
  { path: "/bookmarks",   element: <Bookmarks />   },
  { path: "/collections", element: <Collections /> },
  { path: "/bulk-edit",   element: <BulkEdit />    },
  { path: "*",            element: <NotFound />    },
];

export default routes;
