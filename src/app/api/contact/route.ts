import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize input (basic sanitization)
    const sanitizedName = name.trim().substring(0, 100);
    const sanitizedEmail = email.trim().substring(0, 100);
    const sanitizedMessage = message.trim().substring(0, 2000);

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpFromEmail = process.env.SMTP_FROM_EMAIL;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'info@immersegeek.com';

    // Validate SMTP configuration
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFromEmail) {
      console.error('SMTP configuration is missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Email content
    const mailOptions = {
      from: `"${sanitizedName}" <${smtpFromEmail}>`,
      replyTo: sanitizedEmail,
      to: recipientEmail,
      subject: `Contact Form Submission from ${sanitizedName}`,
      text: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <h3 style="color: #333;">Message:</h3>
          <p style="white-space: pre-wrap;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}

