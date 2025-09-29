#!/bin/bash

# Wait till dev server is up
sleep 3

# By default, next doesn't compile all routes
# To speed up local development, hit them all once, so they are compiled before you start working
curl -s -o /dev/null http://localhost:3000/en
curl -s -o /dev/null http://localhost:3000/en/employees
curl -s -o /dev/null http://localhost:3000/en/departments
curl -s -o /dev/null http://localhost:3000/en/contracts
curl -s -o /dev/null http://localhost:3000/en/pay-adjustments-to-employees
curl -s -o /dev/null http://localhost:3000/en/recipient-payment-info
curl -s -o /dev/null http://localhost:3000/en/payouts
curl -s -o /dev/null http://localhost:3000/en/payout-proposals
