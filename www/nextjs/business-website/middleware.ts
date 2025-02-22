// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import jwt from "jsonwebtoken";
import { withAuth } from "next-auth/middleware";
import * as jose from "jose";

const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER

function getKeys() {
  return fetch(`${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`, { //omitted headers to keep it clean
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("HTTP status " + response.status);
      }
      return response.json(); // or `.json()` or several others, see #4 above
  });
}

export default withAuth(
  async function middleware(req: NextRequest) {
    // console.log(req.nextUrl.pathname)
    // @ts-expect-error nextauth not recognized as an element of NextRequest
    const token = req.nextauth.token.accessToken; // Extract token after 'Bearer '

    try {
      const decodedToken = jwt.decode(token, { complete: true });
      // console.log(decodedToken?.payload)
      if (!decodedToken || typeof decodedToken === "string") {
        throw new Error("Invalid token format");
      }

      const { kid } = decodedToken.header;
      const keys = await getKeys()
      const key = keys.keys.find((key: { kid: string | undefined; }) => key.kid === kid)
      const publicKey = await jose.importJWK({
        kty: "RSA",
        n: key.n,
        e: key.e
      }, 'RS256')
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: process.env.KEYCLOAK_ISSUER,
        audience: "account",
      });

      if (req.nextUrl.pathname.startsWith("/api/payment-info") ) {
        // console.log("Request to payment-info")
      } else {
        if (payload.email !== "admin@cyberprint.com") {
          throw new Error("Invalid token format");
        }
      }

      // Token is valid, proceed with the request
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification error:", error);
      return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
  },
  {
    callbacks: {
      async authorized(req) {
        // console.log("TOKEN:")
        // console.log(req.token)
        
        const token = req.token?.accessToken; // Extract token after 'Bearer '

        try {
          if (!token || typeof token !== "string") { throw new Error("No token")}
          const decodedToken = jwt.decode(token, { complete: true });
          // console.log(decodedToken?.payload)
          if (!decodedToken || typeof decodedToken === "string") {
            throw new Error("Invalid token format");
          }
    
          const { kid } = decodedToken.header;
          const keys = await getKeys()
          const key = keys.keys.find((key: { kid: string | undefined; }) => key.kid === kid)
          const publicKey = await jose.importJWK({
            kty: "RSA",
            n: key.n,
            e: key.e
          }, 'RS256')
          const { payload } = await jwtVerify(token, publicKey, {
            issuer: process.env.KEYCLOAK_ISSUER,
            audience: "account",
          });
    
          // if (payload.email !== "admin@cyberprint.com") {
          //   throw new Error("Invalid token format");
          // }
    
          // Token is valid, proceed with the request
          return true;
        } catch (error) {
          console.error("Token verification error:", error);
          return false;
        }
        
        // if (req.token) return true
        // return false
      },
    },
  }
);

// Apply the middleware to specific paths
export const config = {
  matcher: ["/admin/:path*", "/api/server-flag/:path*", "/api/payment-info/:path*"], // Apply to all API routes
};
