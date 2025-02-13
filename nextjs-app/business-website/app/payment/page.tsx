"use client";
import { useAtom } from "jotai";
import { Package, PrinterIcon as Printer3D, Truck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { orderDetailsAtom } from "../atom";
import { PaidOrderScreen } from "../components/paid-order-screen";
import { Stwipe } from "../components/stwipe";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface Order {
  paid: boolean;
  product_name: string;
  price: string;
}

export interface OrderData {
  order: Order;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setOrderDetails] = useAtom(orderDetailsAtom);
  const SERVICE_FEE = 7.25;

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderInfo = async () => {
      try {
        // TODO: Why are we doing this here? Should this be client side.
        const response = await fetch(`/api/order-info?orderId=${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order information");
        }
        const data = await response.json();
        setOrderData(data);
        setOrderDetails(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error has ocurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId, setOrderDetails]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  // Check if the order has already been paid
  if (orderData?.order?.paid) {
    return <PaidOrderScreen orderData={orderData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFhMjAzYSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIgc3Ryb2tlPSIjMmE0MjdmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxMCIgc3Ryb2tlPSIjM2E2M2JmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8bGluZSB4MT0iMzAiIHkxPSIwIiB4Mj0iMzAiIHkyPSI2MCIgc3Ryb2tlPSIjMmE0MjdmIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT4KPGxpbmUgeDE9IjAiIHkxPSIzMCIgeDI9IjYwIiB5Mj0iMzAiIHN0cm9rZT0iIzJhNDI3ZiIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+Cjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-white tracking-tight">
          Complete Your CyberPrint Order 🖨️
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">3D Model Name</span>
                    <span className="font-semibold">
                      {orderData?.order?.product_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Material Cost</span>
                    <span>${orderData?.order?.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service Fee</span>
                    <span>${SERVICE_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-blue-500/30">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">
                      $
                      {(
                        parseFloat(orderData!.order.price!) + SERVICE_FEE
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  What&apos;s Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-100">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Printer3D className="h-6 w-6 mr-3 text-blue-400" />
                    <span>
                      We&apos;ll start printing your 3D model with precision
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-6 w-6 mr-3 text-blue-400" />
                    <span>
                      Your printed model will be carefully inspected and
                      packaged
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-6 w-6 mr-3 text-blue-400" />
                    <span>
                      Express shipping to your doorstep (don&apos;t worry about
                      giving us your shipping information, we&apos;ll find you)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Stwipe />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Loading Your Order
        </h2>
        <p className="text-blue-200">
          Please wait while we fetch your order details...
        </p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-blue-200 mb-4">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
