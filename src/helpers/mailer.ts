import User from "@/models/userModal";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

interface SendEmailProps {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailProps) => {
  const hashToken = await bcrypt.hash(userId.toString(), 10);

  try {
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashToken,
        verfiyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a5a61017acb91e",
        pass: "739e034c7f4c18",
      },
    });

    const mailOptions = {
      from: `abpanchal951357@gmail.com`,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }<br> ${process.env.DOMAIN}/verifyemail?=${hashToken}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
