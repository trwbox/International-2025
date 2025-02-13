import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// TODO: Is this the right way to extend the Session and Token types?
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    user?: Record<string, unknown>;
  }

  interface Token extends JWT {
    accessToken?: string;
    error?: string;
    decoded?: Record<string, unknown>;
  }
}
