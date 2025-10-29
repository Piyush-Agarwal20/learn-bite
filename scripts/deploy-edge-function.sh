#!/bin/bash

# =========================================
# EDGE FUNCTION DEPLOYMENT SCRIPT
# =========================================
# This script deploys edge functions to Supabase
#
# Requirements:
# 1. Supabase CLI installed (already done ✓)
# 2. SUPABASE_ACCESS_TOKEN in .env file
#
# How to get SUPABASE_ACCESS_TOKEN:
# 1. Go to https://supabase.com/dashboard/account/tokens
# 2. Click "Generate New Token"
# 3. Give it a name (e.g., "LearnBite Deploy")
# 4. Copy the token
# 5. Add to .env file:
#    SUPABASE_ACCESS_TOKEN=sbp_xxxxx...
# =========================================

# Load environment variables
set -a
source .env
set +a

# Add supabase to PATH
export PATH="$HOME/.local/bin:$PATH"

# Check if access token is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo ""
  echo "❌ SUPABASE_ACCESS_TOKEN not found!"
  echo ""
  echo "📝 To deploy edge functions, you need a Personal Access Token:"
  echo ""
  echo "1. Go to: https://supabase.com/dashboard/account/tokens"
  echo "2. Click 'Generate New Token'"
  echo "3. Give it a name (e.g., 'LearnBite Deploy')"
  echo "4. Copy the token (starts with 'sbp_')"
  echo "5. Add to .env file:"
  echo "   SUPABASE_ACCESS_TOKEN=sbp_xxxxx..."
  echo ""
  echo "Then run this script again!"
  echo ""
  exit 1
fi

# Function to deploy
FUNCTION_NAME=${1:-hello}

echo ""
echo "🚀 Deploying Edge Function: $FUNCTION_NAME"
echo "═══════════════════════════════════════════════"
echo ""

# Deploy the function
supabase functions deploy $FUNCTION_NAME --project-ref rvmgfwdqjnmwixxjqcrz

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Edge Function deployed successfully!"
  echo ""
  echo "🔗 Function URL:"
  echo "   https://rvmgfwdqjnmwixxjqcrz.supabase.co/functions/v1/$FUNCTION_NAME"
  echo ""
  echo "📝 Test it:"
  echo "   curl https://rvmgfwdqjnmwixxjqcrz.supabase.co/functions/v1/$FUNCTION_NAME"
  echo ""
else
  echo ""
  echo "❌ Deployment failed!"
  echo ""
  exit 1
fi
