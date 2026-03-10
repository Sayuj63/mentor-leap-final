import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// API Routes
app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, profession, location, program_interest, message } = req.body;

  try {
    const userMailOptions = {
      from: `"MentorLeap" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Confirmation: Application Received - MentorLeap',
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.5;">
          <h2>Hi ${name},</h2>
          <p>Thank you for expressing your interest in the <strong>${program_interest}</strong> program at MentorLeap.</p>
          <p>We have successfully received your application. Our team will review your details and get back to you shortly.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Your Submission Summary:</strong></p>
          <ul>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Profession:</strong> ${profession}</li>
            <li><strong>Location:</strong> ${location}</li>
            ${message ? `<li><strong>Message:</strong> ${message}</li>` : ''}
          </ul>
          <br/>
          <p>If you have any questions, feel free to reply directly to this email.</p>
          <p>Best Regards,</p>
          <p><strong>MentorLeap Team</strong></p>
        </div>
      `,
    };

    const adminMailOptions = {
      from: `"MentorLeap Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Lead: ${name} - ${program_interest}`,
      html: `
        <h2>New Lead Application Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Profession:</strong> ${profession}</li>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>Program:</strong> ${program_interest}</li>
          <li><strong>Message:</strong> ${message || 'N/A'}</li>
        </ul>
      `
    };

    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Export the app for Vercel
export default app;
