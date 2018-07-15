#!/usr/bin/env bash
set -e

# Install dependencies if node_modules not exists
if [ ! -d "node_modules" ]; then
    npm install
fi

if [ "$1" == "e2e" ]; then
    # Run e2e tests
    npm run e2e
else
    # Run unit tests
    npm run test
fi
