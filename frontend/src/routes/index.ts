import { Login } from "@/pages/Login"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/app/login",
    Component: Login,
  },
])
