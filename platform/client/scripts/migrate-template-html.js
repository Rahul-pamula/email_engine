#!/usr/bin/env node
/**
 * Migration script: Update existing templates in the database with compiled HTML.
 * 
 * This reads the existing HTML files from /email-templates/ and uses the API
 * to update any templates whose compiled_html is empty or a placeholder.
 * 
 * Usage: node scripts/migrate-template-html.js <AUTH_TOKEN>
 * 
 * Get your auth token from browser DevTools > Application > Local Storage > token
 */

const fs = require('fs');
const path = require('path');

const API_BASE = "http://localhost:8000";
const TEMPLATES_DIR = path.join(__dirname, '../../../email-templates');

// Map template names to their folder names for matching
const NAME_TO_DIR = {};
const META = {
    template1: "Best Recipes", template2: "Summer Vibes", template3: "Coffee Collection",
    template4: "Travel Adventure", template5: "Restaurant Newsletter", template6: "Gaming Weekly",
    template7: "Tech Weekly", template8: "Organic Living", template9: "Luxury Fashion",
    template10: "Kids Learning", template11: "Fitness & Wellness", template12: "Tech Newsletter",
    template13: "New Year Celebration", template14: "Valentine's Day", template15: "Easter Joy",
    template16: "Thanksgiving", template17: "Christmas Sale", template18: "Father's Day",
    template19: "Black Friday Mega", template20: "Black Friday Luxury", template21: "Cyber Monday",
    template22: "Black Friday Exclusive", template23: "Sports Sale", template24: "Sports Deals v2",
    template25: "Z-Pattern Sale", template26: "Split Design Sale", template27: "Gallery Sale",
    template28: "Magazine Style", template29: "Minimalist Sale", template30: "Vintage Sale",
    template31: "Artsy Sale", template32: "Industrial Sale", template33: "Tech Launch",
    template34: "Spring Collection", template35: "24-Hour Flash Sale"
};

// Build reverse lookup: name -> HTML content
for (const [dir, name] of Object.entries(META)) {
    const htmlFile = path.join(TEMPLATES_DIR, dir, 'index.html');
    if (fs.existsSync(htmlFile)) {
        NAME_TO_DIR[name.toLowerCase()] = htmlFile;
    }
}

async function migrate(token) {
    console.log("🔍 Fetching templates from API...\n");

    const res = await fetch(`${API_BASE}/templates?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        console.error("❌ Failed to fetch templates. Check your auth token.");
        process.exit(1);
    }

    const data = await res.json();
    const templates = data.data;
    console.log(`Found ${templates.length} templates in database.\n`);

    let updated = 0;
    let skipped = 0;

    for (const tpl of templates) {
        const hasRealHtml = false; // Force update all templates with cleaned HTML

        if (hasRealHtml) {
            console.log(`⏭  "${tpl.name}" — already has HTML (${tpl.compiled_html.length} chars)`);
            skipped++;
            continue;
        }

        // Try to match by name
        const htmlFile = NAME_TO_DIR[tpl.name.toLowerCase()];

        if (!htmlFile) {
            console.log(`⚠  "${tpl.name}" — no matching template file found, skipping`);
            skipped++;
            continue;
        }

        const htmlContent = fs.readFileSync(htmlFile, 'utf8');

        // Update via API
        try {
            const updateRes = await fetch(`${API_BASE}/templates/${tpl.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    compiled_html: htmlContent,
                    name: tpl.name,
                    subject: tpl.subject
                })
            });

            if (updateRes.ok) {
                console.log(`✅ "${tpl.name}" — updated with HTML (${htmlContent.length} chars)`);
                updated++;
            } else {
                const err = await updateRes.json();
                console.error(`❌ "${tpl.name}" — update failed: ${JSON.stringify(err)}`);
            }
        } catch (err) {
            console.error(`❌ "${tpl.name}" — ${err.message}`);
        }
    }

    console.log(`\n🏁 Done! Updated: ${updated}, Skipped: ${skipped}`);
}

// Get token from command line
const token = process.argv[2];
if (!token) {
    console.log("Usage: node scripts/migrate-template-html.js <AUTH_TOKEN>");
    console.log("\nGet your auth token from browser DevTools:");
    console.log("  Application > Local Storage > token");
    process.exit(1);
}

migrate(token).catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
