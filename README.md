# caffe-manager
App that will make managing a caffe/restaurant/shop/warehouse easier.

### Node.js, Electron, Express, Vue.js

## First

### Make sure you have [NodeJS](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/) installed locally.

## How to run

### Linux (not tested on MacOS)
1. Clone - `git clone https://github.com/skinnn/vue-caffe.git` or download the code repo
2. Run `npm run install-dependencies` command in the **root** folder to install all the dependencies
3. To start the app (both client and the server) run `npm start` in the **root** folder

:tada: :fireworks:

## Run Alternatively

1. After installing all the dependencies, in the first terminal inside the **client** folder you can run `npm start` to start the client
2. In the second terminal inside the **server** folder you can run `npm start` to start the server

- Client default port: 9080
- Server default port: 8080

### Windows
1. After you install all the dependencies with `npm run install-dependencies` you need to change start and lint scripts in **package.json** file in the **server** folder. It should look like this:

```json
"scripts": {
  "start": "nodemon src/app.js --exec \"npm run lint && node\"",
  "lint": "eslint src/**/*.js"
}
```

2. You can start the app with `npm start` command from the **root** folder or run alternatively
in separate terminals as described above.




## License

MIT - see [LICENSE](LICENSE)
