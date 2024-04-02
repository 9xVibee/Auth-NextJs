import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bycrypt from "bcrypt";
import { sendEmail } from "@/helpers/mailer";

connectDb();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();

    const { username, email, password } = reqBody;

    console.log(reqBody);

    // checking if user already exist
    const isExist = await User.findOne({
      email,
    });

    if (isExist)
      return NextResponse.json(
        {
          error: "User already exists",
        },
        {
          status: 500,
        }
      );

    const salt = await bycrypt.genSalt(10);
    const hashPassword = await bycrypt.hash(password, salt);

    const user = new User({
      email,
      username,
      password: hashPassword,
    });

    const savedUser = await user.save();
    console.log(savedUser);

    // send verification email
    await sendEmail({
      email: email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message,
      },
      {
        status: 500,
      }
    );
  }
}
