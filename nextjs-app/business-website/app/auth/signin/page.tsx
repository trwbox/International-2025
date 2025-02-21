import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Login from "@/app/components/login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const signinErrors: Record<string | "default", string> = {
// ...
}

interface SignInPageProp {
  params: object
  searchParams: {
    callbackUrl: string
    error: string
  }
}

export default async function Signin({ searchParams: { error } }: SignInPageProp) {
  const error_sync = await error
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/")
  }
  return (
    <div>
      {error_sync && <div>
        {signinErrors[error_sync.toLowerCase()]}
      </div>}
      <Login />
    </div>
  )
}