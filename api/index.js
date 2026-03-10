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
        <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">Hi ${name} 👋</h2>
          <p>Thank you for registering for the <strong>FREE Personality Development Masterclass</strong> by Mridu Bhandari.</p>
          <p>In this live session, you will learn practical tools and frameworks to help you:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li>• Speak with confidence in meetings</li>
            <li>• Improve your communication and executive presence</li>
            <li>• Present your ideas clearly and authoritatively</li>
            <li>• Build a strong professional personality in the workplace</li>
          </ul>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> 15th March 2026</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> 07:30 PM – 08:30 PM</p>
            <p style="margin: 5px 0;"><strong>🌐 Live Session:</strong> <a href="https://mentorleap.co/" style="color: #2563eb; text-decoration: none;">https://mentorleap.co/</a></p>
          </div>
          <p>We hope you will keep yourself free at this time and join the session.</p>
          <p>Looking forward to seeing you! 🚀</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 0.9em;">— Team MentorLeap</p>
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

    // 3. Optional: Send to Google Sheets if Webhook URL exists
    if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, profession, location, program_interest, message }),
        });
      } catch (err) {
        console.error('Error logging to Google Sheets:', err);
      }
    }

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Export the app for Vercel
export default app;
