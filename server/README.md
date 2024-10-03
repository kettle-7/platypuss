# Platypuss Server

Before first use:

- extract from zip file (if it's in one)
- make sure node / npm is installed
- open a terminal in this folder and run `npm install`
- profit

Run `server.js` if you don't have an SSL certificate (this is not guaranteed
to work with all clients because of rules on what websites loaded over https
are allowed to do), `secureServer.js` if you do (you will need to edit the
`server.properties` file after you first run it to specify the path to the
public and private keys) and `multipleServer.js` to run multiple server through
one process to save ram and cpu usage at the cost of multithreading. This also
needs an SSL certificate.

