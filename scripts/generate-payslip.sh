#!/bin/bash
set -a            # automatically export all sourced vars
source .env.local # load your env file
set +a

npx supabase functions deploy --project-ref zitmxagvhpivdadshfdu generate-payslip

curl -L \
    -i \
    -X POST \
    -H "Authorization: Bearer ${NEXT_PUBLIC_SUPABASE_KEY}" \
    'https://zitmxagvhpivdadshfdu.supabase.co/functions/v1/generate-payslip' \
    --data '{"worked_hours": [{"contract_id": "7b7a7af7-e49f-40be-8d0a-81ce91da92d2", "hours": 12}]}'
