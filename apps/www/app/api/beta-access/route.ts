import { NextRequest, NextResponse } from "next/server";
import EmailService from "@/utils/mailer";
import prisma from "@/utils/prisma";

const EMAIL_TEMPLATE = {
  subject: "Beta Access Request Under Review",
  html: `
    <p>Dear User,</p>
    <p>Thank you for requesting beta access to <strong>Learnest</strong>. We have successfully received your request, and it is currently under review.</p>
    <p>We’ll notify you when access is approved or if additional information is required.</p>
    <p>Best regards,<br/>The Learnest Team</p>
  `,
};

class BetaAccessController {
  private async findBetaAccessByEmail(email: string) {
    if (!email) {
      throw new Error("Email is required.");
    }
    return await prisma.betaAccess.findUnique({ where: { email } });
  }

  private validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format.");
    }
  }

  async createBetaAccess(req: NextRequest) {
    try {
      const { email } = await req.json();
      this.validateEmail(email);

      const existingBetaAccess = await this.findBetaAccessByEmail(email);
      if (existingBetaAccess) {
        return NextResponse.json(
          { message: "Email has already requested beta access." },
          { status: 400 }
        );
      }

      const emailSent = await EmailService.sendEmail({
        to: email,
        subject: EMAIL_TEMPLATE.subject,
        html: EMAIL_TEMPLATE.html,
      });

      if (!emailSent) {
        console.error("Failed to send email:", email);
        return NextResponse.json(
          { message: "Failed to send confirmation email." },
          { status: 500 }
        );
      }

      // Use Prisma to create a new beta access record in the betaAccess table
      await prisma.betaAccess.create({
        data: {
          email,
          betaAccess: false, // Set default value for betaAccess
        },
      });

      return NextResponse.json(
        { message: "Beta access request received. Confirmation email sent." },
        { status: 201 }
      );
    } catch (err: any) {
      console.error("Error creating beta access:", err.message);
      return NextResponse.json(
        { message: err.message || "Server error. Please try again later." },
        { status: 500 }
      );
    }
  }

  async getBetaAccessStatus(req: NextRequest) {
    try {
      const email = req.nextUrl.searchParams.get("email");
      this.validateEmail(email!);

      const betaAccess = await this.findBetaAccessByEmail(email!);
      if (!betaAccess) {
        return NextResponse.json(
          { message: "User not found." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { email: betaAccess.email, betaAccess: betaAccess.betaAccess },
        { status: 200 }
      );
    } catch (err: any) {
      console.error("Error fetching beta access status:", err.message);
      return NextResponse.json(
        { message: err.message || "Server error. Please try again later." },
        { status: 500 }
      );
    }
  }

  async updateBetaAccess(req: NextRequest) {
    try {
      const email = req.nextUrl.searchParams.get("email");
      const { betaAccess } = await req.json();
      this.validateEmail(email!);

      if (betaAccess === undefined) {
        throw new Error("Beta access status is required.");
      }

      const betaAccessRecord = await this.findBetaAccessByEmail(email!);
      if (!betaAccessRecord) {
        return NextResponse.json(
          { message: "User not found." },
          { status: 404 }
        );
      }

      // Update the beta access status
      await prisma.betaAccess.update({
        where: { email: email! },
        data: { betaAccess },
      });

      return NextResponse.json(
        { message: "Beta access updated successfully." },
        { status: 200 }
      );
    } catch (err: any) {
      console.error("Error updating beta access:", err.message);
      return NextResponse.json(
        { message: err.message || "Server error. Please try again later." },
        { status: 500 }
      );
    }
  }

  async deleteBetaAccess(req: NextRequest) {
    try {
      const email = req.nextUrl.searchParams.get("email");
      this.validateEmail(email!);

      const betaAccessRecord = await this.findBetaAccessByEmail(email!);
      if (!betaAccessRecord) {
        return NextResponse.json(
          { message: "User not found." },
          { status: 404 }
        );
      }

      // Delete the beta access record
      await prisma.betaAccess.delete({
        where: { email: email! },
      });

      return NextResponse.json(
        { message: "Beta access deleted successfully." },
        { status: 200 }
      );
    } catch (err: any) {
      console.error("Error deleting beta access:", err.message);
      return NextResponse.json(
        { message: err.message || "Server error. Please try again later." },
        { status: 500 }
      );
    }
  }
}

export default new BetaAccessController();
