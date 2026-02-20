"""
seed_templates.py
Populates the templates table with 3 clean starter templates.
Calls TemplateService directly (no HTTP auth needed).
"""
import os, sys
from dotenv import load_dotenv

load_dotenv(dotenv_path="platform/api/.env")
sys.path.append(os.path.join(os.getcwd(), "platform/api"))

from utils.supabase_client import db
from services.template_service import TemplateService
from models.template import TemplateCreate

# ── Fetch the first available tenant ─────────────────────────────────────────
res = db.client.table("tenants").select("id").limit(1).execute()
if not res.data:
    print("ERROR: No tenants found in database. Make sure you have an account.")
    sys.exit(1)

TENANT_ID = res.data[0]["id"]
print(f"Using tenant_id: {TENANT_ID}")

# ── Template Definitions ──────────────────────────────────────────────────────

BLANK_CANVAS = """<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f4">
    <mj-section background-color="#ffffff" padding="40px 20px">
      <mj-column>
        <mj-text font-size="24px" font-weight="bold" color="#111111">
          Your Email Heading
        </mj-text>
        <mj-text>
          Start writing your email content here. Click any block to select and edit it.
        </mj-text>
        <mj-button background-color="#4f46e5" color="#ffffff" href="#" border-radius="6px" padding="12px 24px">
          Click Here
        </mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#f4f4f4" padding="20px">
      <mj-column>
        <mj-text font-size="11px" color="#999999" align="center">
          You are receiving this email because you signed up for our service.
          <br /><a href="{{ unsubscribe_url }}" style="color:#999999;">Unsubscribe</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>"""

SIMPLE_NEWSLETTER = """<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
    <mj-style>
      .link { color: #4f46e5; text-decoration: none; }
    </mj-style>
  </mj-head>
  <mj-body background-color="#f0f0f0">
    <!-- Header -->
    <mj-section background-color="#4f46e5" padding="24px 20px">
      <mj-column>
        <mj-text font-size="22px" font-weight="bold" color="#ffffff" align="center">
          Your Company Name
        </mj-text>
      </mj-column>
    </mj-section>
    <!-- Hero -->
    <mj-section background-color="#ffffff" padding="40px 30px">
      <mj-column>
        <mj-text font-size="28px" font-weight="bold" color="#111111" line-height="1.3">
          This Month's Newsletter
        </mj-text>
        <mj-text color="#555555">
          Hi {{ contact.firstname }}, welcome to our monthly update. Here is what is new this month.
        </mj-text>
        <mj-divider border-width="1px" border-color="#eeeeee" padding="10px 0" />
        <mj-text font-size="16px" font-weight="bold" color="#111111">
          Story Title Goes Here
        </mj-text>
        <mj-text color="#555555">
          Write the first story of your newsletter here. Keep it concise and engaging for your readers.
        </mj-text>
        <mj-button background-color="#4f46e5" color="#ffffff" href="#" border-radius="6px" padding="10px 22px" font-size="14px">
          Read More
        </mj-button>
      </mj-column>
    </mj-section>
    <!-- Footer -->
    <mj-section background-color="#f0f0f0" padding="20px">
      <mj-column>
        <mj-text font-size="11px" color="#999999" align="center">
          © 2025 Your Company. All rights reserved.
          <br /><a href="{{ unsubscribe_url }}" style="color:#999999;">Unsubscribe</a> · <a href="{{ webview_url }}" style="color:#999999;">View in browser</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>"""

PROMOTIONAL_EMAIL = """<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f4">
    <!-- Header -->
    <mj-section background-color="#111111" padding="20px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold" color="#ffffff" align="center">
          SALE
        </mj-text>
      </mj-column>
    </mj-section>
    <!-- Hero Banner -->
    <mj-section background-color="#4f46e5" padding="48px 30px">
      <mj-column>
        <mj-text font-size="36px" font-weight="bold" color="#ffffff" align="center" line-height="1.2">
          50% OFF
          <br/>Everything
        </mj-text>
        <mj-text color="rgba(255,255,255,0.8)" align="center">
          Limited time offer. Use code SAVE50 at checkout.
        </mj-text>
        <mj-button background-color="#ffffff" color="#4f46e5" href="#" border-radius="6px" padding="14px 32px" font-weight="bold" font-size="16px">
          Shop Now
        </mj-button>
      </mj-column>
    </mj-section>
    <!-- Product Grid -->
    <mj-section background-color="#ffffff" padding="30px 20px">
      <mj-column>
        <mj-text font-size="18px" font-weight="bold" color="#111111">
          Product One
        </mj-text>
        <mj-text color="#555555">Short description of this product and why it is great.</mj-text>
        <mj-text font-size="20px" font-weight="bold" color="#4f46e5">$49.00</mj-text>
      </mj-column>
      <mj-column>
        <mj-text font-size="18px" font-weight="bold" color="#111111">
          Product Two
        </mj-text>
        <mj-text color="#555555">Short description of this product and why it is great.</mj-text>
        <mj-text font-size="20px" font-weight="bold" color="#4f46e5">$39.00</mj-text>
      </mj-column>
    </mj-section>
    <!-- Footer -->
    <mj-section background-color="#f4f4f4" padding="20px">
      <mj-column>
        <mj-text font-size="11px" color="#999999" align="center">
          © 2025 Your Company. All rights reserved.
          <br /><a href="{{ unsubscribe_url }}" style="color:#999999;">Unsubscribe</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>"""

# ── Seed ─────────────────────────────────────────────────────────────────────

TEMPLATES = [
    {
        "name": "Blank Canvas",
        "subject": "Your email subject here",
        "category": "general",
        "mjml_source": BLANK_CANVAS,
    },
    {
        "name": "Simple Newsletter",
        "subject": "This Month's Newsletter",
        "category": "newsletter",
        "mjml_source": SIMPLE_NEWSLETTER,
    },
    {
        "name": "Promotional Email",
        "subject": "50% OFF Everything - Limited Time!",
        "category": "promotional",
        "mjml_source": PROMOTIONAL_EMAIL,
    },
]

print(f"\nSeeding {len(TEMPLATES)} templates...\n")

for tpl in TEMPLATES:
    PLACEHOLDER_HTML = "<html><body><p>Template content will be compiled on first save.</p></body></html>"

    create_obj = TemplateCreate(
        name=tpl["name"],
        subject=tpl["subject"],
        category=tpl.get("category", "general"),
        mjml_json={},
        mjml_source=tpl["mjml_source"],
        compiled_html=PLACEHOLDER_HTML,
    )
    result = TemplateService.create_template(TENANT_ID, create_obj)
    if result:
        print(f"  ✅  Created: '{result['name']}' (id: {result['id']})")
    else:
        print(f"  ❌  Failed to create: {tpl['name']}")

print("\nDone! Templates seeded successfully.")
