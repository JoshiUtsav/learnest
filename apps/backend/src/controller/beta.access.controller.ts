import { Request, Response } from 'express';
import User from '../models/beta.user.model';
import emailService from '../service/mailer';
import ApiResponse from '../utils/apiResponse.utils';
import ApiError from '../utils/apiError.utils';

const subject = 'Beta Access Request Under Review';
const html = `
<p class="text-foreground">Dear User,</p>

<p class="text-foreground">
  Thank you for requesting beta access to <strong class="text-primary">Learnest</strong>. We have successfully received your request, and it is currently under review.
</p>

<p class="text-foreground">
  We understand the importance of your access, and our team is diligently evaluating the request. We will notify you once your access has been approved or if any additional information is required.
</p>

<p class="text-foreground"><strong class="text-primary">What's next?</strong></p>

<ol class="list-decimal pl-5 text-foreground">
  <li><strong class="text-primary">Review Process:</strong> Our team will review your application to ensure everything aligns with our beta testing needs.</li>
  <li><strong class="text-primary">Notification:</strong> You will receive an email confirmation once your access has been granted.</li>
  <li><strong class="text-primary">Start Using Learnest:</strong> Upon approval, you will be able to start using Learnest's premium features and contribute valuable feedback.</li>
</ol>

<p class="text-foreground">
  In the meantime, please feel free to reach out to us if you have any questions or need further assistance.
</p>

<p class="text-foreground">
  Thank you for your patience and for being part of the <strong class="text-primary">Learnest</strong> community.
</p>

<p class="text-foreground">Best regards,<br/>The Learnest Team</p>

<p class="text-foreground"><strong>Contact Information:</strong><br/>
  Email: <a href="mailto:support@example.com" class="text-primary hover:text-primary/80">support@example.com</a><br/>
  Phone: <a href="tel:+1234567890" class="text-primary hover:text-primary/80">+1 (234) 567-890</a><br/>
  Website: <a href="https://example.com" class="text-primary hover:text-primary/80">example.com</a>
</p>

`;

class BetaAccessController {
  async createBetaAccess(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              null,
              'Email has already requested beta access.'
            )
          );
      }

      // Attempt to send the email
      const emailSent = await emailService.sendEmail({
        to: email,
        subject,
        html,
      });

      if (!emailSent) {
        console.error('Email failed to send to:', email);
        return res
          .status(500)
          .json(new ApiError(500, 'Failed to send confirmation email.', []));
      }

      // Only save the user if the email was sent successfully
      const newUser = new User({ email, betaAccess: false });
      await newUser.save();

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            null,
            'Beta access request received. A confirmation email has been sent'
          )
        );
    } catch (err: any) {
      console.error('Error in creating beta access:', err);
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            'Server error. Please try again later.',
            err.stack,
            err
          )
        );
    }
  }

  async getBetaAccessStatus(req: Request, res: Response): Promise<Response> {
    const { email } = req.params;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json(new ApiError(404, 'User not found.', []));

      return res.status(200).json(
        new ApiResponse(200, {
          email: user.email,
          betaAccess: user.betaAccess,
        })
      );
    } catch (err: any) {
      console.error('Error fetching user beta access status:', err);
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            'Server error. Please try again later.',
            err.stack,
            err
          )
        );
    }
  }

  async updateBetaAccess(req: Request, res: Response): Promise<Response> {
    const { email } = req.params;
    const { betaAccess } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json(new ApiError(404, 'User not found.', []));

      user.betaAccess = betaAccess;
      await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Beta access updated successfully.'));
    } catch (err: any) {
      console.error('Error updating beta access:', err);
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            'Server error. Please try again later.',
            err.stack,
            err
          )
        );
    }
  }

  async deleteBetaAccess(req: Request, res: Response): Promise<Response> {
    const { email } = req.params;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json(new ApiError(404, 'User not found.', []));

      user.betaAccess = false;
      await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Beta access revoked successfully.'));
    } catch (err: any) {
      console.error('Error deleting beta access:', err);
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            'Server error. Please try again later.',
            err.stack,
            err
          )
        );
    }
  }
}

export default new BetaAccessController();
