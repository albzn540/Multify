# We use a paid version of Firebase so PLEASE READ these instructions
We had to do use the paid version because of the CORS problem and data usage will cost money. This is fine by us but we ask that you will be respectfull by not needlessly skipping around the page, searching and adding songs more than necessary, and also following these instructions to minimize the cost. If you know a solution to this please contact us on our email addresses below.

# Multify
Share the music queue with your friends! This app will access your Spotify account and setup a playlist to be used as a collaborative queue.
After creating a room your friends can join with a given code. In the queue users can upvote or downvote tracks to determine the order that they will be played. It is also possible to search for new tracks and add them to the queue, all done through the Spotify API. There is also the options to add a users playlists to the queue in case it would take to long to add individual songs or if there simply are no more songs in the queue.

## Project structure
./functions - Contains firebase functions  
./src/Components - React components  
./src/Constants - Resources, images and icons, etc  
./Firebase -  Provides context for frontend Firebase functions so that they do not need to be passed as props  
./Spotify -  Provides context for frontend SpotifyAPI functions so that they do not need to be passed as props

## Setup
There are two other README:s covering the various stacks of this application but here follows a detailed step by step instruction for the setup:

1. Open two seperate CLI:s.
   * Stand in the root directory of the project (path/to/Multify).
2. Create a file called **.env**
   * Copy over the contentsof **.env.exampl** to **.env** and fill in the blanks (or copy paste what we sent in the final submission in canvas).
3. Type `npm start` in one of ther terminals.
4. In the other terminal type `cd functions`
  * Run `npm i -g firebase-tools`
  * Run ...
  * In **set_environmental_variables.sh** add the spotify id and secret (Which were provided in the final submission).

## Setup
If you want to continue developing this project, follow these guides.  
Set up **backend** [click here](./functions/README.md)  
Set up **frontend** [click here](./REACT_README.md)  

## Access to Spotify account
This app requires you to have a Spotify account. If you would like to revoke the access it can be done at: https://www.spotify.com/is/account/apps/ the app is called Spotify Queue.

## Frameworks

### Material-UI
Is what we use for the heavy design and layouting.

## If there are any questions about .env variables
Contact:\
simflo@kth.se or\
albinwi@kth.se
