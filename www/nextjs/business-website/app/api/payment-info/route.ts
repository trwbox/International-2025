import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { RowDataPacket } from "mysql2";
import pool from "../../lib/pool";

let client: jwksClient.JwksClient;

//Gets the public key from the auth server to verify the JWT signature
async function getSigningKey(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err || !key) {
        return reject(err);
      }
      const signingKey = key.getPublicKey();
      resolve(signingKey);
    });
  });
}

async function validateToken(token: string): Promise<string | null> {
  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === "string") {
      throw new Error("Invalid token format");
    }

    const { kid } = decodedHeader.header;
    const { iss } = decodedHeader.payload as JwtPayload;
    client = jwksClient({ jwksUri: `${iss}/protocol/openid-connect/certs` });
    const publicKey = await getSigningKey(kid!);

    const decoded = jwt.verify(token, publicKey) as JwtPayload;

    return decoded.email as string;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    // TODO: This feels broken. Likely should be using some better middleware thing?
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing or invalid" }),
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const userId = await validateToken(token);

    console.log("Token received: ", token);
    console.log("userId found from token: ", userId);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 403 },
      );
    }

    // TODO: I do not like how this is done.
    // Query to get the card info associated with the user
    const [rows] = await pool.query(
      `
  SELECT 
    cards.card_number,
    cards.expiration_date,
    cards.cvc
  FROM 
    cards
  JOIN 
    user_cards ON cards.id = user_cards.card_id
  WHERE 
    user_cards.email = ?
  `,
      [userId],
    );
  
    const cardRows = rows as RowDataPacket[];
    return new Response(
      JSON.stringify({ cards: cardRows.length > 0 ? rows : [] }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
