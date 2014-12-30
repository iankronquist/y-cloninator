Y-Cloninator
============

Get the best parts of Y-Combinator's Hacker News - the links to awesome github
projects

Getting started
---------------
* Install node.js on your system
* Install dependencies
* Run migrations
* Run the app
```shell
$ npm install
$ npm run migrate
$ npm start
```

Testing
-------
Tests are run using mocha.
```shell
$ npm test
```
You can also run the jshint linter quite easily:
```shell
$ npm run lint
```

Configuration
-------------
Configuration is done using environment variables. Sane defaults are provided
for a dev environment, but require dev dependencies to be installed.
