# Statistak

App for keeping track of tour performances, made for use on tour with the [Ricciotti Ensemble](https://ricciotti.nl)!

## Installation

Run the following commands to get the codebase installed (with Node and the Yarn package manager installed), starting in the root directory of this project:

```shell script
cd server
yarn
cd ..
cd client
yarn
cd ..
```

## Development

To locally develop this, run two commands in two separate terminals:

* `yarn start:dev` in the `server` directory
* `yarn start` in the `client` directory 

## Restoring and Backing up
To import the contents of the `data` directory into a running MongoDB instance, run the following command:

```shell script
mongorestore --db=statistak --dir=data/statistak
```

To back up the current state of a running MongoDB instance serving the `statistak` database, run the following command:

```shell script
mongodump --db=statistak --out=data
```

## Credits

See [the license](LICENSE) for more information.

_Disclaimer: This software and its data artifacts are not affiliated or endorsed by the Ricciotti Ensemble._
