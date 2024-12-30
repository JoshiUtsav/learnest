import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "your-smtp-username",
        pass: process.env.MAIL_PASSWORD || "your-smtp-password",
      },
    });
  }

  public async sendEmail(options: EmailOptions): Promise<string> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Learnest" <${process.env.MAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      return "Email sent successfully";
    } catch (error: any) {
      console.error("Error sending email:", error);
      if (error.response) {
        console.error("SMTP Error Response:", error.response);
      }
      throw new Error("Failed to send email");
    }
  }
}

export default new EmailService();
