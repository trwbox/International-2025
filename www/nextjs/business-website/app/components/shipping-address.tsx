import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MapPin } from "lucide-react";

export function ShippingAddress() {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  return (
    <Card className="w-full bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <MapPin className="mr-2 h-6 w-6 text-blue-400" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street" className="text-blue-100">
            Street Address
          </Label>
          <Input
            id="street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-blue-100">
              City
            </Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-blue-100">
              State
            </Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-blue-100">
              ZIP Code
            </Label>
            <Input
              id="zipCode"
              value={address.zipCode}
              onChange={(e) =>
                setAddress({ ...address, zipCode: e.target.value })
              }
              className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="text-blue-100">
              Country
            </Label>
            <Input
              id="country"
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
              className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
