# We use a paid version of Firebase so PLEASE READ these instructions
When you click 'create a party' you need to check the developer tools and check the console log. There will be a url that will take you to a Spotify authentication page. Then all you need to do is click agree.
We had to do use the paid version because of the CORS problem and data usage will cost money. This is fine by us but we ask that you will be respectfull by not needlessly skipping around the page, searching and adding songs more than necessary, and also following these instructions to minimize the cost. If you know a solution to this please contact us on our email addresses below.\
To enter the only currently existing party room use code: 12345

# Multify
Share the music queue with your friends! This app will access your Spotify account and setup a playlist to be used as a collaborative queue.
After creating a room your friends can join with a given code. In the queue users can upvote or downvote tracks to determine the order that
they will be played. It is also possible to search for new tracks and add them to the queue, all done through the Spotify API. There (will be) is 
also a 'now playing' view to control the current song, play, pause, etc.

## What has been done so far...
Currently authorization with spotify works but the user must go one page back and enter a room with a party room code.
Inside the party room one can switch between a view of the queue and the search bar. The search bar is fully functional and will add
tracks to the firestore. The rest of the code is displayed through mock data. As for what has been done with the framework and other technologies,
Almost all except the 'now playing' screen have been created as react components and the firebase and Spotify integration code have been implemented. Bundles of resources as constants also reside within the source folder.

## What will be done later on...
Obviously the 'now playing' component must be implemented. The voting system is not in place. All mock data should be replaced by dynamic data.
Navigating from the create party needs to be smoother, i.e. not have to back out or switch url. There needs to be some way for the party room creator
to get and share the party code. More admin priviliges for the party creator that are not accessible by users who join by code.

## Project structure
./functions - Contains firebase functions
./src/Components - React components
./src/Constants - Resources, images and icons, etc
./Firebase -  Provides context for frontend Firebase functions so that they do not need to be passed as props
./Spotify -  Provides context for frontend SpotifyAPI functions so that they do not need to be passed as props

### Other ReadMe:s
[Read about setting up firebase](./functions/README.md)\
[Read about setting up React](./REACT_README.md)

## Access to Spotify account
This app requires you to have a Spotify account. If you would like to revoke the access it can be done at: https://www.spotify.com/is/account/apps/ the app is called Spotify Queue.

## Frameworks

### Styled Components
Styled components is used where we need to do some minor styling, seems to be the perfect framwork for this kind of things.  
eg. Login page background styling.

### Material-UI
Is what we use for the heavy design and layouting.

### If there are any questions about .env variables
Contact:\
simflo@kth.se or\
albinwi@kth.se
