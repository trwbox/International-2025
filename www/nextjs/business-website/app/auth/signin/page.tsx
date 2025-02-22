import { authOptions } from "@/utils/authOptions";
import Login from "@/app/components/login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Signin({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const error = (await searchParams).error
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/")
  }
  return (
    <div>
      {error && <div>
        {error}
      </div>}
      <Login />
    </div>
  )
}