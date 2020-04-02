# Chat-app
Simple chat application that supports users and rooms. 
For users to be able to chat with each other, they have to enter the same room.
If the room that users want to access doesn't exist, it will be created automatically.

The deployment of the application can be found [here](https://).

## Build
1. Install the node.js.
2. Initialise the npm
```
npm init
```
3. Pull the code from the github.
4. Install all of the dependencies for the chat
```
npm install
```
5. Run in developer mode
```
npm run dev
```
or run in the production mode
```
npm start
```

## Third-party libraries:

### Server-side:
Following is a list of third-party libraries used in building this web service:
- [express](https://www.npmjs.com/package/express)
- [bad-words](https://www.npmjs.com/package/bad-words)
- [socket.io](https://www.npmjs.com/package/socket.io)
- [nodemon](https://www.npmjs.com/package/nodemon)

### Client-side:
- [mustache.js](https://github.com/janl/mustache.js)
- [moment.js](https://momentjs.com)
- [qs](https://www.npmjs.com/package/qs)

