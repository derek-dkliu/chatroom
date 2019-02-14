## Run Server

To run server locally, just install dependencies and run `gulp` task to create a build:

```bash
$ cd server
$ npm install -g gulp-cli
$ npm install
$ gulp build
$ node dist/index
```

The `socket.io` server will be running on port `8080`

## Run Client

Open other command line window and run following commands:

```bash
$ cd client
$ npm install
$ ng serve --open
```