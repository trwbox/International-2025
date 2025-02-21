import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Logout from "@/app/components/logout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignoutPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div>
        <div>Signout</div>
        <div>Are you sure you want to sign out?</div>
        <div>
          <Logout />
        </div>
      </div>
    )
  }
  return redirect("/api/auth/signin")
}