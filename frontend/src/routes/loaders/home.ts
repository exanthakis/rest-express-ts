import { endpoints } from "@/config"
import { getAccessToken } from "@/lib/utils"
import type { User } from "@/types"
import axios from "axios"
import { redirect, type LoaderFunction } from "react-router"

export const homeLoader: LoaderFunction = async () => {
  try {
    const response = await axios.get<User>(endpoints.profile, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    console.log(response.data)

    return { user: response.data }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401)
      return redirect("/app/login")
  }
}
