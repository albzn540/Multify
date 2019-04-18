# Multify Functions

This is the project folder 

# How to run (locally)
Make sure your standing in `/functions` directory with your terminal.  

## Firebase
This app uses firebase as the primary hosting service, both for the backend and the frontend.
To start the backend, you must have a firebase project. Follow this link and create one: https://console.firebase.google.com/  

Install firebase tools in your terminal:  
`$ npm install -g firebase-tools`

Log in with your google account:  
`$ firebase login`

## Spotify
To interact with Spotify you have to make a Spotify app, follow this link and create a new app. https://developer.spotify.com/dashboard/applications

## Environmental variables
The backend requires two environmental variables, the client id and secret from your spotify app. Open up the set_environmental_variables and fill in the appropriate variables. Then, run the script. The firebase-cli-tools can be a bit slow, so just let the script take it's time

## Install dependencies
`$ npm install`

## Serve cloud functions
This will build and serve the functions locally:  
`$ npm run serve`  

## Deploy functions
This will build and deploy the functions:  
`$ npm run deploy`  
