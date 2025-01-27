"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ServerFlagButton } from "../components/server-flag-button";
import jwt, { JwtPayload } from "jsonwebtoken";

export default function AdminPage() {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      try {
        const decoded = jwt.decode(session.accessToken) as JwtPayload | null;

        if (decoded!.email.toLowerCase() == "admin@cyberprint.com") {
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 text-white tracking-tight">
            Unauthorized Access
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzBmMTcyYSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8cGF0aCBkPSJNMzAgMTBMMTAgMzBMNDAgNTBMNjAgMzBMMzAgMTAiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/10 to-blue-300/10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-white tracking-tight">
          Admin Dashboard
        </h1>

        <div className="bg-blue-800 border border-blue-500 rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Random Flag:
          </h2>
          <div className="text-3xl font-mono bg-blue-900 text-white p-4 rounded-md break-all">
            {process.env.NEXT_PUBLIC_CLIENT_FLAG}
          </div>
        </div>

        <ServerFlagButton />
      </div>
    </div>
  );
}
