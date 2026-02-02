import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Only allow requests from your domain(s)
const ALLOWED_ORIGINS = [
  "https://refineplasticsurgerytz.com",
  "https://www.refineplasticsurgerytz.com",
  "https://refine-plastic-surgery.vercel.app",
];

// Development origins
const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

const getAllowedOrigins = () => {
  const env = Deno.env.get("DENO_ENV") || "production";
  return env === "development" ? [...ALLOWED_ORIGINS, ...DEV_ORIGINS] : ALLOWED_ORIGINS;
};

// Helper function to escape HTML and prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Rate limiting using timestamp tracking
// In a production environment, use Deno KV Storage or a persistent store
let lastResetTime = Date.now();
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 30; // Adjust based on your needs

function rateLimit(): boolean {
  const now = Date.now();
  
  // Reset counter every minute
  if (now - lastResetTime > 60000) {
    lastResetTime = now;
    requestCount = 1;
    return true;
  }
  
  // Check if we've exceeded the limit
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  // Increment request count
  requestCount++;
  return true;
}

function getCorsHeaders(origin: string | null) {
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = origin && allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, authorization",
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
  };
}

interface AppointmentRequest {
  name: string;
  email: string;
  phone: string;
  procedure: string;
  date: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin");
  const cors = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  // Validate origin - reject if not allowed
  if (!cors["Access-Control-Allow-Origin"]) {
    console.warn(`Rejected request from unauthorized origin: ${origin}`);
    return new Response(
      JSON.stringify({ success: false, error: "Origin not allowed" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Apply rate limiting (30 requests per minute globally)
    if (!rateLimit()) {
      console.warn("Rate limit exceeded");
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const { name, email, phone, procedure, date, message }: AppointmentRequest = await req.json();

    console.log("Received appointment request:", { name, email, phone, procedure, date });

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: name, email, and phone" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    // Basic validation for email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #C41E7D 0%, #E91E8C 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #C41E7D; }
          .value { margin-top: 5px; word-break: break-word; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Appointment Request</h1>
            <p>Refine Plastic & Aesthetic Surgery Centre</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Patient Name:</div>
              <div class="value">${escapeHtml(name)}</div>
            </div>
            <div class="field">
              <div class="label">Email Address:</div>
              <div class="value">${escapeHtml(email)}</div>
            </div>
            <div class="field">
              <div class="label">Phone Number:</div>
              <div class="value">${escapeHtml(phone)}</div>
            </div>
            ${procedure ? `
            <div class="field">
              <div class="label">Procedure of Interest:</div>
              <div class="value">${escapeHtml(procedure)}</div>
            </div>
            ` : ''}
            ${date ? `
            <div class="field">
              <div class="label">Preferred Date:</div>
              <div class="value">${escapeHtml(date)}</div>
            </div>
            ` : ''}
            ${message ? `
            <div class="field">
              <div class="label">Additional Message:</div>
              <div class="value">${escapeHtml(message)}</div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This email was sent from the website appointment form.</p>
            <p>© ${new Date().getFullYear()} Refine Plastic & Aesthetic Surgery Centre</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Refine Appointments <onboarding@resend.dev>",
      to: ["info@refineplasticsurgerytz.com"],
      subject: `New Appointment Request from ${escapeHtml(name)}`,
      html: emailHtml,
      reply_to: email,
    });

    console.log("Email sent successfully:", emailResponse);

    // Also send confirmation to the patient
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #C41E7D 0%, #E91E8C 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Request</h1>
            <p>Refine Plastic & Aesthetic Surgery Centre</p>
          </div>
          <div class="content">
            <p>Dear ${escapeHtml(name)},</p>
            <p>Thank you for your interest in Refine Plastic & Aesthetic Surgery Centre. We have received your appointment request and our team will contact you within 24 hours to confirm your consultation.</p>
            <p>If you have any urgent questions, please don't hesitate to call us at <strong>(+255) 793 145 167</strong>.</p>
            <p>Best regards,<br>The Refine Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Refine Plastic & Aesthetic Surgery Centre</p>
            <p>info@refineplasticsurgerytz.com | refineplasticsurgerytz.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: "Refine Appointments <onboarding@resend.dev>",
      to: [email],
      subject: "Appointment Request Received - Refine Plastic Surgery",
      html: confirmationHtml,
    });

    console.log("Confirmation email sent to patient");

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...cors,
      },
    });
  } catch (error: any) {
    console.error("Error in send-appointment-email function:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      }
    );
  }
};

serve(handler);
