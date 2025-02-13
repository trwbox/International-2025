import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Contact {
  id: number;
  email: string;
  inquiry_type: string;
  message: string;
  created_at: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, inquiryType, message } = body;

    if (!email || !inquiryType || !message) {
      return NextResponse.json(
        { error: "email, inquiryType, and message are required" },
        { status: 400 },
      );
    }

    // TODO: Original is commented out. This is vulnerable to SQL injection. Use parameterized queries.
    // const sqlQuery =
    //   "INSERT INTO contact (email, inquiry_type, message) VALUES ('" +
    //   email +
    //   "', '" +
    //   inquiryType +
    //   "', '" +
    //   message +
    //   "')";

    // const [result] = await pool.query<ResultSetHeader>(sqlQuery);


    // TODO: This should fix this injection, but needs to be tested
    // Create a prepared statement to prevent SQL injection
    const sqlQuery = "INSERT INTO contact (email, inquiry_type, message) VALUES (?, ?, ?)";
    
    // Make the prepared statement
    const [result] = await pool.query<ResultSetHeader>(sqlQuery, [email, inquiryType, message]);

    // TODO: Original is commented out. This is vulnerable to SQL injection. Use parameterized queries.
    // const [rows] = await pool.query<RowDataPacket[]>(
    //   "SELECT * FROM contact WHERE id = " + [result.insertId],
    // );

    // TODO: This should fix this injection, but needs to be tested
    const row_query = "SELECT * FROM contact WHERE id = ?";
    const [rows] = await pool.query<RowDataPacket[]>(row_query, [result.insertId]);

    return NextResponse.json(
      {
        message: "Contact entry created successfully",
        contact: rows[0] as Contact,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contact entry:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the contact entry" },
      { status: 500 },
    );
  }
}
