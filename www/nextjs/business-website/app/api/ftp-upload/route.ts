// import { Client } from "basic-ftp";
import { FieldPacket, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import pool from "../../lib/pool";
// @ts-expect-error - This package does not have types
import { Client } from "ssh2-sftp-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if ( !orderId ) {
      return NextResponse.json(
        { message: "orderId is required in the request body" },
        { status: 400 },
      );
    }

    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM orders WHERE guid = ?",
      [orderId],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!rows[0].paid) {
      return NextResponse.json(
        {
          message: "Order has not been paid for",
          error: "Order has not been paid for",
        },
        { status: 402 },
      );
    }

    // Create the filename for the STL file
    const fileName = `${orderId}.stl`;
    console.log("Filename for FTP upload: ", fileName);

    const localDirectory = process.env.FTP_LOCAL_DIR;
    const remoteDirectory = process.env.FTP_REMOTE_DIR;

    console.log("Local path of FTP file: ", `${localDirectory}/${fileName}`);
    console.log("Remote path of FTP file: ", `${remoteDirectory}/${fileName}`);

    const config = {
      host: process.env.FTP_HOST,
      port: process.env.FTP_PORT,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    }

    const sftp = new Client('main-client');




    // TODO: We should probably do a basename on the file just to be safe.
    const localFilePath = `${localDirectory}/${fileName}`;

    sftp.ftp.verbose = true;

    await sftp.connect(config);

    await sftp.put(localFilePath, `${remoteDirectory}/${fileName}`);

    await sftp.end();

    return NextResponse.json({ message: "File uploaded successfully" });

    // try {
    //   await client.access({
    //     host: process.env.FTP_HOST,
    //     user: process.env.FTP_USER,
    //     password: process.env.FTP_PASSWORD,
    //     secure: false,
    //   });

    //   await client.cd(remoteDirectory as string);

    //   await client.uploadFrom(localFilePath, fileName);

    //   return NextResponse.json({ message: "File uploaded successfully" });
    // } catch (error) {
    //   if (error instanceof Error) {
    //     return NextResponse.json(
    //       { message: "Failed to upload file.", error: error.message },
    //       { status: 500 },
    //     );
    //   } else {
    //     return NextResponse.json(
    //       {
    //         message: "Failed to upload file.",
    //         error: "Unknown error occurred.",
    //       },
    //       { status: 500 },
    //     );
    //   }
    // } finally {
    //   client.close();
    // }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Invalid request body", error: error.message },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { message: "Invalid request body", error: "Unknown error occurred." },
        { status: 400 },
      );
    }
  }
}
