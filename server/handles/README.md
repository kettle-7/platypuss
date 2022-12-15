# How this folder works

The Platypuss server reads javascript event files from inside this folder in
alphabetical order. You can control this order with the numbers at the start
of the file names.

The event files must define two globals in `module.exports`: `eventType` and
`execute`. `eventType` should be an event type ID defined in the Platypuss API
docs, so that both client and server can understand it. `execute` should be a
function that takes four arguments: `server`, `wss` and `packet`. `server` is
the server data (a global object that saves data on anything from channels to
members to messages), the `wss` property holds the `WebSocketServer` instance
(so that you can send replies to the client or broadcast an event to all
clients). The function should return the `server` if it has been modified.