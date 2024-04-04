import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log(email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isValidPassword = await bycrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: "Not valid password",
        },
        {
          status: 400,
        }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        {
          error: "Email not verfied",
        },
        {
          status: 400,
        }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const res = NextResponse.json({
      message: "Login successfull",
      success: true,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
