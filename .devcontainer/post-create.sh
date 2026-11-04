#!/bin/bash
set -e

echo "================================"
echo "Checking NTS-SMS development environment"
echo "================================"

echo ""
echo "PHP version:"
php -v

echo ""
echo "Composer version:"
composer --version

echo ""
echo "Node version:"
node -v

echo ""
echo "npm version:"
npm -v

echo ""
echo "Checking required PHP extensions..."

missing=0
for extension in pdo_mysql mysqli mbstring xml curl zip gd bcmath intl; do
    if php -m | grep -qi "^${extension}$"; then
        echo "OK: $extension"
    else
        echo "MISSING: $extension"
        missing=1
    fi
done

if [ "$missing" -ne 0 ]; then
    echo ""
    echo "ERROR: Some PHP extensions are missing. Check the Dockerfile."
    exit 1
fi

echo ""
echo "Installing frontend dependencies (if needed)..."
if [ -f frontend/package.json ] && [ ! -d frontend/node_modules ]; then
    (cd frontend && npm ci)
fi

echo ""
echo "Development environment is ready!"