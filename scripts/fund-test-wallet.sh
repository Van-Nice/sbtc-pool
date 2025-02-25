#!/bin/bash

# Bitcoin RPC credentials
BTC_RPC_USER="devnet"
BTC_RPC_PASS="devnet"
BTC_RPC_URL="http://localhost:18443"
WALLET_NAME="devnet-wallet"

# Function to make Bitcoin RPC calls
btc_cli() {
    curl --user "$BTC_RPC_USER:$BTC_RPC_PASS" \
         -H 'content-type: text/plain;' \
         -d "{\"jsonrpc\": \"1.0\", \"id\":\"fund-wallet\", \"method\": \"$1\", \"params\": ${2:-[]}}" \
         "$BTC_RPC_URL/wallet/$WALLET_NAME"
}

# Generate blocks to get some BTC
btc_cli "generatetoaddress" "[1, \"$1\"]"

# Send BTC to the test wallet
btc_cli "sendtoaddress" "[\"$1\", 1.0]"

# Generate more blocks to confirm the transaction
btc_cli "generatetoaddress" "[6, \"$1\"]"

echo "Funded $1 with 1 BTC"