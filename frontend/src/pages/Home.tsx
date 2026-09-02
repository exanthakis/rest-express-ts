import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { User } from "@/types"
import { useLoaderData } from "react-router"

export const Home = () => {
  const { user } = useLoaderData<{ user: User }>()
  console.log(user)

  return (
    <div className="flex h-screen w-screen items-center">
      <Card className="mx-auto w-full max-w-xs">
        <CardHeader className="flex items-start gap-4">
          <Avatar size="lg">
            <AvatarImage src={user?.photo?.url} />
            <AvatarFallback>{user?.name?.first?.at(0)}</AvatarFallback>
          </Avatar>

          <div>
            <CardTitle>{user?.name?.first + " " + user?.name?.last}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>

        <CardFooter>
          <Button variant="destructive" className="mx-auto">
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
