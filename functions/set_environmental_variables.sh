#!/bin/bash
firebase:config:set spotify.id="" spotify.secret=""
firebase:config:get > .runtimeconfig.json
echo "You can now run your functions locally."
echo "`npm run serve`"