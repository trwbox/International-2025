// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useSession } from "next-auth/react";
import { jwtVerify } from 'jose';
import jwksClient from 'jwks-rsa';
import jwt, { JwtPayload } from "jsonwebtoken";

export async function middleware(request: NextRequest) {
    const { data: session } = useSession();

    const token = session?.accessToken; // Extract token after 'Bearer '
  
    try {
        const decodedToken = jwt.decode(token, { complete: true });
        if (!decodedToken || typeof decodedToken === "string") {
            throw new Error("Invalid token format");
        }
      
        const { kid } = decodedToken.header;
        const { iss } = decodedToken.payload as JwtPayload;
        const client = jwksClient({ jwksUri: `${iss}/protocol/openid-connect/certs` });
        const key = await client.getSigningKey(kid!);
        const { payload } = await jwtVerify(token, key.getPublicKey(), {
          issuer: process.env.KEYCLOAK_ISSUER, // Replace with your Keycloak issuer URL
          audience: process.env.KEYCLOAK_CLIENT_ID, // Replace with your Keycloak client ID
        });
        
        if (payload.email.toLowerCase() != "admin@cyberprint.com") {
            throw new Error("Invalid token format")
        }
    
        // Token is valid, proceed with the request
        return NextResponse.next();
    } catch (error) {
        console.error('Token verification error:', error);
        return new NextResponse(
        JSON.stringify({ message: 'Invalid token' }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        );
    }
}

// Apply the middleware to specific paths
export const config = {
  matcher: ['/admin/:path*', '/server-flag/:path*'], // Apply to all API routes
};