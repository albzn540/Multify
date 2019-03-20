#!/bin/bash
firebase functions:config:set spotify.id="" spotify.secret=""
firebase functions:config:get > .runtimeconfig.json
echo You can now run your functions locally.
echo $ npm run serve