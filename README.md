<img src="client/static/logo/caffe_manager_horizontal.png" alt="Caffe Manager" width="400">
<br><br>

App that makes managing a caffe/restaurant/shop/warehouse easier.

##### Node.js, Express, MongoDB, Vue.js, Electron

## First

##### Make sure you have [NodeJS](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/) installed locally.

## How to run

1. `git clone https://github.com/skinnn/caffe-manager.git` or download the repo
2. Run `npm run install-deps` command in the **root** directory to install all the dependencies
3. Run **client** and **server** (from **root** directory)
	+ In the first terminal start the server with `npm run server`
	+ In the second terminal start the client with `npm run client`
4. Login with the root (admin) credentials that can be found in the [config.js](server/src/config/config.js#rootUser) file, under the `rootUser` property

:tada: :fireworks:

#### Run Alternatively

1. After installing all the dependencies, in the second terminal inside the **server** directory you can run `npm run dev` to start the server
2. In the first terminal inside the **client** directory you can run `npm run dev` to start the client

## License

MIT - see [LICENSE](LICENSE)
