import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

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
