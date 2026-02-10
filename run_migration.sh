#!/bin/bash

# Run onboarding migration on Supabase
# This adds the new onboarding fields to the tenants table

set -e

echo "🔄 Running onboarding migration..."

# Load environment variables
source .env

# Check if Supabase credentials exist
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Error: SUPABASE_URL not found in .env"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env"
    exit 1
fi

# Extract database connection details from Supabase URL
# Format: https://PROJECT_ID.supabase.co
PROJECT_ID=$(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')

echo "📊 Project ID: $PROJECT_ID"
echo ""

# Run migration using Supabase SQL API
echo "Running SQL migration..."

curl -X POST \
  "https://$PROJECT_ID.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "query": "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS workspace_name VARCHAR(255), ADD COLUMN IF NOT EXISTS user_role VARCHAR(50), ADD COLUMN IF NOT EXISTS primary_use_case VARCHAR(100), ADD COLUMN IF NOT EXISTS integration_sources TEXT[], ADD COLUMN IF NOT EXISTS expected_scale VARCHAR(50);"
}
EOF

echo ""
echo "✅ Migration complete!"
echo ""
echo "New columns added to tenants table:"
echo "  • workspace_name"
echo "  • user_role"
echo "  • primary_use_case"
echo "  • integration_sources"
echo "  • expected_scale"
