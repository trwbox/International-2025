import { FieldPacket, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import pool from "../../lib/pool";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderGuid = searchParams.get("orderId");
    if (!orderGuid) {
      return NextResponse.json(
        { error: "Order GUID is required" },
        { status: 400 },
      );
    }

    console.log("Selecting * from the following order: ", orderGuid);
    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM orders WHERE guid = ?",
      [orderGuid],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Order retrieved successfully",
        order: {
          ...rows[0],
          price: parseFloat(rows[0].price).toFixed(2),
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error fetching order info:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//Some function to generate a price based on file size, not too important
const calculatePrice = (fileSize: number): number => {
  const fileSizeDigits = fileSize.toString().length;

  let price: number;

  if (fileSizeDigits <= 5) {
    price = Math.random() * (15 - 5) + 5;
  } else if (fileSizeDigits === 6) {
    price = Math.random() * (25 - 15) + 15;
  } else {
    price = Math.random() * (50 - 25) + 25;
  }

  return price;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const { creationName, fileSize, fileName } = body;

    if (!creationName || !fileSize || !fileName) {
      return NextResponse.json(
        { error: "creationName, fileSize, and fileName are required" },
        { status: 400 },
      );
    }

    const price = calculatePrice(fileSize);

    const guid = uuidv4();
    // TODO: Check that this uuid is unique in the database

    console.log("In POST order-info");
    console.log("GUID/orderId: ", guid);
    console.log("Price: ", price);
    console.log("creationName: ", creationName);
    console.log("filesize: ", fileSize);
    console.log("filename: ", fileName);

    await pool.query(
      "INSERT INTO orders (guid, price, product_name, created_at, filesize, filename, paid) VALUES (?, ?, ?, NOW(), ?, ?, FALSE)",
      [guid, price, creationName, fileSize, fileName],
    );

    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM orders WHERE guid = ?",
      [guid],
    );

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          ...rows[0],
          price: parseFloat(rows[0].price).toFixed(2),
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
