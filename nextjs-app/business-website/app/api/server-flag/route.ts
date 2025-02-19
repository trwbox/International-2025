import jwt, { JwtPayload } from "jsonwebtoken";

async function validateToken(token: string): Promise<string | null> {
  try {
    // TODO: This does not verify the token?
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token format");
    }
    const payload = decoded.payload as JwtPayload & { email?: string };

    if (!payload.email) {
      throw new Error("Email field not found in token");
    }

    return payload.email;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// TODO: This has broken authentication. It simply checks that there is a JWT token in the Authorization header.
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing or invalid" }),
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const userId = await validateToken(token);

    console.log("userId is: ", userId);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 403 },
      );
    }
    if (userId !== "admin@cyberprint.com") {
      return new Response(
        JSON.stringify({ error: "You are not authorized to access this" }),
        { status: 401 },
      );
    }

    return new Response(JSON.stringify({ flag: process.env.SERVER_FLAG }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
