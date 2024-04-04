import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    // token which was got created after signup === verifyToken
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      verfiyTokenExpiry: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid Token",
        },
        {
          status: 400,
        }
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verfiyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message: "Email verified successfully",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
