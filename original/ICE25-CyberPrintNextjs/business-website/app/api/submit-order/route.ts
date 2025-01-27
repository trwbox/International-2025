import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "../../lib/pool";

const orderSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date"),
  //  cvc: z.string().regex(/^\d{3}$/, "Invalid CVC"),
  cvc: z.string(),
  saveCard: z.boolean(),
  orderId: z.string(),
  amount: z.any(),
  productName: z.string(),
  fileName: z.string(),
  email: z.string().email().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    orderSchema.parse(body);

    const { cardNumber, expiry, cvc, saveCard, orderId, email } = body;
    console.log("Request received, listing data below: ");
    console.log("card number: ", cardNumber);
    console.log("expiry: ", expiry);
    console.log("cvc: ", cvc);
    console.log("save card: ", saveCard);
    console.log("orderId: ", orderId);
    console.log("email: ", email);

    const [month, year] = expiry.split("/").map(Number);
    const formattedExpiry = new Date(`20${year}-${month}-01`)
      .toISOString()
      .split("T")[0]; // YYYY-MM-DD

    const [updateResult] = await pool.query<ResultSetHeader>(
      "UPDATE orders SET paid = TRUE WHERE guid = ?",
      [orderId],
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 406 });
    }

    if (saveCard) {
      console.log("Save card chosen. Checking if card exists... ");
      const [existingCard] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM cards WHERE card_number = ? AND expiration_date = ? AND cvc = ?",
        [cardNumber, formattedExpiry, cvc],
      );
      console.log("Existing card query result: ", existingCard);

      let cardId: number;

      if (existingCard.length > 0) {
        cardId = existingCard[0].id;
        console.log("Existing card  was found");
      } else {
        console.log("Existing card not found, adding this new card...");
        const [insertResult] = await pool.query<ResultSetHeader>(
          "INSERT INTO cards (card_number, expiration_date, cvc) VALUES ('" +
            cardNumber +
            "', '" +
            formattedExpiry +
            "', '" +
            cvc +
            "')",
        );
        cardId = insertResult.insertId;
      }

      console.log("Now mapping cardId: ", cardId);
      console.log("Now mapping email: ", email);
      const [mappingResult] = await pool.query<ResultSetHeader>(
        "INSERT INTO user_cards (email, card_id) VALUES (?, ?)",
        [email, cardId],
      );

      if (mappingResult.affectedRows > 0) {
        console.log(`Card mapped to email: ${email}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 403 },
      );
    }

    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 503 },
    );
  }
}
