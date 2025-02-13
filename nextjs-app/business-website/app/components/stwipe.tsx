import dayjs from "dayjs";
import { useAtom } from "jotai";
import {
  BadgeDollarSign,
  CreditCard,
  Loader2,
  LockIcon,
  LogIn,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderDetailsAtom } from "../atom.js";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Card {
  card_number: string;
  expiration_date: string;
  cvc: string;
}

interface PaymentInfo {
  cards: Card[];
}

interface OrderDetails {
  order: {
    guid: string;
    price: string;
    product_name: string;
    filename: string;
  };
}
export function Stwipe() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const [, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [orderDetails] = useAtom<OrderDetails | null>(orderDetailsAtom);

  useEffect(() => {
    const isValidCardNumber =
      cardNumber.length === 16 && /^\d+$/.test(cardNumber);
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(expiry);
    const isValidCVC = cvc.length === 3 && /^\d+$/.test(cvc);

    if (selectedCard !== "-1") {
      setIsFormValid(true);
    } else {
      setIsFormValid(isValidCardNumber && isValidExpiry && isValidCVC);
    }
    if (selectedCard === null) {
      setIsFormValid(isValidCardNumber && isValidExpiry && isValidCVC);
    }
  }, [cardNumber, expiry, cvc, selectedCard]);

  useEffect(() => {
    const token = session?.accessToken;
    const fetchPaymentInfo = async () => {
      // TODO: Why are we making this request here and not client side?
      try {
        const response = await fetch(`/api/payment-info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order information");
        }
        const data = await response.json();
        setPaymentInfo(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPaymentInfo();
  }, [session, status]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    if (value.length <= 2) {
      setExpiry(value);
      return;
    }

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) setCvc(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const fallbackSelectedCard: number = parseInt(selectedCard!) ?? 0;
    const submitData = {
      orderId: orderDetails?.order?.guid,
      amount: parseFloat(orderDetails?.order?.price as string),
      productName: orderDetails?.order?.product_name,
      fileName: orderDetails?.order?.filename,
      cardNumber:
        paymentInfo?.cards[fallbackSelectedCard]?.card_number || cardNumber,
      expiry:
        dayjs(paymentInfo?.cards[fallbackSelectedCard]?.expiration_date).format(
          "MM/YY",
        ) || expiry,
      cvc: paymentInfo?.cards[fallbackSelectedCard]?.cvc || cvc,
      email: session?.user?.email || null,
      saveCard: paymentInfo?.cards[fallbackSelectedCard] ? false : saveCard,
    };

    // TODO: Why are we making this request here and not client side?
    console.log("Submitting this data: ", JSON.stringify(submitData));
    try {
      const response = await fetch("/api/submit-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const result = await response.json();

      // TODO: Why are we making this request here and not client side?
      const ftpResponse = await fetch("/api/ftp-upload", {
        method: "POST",
        headers: {
          "Conent-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: orderDetails?.order?.filename,
          orderId: orderDetails?.order?.guid,
        }),
      });

      const ftpResult = await ftpResponse.json();

      console.log("Order submission result: ", result);
      console.log("FTP upload result: ", ftpResult);

      // TODO: This feels like the wrong was to add the query params
      router.push(
        `/thankyou?${new URLSearchParams(orderDetails?.order as Record<string, string>).toString()}`,
      );
    } catch (error) {
      console.error("Error submitting order:", error);
      setError("Unable to process payment, make sure fields are valid");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignIn = async () => {
    signIn("keycloak");
  };

  if (status === "loading") {
    return (
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center">
              <BadgeDollarSign className="mr-2 h-6 w-6 text-blue-400" />
              Stwipe Payment
            </span>
            <LockIcon className="h-5 w-5 text-green-400" />
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-gray-800 to-blue-900 shadow-xl border border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <BadgeDollarSign className="mr-2 h-6 w-6 text-blue-400" />
            Stwipe Payment
          </span>
          <LockIcon className="h-5 w-5 text-green-400" />
        </CardTitle>
        <div className="text-xs text-gray-400 mt-1">
          *Don&apos;t enter real card information
        </div>
      </CardHeader>
      <CardContent>
        {!session && (
          <div className="mb-6">
            <Button
              onClick={handleSignIn}
              className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <LogIn className="mr-2 h-4 w-4 text-white" /> Sign In
            </Button>
            <p className="text-center text-sm text-blue-200">
              or continue as guest
            </p>
          </div>
        )}

        {paymentInfo && (
          <div className="mb-6">
            <Label className="text-blue-100 mb-2 block">Select a card</Label>
            <RadioGroup
              value={selectedCard ?? undefined}
              onValueChange={setSelectedCard}
              className="space-y-3"
            >
              {paymentInfo.cards.length > 0 &&
                paymentInfo.cards.map((card, index) => (
                  <Label
                    key={index}
                    htmlFor={`card-${index}`}
                    className="flex items-center space-x-3 bg-gray-700/30 p-3 rounded-md cursor-pointer hover:bg-gray-600/30 transition-colors"
                  >
                    <RadioGroupItem
                      value={String(index)}
                      id={`card-${index}`}
                      className="border-blue-400 text-blue-400"
                    />
                    <CreditCard className="h-6 w-6 text-blue-400" />
                    <span className="text-blue-100 flex items-center">
                      Card ending in {card.card_number.slice(-4)}
                    </span>
                  </Label>
                ))}

              <Label
                htmlFor="new-card"
                className="flex items-center space-x-3 bg-gray-700/30 p-3 rounded-md cursor-pointer hover:bg-gray-600/30 transition-colors"
              >
                <RadioGroupItem
                  value={String(-1)}
                  id="new-card"
                  className="border-blue-400 text-blue-400"
                />
                <CreditCard className="h-6 w-6 text-blue-400" />
                <span className="text-blue-100">Use a new card</span>
              </Label>
            </RadioGroup>
          </div>
        )}
        {(!session || selectedCard === "-1") && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number" className="text-blue-100">
                  Card number
                </Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-blue-100">
                    Expiry date
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc" className="text-blue-100">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={handleCvcChange}
                    className="bg-gray-800/50 text-white placeholder:text-blue-200 border-blue-500/30 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              {session && selectedCard === "-1" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-card"
                    checked={saveCard}
                    onCheckedChange={(checked) =>
                      setSaveCard(checked as boolean)
                    }
                  />
                  <Label htmlFor="save-card" className="text-sm text-blue-100">
                    Save this card for future purchases
                  </Label>
                </div>
              )}
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"
          onClick={handleSubmit}
          disabled={
            !isFormValid || isLoading || (!!session && selectedCard === null)
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
        {error && (
          <div className="w-full p-2 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
