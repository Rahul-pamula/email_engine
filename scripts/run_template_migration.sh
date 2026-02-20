#!/bin/bash

# Run templates migration on Supabase
# This creates the templates table
set -e

echo "🔄 Running templates migration..."

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "⚠️ .env file not found!"
    exit 1
fi

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

# Read SQL file content
SQL_CONTENT=$(cat migrations/003_create_templates_table.sql)

# Escape double quotes and newlines for JSON payload
# This is a bit tricky in bash, so we strive for simplicity
# Using jq is safer but might not be installed. Let's try curl's --data-binary or just simply python for encoding if needed.
# Actually, the simplest way is to use python to post it if available, or just use psql if we had direct access.
# But since we use HTTP API, let's use a small python snippet to execute it safely.

python3 -c "
import os
import requests
import sys

url = 'https://$PROJECT_ID.supabase.co/rest/v1/rpc/exec_sql'
headers = {
    'apikey': '$SUPABASE_SERVICE_ROLE_KEY',
    'Authorization': 'Bearer $SUPABASE_SERVICE_ROLE_KEY',
    'Content-Type': 'application/json'
}

with open('migrations/003_create_templates_table.sql', 'r') as f:
    sql = f.read()

payload = {'query': sql}
response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    print('✅ Migration successful!')
    print(response.text)
else:
    print(f'❌ Migration failed: {response.status_code}')
    print(response.text)
    sys.exit(1)
"
