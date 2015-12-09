var fs = require('fs')
var http = require('http')
var Authentic = require('authentic-server')

var db = {
  store: {},
  get: function (key, cb) { cb(null, this.store[key]) },
  put: function (key, val, cb) { cb(null, this.store[key] = val) }
}

var auth = Authentic({
  db: db,
  publicKey: fs.readFileSync(__dirname + '/rsa-public.pem'),
  privateKey: fs.readFileSync(__dirname + '/rsa-private.pem'),
  sendEmail: function (opts, cb) { console.log(opts); cb() }
})

http.createServer(auth).listen(1337)
