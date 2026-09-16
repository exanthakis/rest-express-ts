import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { endpoints } from "@/config"
import type { User } from "@/types"
import axios from "axios"
import { useLoaderData, useNavigate } from "react-router"

export const Home = () => {
  const { user } = useLoaderData<{ user: User }>()
  const navigate = useNavigate()

  console.log(user)

  const handleLogout = async () => {
    try {
      await axios.post(
        endpoints.logout,
        {},
        {
          withCredentials: true,
        }
      )

      navigate("/app/login", { replace: true })
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center">
      <Card className="mx-auto w-full max-w-xs">
        <CardHeader className="flex items-start gap-4">
          <Avatar size="lg">
            <AvatarImage
              src={user?.photo?.url}
              alt={`${user?.name?.first} ${user?.name?.last}`}
              onError={(event) => {
                console.error("Failed to load avatar:", user?.photo?.url)
                console.error("Image error:", event)
              }}
            />
            <AvatarFallback>{user?.name?.first?.at(0)}</AvatarFallback>
          </Avatar>

          <div>
            <CardTitle>{user?.name?.first + " " + user?.name?.last}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>

        <CardFooter>
          <Button
            variant="destructive"
            className="mx-auto"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
