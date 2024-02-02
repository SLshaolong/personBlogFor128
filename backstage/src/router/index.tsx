import { Navigate, useRoutes } from "react-router-dom";
import App from "../App";
import { lazy, Suspense } from "react";
import HomeView from "../views/Home";
const BlogView = lazy(() => import("../views/Blogs"));
export default function index() {
  const routes = useRoutes([
    {
      path: "/",

      element: <App />,

      children: [
        {
            path:'/',
            index: true,
            element:<Navigate to="/setting" replace />
        },
        {
          path: "/setting",
          
          element: <HomeView />,
        },
        {
          path: "/blogs",
          element: (
            <Suspense fallback="loading">
              <BlogView />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return routes;
}
