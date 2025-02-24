"use client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrinterIcon as Printer3d } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import federatedLogout from "../lib/federatedLogout";
export default function Header() {
  const { data: session } = useSession();
  // TODO: Why is this in the header?
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (session?.accessToken) {
      try {
        // TODO: This feels like the wrong way to do this and it needs to be verified.
        const decoded = jwt.decode(session.accessToken) as JwtPayload | null;

        // TODO: I dislike the usage of the raw email. I think this could be a role?
        if (decoded!.email === "admin@cyberprint.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [session]);
  return (
    <header className="bg-gray-800 text-white shadow-lg border-b border-blue-500">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Printer3d size={32} className="text-blue-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            CyberPrint
          </span>
        </Link>
        <nav>
          <ul className="flex gap-6 text-lg">
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="hover:text-blue-400 transition duration-300"
                >
                  Admin
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/"
                className="hover:text-blue-400 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/print"
                className="hover:text-blue-400 transition duration-300"
              >
                Print
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-400 transition duration-300"
              >
                Contact
              </Link>
            </li>
            <li>
              <button
                className="hover:text-blue-400 transition duration-300"
                onClick={() =>
                  session ? federatedLogout() : signIn("keycloak")
                }
              >
                {session ? "Sign out" : "Sign in"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
