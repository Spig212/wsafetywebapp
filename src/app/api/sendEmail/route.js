
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
    try {
        console.log("📩 API Called: /api/sendEmail");

        // Parse request body
        const { location, message } = await req.json();
        console.log("📍 Location:", location);
        console.log("📝 Message:", message);

        // ✅ Fix: Use correct path for `friends.json`
        const friendsFilePath = path.join(process.cwd(), "src", "data", "friends.json");
        const friendsData = await fs.readFile(friendsFilePath, "utf-8");
        const friends = JSON.parse(friendsData);

        if (!friends.contacts || friends.contacts.length === 0) {
            console.error("❌ No emergency contacts found!");
            return new Response(JSON.stringify({ success: false, error: "No emergency contacts saved!" }), { 
                status: 400, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        // ✅ Setup mail transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,  // Your Gmail
                pass: process.env.EMAIL_PASS, // App Password
            },
        });

        // ✅ Email Template
        const emailSubject = "🚨 Emergency Alert!";
        const emailBody = `
            <h2>🚨 Emergency Alert!</h2>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Location:</strong> ${location || "Not Available"}</p>
            <p>Please check on your friend immediately!</p>
        `;

        // ✅ Send email to all contacts
        const emailPromises = friends.contacts.map(email => {
            console.log(`📧 Sending email to: ${email}`);
            return transporter.sendMail({
                from: `"Emergency Alert" <${process.env.EMAIL}>`,
                to: email,
                subject: emailSubject,
                html: emailBody,
            });
        });

        await Promise.all(emailPromises);

        console.log("✅ All emergency emails sent!");
        return new Response(JSON.stringify({ success: true, message: "Emergency emails sent!" }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("❌ Email sending error:", error);
        return new Response(JSON.stringify({ success: false, error: "Failed to send emails." }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    }
}

/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Emergency Alert" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

export default sendMail;

import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { to, subject, text } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use `true` for 465, `false` for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Emergency Alert" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return Response.json({ message: 'Email sent successfully!', id: info.messageId });
  } catch (error) {
    console.error('Email sending error:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
*/