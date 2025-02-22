"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "../components/ui/button";

// TODO: This feels like the request should happen client side?
// Why are we doing this weird double fetch?
export function ServerFlagButton() {
  const [serverFlag, setServerFlag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const fetchServerFlag = async () => {
    setIsLoading(true);
    setError(null);
    const token = session?.accessToken;

    console.log("Fetching with this token: ", token);
    if (!token) {
      setError("No token found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/server-flag", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch server flag");
      }

      const data = await response.json();
      setServerFlag(data.flag);
    } catch (error) {
      console.error("Failed to fetch server flag:", error);
      setError("ACCESS DENIED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Button
        onClick={fetchServerFlag}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        {isLoading ? "Fetching..." : "Get Server-Side Flag"}
      </Button>
      {serverFlag && !error && (
        <div className="mt-8 p-4 bg-blue-700 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-white mb-2">
            Server-Side Flag:
          </h3>
          <p className="text-2xl font-mono text-blue-200 break-all">
            {serverFlag}
          </p>
        </div>
      )}
      {error && (
        <div className="mt-8 p-4 bg-red-900 rounded-lg shadow-inner overflow-hidden">
          <h3 className="text-xl font-semibold text-white mb-2">Error:</h3>
          <p
            className="text-4xl font-mono text-red-500 glitch"
            data-text={error}
          >
            {error}
          </p>
        </div>
      )}
      <style jsx>{`
        @keyframes glitch-anim-1 {
          0% {
            clip: rect(30px, 9999px, 10px, 0);
            transform: skew(0.65deg);
          }
          5% {
            clip: rect(49px, 9999px, 98px, 0);
            transform: skew(0.23deg);
          }
          10% {
            clip: rect(88px, 9999px, 18px, 0);
            transform: skew(0.06deg);
          }
          15% {
            clip: rect(96px, 9999px, 72px, 0);
            transform: skew(0.66deg);
          }
          20% {
            clip: rect(63px, 9999px, 62px, 0);
            transform: skew(0.63deg);
          }
          25% {
            clip: rect(35px, 9999px, 25px, 0);
            transform: skew(0.17deg);
          }
          30% {
            clip: rect(40px, 9999px, 53px, 0);
            transform: skew(0.71deg);
          }
          35% {
            clip: rect(52px, 9999px, 32px, 0);
            transform: skew(0.35deg);
          }
          40% {
            clip: rect(80px, 9999px, 76px, 0);
            transform: skew(0.98deg);
          }
          45% {
            clip: rect(20px, 9999px, 23px, 0);
            transform: skew(0.12deg);
          }
          50% {
            clip: rect(39px, 9999px, 8px, 0);
            transform: skew(0.05deg);
          }
          55% {
            clip: rect(76px, 9999px, 48px, 0);
            transform: skew(0.14deg);
          }
          60% {
            clip: rect(11px, 9999px, 90px, 0);
            transform: skew(0.33deg);
          }
          65% {
            clip: rect(41px, 9999px, 43px, 0);
            transform: skew(0.02deg);
          }
          70% {
            clip: rect(19px, 9999px, 99px, 0);
            transform: skew(0.61deg);
          }
          75% {
            clip: rect(85px, 9999px, 96px, 0);
            transform: skew(0.92deg);
          }
          80% {
            clip: rect(68px, 9999px, 88px, 0);
            transform: skew(0.28deg);
          }
          85% {
            clip: rect(19px, 9999px, 66px, 0);
            transform: skew(0.62deg);
          }
          90% {
            clip: rect(94px, 9999px, 68px, 0);
            transform: skew(0.1deg);
          }
          95% {
            clip: rect(100px, 9999px, 43px, 0);
            transform: skew(0.01deg);
          }
          100% {
            clip: rect(33px, 9999px, 73px, 0);
            transform: skew(0.09deg);
          }
        }

        @keyframes glitch-anim-2 {
          0% {
            clip: rect(76px, 9999px, 31px, 0);
            transform: skew(0.05deg);
          }
          5% {
            clip: rect(37px, 9999px, 98px, 0);
            transform: skew(0.05deg);
          }
          10% {
            clip: rect(10px, 9999px, 96px, 0);
            transform: skew(0.86deg);
          }
          15% {
            clip: rect(65px, 9999px, 59px, 0);
            transform: skew(0.13deg);
          }
          20% {
            clip: rect(68px, 9999px, 44px, 0);
            transform: skew(0.2deg);
          }
          25% {
            clip: rect(100px, 9999px, 91px, 0);
            transform: skew(0.2deg);
          }
          30% {
            clip: rect(60px, 9999px, 37px, 0);
            transform: skew(0.09deg);
          }
          35% {
            clip: rect(95px, 9999px, 43px, 0);
            transform: skew(0.42deg);
          }
          40% {
            clip: rect(91px, 9999px, 6px, 0);
            transform: skew(0.84deg);
          }
          45% {
            clip: rect(44px, 9999px, 78px, 0);
            transform: skew(0.14deg);
          }
          50% {
            clip: rect(96px, 9999px, 2px, 0);
            transform: skew(0.12deg);
          }
          55% {
            clip: rect(66px, 9999px, 90px, 0);
            transform: skew(0.09deg);
          }
          60% {
            clip: rect(57px, 9999px, 18px, 0);
            transform: skew(0.08deg);
          }
          65% {
            clip: rect(3px, 9999px, 94px, 0);
            transform: skew(0.44deg);
          }
          70% {
            clip: rect(57px, 9999px, 92px, 0);
            transform: skew(0.46deg);
          }
          75% {
            clip: rect(30px, 9999px, 49px, 0);
            transform: skew(0.19deg);
          }
          80% {
            clip: rect(76px, 9999px, 67px, 0);
            transform: skew(0.86deg);
          }
          85% {
            clip: rect(85px, 9999px, 64px, 0);
            transform: skew(0.25deg);
          }
          90% {
            clip: rect(12px, 9999px, 86px, 0);
            transform: skew(0.94deg);
          }
          95% {
            clip: rect(7px, 9999px, 71px, 0);
            transform: skew(0.67deg);
          }
          100% {
            clip: rect(21px, 9999px, 35px, 0);
            transform: skew(0.99deg);
          }
        }

        .glitch {
          position: relative;
          animation: glitch-skew 1s infinite linear alternate-reverse;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch::before {
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim-1 5s infinite linear alternate-reverse;
        }
        .glitch::after {
          left: -2px;
          text-shadow:
            -2px 0 #00fff9,
            2px 2px #ff00c1;
          animation: glitch-anim-2 1s infinite linear alternate-reverse;
        }
      `}</style>
    </div>
  );
}
