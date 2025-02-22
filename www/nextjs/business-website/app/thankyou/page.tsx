"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Printer, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("guid");
  // TODO: If we are taking in the guid why are we taking in the price as well? We should pull it from the database.
  const amount = parseFloat(searchParams.get("price") as string) + 7.25;
  const name = searchParams.get("product_name");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* 3D Printing themed background */}
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#4A5568"
                  strokeWidth="1"
                />
              </pattern>
              <pattern
                id="3d-cube"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0 L80 20 L40 40 L0 20 Z"
                  fill="#4299E1"
                  fillOpacity="0.2"
                />
                <path
                  d="M0 20 L40 40 L40 80 L0 60 Z"
                  fill="#2B6CB0"
                  fillOpacity="0.2"
                />
                <path
                  d="M40 40 L80 20 L80 60 L40 80 Z"
                  fill="#2C5282"
                  fillOpacity="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#3d-cube)" />
          </svg>
        </div>

        {/* Moving 3D printer extruder */}
        <div className="absolute top-0 left-0 w-full h-16 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-12 h-12 animate-printer-head"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L12 6M12 22L12 18M7 3.5L17 3.5L19 7.5L5 7.5L7 3.5Z"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="5"
              y="7.5"
              width="14"
              height="10.5"
              rx="1"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            <path d="M10 18L14 18L13 22L11 22L10 18Z" fill="#60A5FA" />
            <circle cx="12" cy="13" r="2" fill="#60A5FA" />
          </svg>
        </div>

        <Card className="w-full max-w-md bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20 relative z-10">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-white text-2xl">
              <CheckCircle className="mr-2 h-8 w-8 text-green-400" />
              Thank You for Your Order!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4 text-blue-100">
              <p>Your 3D printing order has been successfully placed.</p>
              <div className="bg-blue-900/50 p-4 rounded-md">
                <p className="font-semibold">Order Details:</p>
                <p>Order ID: {orderId}</p>
                <p>Amount: ${amount}</p>
                <p>TODO: This should be checked for XSS</p>
                <p>Item name: {name}</p>
              </div>
              <p>We&apos;ll start processing your order right away!</p>
              <div className="pt-4">
                <Link href="/" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Printer className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <style jsx global>{`
          @keyframes move-printer-head {
            0%,
            100% {
              transform: translateX(0);
            }
            10% {
              transform: translateX(20vw);
            }
            25% {
              transform: translateX(5vw);
            }
            40% {
              transform: translateX(60vw);
            }
            60% {
              transform: translateX(40vw);
            }
            75% {
              transform: translateX(80vw);
            }
            90% {
              transform: translateX(30vw);
            }
          }
          .animate-printer-head {
            animation: move-printer-head 15s ease-in-out infinite;
          }
        `}</style>
      </div>
    </Suspense>
  );
}
