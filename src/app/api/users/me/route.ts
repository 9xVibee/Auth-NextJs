import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDb();

export async function POST(req: NextRequest) {
  try {
    // extract data from token
    const userId = await getDataFromToken(req);

    const user = await User.findOne({
      _id: userId,
    }).select("-password");

    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error) {}
}
