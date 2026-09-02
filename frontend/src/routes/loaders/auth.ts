import { getAccessToken } from "@/lib/utils"
import { redirect, type LoaderFunction } from "react-router"

export const authLoader: LoaderFunction = () => {
  if (!getAccessToken()) return redirect("/app/login")

  return null
}
