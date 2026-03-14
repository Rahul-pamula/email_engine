"""
EMAIL SERVICE
Phase 1.5 — Auth Security

Handles sending transactional emails via SMTP (Mailtrap in dev, SES in prod).
"""

import asyncio
import aiosmtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging

logger = logging.getLogger(__name__)


SMTP_HOST = os.getenv("SMTP_HOST", "sandbox.smtp.mailtrap.io")
SMTP_PORT = int(os.getenv("SMTP_PORT", "2525"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
# Use the same env var as the bulk worker so sender is consistent
FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL") or os.getenv("FROM_EMAIL", "noreply@emailengine.io")
FROM_NAME = os.getenv("SMTP_FROM_NAME", "Email Engine")
APP_URL = os.getenv("APP_URL", "http://localhost:3000")
SMTP_TIMEOUT = 15  # seconds — prevents indefinite hangs


async def send_email(to_email: str, subject: str, html_body: str, text_body: str = "") -> bool:
    """Send a transactional email via SMTP with a timeout to prevent hangs."""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = to_email

        if text_body:
            msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        async def _do_send():
            await aiosmtplib.send(
                msg,
                hostname=SMTP_HOST,
                port=SMTP_PORT,
                username=SMTP_USERNAME,
                password=SMTP_PASSWORD,
                use_tls=(SMTP_PORT == 465),
                start_tls=(SMTP_PORT == 587),
            )

        await asyncio.wait_for(_do_send(), timeout=SMTP_TIMEOUT)
        logger.info(f"[EMAIL] Sent '{subject}' to {to_email}")
        return True

    except asyncio.TimeoutError:
        logger.error(f"[EMAIL] SMTP timed out after {SMTP_TIMEOUT}s sending to {to_email}")
        return False
    except Exception as e:
        logger.error(f"[EMAIL ERROR] Failed to send to {to_email}: {e}")
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


async def send_team_invite(to_email: str, inviter_name: str, workspace_name: str, invite_token: str) -> bool:
    """Send a team invitation email."""
    invite_url = f"{APP_URL}/team/join?token={invite_token}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Inter, sans-serif; background: #0F172A; color: #F1F5F9; padding: 40px;">
      <div style="max-width: 480px; margin: 0 auto; background: #1E293B; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
        <h2 style="margin-top: 0; color: #F1F5F9;">You've been invited!</h2>
        <p style="color: #94A3B8;">
          <strong>{inviter_name}</strong> has invited you to join their workspace <strong>{workspace_name}</strong> on Email Engine.
        </p>
        <a href="{invite_url}"
           style="display: inline-block; margin: 24px 0; padding: 12px 24px;
                  background: #10B981; color: white; text-decoration: none;
                  border-radius: 8px; font-weight: 600;">
          Accept Invitation
        </a>
        <p style="color: #64748B; font-size: 13px;">
          This link expires in <strong>7 days</strong>.
        </p>
      </div>
    </body>
    </html>
    """

    text_body = f"""You've been invited!

{inviter_name} has invited you to join their workspace {workspace_name} on Email Engine.

Click this link to accept your invitation (expires in 7 days):
{invite_url}
"""

    return await send_email(to_email, f"Join {workspace_name} on Email Engine", html_body, text_body)


async def send_access_request_notification(to_email: str, requester_email: str, workspace_name: str) -> bool:
    """Send an email to workspace owner when someone requests JIT access."""
    admin_url = f"{APP_URL}/settings/team/requests"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Inter, sans-serif; background: #0F172A; color: #F1F5F9; padding: 40px;">
      <div style="max-width: 480px; margin: 0 auto; background: #1E293B; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
        <h2 style="margin-top: 0; color: #F1F5F9;">New Workspace Access Request</h2>
        <p style="color: #94A3B8;">
          A new user <strong>({requester_email})</strong> is requesting to join your workspace <strong>{workspace_name}</strong> via Corporate Auto-Discovery.
        </p>
        <p style="color: #94A3B8;">
          You can review this request in your Team Settings dashboard to approve or explicitly block their access.
        </p>
        <a href="{admin_url}"
           style="display: inline-block; margin: 24px 0; padding: 12px 24px;
                  background: #3B82F6; color: white; text-decoration: none;
                  border-radius: 8px; font-weight: 600;">
          Review Request
        </a>
      </div>
    </body>
    </html>
    """

    text_body = f"""New Workspace Access Request

A new user ({requester_email}) is requesting to join your workspace {workspace_name} via Corporate Auto-Discovery.

You can review this request in your Team Settings dashboard to approve or block their access here:
{admin_url}
"""

    return await send_email(to_email, f"Action Required: New Access Request for {workspace_name}", html_body, text_body)
