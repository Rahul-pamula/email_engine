#!/usr/bin/env node
/**
 * Build script to generate templatePresets.ts from existing email templates.
 * 
 * Each template folder contains:
 *   - index.html   (pre-compiled HTML - ready to use)
 *   - index.mjml   (MJML source - not needed)
 *   - thumbnail.png (preview thumbnail)
 * 
 * This script reads index.html directly (no MJML compilation needed)
 * and copies thumbnails to the public directory for use in the UI.
 * 
 * Run: node scripts/build-template-presets.js
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../../../email-templates');
const OUTPUT_FILE = path.join(__dirname, '../src/app/templates/templatePresets.ts');
const PUBLIC_THUMBS_DIR = path.join(__dirname, '../public/images/templates');

// Template metadata - name, description, category for each
const TEMPLATE_META = {
  template1: { name: "Best Recipes", description: "Showcase food & recipes with beautiful cards.", category: "newsletter" },
  template2: { name: "Summer Vibes", description: "Fresh summer-themed promotional email.", category: "marketing" },
  template3: { name: "Coffee Collection", description: "Coffee shop or café themed newsletter.", category: "marketing" },
  template4: { name: "Travel Adventure", description: "Travel agency or tourism email.", category: "marketing" },
  template5: { name: "Restaurant Newsletter", description: "Restaurant menu & event updates.", category: "newsletter" },
  template6: { name: "Gaming Weekly", description: "Gaming news and product launches.", category: "newsletter" },
  template7: { name: "Tech Weekly", description: "Tech news roundup newsletter.", category: "newsletter" },
  template8: { name: "Organic Living", description: "Natural & organic lifestyle email.", category: "newsletter" },
  template9: { name: "Luxury Fashion", description: "High-end fashion brand email.", category: "marketing" },
  template10: { name: "Kids Learning", description: "Educational content for children.", category: "education" },
  template11: { name: "Fitness & Wellness", description: "Gym & wellness promotional email.", category: "newsletter" },
  template12: { name: "Tech Newsletter", description: "Technology industry updates.", category: "newsletter" },
  template13: { name: "New Year Celebration", description: "New year themed promotional email.", category: "seasonal" },
  template14: { name: "Valentine's Day", description: "Valentine's day special offers.", category: "seasonal" },
  template15: { name: "Easter Joy", description: "Easter themed promotional email.", category: "seasonal" },
  template16: { name: "Thanksgiving", description: "Thanksgiving celebration email.", category: "seasonal" },
  template17: { name: "Christmas Sale", description: "Christmas holiday sale email.", category: "seasonal" },
  template18: { name: "Father's Day", description: "Father's day gift guide email.", category: "seasonal" },
  template19: { name: "Black Friday Mega", description: "Black Friday mega sale email.", category: "sales" },
  template20: { name: "Black Friday Luxury", description: "Premium Black Friday deals.", category: "sales" },
  template21: { name: "Cyber Monday", description: "Cyber Monday tech deals email.", category: "sales" },
  template22: { name: "Black Friday Exclusive", description: "Exclusive Black Friday discounts.", category: "sales" },
  template23: { name: "Sports Sale", description: "Sports equipment sale email.", category: "sales" },
  template24: { name: "Sports Deals v2", description: "Athletic gear deals email.", category: "sales" },
  template25: { name: "Z-Pattern Sale", description: "Modern z-pattern layout sale.", category: "sales" },
  template26: { name: "Split Design Sale", description: "Split-screen design sale email.", category: "sales" },
  template27: { name: "Gallery Sale", description: "Product gallery style sale email.", category: "sales" },
  template28: { name: "Magazine Style", description: "Editorial magazine layout email.", category: "newsletter" },
  template29: { name: "Minimalist Sale", description: "Clean minimalist sale email.", category: "sales" },
  template30: { name: "Vintage Sale", description: "Retro vintage themed sale email.", category: "sales" },
  template31: { name: "Artsy Sale", description: "Creative artistic sale email.", category: "sales" },
  template32: { name: "Industrial Sale", description: "Industrial design sale email.", category: "sales" },
  template33: { name: "Tech Launch", description: "Product launch announcement.", category: "marketing" },
  template34: { name: "Spring Collection", description: "Spring fashion collection email.", category: "marketing" },
  template35: { name: "24-Hour Flash Sale", description: "Urgent flash sale email.", category: "sales" },
};

// Ensure public thumbnails directory exists
if (!fs.existsSync(PUBLIC_THUMBS_DIR)) {
  fs.mkdirSync(PUBLIC_THUMBS_DIR, { recursive: true });
}

// Read all template directories
const templateDirs = fs.readdirSync(TEMPLATES_DIR)
  .filter(d => fs.statSync(path.join(TEMPLATES_DIR, d)).isDirectory())
  .sort((a, b) => {
    const numA = parseInt(a.replace('template', ''));
    const numB = parseInt(b.replace('template', ''));
    return numA - numB;
  });

const presets = [];

// Add blank canvas preset
presets.push({
  id: "blank",
  name: "Blank Canvas",
  description: "Start from scratch with a clean slate.",
  category: "general"
});

for (const dir of templateDirs) {
  const htmlFile = path.join(TEMPLATES_DIR, dir, 'index.html');
  const thumbFile = path.join(TEMPLATES_DIR, dir, 'thumbnail.png');

  // Skip if no HTML file
  if (!fs.existsSync(htmlFile)) {
    console.error(`✗ ${dir}: No index.html found, skipping`);
    continue;
  }

  const meta = TEMPLATE_META[dir] || { name: dir, description: 'Email template', category: 'general' };

  try {
    // Read the pre-compiled HTML directly
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');

    // Copy thumbnail to public directory if it exists
    let thumbnailPath = undefined;
    if (fs.existsSync(thumbFile)) {
      const destThumb = path.join(PUBLIC_THUMBS_DIR, `${dir}.png`);
      fs.copyFileSync(thumbFile, destThumb);
      thumbnailPath = `/images/templates/${dir}.png`;
    }

    presets.push({
      id: dir,
      name: meta.name,
      description: meta.description,
      category: meta.category,
      thumbnail: thumbnailPath,
      compiledHtml: htmlContent
    });

    console.log(`✓ ${dir}: ${meta.name}${thumbnailPath ? ' (with thumbnail)' : ''}`);
  } catch (err) {
    console.error(`✗ ${dir}: ${err.message}`);
  }
}

// Generate TypeScript file
const tsContent = `// Auto-generated by scripts/build-template-presets.js
// Do not edit manually. Run: node scripts/build-template-presets.js

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  compiledHtml?: string;
  design?: any;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = ${JSON.stringify(presets, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');
console.log(`\n✅ Generated ${presets.length} presets → ${OUTPUT_FILE}`);
console.log(`📁 Thumbnails copied to → ${PUBLIC_THUMBS_DIR}`);
