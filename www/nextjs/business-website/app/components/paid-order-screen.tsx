import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { OrderData } from "../payment/page";

export function PaidOrderScreen({ orderData }: { orderData: OrderData }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFhMjAzYSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIgc3Ryb2tlPSIjMmE0MjdmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxMCIgc3Ryb2tlPSIjM2E2M2JmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPjwvY2lyY2xlPgo8bGluZSB4MT0iMzAiIHkxPSIwIiB4Mj0iMzAiIHkyPSI2MCIgc3Ryb2tlPSIjMmE0MjdmIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT4KPGxpbmUgeDE9IjAiIHkxPSIzMCIgeDI9IjYwIiB5Mj0iMzAiIHN0cm9rZT0iIzJhNDI3ZiIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+Cjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
            Order Already Paid
          </h1>
          <p className="text-xl text-blue-200">
            Thank you for your purchase! Your order has been successfully
            processed.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">3D Model Name</span>
                <span className="font-semibold">
                  {orderData.order.product_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Paid</span>
                <span>${orderData.order.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
