import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cookies = {
  sessionToken: {
    name: `next-auth.session-token.0`,
    options: {
      httpOnly: !!0,
      sameSite: "lax",
      path: "/",
      secure: !!0,
    },
  },
};
