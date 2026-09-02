import { Login } from "@/pages/Login"
import { createBrowserRouter } from "react-router"
import { authLoader } from "@/routes/loaders/auth"
import { Home } from "@/pages/Home"
import { homeLoader } from "./loaders/home"

export const router = createBrowserRouter([
  {
    path: "/app/login",
    Component: Login,
  },
  {
    path: "/app",
    loader: authLoader,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      },
    ],
  },
])
