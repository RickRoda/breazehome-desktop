#!/bin/bash
set -e

if [ "$HTTPS_METHOD" = 'noredirect' ]; then
  sed -i 's/https/http/g' app/settings.js
  sed -i 's/wss/ws/g' app/settings.js
fi

exec "$@"
