# Statistak

App for keeping track of tour performances, made for use on tour with the [Ricciotti Ensemble](https://ricciotti.nl)!

## Installation

Run the following commands to get the codebase installed (with Node+NPM installed), starting in the root directory of this project:

```shell script
cd server
npm install
cd ..
cd client
npm install
cd ..
```

## Development

To locally develop this, run these two commands in two separate terminals:

* `npm run start:dev` in the `server` directory
* `npm run start` in the `client` directory 

Have a database running:

```shell script
brew services start mongodb-community@8.0
```

Important: also have these variables set:

```shell script
# For the server:
export SERVER_PORT=3001
# For the app
export REACT_APP_SERVER_BASE_URL=http://localhost:3001
```

## Restoring and Backing up
To import the contents of the `data` directory into a running MongoDB instance, run the following command:

```shell script
mongorestore --db=statistak --dir=data/statistak
```

To back up the current state of a running MongoDB instance serving the `statistak` database, run the following command:

```shell script
mongodump --db=statistak --out=data
```

## Running a local MongoDB instance on a Mac

```shell script
brew services start mongodb-community@8.0
brew services stop mongodb-community@8.0
```

More information can be found [here](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/).

## Deployment

You'll need a server with at least 1 vCPU and 2 GB, with MongoDB already installed and running. Populate the database with the instructions above.

Make an `.env` file in the server directory with the following contents:

```bash
export SERVER_PORT=443
export AUTH0_DOMAIN=[...]
```

Then, in the server directory, build the server:

```bash
npm run build
```

Make an `.env` file in the client directory with the following contents:

```bash
export REACT_APP_AUTH0_DOMAIN=[...]
export REACT_APP_AUTH0_CLIENT_ID=[...]
export REACT_APP_SERVER_BASE_URL=https://statistak.nl
```

Then, in the client directory, build the client:

```bash
npm run build
```

Request a certificate using the certbot.

Use a run manager such as PM2 to then start the server, in the server directory:

```shell script
pm2 start npm --name "main" -- run start:prod

# To ensure it starts on restarts:
pm2 startup
pm2 save
```

Set hooks for certbot to gracefully handle the server when renewing:

```shell script
echo "pm2 stop main" > /etc/letsencrypt/renewal-hooks/pre/stop_server.sh
echo "pm2 start main" > /etc/letsencrypt/renewal-hooks/post/start_server.sh
chmod +x /etc/letsencrypt/renewal-hooks/pre/stop_server.sh
chmod +x /etc/letsencrypt/renewal-hooks/post/start_server.sh

# Test it with
certbot renew --dry-run
```

## Maintenance

To upgrade all packages, run:

```shell script
npm i -g npm-check-updates
ncu -u
npm install
```

## Credits

See [the license](LICENSE) for more information.

_Disclaimer: This software and its data artifacts are not affiliated or endorsed by the Ricciotti Ensemble._
