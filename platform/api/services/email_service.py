"""
EMAIL SERVICE
Phase 1.5 — Auth Security

Handles sending transactional emails via SMTP (Mailtrap in dev, SES in prod).
"""

import aiosmtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


SMTP_HOST = os.getenv("SMTP_HOST", "sandbox.smtp.mailtrap.io")
SMTP_PORT = int(os.getenv("SMTP_PORT", "2525"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@emailengine.io")
APP_URL = os.getenv("APP_URL", "http://localhost:3000")


async def send_email(to_email: str, subject: str, html_body: str, text_body: str = "") -> bool:
    """Send a transactional email via SMTP."""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL
        msg["To"] = to_email

        if text_body:
            msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        await aiosmtplib.send(
            msg,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
            use_tls=False,
            start_tls=False,
        )
        return True

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send to {to_email}: {e}")
        return False


async def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Send a password reset link to the user."""
    reset_url = f"{APP_URL}/reset-password?token={reset_token}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Inter, sans-serif; background: #0F172A; color: #F1F5F9; padding: 40px;">
      <div style="max-width: 480px; margin: 0 auto; background: #1E293B; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
        <h2 style="margin-top: 0; color: #F1F5F9;">Reset your password</h2>
        <p style="color: #94A3B8;">
          We received a request to reset the password for your Email Engine account.
          Click the button below to set a new password.
        </p>
        <a href="{reset_url}"
           style="display: inline-block; margin: 24px 0; padding: 12px 24px;
                  background: #3B82F6; color: white; text-decoration: none;
                  border-radius: 8px; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #64748B; font-size: 13px;">
          This link expires in <strong>1 hour</strong>.<br>
          If you didn't request a password reset, you can ignore this email.
        </p>
        <hr style="border-color: #334155; margin: 24px 0;">
        <p style="color: #64748B; font-size: 12px;">
          If the button doesn't work, copy and paste this link:<br>
          <a href="{reset_url}" style="color: #3B82F6;">{reset_url}</a>
        </p>
      </div>
    </body>
    </html>
    """

    text_body = f"""Reset your password

We received a request to reset the password for your Email Engine account.

Click this link to reset your password (expires in 1 hour):
{reset_url}

If you didn't request a reset, ignore this email.
"""

    return await send_email(to_email, "Reset your Email Engine password", html_body, text_body)


async def send_email_verification(to_email: str, verify_token: str) -> bool:
    """Send an email verification link after signup."""
    verify_url = f"{APP_URL}/verify-email?token={verify_token}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Inter, sans-serif; background: #0F172A; color: #F1F5F9; padding: 40px;">
      <div style="max-width: 480px; margin: 0 auto; background: #1E293B; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
        <h2 style="margin-top: 0; color: #F1F5F9;">Verify your email address</h2>
        <p style="color: #94A3B8;">
          Thanks for signing up! Click the button below to verify your email address
          and complete your account setup.
        </p>
        <a href="{verify_url}"
           style="display: inline-block; margin: 24px 0; padding: 12px 24px;
                  background: #10B981; color: white; text-decoration: none;
                  border-radius: 8px; font-weight: 600;">
          Verify Email
        </a>
        <p style="color: #64748B; font-size: 13px;">
          This link expires in <strong>24 hours</strong>.
        </p>
      </div>
    </body>
    </html>
    """

    text_body = f"""Verify your email address

Thanks for signing up for Email Engine!

Click this link to verify your email (expires in 24 hours):
{verify_url}
"""

    return await send_email(to_email, "Verify your Email Engine account", html_body, text_body)
