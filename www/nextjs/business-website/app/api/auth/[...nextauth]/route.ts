import NextAuth from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

// Pretty sure these options came from this blog post
// https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-2-6f68406bb3b5


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, };
